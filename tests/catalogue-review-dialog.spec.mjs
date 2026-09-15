// The review dialog: one block at a time, by keyboard (Kenny, 2026-09-15,
// scope-89 and scope-90), built from research/review-dialog/demo.html into
// catalogue/review-dialog.js over the verdicts of catalogue/judging.js.
//
// Red run first, on 6fd84fe0 in firefox, before the change: every test failed
// at its first step, because no page had a "Review in a dialog" button.

import { expect, test } from '@playwright/test';
import { useEmptyRegister } from './helpers/empty-register.mjs';
import { waitForJudging } from './helpers/catalogue.mjs';

test.describe.configure({ timeout: 120_000 });

const JUDGEMENTS = 'kp-catalogue-judgements:v3';
const FEEDBACK = 'kp-catalogue-feedback:v1';

test.beforeEach(async ({ context }) => {
    await useEmptyRegister(context);
});

/** The hash this browser stored for a block in formal. */
const storedHash = (page, key, engine) =>
    page.evaluate(([store, block, eng]) => JSON.parse(localStorage.getItem(store) ?? '{}')[block]?.formal?.[eng]?.hash, [JUDGEMENTS, key, engine]);

/** The note stored for a block in formal, under the review page's keys. */
const storedNote = (page, key) =>
    page.evaluate(([store, block]) => JSON.parse(localStorage.getItem(store) ?? '{}')['catalogue/index.html']?.[block]?.formal, [FEEDBACK, key]);

/** A component page, read, in formal. */
async function openPage(page, href, { width = 1440, height = 900 } = {}) {
    await page.setViewportSize({ width, height });
    await page.goto(href);
    await waitForJudging(page);
}

const dialogOf = (page) => page.locator('#cat-review-dialog');
const titleOf = (page) => dialogOf(page).locator('[data-cat-dialog-title]');
const noteOf = (page) => dialogOf(page).locator('[data-cat-dialog-note]');

test(
    'the review dialog keeps one size over every block, with the cursor in the note on each [scope-90]',
    { tag: ['@component:catalogue'] },
    async ({ page }) => {
        for (const [width, height] of [
            [1440, 900],
            [1280, 720],
        ]) {
            await openPage(page, '/catalogue/table.html', { width, height });
            await page.locator('.cat-bar [data-cat-dialog-open]').click();
            const dialog = dialogOf(page);
            await expect(dialog).toBeVisible();
            const seen = [];
            // Seventeen blocks of the tables page, the data table among them (the tall one).
            for (let i = 0; i < 17; i += 1) {
                if (i) await page.keyboard.press('ArrowRight');
                await expect(noteOf(page)).toBeFocused();
                const reading = await dialog.evaluate((el) => {
                    const box = el.getBoundingClientRect();
                    const stage = /** @type {HTMLElement} */ (el.querySelector('[data-cat-dialog-stage]'));
                    return {
                        title: el.querySelector('[data-cat-dialog-title]')?.textContent,
                        width: box.width,
                        height: box.height,
                        stage: `${stage.clientWidth}x${stage.clientHeight}`,
                        scroll: `${stage.scrollWidth}x${stage.scrollHeight}`,
                    };
                });
                seen.push(reading);
            }
            expect(new Set(seen.map((s) => s.title)).size, 'different blocks').toBeGreaterThanOrEqual(5);
            for (const s of seen) {
                expect(s.width, s.title).toBeCloseTo(width * 0.92, 0);
                expect(s.height, s.title).toBeCloseTo(height * 0.9, 0);
                expect(s.stage, s.title).toBe(seen[0].stage);
            }
            expect(
                seen.some((s) => Number(s.scroll.split('x')[1]) > Number(s.stage.split('x')[1])),
                'a block taller than the stage scrolls inside it',
            ).toBe(true);
            await page.keyboard.press('Escape');
        }
    },
);

test(
    'Down is refused with an empty note, records with text and brings the next block [scope-90]',
    { tag: ['@component:catalogue'] },
    async ({ page, browserName }) => {
        await openPage(page, '/catalogue/switch.html');
        await page.locator('#states [data-cat-dialog-block]').click();
        const dialog = dialogOf(page);
        await expect(titleOf(page)).toHaveText('Switch › States');
        await expect(noteOf(page)).toBeFocused();
        const refused = dialog.locator('[data-cat-dialog-refused]');
        for (const text of ['', '   ']) {
            await noteOf(page).fill(text);
            await page.keyboard.press('ArrowDown');
            await expect(refused).toBeVisible();
            await expect(refused).toHaveText(/only not approved with a note/);
            await expect(noteOf(page)).toHaveAttribute('aria-invalid', 'true');
            await expect(titleOf(page)).toHaveText('Switch › States');
            expect(await storedHash(page, 'switch--states', browserName)).toBeUndefined();
        }
        await noteOf(page).fill('The knob is off centre');
        await expect(refused).toBeHidden();
        await page.keyboard.press('ArrowDown');
        await expect(titleOf(page)).not.toHaveText('Switch › States');
        await expect(noteOf(page)).toBeFocused();
        await expect(noteOf(page)).toHaveValue('');
        expect(await storedHash(page, 'switch--states', browserName)).toMatch(/^[0-9a-f]{64}$/);
        expect(await storedNote(page, 'switch--states')).toBe('The knob is off centre');
        await expect(page.locator('#states')).toHaveAttribute('data-cat-state', 'rejected');
    },
);

