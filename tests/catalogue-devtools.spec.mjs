// The catalogue's developer overlay [scope-42].
//
// Kenny, 2026-09-14: "waar ik ook klik, die pakt zowel het first als second
// element". Every open of the overlay added another pair of document
// listeners and none were ever removed, so after the second open one click
// ran the ruler twice — the first run picked the element as first, the next
// as second.

import { test, expect } from '@playwright/test';
import { useEmptyRegister } from './helpers/empty-register.mjs';

test('after opening the overlay again, one click picks only the first element for the ruler', async ({ page }) => {
    // An empty register, so no block is hidden as already judged.
    await useEmptyRegister(page.context());
    await page.goto('/catalogue/button.html');
    await expect(page.locator('.cat-nav')).toBeVisible();
    // Open, close, open: the sequence a reviewer goes through within minutes.
    for (let i = 0; i < 3; i++) await page.keyboard.press('Alt+d');
    const out = page.locator('[aria-label="Catalogue developer tools"] [data-out]');
    await page.locator('[aria-label="Catalogue developer tools"] [data-tool="ruler"]').click();
    await page.locator('#variants .cat-stage .kp-button--primary').click();
    await expect(out).toContainText('click a second element');
    await expect(out).not.toContainText('second:');
    await page.locator('#variants .cat-stage .kp-button--destructive').click();
    await expect(out).toContainText('second:');
});
