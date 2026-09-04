// The three checks that need a document of their own [L5, AR14, DI6, DI11].
//
// A colour scheme, a scrollbar and a viewport exist once per page, so none
// of these can be measured on the showcase, where seven themes sit in one
// document. The generator writes a bare page per theme for exactly this,
// and these are the tests that open them. Without this file those fixtures
// would be scaffolding for a check nobody wrote.

import { test, expect } from '@playwright/test';
import { THEMES } from '../js/theme-registry.js';

/** SC 1.4.12 Text Spacing (AA). The four values are the success criterion's own. */
const TEXT_SPACING = `* {
    line-height: 1.5 !important;
    letter-spacing: 0.12em !important;
    word-spacing: 0.16em !important;
}
p { margin-bottom: 2em !important; }`;

/** SC 1.4.10 Reflow (AA): usable at 320 CSS px without scrolling in two directions. */
const NARROW = { width: 320, height: 800 };

for (const theme of THEMES) {
    test.describe(`${theme.name} fixture`, () => {
        const url = `/showcase/themes/${theme.name}.html`;

        test('declares its colour scheme, and declares the right one [DI6]', async ({ page }) => {
            await page.goto(url);
            // Not "is the token present" — that is check-invariants' job on
            // the token source. This is whether the browser received it,
            // which is what decides the scrollbar, the autofill highlight
            // and the internals of a <select>.
            const scheme = await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme);
            expect(scheme).toBe(theme.dark ? 'dark' : 'light');
        });

        test('reflows at 320 px without sideways scrolling [DI11]', async ({ page }) => {
            await page.setViewportSize(NARROW);
            await page.goto(url);
            const overflow = await page.evaluate(() => ({
                scroll: document.documentElement.scrollWidth,
                client: document.documentElement.clientWidth,
            }));
            // One pixel of slack for sub-pixel rounding; anything more is a
            // reader dragging the page sideways to finish a sentence.
            expect(overflow.scroll, 'the document scrolls horizontally at 320 px').toBeLessThanOrEqual(overflow.client + 1);
        });

        test('survives forced text spacing without clipping [DI11]', async ({ page }) => {
            await page.goto(url);
            await page.addStyleTag({ content: TEXT_SPACING });

            // The failure this is written against: a badge with a fixed
            // height whose label becomes "Interv" when a reading aid raises
            // the line height. Clipping is content taller than the box that
            // holds it, with overflow hidden — so both halves are checked.
            const clipped = await page.evaluate(() =>
                [...document.querySelectorAll('.sc-chip, .sc-badge, .sc-button, [data-kp-theme]')]
                    .filter((el) => {
                        const style = getComputedStyle(el);
                        const hidden = style.overflow !== 'visible' || style.overflowY !== 'visible';
                        return hidden && (el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1);
                    })
                    .map((el) => `${el.className || el.tagName}: ${el.textContent.trim().slice(0, 20)}`),
            );
            expect(clipped, 'these clip their own content under forced text spacing').toEqual([]);
        });

        test('links are the theme’s colour and clear AA on the page [TH31]', async ({ page }) => {
            await page.goto(url);

            // Measured in the browser, on the colour the page actually
            // paints — not on the token. The browser's own link blue
            // scores 1.99, 2.09 and 2.06 against the three dark themes,
            // and a theme that leaves links alone ships those numbers.
            const ratio = await page.evaluate(() => {
                const parse = (css) =>
                    css
                        .match(/[\d.]+/g)
                        .slice(0, 3)
                        .map(Number);
                const lum = ([r, g, b]) =>
                    [r, g, b]
                        .map((u) => u / 255)
                        .map((u) => (u <= 0.03928 ? u / 12.92 : ((u + 0.055) / 1.055) ** 2.4))
                        .reduce((acc, u, i) => acc + [0.2126, 0.7152, 0.0722][i] * u, 0);
                const link = document.querySelector('[data-specimen="links"] a');
                const [a, b] = [lum(parse(getComputedStyle(link).color)), lum(parse(getComputedStyle(document.body).backgroundColor))].sort(
                    (x, y) => y - x,
                );
                return (a + 0.05) / (b + 0.05);
            });
            expect(ratio).toBeGreaterThanOrEqual(4.5);
        });

        test('a link is not colour alone [DI4]', async ({ page }) => {
            await page.goto(url);
            const decoration = await page.evaluate(() => getComputedStyle(document.querySelector('[data-specimen="links"] a')).textDecorationLine);
            expect(decoration).toContain('underline');
        });

        test('the theme applies its own typefaces [TH12]', async ({ page }) => {
            await page.goto(url);
            // Declared since the extraction, applied by exactly one rule
            // until the first field test served a vendored copy and got
            // the browser's default serif back. Both faces are read now,
            // and the fallback is a sane stack rather than whatever the
            // browser picked in 1996.
            const faces = await page.evaluate(() => {
                const root = getComputedStyle(document.documentElement);
                const first = (stack) =>
                    stack
                        .split(',')[0]
                        .trim()
                        .replace(/^["']|["']$/g, '');
                return {
                    body: first(getComputedStyle(document.body).fontFamily),
                    bodyToken: first(root.getPropertyValue('--theme-font-body')),
                    heading: first(getComputedStyle(document.querySelector('h2')).fontFamily),
                    headingToken: first(root.getPropertyValue('--theme-font-display') || root.getPropertyValue('--theme-font-body')),
                };
            });
            // Asserting the face the theme names, not the absence of a
            // serif: the first version of this test forbade /serif$/,
            // which matches the tail of "sans-serif" and so failed every
            // theme but terminal.
            expect(faces.bodyToken.length).toBeGreaterThan(0);
            expect(faces.body).toBe(faces.bodyToken);
            expect(faces.heading).toBe(faces.headingToken);
            expect(faces.body).not.toMatch(/^Times/i);
        });
    });
}
