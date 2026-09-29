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

test('busy with a start time keeps its own count, told to no one each second [fix-84]', { tag: ['@component:datatable'] }, async ({ page }) => {
    // The homelab dashboard's second round (2026-09-29): a consumer calling
    // busy() every second to say how long it had been asking re-rendered the
    // whole table each second, and the status line is a live region, so a
    // screen reader would be told the new number every second too. busy()
    // with `since` counts by itself, in a part the live region does not
    // announce, and touches nothing else while it counts.
    await page.goto('/tests/fixtures/datatable-first-load.html');
    await page.waitForSelector('html[data-ready]');
    const status = page.locator('[data-test="table"] [data-kp-datatable-status]');
    await page.evaluate(() => /** @type {any} */ (window).kpTable.busy({ text: 'Asking the host…', since: Date.now() - 42_000 }));
    await expect(status).toContainText('Asking the host…');
    const clock = status.locator('[data-kp-busy-clock]');
    await expect(clock).toHaveAttribute('aria-hidden', 'true');
    await expect(clock).toHaveText(/^4[2-3] s so far$/);
    // Watch what changes for two seconds: only the clock may.
    await page.evaluate(() => {
        const target = document.querySelector('[data-test="table"]');
        /** @type {any} */ (window).kpMutations = [];
        new MutationObserver((records) => {
            for (const r of records) {
                const inClock = (r.target instanceof Element ? r.target : r.target.parentElement)?.closest('[data-kp-busy-clock]');
                if (!inClock) /** @type {any} */ (window).kpMutations.push(r.type);
            }
        }).observe(/** @type {Element} */ (target), { subtree: true, childList: true, characterData: true, attributes: true });
    });
    await page.waitForTimeout(2200);
    await expect(clock).toHaveText(/^4[4-6] s so far$/);
    expect(await page.evaluate(() => /** @type {any} */ (window).kpMutations), 'nothing but the clock changed while it counted').toEqual([]);
    await page.evaluate(() => /** @type {any} */ (window).kpTable.state('ready'));
    await expect(status.locator('[data-kp-busy-clock]')).toHaveCount(0);
});