test(
    'Left and Right move between blocks while the note is empty and move the caret once it has text [scope-90]',
    { tag: ['@component:catalogue'] },
    async ({ page }) => {
        await openPage(page, '/catalogue/switch.html');
        await page.locator('#invalid [data-cat-dialog-block]').click();
        await expect(titleOf(page)).toHaveText('Switch › Invalid');
        await page.keyboard.press('ArrowRight');
        const next = await titleOf(page).textContent();
        expect(next).not.toBe('Switch › Invalid');
        await page.keyboard.press('ArrowLeft');
        await expect(titleOf(page)).toHaveText('Switch › Invalid');
        await expect(noteOf(page)).toBeFocused();

        await page.keyboard.type('abcd');
        const caret = () => noteOf(page).evaluate((el) => /** @type {HTMLTextAreaElement} */ (el).selectionStart);
        expect(await caret()).toBe(4);
        await page.keyboard.press('ArrowLeft');
        await page.keyboard.press('ArrowLeft');
        expect(await caret()).toBe(2);
        await expect(titleOf(page)).toHaveText('Switch › Invalid');
        await page.keyboard.press('ArrowRight');
        expect(await caret()).toBe(3);
        await expect(titleOf(page)).toHaveText('Switch › Invalid');
        // Backspace edits the text.
        await page.keyboard.press('Backspace');
        await expect(noteOf(page)).toHaveValue('abd');
        // The draft stays with its block: Next → leaves it, and back on the
        // block the cursor lands at the end of the draft.
        await dialogOf(page).locator('[data-cat-dialog-go="1"]').click();
        await expect(titleOf(page)).toHaveText(next ?? '');
        await expect(noteOf(page)).toBeFocused();
        await expect(noteOf(page)).toHaveValue('');
        await page.keyboard.press('ArrowLeft');
        await expect(titleOf(page)).toHaveText('Switch › Invalid');
        await expect(noteOf(page)).toHaveValue('abd');
        expect(await caret()).toBe(3);
    },
);

test(
    'after the last block without a verdict the dialog stays open and says so; approving clears the note [scope-90]',
    { tag: ['@component:catalogue'] },
    async ({ page, browserName }) => {
        await openPage(page, '/catalogue/switch.html');
        await page.locator('.cat-bar [data-cat-dialog-open]').click();
        await expect(titleOf(page)).toHaveText('Switch › States');
        // A note, then approval: the note goes, in storage and in the panel (fix-29).
        await page.keyboard.type('Looks fine now');
        expect(await storedNote(page, 'switch--states')).toBe('Looks fine now');
        await page.keyboard.press('ArrowUp');
        await expect(titleOf(page)).toHaveText('Switch › Invalid');
        expect(await storedNote(page, 'switch--states')).toBeUndefined();
        await expect(page.locator('#states .cat-judge textarea')).toHaveValue('');
        expect(await storedHash(page, 'switch--states', browserName)).toMatch(/^[0-9a-f]{64}$/);

        await page.keyboard.press('ArrowUp');
        await expect(titleOf(page)).toHaveText('Switch › A long label');
        await page.keyboard.press('ArrowUp');
        await expect(titleOf(page)).not.toHaveText('Switch › A long label');
        await page.keyboard.type('Focus ring too thin');
        await page.keyboard.press('ArrowUp');
        // Every block has its verdict: the dialog stays on the last one and says so.
        const dialog = dialogOf(page);
        await expect(dialog).toBeVisible();
        await expect(dialog.locator('[data-cat-dialog-live]')).toHaveText('Every block is judged in Formal. Escape closes the dialog.');
        await expect(noteOf(page)).toHaveValue('');
        await expect(dialog.locator('[data-cat-dialog-state]')).toContainText('Approved');
        for (const id of ['states', 'invalid', 'extremes', 'keyboard']) {
            expect(await storedHash(page, `switch--${id}`, browserName), id).toMatch(/^[0-9a-f]{64}$/);
        }
        await page.keyboard.press('Escape');
        await expect(dialog).toBeHidden();
        await expect(page.locator('.cat-bar [data-cat-dialog-open]')).toBeFocused();
    },
);

