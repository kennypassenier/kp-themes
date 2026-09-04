// Date picker [TH43].
//
// The parsing is unit-tested in gates/gates.test.mjs. What needs a
// browser is the grid, and specifically the two things that decide
// whether anyone can use it without a mouse: exactly one day in the tab
// order, and arrows that cross a month boundary rather than stopping at
// the edge of the drawn grid.

import { test, expect } from '@playwright/test';
import { DEFAULT_STRINGS as S } from '../js/strings.js';

const URL = '/tests/fixtures/components.html';
// Both channels [AR7]. They share `parseDate` — two implementations of
// "is 31-02 a date" is exactly how the channels come to disagree — but the
// grid is written twice, so the grid is what this drives.
const CHANNELS = [
    {
        name: 'framework-free',
        input: '[data-test="plain-date-input"]',
        open: '[data-test="plain-date-open"]',
        panel: '[data-test="plain-date-panel"]',
    },
    {
        name: 'React',
        input: '[data-test="react-date"] .kp-field__input',
        open: '[data-test="react-date"] [data-kp-date-open]',
        panel: '[data-test="react-date"] .kp-datepicker__panel',
    },
];

for (const channel of CHANNELS) {
    test.describe(`date picker — ${channel.name}`, () => {
        test('typing a date is enough — the calendar never has to open [TH43]', async ({ page }) => {
            await page.goto(URL);
            const input = page.locator(channel.input);
            await input.fill('4-9-2026');
            // ISO in the attribute, Dutch on screen: parsing a localised string on
            // the server is how off-by-one-day bugs are born.
            await expect(input).toHaveAttribute('data-kp-date-value', '2026-09-04');
            await expect(page.locator(channel.panel)).toBeHidden();
        });

        test('an impossible date leaves no value behind [TH43]', async ({ page }) => {
            await page.goto(URL);
            const input = page.locator(channel.input);
            await input.fill('4-9-2026');
            await expect(input).toHaveAttribute('data-kp-date-value', '2026-09-04');
            await input.fill('31-02-2026');
            // A stale value under a rejected date is worse than no value: the
            // consumer would save the previous one.
            await expect(input).not.toHaveAttribute('data-kp-date-value', /.+/);
        });

        test('exactly one day is in the tab order [TH43]', async ({ page }) => {
            await page.goto(URL);
            await page.locator(channel.input).fill('4-9-2026');
            await page.locator(channel.open).click();
            const panel = page.locator(channel.panel);
            await expect(panel).toBeVisible();
            // Otherwise Tab walks 31 buttons to get out of a calendar.
            await expect(panel.locator('[data-kp-day][tabindex="0"]')).toHaveCount(1);
        });

        test('the arrows cross the month boundary [TH43]', async ({ page }) => {
            await page.goto(URL);
            await page.locator(channel.input).fill('01-09-2026');
            await page.locator(channel.open).click();
            const panel = page.locator(channel.panel);
            await expect(panel.locator('.kp-datepicker__title')).toHaveText(`${S.months[8]} 2026`);
            // Stopping at the edge of the drawn grid is the difference between a
            // calendar and a picture of one.
            await panel.locator('[data-kp-day="2026-09-01"]').press('ArrowLeft');
            await expect(panel.locator('.kp-datepicker__title')).toHaveText(`${S.months[7]} 2026`);
            await expect(panel.locator('[data-kp-day="2026-08-31"]')).toBeFocused();
        });

        test('PageDown moves a month, Enter takes the day [TH43]', async ({ page }) => {
            await page.goto(URL);
            const input = page.locator(channel.input);
            await input.fill('04-09-2026');
            await page.locator(channel.open).click();
            const panel = page.locator(channel.panel);
            await panel.locator('[data-kp-day="2026-09-04"]').press('PageDown');
            await expect(panel.locator('.kp-datepicker__title')).toHaveText(`${S.months[9]} 2026`);
            await panel.locator('[data-kp-day="2026-10-04"]').press('Enter');
            await expect(input).toHaveValue('04-10-2026');
            await expect(input).toHaveAttribute('data-kp-date-value', '2026-10-04');
            await expect(panel).toBeHidden();
        });

        test('every day says which month it is in [TH43]', async ({ page }) => {
            await page.goto(URL);
            await page.locator(channel.input).fill('04-09-2026');
            await page.locator(channel.open).click();
            // "4" alone tells a screen reader nothing about which month it is in.
            await expect(page.locator(`${channel.panel} [data-kp-day="2026-09-04"]`)).toHaveAttribute('aria-label', S.dayLabel(4, S.months[8], 2026));
        });

        test('Escape closes the grid and returns focus [TH43]', async ({ page }) => {
            await page.goto(URL);
            await page.locator(channel.input).fill('04-09-2026');
            const open = page.locator(channel.open);
            await open.click();
            await page.locator(`${channel.panel} [data-kp-day="2026-09-04"]`).press('Escape');
            await expect(page.locator(channel.panel)).toBeHidden();
            await expect(open).toBeFocused();
        });
    });
}
