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
import { sweepThemes } from './helpers/sweep-themes.mjs';

const PAGE = '/examples/concept.html?theme=cyberpunk';

test.describe('the shipped fonts', { tag: ['@component:fonts', '@component:examples'] }, () => {
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

// Every control takes the theme's own font [fix-28, scope-103].
//
// The three tests above all ask whether a FACE arrives: the woff2 is
// served, the family loads, the page holds when no file arrives at all.
// None of them asks which family a CONTROL resolves — and that is where
// fix-28 was. A browser's own stylesheet gives button, input, select and
// textarea the system font rather than the page's, so a control the
// package leaves unset shows the desktop's font: Kenny's FireDragon moved
// 39 of his 158 verdict hashes on 2026-09-14 for exactly that reason, and
// Playwright's Firefox reads the generic `sans-serif` in the same place.
//
// tests/control-font.spec.mjs finds that on the review pages, block by
// block, in two themes. This asks the plain question on one fixture
// carrying all four kinds, in the sweep themes: under a forced desktop
// default declared as the lowest author layer, does any control the
// package draws still show that desktop family?
//
// It asked a stricter question until 2026-09-17 — does every control
// resolve the family the BODY resolves — and the release run of 6.1.0
// found that question wrong [fix-51]: terminal, nostromo and phantom give
// `.kp-button` the theme's mono or display face in their own registers,
// which is the look Kenny approved in the catalogue, not a control the
// package forgot. Equality with the body called those three red. The
// desktop family is the fault; a second family of the theme's own is not.
//
// Drilled 2026-09-16 in firefox: `.kp-icon-button` removed from the
// `font-family: inherit` list in css/components.css (the very list fix-28
// added) → red in all three themes, each printing
// `button.kp-icon-button → "DejaVu Serif"`. Restored green. The drill was
// repeated on the narrowed question on 2026-09-17, same removal, same
// three reds — what it guards did not move with the wording.

/** The family forced underneath, as tests/control-font.spec.mjs forces it. */
const DESKTOP = 'DejaVu Serif';

/** The four kinds a browser stylesheet hands the system font to. */
const KINDS = 'button, input, select, textarea';

/** The package's own controls; #unclaimed holds the bare ones it does not style. */
const CONTROLS = `section:not(#unclaimed) :is(${KINDS})`;

/** The same four kinds wearing no package class: the proof the forced layer lands. */
const UNCLAIMED = `#unclaimed :is(${KINDS})`;

for (const theme of sweepThemes()) {
    test(
        `every control resolves the theme's own font under ${theme} [fix-28]`,
        { tag: ['@sweep', '@component:fonts', '@component:field', '@component:button', `@theme:${theme}`] },
        async ({ page }) => {
            await page.goto('/tests/fixtures/control-fonts.html');
            const reading = await page.evaluate(
                async ([name, family, kinds, controls, unclaimed]) => {
                    document.documentElement.setAttribute('data-theme', name);
                    // The lowest author layer there is: declared before the
                    // package's own `@layer kp.base, …` statement it loses to
                    // every package rule and beats nothing but the browser's
                    // stylesheet, which is where a desktop font lives.
                    const style = document.createElement('style');
                    style.textContent = `@layer kp-desktop-default { ${kinds} { font-family: "${family}"; } }`;
                    document.head.prepend(style);
                    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
                    const body = getComputedStyle(document.body).fontFamily;
                    const named = (/** @type {Element} */ el) =>
                        `${el.localName}${el instanceof HTMLInputElement ? `[type=${el.type}]` : ''}${el.className ? `.${[...el.classList].join('.')}` : ''}`;
                    const found = [...document.querySelectorAll(controls)];
                    return {
                        body,
                        kinds: [...new Set(found.map((el) => el.localName))].sort(),
                        // The fault is the DESKTOP's font reaching a control,
                        // not a family that differs from the body's: three
                        // registers give .kp-button the theme's display or
                        // mono face on purpose, and Kenny approved all three
                        // in the catalogue.
                        wrong: found
                            .filter((el) => getComputedStyle(el).fontFamily.includes(family))
                            .map((el) => `${named(el)} → ${getComputedStyle(el).fontFamily}`),
                        forced: [...document.querySelectorAll(unclaimed)].filter((el) => getComputedStyle(el).fontFamily.includes(family)).length,
                    };
                },
                [theme, DESKTOP, KINDS, CONTROLS, UNCLAIMED],
            );
            // Without this the test would pass just as well with the forced
            // layer never applied, which is no measurement at all.
            expect(reading.forced, 'the forced desktop layer must reach the bare controls').toBe(4);
            expect(reading.kinds, 'the fixture carries the package’s own controls of all four kinds').toEqual([
                'button',
                'input',
                'select',
                'textarea',
            ]);
            expect(reading.body, `the body must resolve ${theme}'s own font, not the desktop's`).not.toContain(DESKTOP);
            expect(reading.wrong, `these controls take the desktop's font under ${theme}`).toEqual([]);
        },
    );
}
