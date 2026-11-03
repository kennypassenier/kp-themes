// No lookup passes an empty id to getElementById [byid-1103].
//
// Firefox logs "Empty string passed to getElementById()" each time. A dialog trigger with an empty value and a tab
// without aria-controls used to cause it on every page load; js/by-id.js answers null for those ids instead.

import { expect, test } from '@playwright/test';

test.describe('ids that cannot name an element', { tag: ['@component:overlays', '@sweep'] }, () => {
    test('an empty data-kp-dialog and a tab without aria-controls log nothing, and the real dialog still opens', async ({ page }) => {
        const warnings = [];
        page.on('console', (message) => message.text().includes('Empty string passed to getElementById') && warnings.push(message.text()));
        await page.goto('/tests/fixtures/empty-id.html');
        await page.waitForFunction(() => document.documentElement.hasAttribute('data-kp-auto-ready'));
        await page.click('[aria-controls="p2"]');
        await page.click('button[data-kp-dialog="real"]');
        await expect(page.locator('#real')).toHaveJSProperty('open', true);
        expect(warnings).toEqual([]);
    });
});
