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
    });
}

// Kenny, after the third look at the showcase: "Kunnen we niet testen dat
// zulke kleuren die buiten ons thema vallen gedetecteerd worden?" Yes.
// Every painted colour on a fixture — backgrounds, text, borders, the
// accent colour of a control — is one of the theme's own token values
// (within rounding), transparent, or a translucent wash of one. The
// probe that produced this test found, on every theme: the browser's grey
// <hr>, the colour picker's grey range sliders, the picker's swatch (the
// chosen colour, legitimately foreign) and the "browser" specimen's
// native controls. The first two were fixed; the last two are the
// allowlist, each with its reason [KT8].
import { readFileSync } from 'node:fs';
import { hsl } from '../gates/colour.mjs';

const THEMES_CSS = readFileSync(new URL('../css/themes.css', import.meta.url), 'utf8');
/** @param {string} name @returns {number[][]} the theme's colours in 0–255 */
const paletteOf = (name) => {
    const start = THEMES_CSS.indexOf(`[data-theme='${name}']`);
    const block = THEMES_CSS.slice(start, THEMES_CSS.indexOf('\n}\n', start));
    const colours = [...block.matchAll(/hsl\([^)]*\)/g)].map((m) => hsl(m[0]).map((v) => Math.round(v * 255)));
    // Pure white and black are the print stylesheet's, allowed everywhere.
    return [...colours, [255, 255, 255], [0, 0, 0]];
};
const ALLOWED = [
    { selector: '.kp-colorpicker__swatch', why: 'the swatch shows the colour a person chose' },
    { selector: '[data-specimen="browser"] input', why: 'the specimen shows what the browser draws on its own' },
];

for (const theme of THEMES) {
    test(`${theme.name} paints no colour that is not its own [KT8]`, async ({ page }) => {
        await page.goto(`/showcase/themes/${theme.name}.html`);
        // Let every finite animation and transition finish first: a theme
        // whose register settles a colour on load (sepia's mark) is
        // MID-TRANSITION for a moment, and a sample taken then reads a
        // blend of two of the theme's own colours as a foreign one —
        // measured at rgb(63, 41, 22) between the accent's ink and the
        // page's, 2026-09-08, which is neither token and is nobody's fault.
        await page.evaluate(() =>
            Promise.all(
                document
                    .getAnimations()
                    .filter((a) => a.effect?.getTiming().iterations !== Infinity)
                    .map((a) => a.finished.catch(() => {})),
            ),
        );
        const palette = paletteOf(theme.name);
        const near = (c) => palette.some((p) => Math.abs(p[0] - c[0]) <= 3 && Math.abs(p[1] - c[1]) <= 3 && Math.abs(p[2] - c[2]) <= 3);
        const painted = await page.evaluate(
            (allowed) => {
                const out = [];
                const seen = new Set();
                for (const el of document.querySelectorAll('body *')) {
                    if (allowed.some((a) => el.matches(a))) continue;
                    const box = el.getBoundingClientRect();
                    if (box.width === 0 || box.height === 0) continue;
                    const s = getComputedStyle(el);
                    for (const prop of ['backgroundColor', 'color', 'borderTopColor', 'accentColor']) {
                        const value = s[prop];
                        if (!value || value === 'rgba(0, 0, 0, 0)' || value === 'auto') continue;
                        if (prop === 'borderTopColor' && s.borderTopWidth === '0px') continue;
                        const key = `${prop} ${value}`;
                        if (seen.has(key)) continue;
                        seen.add(key);
                        const where = `${el.tagName.toLowerCase()}${typeof el.className === 'string' && el.className ? '.' + el.className.split(' ')[0] : ''} in #${el.closest('.sc-specimen')?.id ?? 'page'}`;
                        out.push({ prop, value, where });
                    }
                }
                return out;
            },
            ALLOWED.map((a) => a.selector),
        );
        const foreign = [];
        for (const { prop, value, where } of painted) {
            const m = /rgba?\((\d+), (\d+), (\d+)(?:, ([\d.]+))?\)/.exec(value);
            if (!m) {
                // color(srgb …) is how Chromium reports hsl(from …): a wash, by construction.
                if (!/^color\(srgb /.test(value)) foreign.push(`${prop} ${value} on ${where}`);
                continue;
            }
            if (m[4] !== undefined && Number(m[4]) < 1) continue;
            if (!near([Number(m[1]), Number(m[2]), Number(m[3])])) foreign.push(`${prop} ${value} on ${where}`);
        }
        // Drill: remove the `hr` rule from css/_rules.css and every theme
        // reports "color rgb(128, 128, 128) on hr in #<theme>-typography".
        expect(foreign).toEqual([]);
    });
}
