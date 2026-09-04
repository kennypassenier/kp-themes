// The command palette and the shortcut sheet, both channels [TH40, TH49].
//
// What is worth testing here is not that a dialog opens — the browser
// does that — but the three things a palette gets wrong: the keystroke on
// the wrong platform, the subsequence match, and a `?` that steals the
// question mark someone is typing into a field.

import { test, expect } from '@playwright/test';

const URL = '/tests/fixtures/components.html';

const CHANNELS = [
    { name: 'framework-free', palette: '[data-test="plain-palette"]', sheet: '[data-test="plain-shortcuts"]' },
    { name: 'React', palette: '[data-test="react-palette"] .kp-palette', sheet: '[data-test="react-palette"] .kp-shortcuts' },
];

for (const channel of CHANNELS) {
    test.describe(`command palette — ${channel.name}`, () => {
        /** Open this channel's palette directly: the global key belongs to
         * the first palette in the document, which is what the shared test
         * at the bottom of this file covers. */
        const open = async (page) => {
            await page.locator(channel.palette).evaluate((dialog) => dialog.showModal());
            await page.locator(`${channel.palette} .kp-palette__input`).focus();
        };

        test('it matches a subsequence, not a substring [TH40]', async ({ page }) => {
            await page.goto(URL);
            await open(page);
            const palette = page.locator(channel.palette);
            // "thm" is not a substring of "Thema wisselen"; a palette that
            // uses `includes` finds nothing here, which is the difference
            // people actually notice.
            await palette.locator('.kp-palette__input').fill('thm');
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

test('Ctrl+K opens the palette and focus lands in the input [TH40]', async ({ page }) => {
    await page.goto(URL);
    const palette = page.locator('[data-test="plain-palette"]');
    await expect(palette).toBeHidden();
    await page.keyboard.press('Control+k');
    await expect(palette).toBeVisible();
    // showModal() put focus inside; without it the first keystroke goes to
    // the page behind the dialog.
    await expect(palette.locator('.kp-palette__input')).toBeFocused();
});

test('a second palette on the page does not also open [TH40]', async ({ page }) => {
    await page.goto(URL);
    await page.keyboard.press('Control+k');
    // Two open modal dialogs is what happened before the key was given to
    // the first palette only — found by this suite, with one palette per
    // channel on one page.
    await expect(page.locator('dialog[open].kp-palette')).toHaveCount(1);
});

test('the shortcut sheet opens on ? and not while typing [TH49]', async ({ page }) => {
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
