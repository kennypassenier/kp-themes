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

const THEMES = /** @type {string[]} */ (JSON.parse(readFileSync(new globalThis.URL('../themes/order.json', import.meta.url), 'utf8')));

test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
});

// --- 1 · Reorder: a pointer drag crosses rows [scope-60] -----------------

const REORDER_CHANNELS = [
    { name: 'framework-free', list: '[data-test="plain-reorder-long"]' },
    { name: 'React', list: '[data-test="react-reorder-long"] .kp-reorder' },
];

for (const channel of REORDER_CHANNELS) {
    test(`reorder — ${channel.name}: a pointer drag moves a row four rows down, live, announced, and ends where four ArrowDowns end [scope-60]`, async ({
        page,
    }) => {
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
        await expect.poll(async () => (await order()).indexOf('pressure'), { message: 'the row moves while the pointer is held' }).toBeGreaterThan(1);
        await page.mouse.move(x, last.y + last.height - 2, { steps: 8 });
        await expect.poll(order, { message: 'live, before the button is released' }).toEqual(['time', 'flow', 'note', 'signed', 'shift', 'pressure']);
        await page.mouse.up();
        await expect.poll(order).toEqual(['time', 'flow', 'note', 'signed', 'shift', 'pressure']);
        await expect(status).toHaveText(/** @type {string} */ (keyboardSaid));
    });
}

test('reorder — catalogue: Time dragged to the bottom in one movement ends last in every theme, where four ArrowDowns end [scope-60]', async ({
    page,
}) => {
    // Before: in Firefox the drag left Time one row down — pressure, time, flow, note, signed — in all 22 themes.
    // A register lifts the held row with a shadow and a transform, so the drag is driven under every one of them.
    await page.goto('/catalogue/structure.html');
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
});

// --- 2 · Wizard: inner spacing in its frame [scope-60] --------------------

/**
 * Sweep every theme and report each wizard whose outermost visible child
 * sits closer than `min` px to the frame's inner edge (the border box less
 * the border). Runs in the page; returns the faults, empty when right.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} selector
 */
const wizardInsets = (page, selector) =>
    expect
        .poll(
            async () => {
                const faults = [];
                for (const theme of THEMES) {
                    await page.evaluate((name) => document.documentElement.setAttribute('data-theme', name), theme);
                    const fault = await page.evaluate((sel) => {
                        const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
                        const min = 0.75 * rem - 0.5;
                        const out = [];
                        for (const [n, wizard] of [...document.querySelectorAll(sel)].entries()) {
                            const c = getComputedStyle(wizard);
                            const box = wizard.getBoundingClientRect();
                            const inner = {
                                top: box.top + parseFloat(c.borderTopWidth),
                                right: box.right - parseFloat(c.borderRightWidth),
                                bottom: box.bottom - parseFloat(c.borderBottomWidth),
                                left: box.left + parseFloat(c.borderLeftWidth),
                            };
                            const kids = [...wizard.children].map((k) => k.getBoundingClientRect()).filter((r) => r.width > 0 && r.height > 0);
                            if (kids.length === 0) continue;
                            const gap = {
                                top: Math.min(...kids.map((r) => r.top)) - inner.top,
                                right: inner.right - Math.max(...kids.map((r) => r.right)),
                                bottom: inner.bottom - Math.max(...kids.map((r) => r.bottom)),
                                left: Math.min(...kids.map((r) => r.left)) - inner.left,
                            };
                            const short = Object.entries(gap).filter(([, v]) => v < min);
                            if (short.length) out.push(`#${n} ${short.map(([k, v]) => `${k} ${v.toFixed(1)}px`).join(', ')}`);
                        }
                        return out.length ? out.join('; ') : null;
                    }, selector);
                    if (fault) faults.push(`${theme}: ${fault}`);
                }
                return faults;
            },
            { timeout: 15000 },
        )
        .toEqual([]);

test('wizard — the frozen, the narrow and the live wizard keep at least 0.75rem between their items and the frame, in all 22 themes [scope-60]', async ({
    page,
}) => {
    // Before: 0.0px on all four sides of every wizard on the catalogue page in 21 themes, and 3.0px in retro (its own padding: 3px).
    await page.goto('/catalogue/structure.html');
    await wizardInsets(page, '#wizard .kp-wizard, #wizard-live .kp-wizard');
});

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
    test(`palette — ${channel.name}: "read" finds "Readings for line 2" and not "Report an incident" by default [scope-56]`, async ({ page }) => {
        // Before: the default matcher was subsequence, and "read" showed both — Report an incident (r·e·a·d in order) and Readings for line 2.
        await page.goto(channel.url);
        const options = await shown(page, channel.byDefault, 'read');
        await expect(options).toHaveText(['Readings for line 2']);
    });

    if (channel.subsequence) {
        const subsequence = channel.subsequence;
        test(`palette — ${channel.name}: asked for subsequence, "read" finds both [scope-56]`, async ({ page }) => {
            await page.goto(channel.url);
            const options = await shown(page, subsequence, 'read');
            await expect(options).toHaveText(['Report an incident', 'Readings for line 2']);
        });
    }
}

