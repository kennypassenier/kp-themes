// Keyboard operation of the overlays, in both channels [L8, TH35, AR7].
//
// L8's exit criterion names three things and this file asserts exactly
// those: it opens, Escape closes it, and focus returns where it came
// from. The third is the one that quietly breaks — and AR7's worked
// example is precisely this: on Escape the framework-free script returned
// focus to the trigger and the React component did not. A structural
// comparison scores those two as identical.
//
// Both channels get the behaviour from <dialog> rather than from our
// code, which is the point: the test is here to catch the day someone
// replaces it with a div.

import { test, expect } from '@playwright/test';

const PAGE = '/tests/fixtures/components.html';
const CHANNELS = [
    { name: 'framework-free', root: '#plain' },
    { name: 'react', root: '#react-components' },
];

for (const channel of CHANNELS) {
    test.describe(`overlays · ${channel.name}`, () => {
        test.beforeEach(async ({ page }) => {
            await page.goto(PAGE);
            await page.waitForSelector(`${channel.root} [data-test="dialog-open"]`);
        });

        test('a dialog opens, Escape closes it, and focus goes back to the opener', async ({ page }) => {
            const opener = page.locator(`${channel.root} [data-test="dialog-open"]`);
            const dialog = page.locator(`${channel.root} dialog`);

            await opener.focus();
            await opener.click();
            await expect(dialog).toBeVisible();

            await page.keyboard.press('Escape');
            await expect(dialog).toBeHidden();

            // Not "something has focus" — the opener has it. Landing back
            // at the top of the document is the failure this catches.
            const returned = await page.evaluate(
                (root) => document.activeElement === document.querySelector(`${root} [data-test="dialog-open"]`),
                channel.root,
            );
            expect(returned, 'focus did not return to the button that opened the dialog').toBe(true);
        });

        test('the close button closes it too', async ({ page }) => {
            const dialog = page.locator(`${channel.root} dialog`);
            await page.locator(`${channel.root} [data-test="dialog-open"]`).click();
            await expect(dialog).toBeVisible();
            await page.locator(`${channel.root} [data-test="dialog-close"]`).click();
            await expect(dialog).toBeHidden();
        });

        test('tabs are one tab stop, and arrows move between them', async ({ page }) => {
            const tabs = page.locator(`${channel.root} [role="tab"]`);
            await expect(tabs).toHaveCount(2);

            await tabs.nth(0).focus();
            await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true');
            // The second tab is out of the tab order while the first is
            // selected: a row of tabs is one stop, not one per tab.
            await expect(tabs.nth(1)).toHaveAttribute('tabindex', '-1');

            await page.keyboard.press('ArrowRight');
            await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
            await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'false');
            await expect(page.locator(`${channel.root} [data-test="panel-1"]`)).toBeVisible();
            await expect(page.locator(`${channel.root} [data-test="panel-0"]`)).toBeHidden();
        });
    });
}
