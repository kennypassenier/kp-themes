// The minified build paints what the authored one paints [2026-09-08].
//
// Minifying is only safe if it changes nothing a browser can see. This
// suite proves it the way KT13 asks: by reading the paint. It loads the
// concept page twice under the same theme — once with the authored
// stylesheets, once with dist/css/*.min.css — and compares what the
// browser computes for a sample of elements across both surfaces.
//
// Drill [KT3], performed 2026-09-08 in chromium and restored: with
// `dist/css/cyberpunk-register.min.css` replaced by an empty file, the
// minified page loses the register's paint and the test goes red on the
// hero's own colours.

import { expect, test } from '@playwright/test';

const SAMPLE = [
    '[data-kp-surface="hero"]',
    '[data-kp-surface="hero"] h1',
    '[data-kp-surface="app"]',
    '.kp-button--primary',
    '.kp-card',
    '.kp-nav',
    '.kp-marquee',
];

const PROPS = ['color', 'backgroundColor', 'fontFamily', 'fontSize', 'borderColor', 'borderRadius', 'boxShadow', 'letterSpacing'];

/** @param {import('@playwright/test').Page} page */
const paint = (page) =>
    page.evaluate(
        ([selectors, props]) =>
            selectors.map((selector) => {
                const el = document.querySelector(selector);
                if (!el) return `${selector}: absent`;
                const style = getComputedStyle(el);
                return `${selector}: ${props.map((p) => `${p}=${style[p]}`).join(' ')}`;
            }),
        [SAMPLE, PROPS],
    );

for (const theme of ['cyberpunk', 'formal', 'ticker']) {
    test(`the minified stylesheets paint what the authored ones paint, ${theme}`, async ({ page }) => {
        await page.emulateMedia({ reducedMotion: 'reduce' });
        // concept.html carries the theme in its query; the per-theme
        // pages differ only in their copy, and cyberpunk has no page of
        // its own because it is the copy every other page varies from.
        await page.goto(`/examples/concept.html?theme=${theme}`);
        await expect(page.locator('[data-kp-surface="app"]').first()).toBeVisible();
        const authored = await paint(page);

        // The same page, with every authored stylesheet swapped for its
        // minified twin. The swap is done in the page rather than by a
        // second fixture, so the markup is provably identical.
        await page.evaluate(() => {
            for (const link of document.querySelectorAll('link[rel="stylesheet"]')) {
                const href = link.getAttribute('href') ?? '';
                const file = href.split('/').pop() ?? '';
                if (!href.includes('/css/') || !file.endsWith('.css')) continue;
                link.setAttribute('href', `/dist/css/${file.replace(/\.css$/, '.min.css')}`);
            }
        });
        await page.waitForFunction(() => [...document.styleSheets].every((s) => !s.href || s.href.includes('.min.css') || s.cssRules.length > 0));
        await page.waitForTimeout(300);
        const minified = await paint(page);

        expect(minified).toEqual(authored);
    });
}
