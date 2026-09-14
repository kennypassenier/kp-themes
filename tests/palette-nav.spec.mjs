// The command palette as navigation, both channels [scope-48, scope-79].
//
// research/navbar/README.md, recommendation 2: the palette existed, but a
// hotkey alone is a secret, and a palette whose commands only did something
// after the consumer wrote a `kp-palette-run` handler could not navigate on
// its own. Two additions, and the tests are about behaviour only:
//
//   - a visible trigger in the bar's `.kp-nav__search` slot, announced as
//     opening a dialog, printing the hotkey, opening the palette with focus
//     in its input, and taking focus back when Escape closes it;
//   - an option that is an `<a href>`: Enter and a click both follow it, the
//     run is still reported, and before the module attaches (or without
//     JavaScript at all) the list is a list of plain, working links.
//
// One suite, both channels [AR7, rule 7g]: `free` is the markup and
// js/palette.js, `react` is NavBar's `search` slot, PaletteTrigger and
// CommandPalette.

import { expect, test } from '@playwright/test';

const FIXTURE = '/tests/fixtures/palette-nav.html';

/** @param {import('@playwright/test').Page} page @param {'free' | 'react'} channel */
const parts = (page, channel) => {
    const palette = page.locator(`[data-test="${channel}-palette"]`);
    return {
        trigger: page.locator(`[data-test="${channel}-trigger"]`),
        palette,
        input: palette.locator('.kp-palette__input'),
        option: (/** @type {string} */ name) => palette.locator('.kp-palette__option', { hasText: name }),
    };
};

/** @param {import('@playwright/test').Page} page @param {'free' | 'react'} channel */
const runs = (page, channel) => page.evaluate((c) => /** @type {any} */ (window).runs[c], channel);

