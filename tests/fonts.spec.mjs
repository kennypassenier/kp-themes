// The shipped fonts on a page [T19, AR39, C4].
//
// Two questions. Does a theme's face actually arrive — the @font-face
// resolves, the file is served, the browser reports the family loaded —
// and does the page still hold when no font file arrives at all, which
// is what chassis-rs sees until it vendors fonts/ (T9) and what any
// consumer sees on a blocked network: the fallback stack after the
// family name is the promise the tokens make.
//
// Drills [KT3], performed 2026-09-07 in both browsers and restored:
//   - the Rajdhani faces removed from fonts/families.json and the
//     stylesheet regenerated → "Rajdhani never loaded", red. The first
//     version of the assertion asked document.fonts.check(), which stayed
//     green with no face at all — check() answers true when nothing
//     matches — and was replaced by reading the loaded FontFace list;
//   - the `font-display: swap` line removed → the blocked-network test
//     still passed (the text is painted with the fallback after the
//     3-second block period, and the assertion waits for it), so that
//     drill is recorded as green: it guards nothing here.

import { expect, test } from '@playwright/test';

const PAGE = '/examples/concept.html?theme=cyberpunk';

test.describe('the shipped fonts', () => {
    test('the theme faces arrive: every woff2 the page asks for is served and the families load [T19]', async ({ page }) => {
        const failed = [];
        page.on('response', (r) => {
            if (r.url().endsWith('.woff2') && r.status() !== 200) failed.push(`${r.status()} ${r.url()}`);
        });
        await page.setViewportSize({ width: 1280, height: 900 });
        await page.goto(PAGE);
        await page.waitForFunction(() => document.documentElement.getAttribute('data-theme') === 'cyberpunk');
        const loaded = await page.evaluate(async () => {
            await document.fonts.ready;
            // Force the faces the page uses to load, then ask.
            await Promise.all([document.fonts.load("900 1em 'Big Shoulders Display'"), document.fonts.load("400 1em 'Rajdhani'")]);
            // Not document.fonts.check(): it answers true when no face
            // matches at all (nothing needed loading), which is exactly the
            // fault the drill injects. The loaded FontFace list cannot lie.
            const loaded = [...document.fonts].filter((f) => f.status === 'loaded');
            const has = (family) => loaded.some((f) => f.family.replace(/^["']|["']$/g, '') === family);
            return {
                display: has('Big Shoulders Display'),
                body: has('Rajdhani'),
                faces: loaded.map((f) => `${f.family} ${f.weight} ${f.style}`),
            };
        });
        expect(failed, 'every requested font file is served').toEqual([]);
        expect(loaded.display, 'Big Shoulders Display never loaded').toBe(true);
        expect(loaded.body, 'Rajdhani never loaded').toBe(true);
        expect(loaded.faces.length).toBeGreaterThan(0);
    });

    test('without a single font file the page still reads and holds [T19, T9]', async ({ page }) => {
        await page.route('**/*.woff2', (route) => route.abort());
        await page.setViewportSize({ width: 1280, height: 900 });
        await page.goto(PAGE);
        await page.waitForFunction(() => document.documentElement.getAttribute('data-theme') === 'cyberpunk');
        const h1 = page.locator('[data-kp-reveal="headline"]').first();
        await expect(h1).toBeVisible();
        const state = await page.evaluate(async () => {
            await document.fonts.ready;
            const h1 = document.querySelector('[data-kp-reveal="headline"]');
            return {
                family: getComputedStyle(h1).fontFamily,
                textWidth: h1.getBoundingClientRect().width,
                scrollsSideways: document.documentElement.scrollWidth > document.documentElement.clientWidth,
                loaded: [...document.fonts].filter((f) => f.status === 'loaded').length,
            };
        });
        expect(state.loaded, 'no shipped face loaded').toBe(0);
        expect(state.family, 'the fallback stack is still the token').toContain('Big Shoulders Display');
        expect(state.textWidth).toBeGreaterThan(100);
        expect(state.scrollsSideways, 'the fallback face must not overflow the page').toBe(false);
    });
});
