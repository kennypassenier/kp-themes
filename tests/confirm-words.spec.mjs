// kyu-ux-1101: a plain confirmation takes its words from markup, so kyu's prune
// can say "Delete 8 dead letters" on Confirm and drop "This cannot be undone."
// when its phrase already says so. Until 12.1.0 `data-kp-confirm-label` was read
// for a typed confirmation only, and the sentence came from the dictionary or JS.
import { expect, test } from '@playwright/test';

const PAGE = '/site/components/button.html';

test('a plain confirmation names Confirm and drops the sentence from markup [kyu-ux-1101]', { tag: ['@component:button', '@component:overlays'] }, async ({ page }) => {
    await page.goto(PAGE);
    await page.getByRole('button', { name: 'Prune', exact: true }).click();
    const dialog = page.locator('[data-kp-confirm-dialog]');
    await expect(dialog).toHaveCount(1);
    // Drill: drop the attribute read on the plain path in js/components/confirm-dialog.js and this reads the dictionary's "Yes, do it".
    await expect(dialog.locator('[data-kp-confirm-accept]')).toHaveText('Delete 8 dead letters');
    await expect(dialog.locator('.kp-dialog__description')).toHaveCount(0);
    expect(await dialog.getAttribute('aria-describedby')).toBeNull();
    await dialog.locator('[data-kp-confirm-cancel]').click();
});

test('a plain confirmation carries its own sentence from markup [kyu-ux-1101]', { tag: ['@component:button', '@component:overlays'] }, async ({ page }) => {
    await page.goto(PAGE);
    await page.getByRole('button', { name: 'Remove', exact: true }).first().click();
    const dialog = page.locator('[data-kp-confirm-dialog]');
    await expect(dialog.locator('[data-kp-confirm-accept]')).toHaveText('Remove alerts');
    await expect(dialog.locator('.kp-dialog__description')).toHaveText('Its 3 subscribers stop getting messages; the topic can be made again.');
});
