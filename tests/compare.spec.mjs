// The compare page: 4.0.0 on the left, the current build on the right,
// the same theme in both [MR-R6-COMPARE, C5].
//
// Measured by the identity every themes.css declares since 3.0.0
// (`--kp-themes-version`, AR25): the left frame's stylesheet says 4.0.0,
// the right frame's says the package version, and both documents wear
// the theme from the query.
//
// Drills [KT3], performed 2026-09-07 in both browsers and restored:
//   - the left frame's `src` pointed at concept.html → both sides read the
//     current version, red on "the left is not 4.0.0";
//   - the theme script's `setAttribute` on the frames removed → the old
//     frame keeps formal, red.

import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';

const VERSION = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')).version;

test.describe('the compare page', () => {
    test('the left frame is 4.0.0, the right frame is the current build, both wear the theme from the query', async ({ page }) => {
        await page.setViewportSize({ width: 1400, height: 900 });
        await page.goto('/examples/compare.html?theme=nostromo');
        const old = page.frameLocator('iframe[data-compare-side="old"]');
        const current = page.frameLocator('iframe[data-compare-side="new"]');
        await expect(old.locator('[data-kp-surface="hero"]')).toBeVisible();
        await expect(current.locator('[data-kp-surface="hero"]')).toBeVisible();
        const identity = (frame) =>
            frame.locator('html').evaluate((html) => ({
                version: getComputedStyle(html).getPropertyValue('--kp-themes-version').trim().replace(/^'|'$/g, ''),
                theme: html.getAttribute('data-theme'),
                // A 5.0.0 token no 4.0.0 stylesheet declares (C1): the sharper
                // discriminator while package.json still says 4.0.0.
                heroSource: getComputedStyle(html).getPropertyValue('--surface-hero-bg').trim(),
            }));
        await expect.poll(async () => (await identity(old)).theme).toBe('nostromo');
        await expect.poll(async () => (await identity(current)).theme).toBe('nostromo');
        const left = await identity(old);
        const right = await identity(current);
        expect(left.version, 'the left is not 4.0.0').toBe('4.0.0');
        expect(right.version, 'the right is not the current build').toBe(VERSION);
        expect(left.heroSource, 'the left declares a 5.0.0 token').toBe('');
        expect(right.heroSource, 'the right is not the 5.0.0 build').not.toBe('');
    });

    test('every theme is linked, and the chosen one is marked current', async ({ page }) => {
        await page.goto('/examples/compare.html?theme=cyberpunk');
        expect(await page.locator('[data-theme-link]').count()).toBe(24);
        await expect(page.locator('[data-theme-link="cyberpunk"]')).toHaveAttribute('aria-current', 'page');
    });
});
