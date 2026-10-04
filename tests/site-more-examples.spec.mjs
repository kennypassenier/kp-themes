// The site's component pages show the catalogue's blocks as more examples.
//
// Kenny, 2026-09-29, on site/components/table.html: three tables, while the
// component has many more options, and nothing of how a table loads or
// fails. The catalogue held a block for each; the site now shows them on the
// component's own page, read from catalogue/*.html by
// gates/site/catalogue-examples.mjs.

import { expect, test } from '@playwright/test';

test(
    'the data table page shows every catalogue block, loading and failed among them',
    { tag: ['@component:site', '@component:datatable'] },
    async ({ page }) => {
        await page.goto('/site/components/datatable.html');
        const more = page.locator('#more-examples figure');
        // Twelve since the busy overlay's block (8.1.0); fourteen since the
        // states block shows the live busy counter and a written failure
        // reason as stages of their own (9.2.0).
        await expect(more).toHaveCount(14);
        await expect(page.locator('#more-table-datatable-busy-overlay .kp-datatable__busy-overlay .kp-spinner')).toHaveCount(1);
        const states = page.locator('#more-table-datatable-states');
        // Three since 9.2.0: the live counter's table is busy too.
        await expect(states.locator('[data-kp-datatable-status] .kp-spinner')).toHaveCount(3);
        await expect(states.locator('[data-cat-busy] [data-kp-datatable-status]'), "the app's own words, through busy()").toContainText(
            'Asking the host… 42 s so far',
        );
        await expect(states.getByRole('button', { name: 'Try again' })).toBeVisible();
        // The pretend server of catalogue/demos.js answers here too.
        await expect(page.locator('#more-table-datatable-server tbody tr').first()).toBeVisible();
    },
);

test('the table page shows its catalogue blocks beside its own examples', { tag: ['@component:site'] }, async ({ page }) => {
    await page.goto('/site/components/table.html');
    await expect(page.locator('#example figure')).toHaveCount(3);
    await expect(page.locator('#more-examples figure')).toHaveCount(7);
});
