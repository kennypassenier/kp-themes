// The command palette and the shortcut sheet, both channels [TH40, TH49].
//
// What is worth testing here is not that a dialog opens — the browser
// does that — but the three things a palette gets wrong: the keystroke on
// the wrong platform, the match, and a `?` that steals the
// question mark someone is typing into a field. The sheet fitting a 360px
// window [MR-R6-2] is judged by eye on the catalogue since scope-73
// (page-effects#palette-narrow).

import { test, expect } from '@playwright/test';

const URL = '/tests/fixtures/components.html';

const CHANNELS = [
    { name: 'framework-free', palette: '[data-test="plain-palette"]', sheet: '[data-test="plain-shortcuts"]' },
    { name: 'React', palette: '[data-test="react-palette"] .kp-palette', sheet: '[data-test="react-palette"] .kp-shortcuts' },
];

for (const channel of CHANNELS) {
    test.describe(`command palette — ${channel.name}`, { tag: ['@component:page'] }, () => {
        /** Open this channel's palette directly: the global key belongs to
         * the first palette in the document, which is what the shared test
         * at the bottom of this file covers. */
        const open = async (page) => {
            await page.locator(channel.palette).evaluate((dialog) => dialog.showModal());
            await page.locator(`${channel.palette} .kp-palette__input`).focus();
        };

        test('it matches literally by default, not as a subsequence [TH40, scope-56]', async ({ page }) => {
            await page.goto(URL);
            await open(page);
            const palette = page.locator(channel.palette);
            // Until scope-56 the default was a subsequence and "thm" found
            // "Thema wisselen". Kenny read that as a wrong answer: the
            // default is now literal, and subsequence is asked for per
            // palette (tests/held-60.spec.mjs drives that half).
            await palette.locator('.kp-palette__input').fill('thm');
            await expect(palette.locator('.kp-palette__option:visible')).toHaveCount(0);
            await palette.locator('.kp-palette__input').fill('them');
            const options = palette.locator('.kp-palette__option:visible');
            await expect(options).toHaveCount(1);
            await expect(options.first()).toContainText('Thema wisselen');
        });

        test('Escape closes it, and the query does not survive [TH40]', async ({ page }) => {
            await page.goto(URL);
            await open(page);
            const palette = page.locator(channel.palette);
            await palette.locator('.kp-palette__input').fill('thm');
            await page.keyboard.press('Escape');
            await expect(palette).toBeHidden();
            await open(page);
            // Reopening with the old query still in the box makes the list
            // look filtered for no visible reason.
            await expect(palette.locator('.kp-palette__input')).toHaveValue('');
        });
    });
}

test('Ctrl+K opens the palette and focus lands in the input [TH40]', { tag: ['@component:page'] }, async ({ page }) => {
    await page.goto(URL);
    const palette = page.locator('[data-test="plain-palette"]');
    await expect(palette).toBeHidden();
    await page.keyboard.press('Control+k');
    await expect(palette).toBeVisible();
    // showModal() put focus inside; without it the first keystroke goes to
    // the page behind the dialog.
    await expect(palette.locator('.kp-palette__input')).toBeFocused();
});

test('a second palette on the page does not also open [TH40]', { tag: ['@component:page'] }, async ({ page }) => {
    await page.goto(URL);
    await page.keyboard.press('Control+k');
    // Two open modal dialogs is what happened before the key was given to
    // the first palette only — found by this suite, with one palette per
    // channel on one page.
    await expect(page.locator('dialog[open].kp-palette')).toHaveCount(1);
});

test('the shortcut sheet opens on ? and not while typing [TH49]', { tag: ['@component:page'] }, async ({ page }) => {
    await page.goto(URL);
    const sheet = page.locator('[data-test="plain-shortcuts"]');
    await page.keyboard.press('?');
    await expect(sheet).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(sheet).toBeHidden();

    // A `?` typed into a field is a question mark. Stealing it is the bug
    // every shortcut sheet ships with once.
    const field = page.locator('[data-test="plain-combobox-input"]');
    await field.click();
    await field.press('?');
    await expect(sheet).toBeHidden();
    await expect(field).toHaveValue('?');
});

// Kenny's note on the palette (scope-80) was answered for the palette in
// ec3d3b9; the shortcut sheet is the same dialog machinery and kept the old
// behaviour. Before: a press on the sheet's backdrop left it open, in both
// channels.
for (const channel of CHANNELS) {
    test(
        `the shortcut sheet closes on a press outside it and stays open on a press inside, ${channel.name} [scope-80]`,
        { tag: ['@component:page'] },
        async ({ page }) => {
            await page.setViewportSize({ width: 1280, height: 900 });
            await page.goto(URL);
            const sheet = page.locator(channel.sheet);
            await sheet.evaluate((dialog) => /** @type {HTMLDialogElement} */ (dialog).showModal());
            await expect(sheet).toBeVisible();
            const box = /** @type {{ x: number, y: number, width: number, height: number }} */ (await sheet.boundingBox());
            await page.mouse.click(box.x + box.width / 2, box.y + Math.min(20, box.height / 2));
            await expect(sheet, 'a press inside the box keeps the sheet open').toBeVisible();
            await page.mouse.click(box.x + box.width / 2, Math.min(890, box.y + box.height + 40));
            await expect(sheet, 'a press on the backdrop closes it').toBeHidden();
        },
    );
}
