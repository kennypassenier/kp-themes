// Every table can fail with a reason and a way out, and "nothing yet" is
// told apart from "nothing matches" [fix-85].
//
// The homelab dashboard's second round (2026-09-29): the failed slot, with
// its Try again, was made only for a `data-kp-server` table, so a table whose
// page loads its own rows and calls state('failed') showed nothing but
// "Showing 0 of 0"; the slot's words could not carry the reason; and one
// empty slot served both "there is nothing" and "nothing matches".

import { expect, test } from '@playwright/test';

test('a table that loads its own rows fails with its reason and Try again [fix-85]', { tag: ['@component:datatable'] }, async ({ page }) => {
    await page.goto('/tests/fixtures/datatable-empty-failed.html');
    await page.waitForSelector('html[data-ready]');
    const table = page.locator('[data-test="table"]');
    await page.evaluate(() => /** @type {any} */ (window).kpTable.fail('The host did not answer (HTTP 502).'));
    const failed = table.locator('[data-kp-datatable-failed]');
    await expect(failed).toBeVisible();
    await expect(failed).toContainText('The host did not answer (HTTP 502).');
    await failed.getByRole('button', { name: 'Try again' }).click();
    expect(await page.evaluate(() => /** @type {any} */ (window).kpRetries)).toBe(1);
    await page.evaluate(() => /** @type {any} */ (window).kpTable.state('ready'));
    await expect(failed).toBeHidden();
});

test('nothing yet and nothing matching say different things [fix-85]', { tag: ['@component:datatable'] }, async ({ page }) => {
    await page.goto('/tests/fixtures/datatable-empty-failed.html');
    await page.waitForSelector('html[data-ready]');
    const none = page.locator('[data-test="none"]');
    const nomatch = page.locator('[data-test="nomatch"]');
    await page.locator('[data-test="search"]').fill('zzz');
    await expect(nomatch).toBeVisible();
    await expect(none).toBeHidden();
    await page.locator('[data-test="search"]').fill('');
    await expect(nomatch).toBeHidden();
    await page.evaluate(() => {
        document.querySelector('[data-test="table"] tbody')?.replaceChildren();
        /** @type {any} */ (window).kpTable.refresh();
    });
    await expect(none).toBeVisible();
    await expect(nomatch).toBeHidden();
});
