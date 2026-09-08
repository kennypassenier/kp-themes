// The bundle behaves like the loose files [TH106].
//
// Two fixtures with byte-identical markup: one loads the six stylesheets
// and js/auto.js, the other loads dist/kp-themes.css and
// dist/kp-themes.js. Anything that measures differently between them is
// the bundle's fault.
//
// Drilled per KT3: the removed rule is named above each test.

import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';

const LOOSE = '/tests/fixtures/bundle-loose.html';
const BUNDLED = '/tests/fixtures/bundle-bundled.html';

/** @type {string[]} */
const THEMES = JSON.parse(readFileSync(new URL('../themes/order.json', import.meta.url), 'utf8'));

/**
 * Everything worth comparing, for every element the fixture marks.
 *
 * The fonts are awaited and the animations are settled first. Each theme
 * has a gesture of its own -- a badge that settles, a card whose edge
 * glows once -- and a texture that drifts for 40 seconds, so a snapshot
 * taken mid-gesture reads a transient box shadow. Without this the
 * comparison failed on a different theme each run: forest and grotesk in
 * Firefox, lapis in Chromium. Awaiting them instead of settling them
 * made the test time out at 30 seconds on the 40-second drift.
 */
const snapshot = async (page) => {
    await page.evaluate(async () => {
        await document.fonts.ready;
        // A finite animation is jumped to its end, an endless one is
        // cancelled. Both pages then sit in the same state, which is what
        // a comparison needs.
        for (const animation of document.getAnimations()) {
            try {
                if (animation.effect?.getTiming().iterations === Infinity) animation.cancel();
                else animation.finish();
            } catch {
                animation.cancel();
            }
        }
    });
    return page.evaluate(() =>
        [...document.querySelectorAll('[data-test]')].map((el) => {
            const s = getComputedStyle(el);
            const r = el.getBoundingClientRect();
            return {
                name: el.dataset.test,
                box: [r.width, r.height].map((n) => n.toFixed(2)).join('x'),
                // The registers work through shadows, borders and background
                // images rather than through the text colour, so a
                // comparison of colour alone stayed green with a register
                // dropped from the bundle and measured nothing [KT3].
                paint: [
                    s.color,
                    s.backgroundColor,
                    s.backgroundImage,
                    s.borderColor,
                    s.borderWidth,
                    s.borderRadius,
                    s.boxShadow,
                    s.textShadow,
                    s.letterSpacing,
                ].join(' | '),
                type: [s.fontFamily, s.fontSize, s.fontWeight, s.textTransform, s.textAlign].join(' | '),
                space: [s.padding, s.margin, s.gap, s.minHeight].join(' | '),
            };
        }),
    );
};

test.describe('the dist bundle', () => {
    test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: 1280, height: 900 });
    });

    // Drill: drop css/utilities.css from STYLESHEETS in
    // gates/generate-bundle.mjs, regenerate, and the badge's weight,
    // transform and the button's padding all differ.
    test('every measured element is identical in both setups [TH106]', async ({ page }) => {
        await page.goto(LOOSE);
        const loose = await snapshot(page);
        await page.goto(BUNDLED);
        const bundled = await snapshot(page);
        expect(bundled).toEqual(loose);
        // The comparison is only worth anything if it looked at something.
        expect(loose.length).toBeGreaterThanOrEqual(10);
    });

    // Drill: drop css/retro-register.css or css/cyberpunk-register.css
    // from STYLESHEETS, regenerate, and the theme that uses it differs.
    // A register works through shadows, borders and background images
    // rather than through the text colour, so the first version of the
    // snapshot -- colour, background colour and border colour -- stayed
    // green under that drill and measured nothing [KT3].
    test('every theme paints the same in both setups [TH106]', async ({ page }) => {
        // Each fixture is loaded once and walked through all 24 themes.
        // Reloading per theme meant 48 page loads, each waiting out its
        // theme's signature animation, and the test ran past 30 seconds.
        const walk = async (fixture) => {
            await page.goto(fixture);
            /** @type {Record<string, string>} */
            const seen = {};
            for (const theme of THEMES) {
                await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);
                seen[theme] = JSON.stringify(await snapshot(page));
            }
            return seen;
        };
        const loose = await walk(LOOSE);
        const bundled = await walk(BUNDLED);
        const differ = THEMES.filter((t) => loose[t] !== bundled[t]);
        expect(differ, `the bundle differs from the loose files in: ${differ.join(', ')}`).toEqual([]);
    });

    // Drill: point the bundle's entry at a module with no side effect
    // instead of js/auto.js, regenerate, and the click changes nothing.
    test('the bundled module attaches the same behaviour [TH106]', async ({ page }) => {
        for (const fixture of [LOOSE, BUNDLED]) {
            await page.goto(fixture);
            // The picker stores the choice, so the second pass would start
            // where the first one left off and prove nothing.
            await page.evaluate(() => localStorage.clear());
            await page.reload();
            expect(await page.evaluate(() => document.documentElement.dataset.theme)).toBe('formal');
            await page.locator('[data-test="pick-dark"]').click();
            expect(await page.evaluate(() => document.documentElement.dataset.theme), `the picker did not attach in ${fixture}`).toBe('dark');
        }
    });
});
