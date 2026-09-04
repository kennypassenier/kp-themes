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
    });
}