test.describe('the palette as navigation', { tag: ['@component:page', '@component:navigation'] }, () => {
    for (const channel of /** @type {const} */ (['free', 'react'])) {
        test(`${channel}: the trigger says it opens a dialog and prints the hotkey for this platform [scope-48]`, async ({ page }) => {
            await page.goto(FIXTURE);
            const { trigger } = parts(page, channel);
            await expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
            // The suite runs on Linux: Ctrl, never ⌘.
            await expect(trigger.locator('kbd')).toHaveText('Ctrl K');
        });

        test(`${channel}: pressing the trigger opens the palette with focus in its input [scope-48]`, async ({ page }) => {
            await page.goto(FIXTURE);
            const { trigger, palette, input } = parts(page, channel);
            await expect(palette).toBeHidden();
            await trigger.click();
            await expect(palette).toBeVisible();
            await expect(input).toBeFocused();
        });

        test(`${channel}: Escape closes the palette and gives focus back to the trigger [scope-48]`, async ({ page }) => {
            await page.goto(FIXTURE);
            const { trigger, palette } = parts(page, channel);
            await trigger.click();
            await expect(palette).toBeVisible();
            await page.keyboard.press('Escape');
            await expect(palette).toBeHidden();
            await expect(trigger).toBeFocused();
        });

        test(`${channel}: a click outside the palette closes it and gives focus back to the trigger, like Escape [scope-80]`, async ({ page }) => {
            // Kenny's note on catalogue/navigation.html#bar-search, dark: a
            // click outside the popup should close it, the way Escape does.
            // Before: the press landed on the dialog's backdrop and nothing
            // happened; the palette stayed open in both channels.
            await page.setViewportSize({ width: 1280, height: 900 });
            await page.goto(FIXTURE);
            const { trigger, palette, input } = parts(page, channel);
            await trigger.click();
            await expect(palette).toBeVisible();
            // Inside the box first: a press on the palette itself keeps it open.
            await input.click();
            await palette.locator('.kp-palette__status').click({ force: true });
            await expect(palette, 'a press inside the box keeps the palette open').toBeVisible();
            const box = /** @type {{ x: number, y: number, width: number, height: number }} */ (await palette.boundingBox());
            // Below the palette's box, on the backdrop.
            await page.mouse.click(box.x + box.width / 2, Math.min(890, box.y + box.height + 40));
            await expect(palette, 'a press on the backdrop closes it').toBeHidden();
            await expect(trigger).toBeFocused();
        });

        test(`${channel}: a press that starts inside the palette and ends outside it does not close it [scope-80]`, async ({ page }) => {
            // Selecting the query with the mouse and letting go past the box
            // is not a click outside.
            await page.setViewportSize({ width: 1280, height: 900 });
            await page.goto(FIXTURE);
            const { trigger, palette, input } = parts(page, channel);
            await trigger.click();
            await input.fill('settings');
            const box = /** @type {{ x: number, y: number, width: number, height: number }} */ (await input.boundingBox());
            await page.mouse.move(box.x + 10, box.y + box.height / 2);
            await page.mouse.down();
            await page.mouse.move(box.x + 10, 5, { steps: 4 });
            await page.mouse.up();
            await expect(palette).toBeVisible();
        });

        test(`${channel}: the highlight still travels by aria-activedescendant onto a link option [scope-48]`, async ({ page }) => {
            await page.goto(FIXTURE);
            const { trigger, input, option } = parts(page, channel);
            await trigger.click();
            await page.keyboard.press('ArrowDown');
            const id = await option('Settings').getAttribute('id');
            expect(id).toBeTruthy();
            await expect(input).toHaveAttribute('aria-activedescendant', /** @type {string} */ (id));
            await expect(option('Settings')).toHaveAttribute('aria-selected', 'true');
            // Virtual focus: the link is pointed at, the input keeps the caret.
            await expect(input).toBeFocused();
        });

        test(`${channel}: Enter on a link option follows the link and still reports the run [scope-48]`, async ({ page }) => {
            await page.goto(FIXTURE);
            const { trigger, palette, input } = parts(page, channel);
            await trigger.click();
            await input.fill('sett');
            await page.keyboard.press('Enter');
            await expect(page).toHaveURL(/#settings$/);
            await expect(palette).toBeHidden();
            expect(await runs(page, channel)).toEqual(['settings']);
        });

        test(`${channel}: a click on a link option follows the link and still reports the run [scope-48]`, async ({ page }) => {
            await page.goto(FIXTURE);
            const { trigger, palette, option } = parts(page, channel);
            await trigger.click();
            await option('Reports').click();
            await expect(page).toHaveURL(/#reports$/);
            await expect(palette).toBeHidden();
            expect(await runs(page, channel)).toEqual(['reports']);
        });

        test(`${channel}: a command that is not a link runs and goes nowhere [scope-48]`, async ({ page }) => {
            await page.goto(FIXTURE);
            const { trigger, input } = parts(page, channel);
            await trigger.click();
            await input.fill('theme');
            await page.keyboard.press('Enter');
            expect(await runs(page, channel)).toEqual(['theme']);
            expect(new URL(page.url()).hash).toBe('');
        });
    }

    test('free: a link option is a plain anchor the module does not need, before it attaches [scope-48]', async ({ page }) => {
        await page.goto(`${FIXTURE}?bare`);
        const { palette, option } = parts(page, 'free');
        // Shown without the module: nothing but the browser's own dialog.
        await palette.evaluate((dialog) => /** @type {HTMLDialogElement} */ (dialog).show());
        await option('Settings').click();
        await expect(page).toHaveURL(/#settings$/);
    });

    test('free: a module that stamped a link option takes the stamps back when it detaches [scope-48]', async ({ page }) => {
        await page.goto(`${FIXTURE}?bare`);
        const options = () => page.locator('#free .kp-palette__list').evaluate((el) => el.innerHTML);
        const before = await options();
        await page.evaluate(async () => {
            const { attachPalettes } = await import('/js/palette.js');
            attachPalettes(document.getElementById('free'))();
        });
        await expect.poll(options).toBe(before);
    });
});

test.describe('the palette as navigation, JavaScript off', { tag: ['@component:page', '@component:navigation'] }, () => {
    test.use({ javaScriptEnabled: false });

    test('free: without JavaScript the list is a list of working links [scope-48]', async ({ page }) => {
        await page.goto(FIXTURE);
        const links = page.locator('[data-test="free-palette"] a.kp-palette__option[href]');
        await expect(links).toHaveCount(2);
        await expect(links.nth(0)).toHaveAttribute('href', '#reports');
        await expect(links.nth(1)).toHaveAttribute('href', '#settings');
        // Followed by the browser alone: the href is the whole contract.
        await page.goto(`${FIXTURE}${await links.nth(1).getAttribute('href')}`);
        await expect(page).toHaveURL(/#settings$/);
    });
});
