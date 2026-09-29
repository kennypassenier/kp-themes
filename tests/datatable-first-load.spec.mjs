// A datatable's first load shows that it is working, and in the consumer's
// words when it has them [fix-80].
//
// The homelab dashboard (2026-09-29): a table with no rows yet, left loading
// for the 93 s its host needs, showed three pulsing grey rows and the busy
// word — no spinner, because the status line only drew one on a refresh
// (`state === 'loading' && all.length > 0`) — and Kenny read it as "it seems
// to load, but nothing loads". What holds now: the first load carries the
// same spinner a refresh does, and the handle's `busy(text)` puts the
// consumer's own progress line in the status while it loads, kept across a
// `refresh()`, gone once the table is ready.

import { expect, test } from '@playwright/test';

test("a first load carries a spinner and the consumer's own progress words [fix-80]", { tag: ['@component:datatable'] }, async ({ page }) => {
    await page.goto('/tests/fixtures/datatable-first-load.html');
    await page.waitForSelector('html[data-ready]');
    const status = page.locator('[data-test="table"] [data-kp-datatable-status]');
    await expect(status.locator('.kp-spinner'), 'a spinner on the first load').toHaveCount(1);
    await page.evaluate(() => /** @type {any} */ (window).kpTable.busy('Asking the host… 42 s so far'));
    await expect(status).toContainText('Asking the host… 42 s so far');
    await page.evaluate(() => /** @type {any} */ (window).kpTable.refresh());
    await expect(status, 'kept across a refresh').toContainText('Asking the host… 42 s so far');
    await expect(status.locator('.kp-spinner')).toHaveCount(1);
    await page.evaluate(() => /** @type {any} */ (window).kpTable.state('ready'));
    await expect(status).not.toContainText('Asking the host');
    await expect(status.locator('.kp-spinner')).toHaveCount(0);
});
