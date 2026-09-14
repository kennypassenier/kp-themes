// The four items held back as held-60, approved by Kenny on 2026-09-13
// [held-60, scope-56, scope-59, scope-60].
//
// A reorder row dragged across any number of rows, inner spacing in the
// wizard, the command palette's literal match as its default, and
// nostromo's navigation bar. Every test here was run on the code before its
// repair and was red for the reason its comment names; the number in each
// comment is what that run measured.
//
// Every assertion reads what the browser did — the order of the rendered
// rows, a painted box, a computed colour — never an attribute the test
// wrote [KT13], and reads it until it is the value [KT16].

import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { waitForJudging } from './helpers/catalogue.mjs';
import { useEmptyRegister } from './helpers/empty-register.mjs';

const THEMES = /** @type {string[]} */ (JSON.parse(readFileSync(new globalThis.URL('../themes/order.json', import.meta.url), 'utf8')));

test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    // The catalogue pages hide a block once it is judged; these tests read
    // the blocks, whatever the committed register says about them.
    await useEmptyRegister(page.context());
});

// --- 1 · Reorder: a pointer drag crosses rows [scope-60] -----------------

const REORDER_CHANNELS = [
    { name: 'framework-free', list: '[data-test="plain-reorder-long"]' },
    { name: 'React', list: '[data-test="react-reorder-long"] .kp-reorder' },
];

for (const channel of REORDER_CHANNELS) {
    test(
        `reorder — ${channel.name}: a pointer drag moves a row four rows down, live, announced, and ends where four ArrowDowns end [scope-60]`,
        { tag: ['@component:structure'] },
        async ({ page }) => {
            // Before: in Firefox, pressing on Pressure's handle and moving the
            // pointer down to the sixth row moved Pressure one row and then
            // stopped, in both channels — time, flow, pressure, note, signed,
            // shift — because the first move released the handle's pointer
            // capture and nothing heard the pointer after it.
            await page.goto('/tests/fixtures/held-60.html');
            const list = page.locator(channel.list);
            const rows = list.locator(':scope > [data-kp-item]');
            await expect(rows).toHaveCount(6);
            const order = () => rows.evaluateAll((items) => items.map((i) => /** @type {HTMLElement} */ (i).dataset.kpItem));
            const status = list.locator('xpath=following-sibling::*[@data-kp-reorder-status][1]');

            // What the keyboard does, on a fresh page: the reference.
            const handle = list.locator('[data-kp-item="pressure"] [data-kp-handle]');
            await handle.focus();
            for (let i = 0; i < 4; i++) await handle.press('ArrowDown');
            await expect.poll(order).toEqual(['time', 'flow', 'note', 'signed', 'shift', 'pressure']);
            await expect(status).toHaveText(/\S/);
            const keyboardSaid = await status.textContent();

            await page.reload();
            await expect(rows).toHaveCount(6);
            await expect.poll(order).toEqual(['time', 'pressure', 'flow', 'note', 'signed', 'shift']);
            // The whole list on screen before a box is read: a pointer moved
            // below the viewport sends no pointermove. Since scope-80's taller
            // rows the React list ended at 796 px in a 720 px viewport, and the
            // drag stopped one row short of the last.
            await list.evaluate((el) => el.scrollIntoView({ block: 'center' }));
            const viewport = /** @type {{ width: number, height: number }} */ (page.viewportSize());
            expect(await list.evaluate((el) => el.getBoundingClientRect().bottom), 'the list fits the viewport').toBeLessThanOrEqual(viewport.height);
            const grip = list.locator('[data-kp-item="pressure"] [data-kp-handle]');
            const from = /** @type {{ x: number, y: number, width: number, height: number }} */ (await grip.boundingBox());
            const last = /** @type {{ x: number, y: number, width: number, height: number }} */ (
                await list.locator('[data-kp-item="shift"]').boundingBox()
            );
            const x = from.x + from.width / 2;
            await page.mouse.move(x, from.y + from.height / 2);
            await page.mouse.down();
            // Halfway: the row is already on its way, while the button is held.
            const mid = /** @type {{ x: number, y: number, width: number, height: number }} */ (
                await list.locator('[data-kp-item="note"]').boundingBox()
            );
            await page.mouse.move(x, mid.y + mid.height / 2, { steps: 8 });
            await expect
                .poll(async () => (await order()).indexOf('pressure'), { message: 'the row moves while the pointer is held' })
                .toBeGreaterThan(1);
            await page.mouse.move(x, last.y + last.height - 2, { steps: 8 });
            await expect
                .poll(order, { message: 'live, before the button is released' })
                .toEqual(['time', 'flow', 'note', 'signed', 'shift', 'pressure']);
            await page.mouse.up();
            await expect.poll(order).toEqual(['time', 'flow', 'note', 'signed', 'shift', 'pressure']);
            await expect(status).toHaveText(/** @type {string} */ (keyboardSaid));
        },
    );
}

