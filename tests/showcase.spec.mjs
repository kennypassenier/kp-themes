// The showcase opens, and opens correctly [L9, AR14].
//
// L9's exit criterion ends with "and produces a showcase that opens" —
// not "the file exists". A generated page that throws on load is exactly
// the kind of thing a file-existence check reports as success.

import { test, expect } from '@playwright/test';
import { THEMES } from '../js/theme-registry.js';

test('the showcase renders every theme, with nothing failing on load', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));

    await page.goto('/showcase/index.html');
    await page.waitForSelector('[data-kp-theme-picker] button');

    // One block per theme, each wearing its own theme.
    await expect(page.locator('.sc-theme')).toHaveCount(THEMES.length);
    for (const theme of THEMES) {
        await expect(page.locator(`#theme-${theme.name}`)).toHaveAttribute('data-theme', theme.name);
    }

    // Every picker on the page was filled from the generated registry.
    const options = await page.locator('#theme-formal [data-kp-theme-picker] button').count();
    expect(options).toBe(THEMES.length);

    expect(errors, 'the showcase logged errors while loading').toEqual([]);
});

test('picking a theme on the showcase changes the document, not the blocks', async ({ page }) => {
    await page.goto('/showcase/index.html');
    await page.waitForSelector('[data-kp-theme-picker] button');

    await page.click('#theme-formal [data-kp-theme-picker] [data-kp-theme="terminal"]');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'terminal');
    // Each block keeps wearing its own theme: that is what makes the page
    // a comparison rather than seven copies of the current theme.
    await expect(page.locator('#theme-pastel')).toHaveAttribute('data-theme', 'pastel');
});