test(
    "Escape closes the review dialog and returns to the block; Tab stays inside; the block's own modal takes the first Escape [scope-90]",
    { tag: ['@component:catalogue'] },
    async ({ page }) => {
        await openPage(page, '/catalogue/overlays.html');
        const block = page.locator('#dialog');
        await block.locator('[data-cat-dialog-block]').click();
        const dialog = dialogOf(page);
        await expect(noteOf(page)).toBeFocused();
        await expect(page.locator('#dialog > .cat-review-dialog__away, .cat-review-dialog__away')).toHaveCount(1);
        for (let i = 0; i < 40; i += 1) {
            await page.keyboard.press('Tab');
            expect(await page.evaluate(() => Boolean(document.activeElement?.closest('#cat-review-dialog'))), `Tab ${i + 1}`).toBe(true);
        }
        // The block's live modal dialog takes the first Escape, the review dialog the second.
        await block.locator('[data-kp-dialog="ov-d1-live"]').click();
        const inner = page.locator('#ov-d1-live');
        await expect(inner).toBeVisible();
        await page.keyboard.press('Escape');
        await expect(inner).toBeHidden();
        await expect(dialog).toBeVisible();
        await noteOf(page).focus();
        await page.keyboard.press('Escape');
        await expect(dialog).toBeHidden();
        await expect(page.locator('.cat-review-dialog__away')).toHaveCount(0);
        await expect(block.locator('[data-cat-dialog-block]')).toBeFocused();
        await expect(block).toBeInViewport();
        // The block is back in its place on the page.
        expect(await block.evaluate((el) => el.parentElement?.closest('dialog') === null && el.closest('main') !== null)).toBe(true);
    },
);

test(
    'a verdict given in the review dialog stores the same hash as the panel under the block [scope-90]',
    { tag: ['@component:catalogue'] },
    async ({ page, browserName }) => {
        await openPage(page, '/catalogue/navigation.html');
        const ids = ['bar', 'tabs', 'app-shell'];
        const fromDialog = {};
        for (const id of ids) {
            await page.locator(`#${id} [data-cat-dialog-block]`).click();
            await page.keyboard.press('ArrowUp');
            fromDialog[id] = await storedHash(page, `navigation--${id}`, browserName);
            await page.keyboard.press('Escape');
            await expect(dialogOf(page)).toBeHidden();
        }
        await page.evaluate((key) => localStorage.removeItem(key), JUDGEMENTS);
        await openPage(page, '/catalogue/navigation.html');
        for (const id of ids) {
            await page.locator(`#${id} [data-cat-verdict="approved"]`).click();
            await expect(page.locator(`#${id}`)).toHaveAttribute('data-cat-state', 'approved');
            const fromPanel = await storedHash(page, `navigation--${id}`, browserName);
            expect(fromPanel, id).toMatch(/^[0-9a-f]{64}$/);
            expect(fromDialog[id], id).toBe(fromPanel);
        }
    },
);

test(
    'the review dialog keeps its size in other themes, and works on the review page [scope-90]',
    { tag: ['@component:catalogue'] },
    async ({ page, browserName }) => {
        test.setTimeout(240_000);
        await openPage(page, '/catalogue/navigation.html');
        for (const [theme, label] of [
            ['nostromo', 'Nostromo'],
            ['cyberpunk', 'Cyberpunk'],
            ['sepia', 'Sepia'],
        ]) {
            await page.evaluate((name) => import('/js/theme-core.js').then((m) => m.applyTheme(name)), theme);
            await waitForJudging(page);
            await page.locator('.cat-bar [data-cat-dialog-open]').click();
            for (let i = 0; i < 5; i += 1) {
                if (i) await page.keyboard.press('ArrowRight');
                await expect(noteOf(page)).toBeFocused();
                // The laid-out size, not the painted box: a theme's opening
                // animation scales the dialog for its first frames (nostromo
                // measured 1319.9 px wide mid-animation, 1324.8 after).
                const box = await dialogOf(page).evaluate((el) => ({
                    width: parseFloat(getComputedStyle(el).width),
                    height: parseFloat(getComputedStyle(el).height),
                }));
                expect(box.width, `${theme} item ${i + 1}`).toBeCloseTo(1440 * 0.92, 0);
                expect(box.height, `${theme} item ${i + 1}`).toBeCloseTo(900 * 0.9, 0);
            }
            await expect(dialogOf(page).locator('[data-cat-dialog-theme]')).toContainText(label);
            await page.keyboard.press('Escape');
            await expect(dialogOf(page)).toBeHidden();
        }

        // The review page: the bar's button opens the first block, a verdict brings
        // the next, and Escape lands on a block still on the page.
        await page.evaluate((name) => import('/js/theme-core.js').then((m) => m.applyTheme(name)), 'formal');
        await page.goto('/catalogue/index.html');
        await waitForJudging(page, { timeout: 180_000 });
        await page.locator('.cat-bar [data-cat-dialog-open]').click();
        const first = await titleOf(page).textContent();
        const key = await page.evaluate(() => document.querySelector('[data-cat-dialog-stage] > .cat-block')?.id);
        expect(key).toBeTruthy();
        await page.keyboard.press('ArrowUp');
        await expect(titleOf(page)).not.toHaveText(first ?? '');
        expect(await storedHash(page, key, browserName)).toMatch(/^[0-9a-f]{64}$/);
        await page.keyboard.press('Escape');
        await expect(dialogOf(page)).toBeHidden();
        await expect(page.locator(`[id="${key}"]`)).toBeHidden();
        const focused = page.locator(':focus');
        await expect(focused).toHaveAttribute('data-cat-dialog-block', '');
        await expect(focused).toBeInViewport();
    },
);
