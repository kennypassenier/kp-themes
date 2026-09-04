// The DataTable, driven in both channels [TH37].
//
// The features are easy to see and easy to test. What this suite is
// actually for is the half nearly every implementation skips: the sort
// state has to reach `aria-sort`, and the row count after a filter has to
// be announced. A sighted user watches the rows rearrange; without those
// two, everyone else is told nothing at all.

import { test, expect } from '@playwright/test';

const URL = '/tests/fixtures/components.html';

const CHANNELS = [
    { name: 'framework-free', table: '[data-test="plain-datatable"]' },
    { name: 'React', table: '[data-test="react-datatable"] .kp-datatable' },
];

for (const channel of CHANNELS) {
    test.describe(`datatable — ${channel.name}`, () => {
        test('a number column sorts as numbers, not as text [TH37]', async ({ page }) => {
            await page.goto(URL);
            const table = page.locator(channel.table);
            await table.locator('th[data-kp-sort="number"]').click();
            const cells = table.locator('tbody tr:visible td:last-child');
            // Sorted as text, "100" comes before "20" and "1.284,50"
            // before "7". That is the most common data-table bug there is.
            await expect(cells.first()).toHaveText('7');
        });

        test('the sort state reaches aria-sort, and only on the sorted column [TH37]', async ({ page }) => {
            await page.goto(URL);
            const table = page.locator(channel.table);
            const name = table.locator('th[data-kp-sort="text"]');
            const amount = table.locator('th[data-kp-sort="number"]');
            await name.click();
            await expect(name).toHaveAttribute('aria-sort', 'ascending');
            await name.click();
            await expect(name).toHaveAttribute('aria-sort', 'descending');
            // Sorting another column must clear the first: a stale
            // "descending" on a column that is no longer the key is worse
            // than saying nothing.
            await amount.click();
            await expect(amount).toHaveAttribute('aria-sort', 'ascending');
            await expect(name).toHaveAttribute('aria-sort', 'none');
        });

        test('filtering announces how many rows are left [TH37]', async ({ page }) => {
            await page.goto(URL);
            const table = page.locator(channel.table);
            const status = table.locator('[data-kp-datatable-status]');
            await expect(status).toHaveText('4 rijen');
            await table.locator('[data-kp-datatable-search]').fill('Acme');
            await expect(status).toHaveText('1 van 4 rijen');
        });

        test('an empty result says so instead of showing nothing [TH37, TH50]', async ({ page }) => {
            await page.goto(URL);
            const table = page.locator(channel.table);
            await table.locator('[data-kp-datatable-search]').fill('zzzz');
            await expect(table.locator('[data-kp-datatable-empty]')).toBeVisible();
            await expect(table.locator('tbody tr:visible')).toHaveCount(0);
        });

        test('pagination shows a page at a time [TH37]', async ({ page }) => {
            await page.goto(URL);
            const table = page.locator(channel.table);
            await expect(table.locator('tbody tr:visible')).toHaveCount(3);
            await expect(table.locator('.kp-datatable__page')).toHaveText('1 / 2');
            await table.getByRole('button', { name: 'Volgende' }).click();
            await expect(table.locator('tbody tr:visible')).toHaveCount(1);
            await expect(table.locator('.kp-datatable__page')).toHaveText('2 / 2');
        });

        test('the header checkbox is indeterminate for a partial selection [TH37]', async ({ page }) => {
            await page.goto(URL);
            const table = page.locator(channel.table);
            await table.locator('tbody tr:visible [data-kp-select-row]').first().check();
            const all = table.locator('[data-kp-select-all]');
            // A header box reading "checked" while one of three rows is
            // selected is a lie; indeterminate is the honest third state.
            await expect(all).toHaveJSProperty('indeterminate', true);
            await expect(all).not.toBeChecked();
        });

        test('the header checkbox takes every visible row [TH37]', async ({ page }) => {
            await page.goto(URL);
            const table = page.locator(channel.table);
            await table.locator('[data-kp-select-all]').check();
            const boxes = table.locator('tbody tr:visible [data-kp-select-row]');
            await expect(boxes).toHaveCount(3);
            for (let i = 0; i < 3; i += 1) await expect(boxes.nth(i)).toBeChecked();
        });

        test('at 320 px a row becomes a card, carrying its column names [TH37, DI11]', async ({ page }) => {
            await page.setViewportSize({ width: 320, height: 800 });
            await page.goto(URL);
            const table = page.locator(channel.table);

            // The alternative every table reaches for is a horizontal
            // scrollbar, and SC 1.4.10 is about not making a reader drag a
            // page sideways. So the row stacks instead.
            const cell = table.locator('tbody tr:visible td').nth(1);
            await expect(cell).toHaveCSS('display', 'flex');

            // And the column name travels with the cell, which is what the
            // stylesheet's ::before shows: a value with no question
            // attached is not information.
            //
            // The attribute is asserted rather than the rendered ::before,
            // because getComputedStyle resolves `content` in Chromium and
            // returns the literal `attr(data-label)` in Firefox. That is a
            // difference between the browsers, not between the channels.
            await expect(cell).toHaveAttribute('data-label', 'Naam');

            // The header row is hidden visually, not removed, so it still
            // names the columns for anyone reading the table structure.
            await expect(table.locator('thead')).not.toBeInViewport();
            await expect(table.locator('thead')).toBeAttached();
        });
    });
}
