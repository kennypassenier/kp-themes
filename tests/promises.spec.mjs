// The promises nothing was checking [Phase 7].
//
// Each of these covers a behaviour the package advertises and no test
// touched: what printing looks like, what happens when the browser
// refuses to store the choice, and whether a second tab is followed.
// They are here because the Phase 7 audit asked which promises had a
// test naming them, and these three came back empty.

import { test, expect } from '@playwright/test';

test('printing drops the theme and the decoration [TH36]', async ({ page }) => {
    await page.goto('/showcase/themes/cyberpunk.html');
    await page.emulateMedia({ media: 'print' });

    // Paper has no theme: white ground, black ink, and the texture layer
    // gone rather than costing toner for something that carries nothing.
    const printed = await page.evaluate(() => {
        const root = getComputedStyle(document.documentElement);
        const texture = getComputedStyle(document.body, '::before');
        return {
            background: root.getPropertyValue('--background').trim(),
            foreground: root.getPropertyValue('--foreground').trim(),
            textureHidden: texture.display === 'none',
        };
    });
    expect(printed.background).toBe('hsl(0, 0%, 100%)');
    expect(printed.foreground).toBe('hsl(0, 0%, 0%)');
    expect(printed.textureHidden).toBe(true);
});

test('a refused save is shown, not swallowed [AR6]', async ({ page }) => {
    await page.goto('/tests/fixtures/picker.html');
    await page.waitForSelector('#plain [data-kp-theme="dark"]');

    // Private mode, blocked storage, a full quota — the browser says no.
    // In a server-rendered dashboard a preference that quietly fails to
    // save is indistinguishable from a broken picker, which is why this
    // is surfaced rather than caught and ignored.
    await page.evaluate(() => {
        Storage.prototype.setItem = () => {
            throw new DOMException('blocked', 'QuotaExceededError');
        };
    });
    await page.click('#plain [data-kp-theme="terminal"]');

    // The theme still applies — only the remembering failed.
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'terminal');
    const status = page.locator('[data-kp-theme-status]');
    await expect(status).toBeVisible();
    await expect(status).toContainText('niet onthouden');
});

test('a choice made in another tab is followed [AR5]', async ({ page }) => {
    await page.goto('/tests/fixtures/picker.html');
    await page.waitForSelector('#plain [data-kp-theme="dark"]');
    await page.click('#plain [data-kp-theme="formal"]');

    // A storage event is what a second tab looks like from in here. The
    // bus translates it into the same announcement a local change makes,
    // so a subscriber never has to know which tab a change came from.
    await page.evaluate(() => {
        window.dispatchEvent(new StorageEvent('storage', { key: 'theme', newValue: 'topo', oldValue: 'formal' }));
    });
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'topo');
    await expect(page.locator('#plain [data-selected="true"]')).toHaveAttribute('data-kp-theme', 'topo');
});
