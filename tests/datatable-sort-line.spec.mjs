// Sorting on several columns never moves the search or the rows [fix-83].
//
// The homelab dashboard's second round (2026-09-29): the multi-sort summary
// was put in the toolbar before the search and grew with its words, so the
// search box shrank and slid under the pointer with every key added (Kenny:
// "als ik nu veel dingen sort, verschuift de UI ook"). What holds now: the
// summary has a line of its own under the toolbar, one line high whatever
// it says, with the way back to the opening sort at its end, present only
// while the sort differs from it and taking its room either way.

import { expect, test } from '@playwright/test';

test('adding sort keys moves neither the search nor the first row [fix-83]', { tag: ['@component:datatable'] }, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/tests/fixtures/datatable-sort-line.html');
    const table = page.locator('[data-test="table"]');
    const search = page.locator('[data-test="search"]');
    const firstRow = table.locator('tbody tr').first();
    const summary = table.locator('[data-kp-datatable-sort-summary]');
    const reset = table.locator('[data-kp-datatable-sort-reset]');
    await expect(summary).toHaveText('Not sorted.');
    await expect(reset, 'nothing to go back to yet, but its room is kept').toBeHidden();
    const searchAt = await search.boundingBox();
    const rowAt = await firstRow.boundingBox();
    const summaryAt = await summary.boundingBox();
    expect(summaryAt && searchAt && summaryAt.y >= searchAt.y + searchAt.height, 'the summary has its own line under the search').toBe(true);
    for (const column of ['Severity', 'Hours open', 'Site', 'Status']) {
        await table.locator('thead th', { hasText: column }).click({ modifiers: ['Shift'] });
        expect(await search.boundingBox(), `the search stayed put after sorting on ${column}`).toEqual(searchAt);
        expect((await firstRow.boundingBox())?.y, `the first row stayed put after sorting on ${column}`).toBe(rowAt?.y);
        expect((await summary.boundingBox())?.height, 'the summary line keeps its height').toBe(summaryAt?.height);
    }
    await expect(reset).toBeVisible();
    await reset.click();
    await expect(summary).toHaveText('Not sorted.');
});
