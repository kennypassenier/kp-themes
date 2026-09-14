// The catalogue's add-filter block [Kenny, 2026-09-14, filter-design, "Allebei, per tabel"].
//
// catalogue/table.html#datatable-add-filter shows the add-filter mode on a
// live table for Kenny to judge. This holds that the block is there, is the
// package's own table rather than a picture of one, and starts from the pill
// its look text promises. Red on 7780e64: the block did not exist.

import { expect, test } from '@playwright/test';
import { DEFAULT_STRINGS as S } from '../js/strings.js';
import { useEmptyRegister } from './helpers/empty-register.mjs';
import { waitForJudging } from './helpers/catalogue.mjs';

test('the table page shows the add-filter mode on a live table, starting with the Status pill', async ({ page }) => {
    await useEmptyRegister(page.context());
    await page.goto('/catalogue/table.html');
    await waitForJudging(page);
    const block = page.locator('#datatable-add-filter.cat-block');
    await expect(block.locator('h2')).toHaveText('Data table: adding a filter, one at a time');
    await expect(block.locator('.cat-look')).toContainText('Look at:');
    const table = block.locator('.kp-datatable[data-kp-filter-mode="add"]');
    await expect(table).toHaveAttribute('data-kp-datatable-attached', '');
    const pill = table.locator('[data-kp-filter-pill]');
    await expect(pill).toHaveText(S.tableFilterChoicePill('Status', ['Open', 'Watching']));
    await expect(table.locator('[data-kp-datatable-add-filter]')).toHaveText(S.tableAddFilter(1));
    await table.locator('[data-kp-datatable-add-filter]').click();
    const menu = table.locator('[data-kp-datatable-add-menu]');
    await expect(menu).toBeVisible();
    await expect(menu.locator('.kp-menu__item')).toHaveText(['Site', `Status ${S.tableFilterMarked}`, 'Hours open', 'Opened']);
    await menu.locator('.kp-menu__item', { hasText: 'Hours open' }).click();
    await table.locator('[data-kp-filter-bound="from"]').fill('10');
    await table.locator('[data-kp-filter-bound="to"]').fill('30');
    await table.locator('[data-kp-filter-bound="to"]').press('Enter');
    await expect(table.locator('[data-kp-filter-pill]')).toHaveCount(2);
    await expect(table.locator('.kp-datatable__clear-filters')).toBeVisible();
});
