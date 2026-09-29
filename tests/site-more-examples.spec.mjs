// The site's component pages show the catalogue's blocks as more examples.
//
// Kenny, 2026-09-29, on site/components/table.html: three tables, while the
// component has many more options, and nothing of how a table loads or
// fails. The catalogue held a block for each; the site now shows them on the
// component's own page, read from catalogue/*.html by
// gates/site/catalogue-examples.mjs.

import { expect, test } from '@playwright/test';

test('the data table page shows every catalogue block, loading and failed among them', { tag: ['@component:site', '@component:datatable'] }, async ({ page }) => {
    await page.goto('/site/components/datatable.html');
    const more = page.locator('#more-examples figure');
    await expect(more).toHaveCount(11);
    const states = page.locator('#more-table-datatable-states');
    await expect(states.locator('[data-kp-datatable-status] .kp-spinner')).toHaveCount(1);
    await expect(states.getByRole('button', { name: 'Try again' })).toBeVisible();
    // The pretend server of catalogue/demos.js answers here too.
    await expect(page.locator('#more-table-datatable-server tbody tr').first()).toBeVisible();
});

test('the table page shows its catalogue blocks beside its own examples', { tag: ['@component:site'] }, async ({ page }) => {
    await page.goto('/site/components/table.html');
    await expect(page.locator('#example figure')).toHaveCount(3);
    await expect(page.locator('#more-examples figure')).toHaveCount(7);
});
