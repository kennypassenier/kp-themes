// The compare page: only what changed between 4.0.0 and the current
// build, per theme, side by side, scrolling together [MR-R6-COMPARE, C5].
//
// Kenny's second reading of the first version: full width, the halves
// scrolled together, and only the differences with a plain statement of
// each. So the page is asked three things per theme: the statement
// exists and is the measured one, the pair shows exactly the sections the
// differences touch (the left under the 4.0.0 bundle, the right under the
// current build), and a scroll in one frame moves the other.
//
// Drills [KT3], performed 2026-09-07 in both browsers and restored:
//   - the right frame's `src` pointed at the 4.0.0 specimen → both sides
//     lack the 5.0.0 token, red on "the right is not the current build";
//   - the sync listener's `scrollTo` removed → the other frame stays at
//     0, red on "the frames scroll together";
//   - `show=` dropped from the frame query → every section visible on the
//     left, red on "only the sections the differences touch".

import { expect, test } from '@playwright/test';

/** @param {import('@playwright/test').Page} page @param {string} theme */
async function open(page, theme) {
    await page.setViewportSize({ width: 1400, height: 900 });
    await page.goto(`/examples/compare.html?theme=${theme}`);
    await expect(page.locator(`[data-compare-theme="${theme}"]`)).toBeVisible();
}

test.describe('the compare page', () => {
    test('cyberpunk: the statement names the rewritten register, and the pair shows the touched sections only — 4.0.0 left, current right', async ({
        page,
    }) => {
        await open(page, 'cyberpunk');
        const lines = await page.locator('[data-compare-theme="cyberpunk"] [data-compare-lines] li').allTextContents();
        expect(lines.join(' ')).toMatch(/register is rewritten/);
        expect(lines.join(' ')).toMatch(/Two surfaces/);
        // Other themes' sections are hidden.
        expect(await page.locator('[data-compare-theme]:not([hidden])').count()).toBe(1);
        const pair = page.locator('[data-compare-theme="cyberpunk"] [data-compare-pair=""]');
        const old = pair.frameLocator('iframe[data-compare-side="old"]');
        const current = pair.frameLocator('iframe[data-compare-side="new"]');
        await expect(current.locator('[data-compare-cat="nav"]')).toBeVisible();
        await expect(old.locator('[data-compare-cat="nav"]')).toBeVisible();
        // Only the sections the differences touch: the palette section is
        // hidden unless a token changed value, and on cyberpunk it did.
        const visible = await current
            .locator('[data-compare-cat]:not([hidden])')
            .evaluateAll((els) => els.map((e) => e.getAttribute('data-compare-cat')));
        expect(visible).toEqual(expect.arrayContaining(['nav', 'buttons', 'fields', 'dossier', 'divider']));
        expect(visible, 'only the sections the differences touch').not.toContain('type-never');
        const identity = (frame) =>
            frame.locator('html').evaluate((html) => ({
                theme: html.getAttribute('data-theme'),
                heroSource: getComputedStyle(html).getPropertyValue('--surface-hero-bg').trim(),
            }));
        expect((await identity(old)).theme).toBe('cyberpunk');
        expect((await identity(current)).theme).toBe('cyberpunk');
        expect((await identity(old)).heroSource, 'the left declares a 5.0.0 token').toBe('');
        expect((await identity(current)).heroSource, 'the right is not the current build').not.toBe('');
    });

    // pastel, not light: light's warning ink moved one step at C1, so its
    // palette section shows too — the measurement, not the test, decides.
    test('pastel: the statement is about typography, and the pair shows the type section alone', async ({ page }) => {
        await open(page, 'pastel');
        const lines = await page.locator('[data-compare-theme="pastel"] [data-compare-lines] li').allTextContents();
        expect(lines.join(' ')).toMatch(/Typography: Instrument Sans/);
        expect(lines.join(' ')).toMatch(/nothing visible changed/);
        const current = page.locator('[data-compare-theme="pastel"] [data-compare-pair=""]').frameLocator('iframe[data-compare-side="new"]');
        const visible = await current
            .locator('[data-compare-cat]:not([hidden])')
            .evaluateAll((els) => els.map((e) => e.getAttribute('data-compare-cat')));
        expect(visible, 'only the sections the differences touch').toEqual(['type']);
        // And the face really differs: Instrument Sans loads on the right, not on the left.
        const loaded = (frame) =>
            frame.locator('html').evaluate(async () => {
                await document.fonts.ready;
                return [...document.fonts].some((f) => f.status === 'loaded' && f.family.replace(/^["']|["']$/g, '') === 'Instrument Sans');
            });
        await expect.poll(() => loaded(current)).toBe(true);
        const old = page.locator('[data-compare-theme="pastel"] [data-compare-pair=""]').frameLocator('iframe[data-compare-side="old"]');
        expect(await loaded(old)).toBe(false);
    });

    test('dark: the R6-Q2 proposal pair paints the texture lower on the right', async ({ page }) => {
        await open(page, 'dark');
        const lines = await page.locator('[data-compare-theme="dark"] [data-compare-lines] li').allTextContents();
        expect(lines.join(' ')).toMatch(/proposal for R6-Q2/);
        const pair = page.locator('[data-compare-theme="dark"] [data-compare-pair="texture"]');
        const opacity = (side) =>
            pair
                .frameLocator(`iframe[data-compare-side="${side}"]`)
                .locator('html')
                .evaluate((html) => parseFloat(getComputedStyle(html).getPropertyValue('--fx-texture-opacity')));
        await expect.poll(() => opacity('old')).toBeGreaterThan(0.4);
        await expect.poll(() => opacity('new')).toBeLessThan(0.1);
    });

    test('the frames of a pair scroll together', async ({ page }) => {
        await open(page, 'cyberpunk');
        const pair = page.locator('[data-compare-theme="cyberpunk"] [data-compare-pair=""]');
        const left = pair.locator('iframe[data-compare-side="old"]');
        await expect(pair.frameLocator('iframe[data-compare-side="new"]').locator('[data-compare-cat="nav"]')).toBeVisible();
        await left.evaluate((frame) => frame.contentWindow.scrollTo(0, 300));
        await expect
            .poll(() => pair.locator('iframe[data-compare-side="new"]').evaluate((frame) => frame.contentWindow.scrollY), { timeout: 3000 })
            .toBeGreaterThan(200);
    });

    test('every theme is linked, and the chosen one is marked current', async ({ page }) => {
        await open(page, 'nostromo');
        expect(await page.locator('[data-theme-link]').count()).toBe(24);
        await expect(page.locator('[data-theme-link="nostromo"]')).toHaveAttribute('aria-current', 'page');
    });
});