test(
    'reorder — catalogue: Time dragged to the bottom in one movement ends last in every theme, where four ArrowDowns end [scope-60]',
    { tag: ['@component:structure', '@sweep', '@component:catalogue'] },
    async ({ page }) => {
        // Before: in Firefox the drag left Time one row down — pressure, time, flow, note, signed — in all 22 themes.
        // A register lifts the held row with a shadow and a transform, so the drag is driven under every one of them.
        await page.goto('/catalogue/structure.html');
        await waitForJudging(page);
        const list = page.locator('#reorder .kp-reorder');
        const order = () =>
            list.locator(':scope > [data-kp-item]').evaluateAll((items) => items.map((i) => /** @type {HTMLElement} */ (i).dataset.kpItem));
        const initial = ['time', 'pressure', 'flow', 'note', 'signed'];
        const expected = ['pressure', 'flow', 'note', 'signed', 'time'];
        const faults = [];
        for (const theme of THEMES) {
            await page.evaluate((name) => document.documentElement.setAttribute('data-theme', name), theme);
            await page.evaluate((ids) => {
                const ul = /** @type {HTMLElement} */ (document.querySelector('#reorder .kp-reorder'));
                for (const id of ids) ul.append(/** @type {HTMLElement} */ (ul.querySelector(`[data-kp-item="${id}"]`)));
            }, initial);
            // A theme's fonts arrive after the switch and move the rows: press
            // where the handle IS, once two reads a frame apart agree and the
            // point under the pointer is the handle itself.
            const handle = list.locator('[data-kp-item="time"] [data-kp-handle]');
            await page.evaluate(() => document.fonts.ready);
            await expect
                .poll(
                    () =>
                        handle.evaluate(
                            (el) =>
                                new Promise((resolve) => {
                                    el.scrollIntoView({ block: 'center' });
                                    const a = el.getBoundingClientRect();
                                    requestAnimationFrame(() =>
                                        requestAnimationFrame(() => {
                                            const b = el.getBoundingClientRect();
                                            const hit = document.elementFromPoint(b.x + b.width / 2, b.y + b.height / 2);
                                            resolve(a.top === b.top && a.left === b.left && el.contains(hit));
                                        }),
                                    );
                                }),
                        ),
                    { message: theme },
                )
                .toBe(true);
            const grip = /** @type {{ x: number, y: number, width: number, height: number }} */ (await handle.boundingBox());
            const bottom = /** @type {{ x: number, y: number, width: number, height: number }} */ (await list.boundingBox());
            const x = grip.x + grip.width / 2;
            await page.mouse.move(x, grip.y + grip.height / 2);
            await page.mouse.down();
            await page.mouse.move(x, bottom.y + bottom.height - 3, { steps: 12 });
            let held = await order();
            for (let attempt = 0; attempt < 20 && held.join() !== expected.join(); attempt++) {
                await page.waitForTimeout(25);
                held = await order();
            }
            await page.mouse.up();
            if (held.join() !== expected.join()) faults.push(`${theme}: ${held.join(', ')}`);
        }
        expect(faults).toEqual([]);
    },
);

// --- 3 · The palette matches literally by default [scope-56] --------------

const PALETTES = [
    {
        name: 'framework-free',
        url: '/tests/fixtures/held-60.html',
        byDefault: '[data-test="plain-palette-default"]',
        subsequence: '[data-test="plain-palette-subsequence"]',
    },
    {
        name: 'React',
        url: '/tests/fixtures/held-60.html',
        byDefault: '[data-test="react-palette-default"] .kp-palette',
        subsequence: '[data-test="react-palette-subsequence"] .kp-palette',
    },
    // The catalogue's live palette carries no data-kp-match: what Kenny
    // types there is the default.
    { name: 'catalogue', url: '/catalogue/page.html', byDefault: '#pg-pal-live', subsequence: null },
];

/**
 * Open a palette, type a query, and return the options the browser shows.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} selector
 * @param {string} query
 */
const shown = async (page, selector, query) => {
    const palette = page.locator(selector);
    await palette.evaluate((dialog) => /** @type {HTMLDialogElement} */ (dialog).showModal());
    await palette.locator('.kp-palette__input').fill(query);
    return palette.locator('.kp-palette__option:visible');
};

for (const channel of PALETTES) {
    test(
        `palette — ${channel.name}: "read" finds "Readings for line 2" and not "Report an incident" by default [scope-56]`,
        { tag: ['@component:page', '@component:catalogue'] },
        async ({ page }) => {
            // Before: the default matcher was subsequence, and "read" showed both — Report an incident (r·e·a·d in order) and Readings for line 2.
            await page.goto(channel.url);
            if (channel.url.startsWith('/catalogue/')) await waitForJudging(page);
            const options = await shown(page, channel.byDefault, 'read');
            await expect(options).toHaveText(['Readings for line 2']);
        },
    );

    if (channel.subsequence) {
        const subsequence = channel.subsequence;
        test(`palette — ${channel.name}: asked for subsequence, "read" finds both [scope-56]`, { tag: ['@component:page'] }, async ({ page }) => {
            await page.goto(channel.url);
            const options = await shown(page, subsequence, 'read');
            await expect(options).toHaveText(['Report an incident', 'Readings for line 2']);
        });
    }
}