// --- 4 · Nostromo's navigation bar [scope-59] -----------------------------

test.describe('nostromo navigation bar [scope-59]', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/catalogue/navigation.html');
        await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'nostromo'));
        await page.evaluate(() => document.fonts.ready);
    });

    test('the site mark "PH//04" reads at 4.5:1 or better on the bar', async ({ page }) => {
        // Before: 1.91:1 — --muted-foreground, a token for the light page, on the bar's dark ground.
        const tag = page.locator('#bar .kp-nav__brand-tag');
        await expect
            .poll(() =>
                tag.evaluate((el) => {
                    // Every colour through a canvas, so hsl(), a relative colour
                    // and an alpha all arrive as the same four bytes.
                    const ctx = /** @type {CanvasRenderingContext2D} */ (
                        document.createElement('canvas').getContext('2d', { willReadFrequently: true })
                    );
                    /** @param {string} css @returns {number[]} */
                    const rgba = (css) => {
                        ctx.clearRect(0, 0, 1, 1);
                        ctx.fillStyle = css;
                        ctx.fillRect(0, 0, 1, 1);
                        return [...ctx.getImageData(0, 0, 1, 1).data];
                    };
                    /** @type {Element | null} */
                    let at = el;
                    let ground = [0, 0, 0, 0];
                    while (at && ground[3] === 0) {
                        ground = rgba(getComputedStyle(at).backgroundColor);
                        at = at.parentElement;
                    }
                    const ink = rgba(getComputedStyle(el).color);
                    const a = (ink[3] / 255) * Number(getComputedStyle(el).opacity);
                    const mixed = [0, 1, 2].map((i) => ink[i] * a + ground[i] * (1 - a));
                    /** @param {number[]} c */
                    const lum = (c) =>
                        [0, 1, 2]
                            .map((i) => c[i] / 255)
                            .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
                            .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
                    const [hi, lo] = [lum(mixed), lum(ground)].sort((x, y) => y - x);
                    return Math.round(((hi + 0.05) / (lo + 0.05)) * 100) / 100;
                }),
            )
            .toBeGreaterThanOrEqual(4.5);
    });

    test('the current item "Incidents" has the same font size and baseline as the other items', async ({ page }) => {
        // Before: the same 11.52px, but its text sat 1.6px lower than Overview, Readings and Rota — the link is inline-flex with the LED dot as its first item, so the dot's bottom edge became the baseline.
        await expect
            .poll(() =>
                page.evaluate(() => {
                    const read = [...document.querySelectorAll('#bar .kp-nav__link')].map((a) => {
                        const text = [...a.childNodes].find((n) => n.nodeType === Node.TEXT_NODE && n.textContent?.trim());
                        const range = document.createRange();
                        range.selectNodeContents(/** @type {Node} */ (text));
                        return { name: a.textContent?.trim(), size: getComputedStyle(a).fontSize, bottom: range.getBoundingClientRect().bottom };
                    });
                    const current = read.find((r) => r.name === 'Incidents');
                    if (!current) return ['no current item'];
                    return read
                        .filter((r) => r !== current)
                        .flatMap((r) => [
                            ...(r.size === current.size ? [] : [`${r.name}: ${r.size}, Incidents ${current.size}`]),
                            ...(Math.abs(r.bottom - current.bottom) <= 0.5
                                ? []
                                : [`${r.name}: baseline ${(current.bottom - r.bottom).toFixed(1)}px apart`]),
                        ]);
                }),
            )
            .toEqual([]);
    });

    test('collapsed: at least 0.5rem between "Readings" and the dropdown under it, and under the dropdown\'s caption', async ({ page }) => {
        // Before: 4.0px from the bottom of "Readings" to the top of the dropdown's caption (the panel's own 0.25rem padding); 4.0px from the caption's rule to "Pressure".
        const nav = page.locator('#bar-collapsed .kp-nav[data-kp-nav-open]');
        await expect
            .poll(() =>
                nav.evaluate((el) => {
                    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
                    const link = /** @type {HTMLElement} */ (el.querySelector('.kp-nav__link[aria-haspopup]'));
                    const menu = /** @type {HTMLElement} */ (el.querySelector('.kp-nav__menu'));
                    const first = /** @type {HTMLElement} */ (menu.querySelector('a'));
                    const m = getComputedStyle(menu);
                    const cap = getComputedStyle(menu, '::before');
                    const px = (/** @type {string} */ v) => parseFloat(v) || 0;
                    const capTop = menu.getBoundingClientRect().top + px(m.borderTopWidth) + px(m.paddingTop) + px(cap.marginTop);
                    const capBottom = capTop + px(cap.paddingTop) + px(cap.height) + px(cap.paddingBottom) + px(cap.borderBottomWidth);
                    const above = capTop - link.getBoundingClientRect().bottom;
                    const below = first.getBoundingClientRect().top - capBottom;
                    return {
                        above: above >= 0.5 * rem - 0.01 ? 'ok' : `${above.toFixed(1)}px`,
                        below: below >= 0.5 * rem - 0.01 ? 'ok' : `${below.toFixed(1)}px`,
                    };
                }),
            )
            .toEqual({ above: 'ok', below: 'ok' });
    });
});
