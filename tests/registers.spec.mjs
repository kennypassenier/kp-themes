import { readdirSync } from 'node:fs';
import { test, expect } from '@playwright/test';
import { measured } from './paint.mjs';
import { contrast } from '../gates/colour.mjs';
import { sweepThemes } from './helpers/sweep-themes.mjs';
import { paintedGroundOf, reportContrast } from './helpers/contrast-guideline.mjs';

/** @param {string} rgb */
const parse = (rgb) => {
    // A relative colour (`hsl(from …)`) computes to `color(srgb r g b [/ a])`.
    const srgb = /color\(srgb ([\d.]+) ([\d.]+) ([\d.]+)(?: \/ ([\d.]+))?/.exec(rgb);
    const m = srgb
        ? [srgb[0], ...srgb.slice(1, 4).map((v) => String(Math.round(Number(v) * 255))), srgb[4]]
        : /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?/.exec(rgb);
    if (!m) throw new Error(`not a colour: ${rgb}`);
    // A transparent border is no boundary at all; the first drill of this
    // test read rgba(0, 0, 0, 0) as black and passed, which is the
    // opposite of what it measures.
    if (m[4] !== undefined && Number(m[4]) < 1) throw new Error(`a see-through boundary: ${rgb}`);
    return [Number(m[1]), Number(m[2]), Number(m[3])];
};

// fix-12 — pressing a button changes what it paints, in every theme.
//
// `@layer kp.base, kp.components, kp.register, …` means a layer beats a
// state: a register's `.kp-button:hover { background: … }` outranks the
// components layer's `.kp-button:active`, and the button then stops
// reacting to being held down — while the pointer is on it, which is the
// only time anyone presses it. Kenny found it on Shade (dark), 2026-09-11:
// "als ik gewoon blijf klikken op de knop zelf, dan gebeurt er precies
// niks... bij shade light werkt het wel precies".
//
// `gates/check-pressed-state.mjs` holds the shape. This reads the paint,
// which is the half a source gate cannot see [KT13].
//
// Drilled 2026-09-12 in firefox: the restored
// `[data-theme='terminal'] .kp-button--primary:active` rule removed →
// red on terminal. Restored green.
const THEMES = readdirSync(new URL('../showcase/themes/', import.meta.url))
    .filter((n) => n.endsWith('.html'))
    .map((n) => n.slice(0, -'.html'.length));

/** The themes a sweep in this file runs on at this level [scope-103]. */
const SWEEP = sweepThemes().filter((n) => THEMES.includes(n));

// Phase 7 widened this from one selector to the three the gate names.
// gates/check-pressed-state.mjs guards `.kp-button`, `.kp-button--primary`
// and `.kp-button--destructive`; this read only the primary — while the
// fault Kenny reported was the plain one: "als ik gewoon blijf klikken op
// de knop zelf, dan gebeurt er precies niks". The gate is presence-only
// (an `:active` rule that paints nothing satisfies it), so the paint half
// was the only thing that could see a button that does not react, and it
// was not looking at the button he meant.
const PRESSED = ['.kp-button--primary', '.kp-button', '.kp-button--destructive'];

/**
 * Everything a press is allowed to change, in one vector (runs in the page).
 *
 * Reading only `background-color` called retro red on 2026-09-12: that theme
 * presses by inverting its bevel and shifting its padding, which is a reaction
 * the narrower question could not see. `transform` and `translate` are different
 * properties and a theme may press with either; a press may also land on a
 * pseudo-element or on the label rather than on the control (nostromo lights a
 * lamp, grotesk thickens the baseline). Reading only `translate` on the element
 * called five themes red in Phase 7 that press perfectly well: the absence of a
 * value read as the value, a fourth time in this round.
 *
 * Since the character rounds a press is also drawn in an image layer of the
 * control (cyberpunk's scan lines, solstice's swell), in the clip of a
 * pseudo-element (blueprint's draught line) and in the style of the outline
 * (forest's blaze closes from dashed to solid): the vector reads all three.
 *
 * @param {Element} el
 */
function readPaint(el) {
    const s = getComputedStyle(el);
    const side = (/** @type {string} */ pseudo) => {
        const q = getComputedStyle(el, pseudo);
        return [q.opacity, q.backgroundColor, q.backgroundImage, q.transform, q.clipPath, q.borderColor, q.boxShadow].join(' ');
    };
    const label = el.querySelector('.kp-button__label');
    return [
        s.backgroundColor,
        s.backgroundImage,
        s.boxShadow,
        s.translate,
        s.transform,
        s.paddingBlockStart,
        s.paddingInlineStart,
        s.borderColor,
        s.color,
        s.outline,
        side('::before'),
        side('::after'),
        label === null ? '' : getComputedStyle(label).getPropertyValue('--kp-baseline-weight'),
    ].join(' | ');
}

for (const theme of THEMES) {
    for (const selector of PRESSED) {
        test(
            `${selector} reacts to being pressed under ${theme} [fix-12]`,
            { tag: ['@sweep', `@theme:${theme}`, '@component:button', '@component:showcase'] },
            async ({ page }) => {
                await page.goto(`/showcase/themes/${theme}.html`);
                // The plain selector matches the variants too, so take one that
                // carries no variant class — that is the control Kenny pressed.
                const button =
                    selector === '.kp-button' ? page.locator('.kp-button:not([class*="kp-button--"])').first() : page.locator(selector).first();
                if ((await button.count()) === 0) test.skip(true, `${theme}'s showcase page carries no ${selector}`);
                await button.scrollIntoViewIfNeeded();
                const paint = () => button.evaluate(readPaint);
                await button.hover();
                // Let the hover settle before taking the baseline: read too early and
                // the baseline is the RESTING paint, which the press then differs
                // from for the wrong reason [fix-1].
                await page.waitForTimeout(260);
                const hovered = await paint();
                await page.mouse.down();
                try {
                    await measured(button, readPaint, undefined, `${theme}: held down, the button paints exactly as it did hovered`).not.toBe(
                        hovered,
                    );
                } finally {
                    await page.mouse.up();
                }
            },
        );
    }
}

// gap-1 — the destructive alert's ink sits on the plate it was drawn for.
//
// The components layer defines a coloured variant as a pair: the plate and
// the ink meant for it. A register painting `.kp-alert` — the base class,
// every variant included — replaces the plate from a later layer and leaves
// the ink pointing at nothing. Kenny saw it in chassis-rs on 2026-09-10:
// "wit op wit". Measured in firefox on 2026-09-12, before the repair,
// seventeen of the twenty-two themes were unreadable and grotesk was
// exactly 1.00.
//
// `gates/check-variant-ground.mjs` holds the shape. This reads the paint,
// which is the half a source gate cannot see [KT13].
//
// Drilled 2026-09-12 in firefox: the `:not([class*='kp-alert--'])` removed
// from css/grotesk-register.css and the bundle regenerated → red on
// grotesk alone, at 1.00. Restored green.
//
// The level decides how many themes this measures [scope-103]; all 22 at
// the release level. The fix-12 loop above stays whole on purpose — its
// fault WAS one theme's.
for (const theme of SWEEP) {
    test(
        `the destructive alert can be read under ${theme} [gap-1]`,
        { tag: ['@sweep', `@theme:${theme}`, '@component:feedback', '@component:showcase'] },
        async ({ page }) => {
            await page.goto(`/showcase/themes/${theme}.html`);
            const alert = page.locator('.kp-alert--destructive').first();
            await alert.scrollIntoViewIfNeeded();
            // The ground the words actually stand on is read from the painted pixels: the alert's own
            // background-color can be transparent over a plate a layer draws elsewhere (pastel).
            const ink = await alert.evaluate((el) => getComputedStyle(el).color);
            const ground = await paintedGroundOf(page, alert);
            // gates/colour.mjs reads channels as 0..1; parse() and the pixels give 0..255.
            const unit = (/** @type {number[]} */ c) => /** @type {[number, number, number]} */ (c.map((v) => v / 255));
            const ratio = contrast(unit(parse(ink)), unit(ground));
            // Contrast is a guideline, not a gate (Kenny, form v44; fix-104).
            if (ratio < 4.5)
                reportContrast(test.info(), `${theme} destructive alert, ${ink} on painted rgb(${ground.join(', ')}): ${ratio.toFixed(2)}:1`);
        },
    );
}

// CP1 — the arrival answers a click anywhere, not only on Skip.
//
// One theme builds one now: synthwave (`boot`; phantom's `card` and
// terminal's boot screen went with those themes on 2026-10-16). The overlay is `position: fixed; inset: 0`, so until 6.0.0 it
// ate every click for up to 1100ms and only the Skip button ended it — a
// click elsewhere did nothing and gave no sign it had been lost.
// JobTracker reported that as "the theme picker does not work on phantom";
// the picker was fine. Kenny, 2026-09-09: remember it for the next
// version. This is that version.
//
// Drilled 2026-09-12 in firefox: the overlay's own listener removed from
// js/effects.js → red on all four, because the click lands and the
// overlay stays. Restored green.
for (const theme of ['synthwave']) {
    test(
        `the arrival lets go of a click anywhere under ${theme} [CP1]`,
        { tag: ['@sweep', `@theme:${theme}`, '@component:page-effects', '@component:showcase'] },
        async ({ page }) => {
            await page.emulateMedia({ reducedMotion: 'no-preference' });
            // The showcase page, which exists for every theme — synthwave has no
            // concept page, and pointing at one that 404s made this test measure
            // an empty document and call it a pass for three of four.
            await page.goto(`/showcase/themes/${theme}.html`);
            const overlay = page.locator('.kp-boot');
            await expect(overlay).toHaveCount(1);

            // What is measured is that the CLICK arrives, not that the overlay
            // eventually goes: every arrival ends on its own inside a second, so
            // waiting for it to vanish passed with the listener removed. `end()`
            // marks the overlay on the spot, and that mark is the click landing.
            const marked = await overlay.evaluate((el) => {
                const wasOff = el.classList.contains('is-off');
                // Anywhere that is not Skip: the overlay's own top-left corner.
                el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                return { wasOff, isOff: el.classList.contains('is-off') };
            });
            expect(marked.wasOff, 'the arrival is still running when the click lands').toBe(false);
            expect(marked.isOff, 'and a click that is not on Skip ends it').toBe(true);
        },
    );
}

// gap-2 — the theme picker sits in the same place in every theme.
//
// Kenny, 2026-09-10: it moves along the top bar from theme to theme.
// Measured 2026-09-12 in firefox at 1280px: 98px of vertical drift, from
// 359 under titanium to 457 under terminal — nearly three times the
// height of the control itself. A control reached by muscle memory should
// not depend on which theme is showing.
//
// The cause was never the picker. The showcase's own header wraps in
// whatever face and scale the document's theme sets, and everything below
// it moved with it. Its prose is the page speaking rather than a specimen,
// so it now carries the page's own measure and scale; the colours and the
// title keep the theme, which is what makes switching visible.
//
// Drilled 2026-09-12: `block-size: 4rem` removed from `.sc-header h1` →
// the spread goes back to 18px and this test is red.
test(
    'the theme picker rests in the same place in every theme [gap-2]',
    { tag: ['@sweep', '@component:picker', '@component:showcase'] },
    async ({ page }) => {
        await page.setViewportSize({ width: 1280, height: 900 });
        /** @type {Array<[string, number, number]>} */
        const seen = [];
        for (const theme of THEMES) {
            await page.addInitScript((name) => {
                try {
                    localStorage.setItem('theme', name);
                } catch {
                    // no storage: the page keeps its served theme, and the
                    // assertion below reports it as an outlier rather than
                    // passing quietly
                }
            }, theme);
            await page.goto('/showcase/index.html');
            await page.waitForFunction((name) => document.documentElement.getAttribute('data-theme') === name, theme);
            const box = await page.locator('.kp-theme-menu').first().boundingBox();
            expect(box, `${theme}: the picker is on the page`).not.toBeNull();
            seen.push([theme, Math.round(box.y), Math.round(box.x)]);
        }
        // No theme is inset on purpose any more: terminal, which reserved the
        // width of its CRT bezel (18px), was removed on 2026-10-16. A theme
        // that frames the page again names its inset here with its measurement.
        /** @type {Record<string, number>} */
        const FRAMED = {};
        const INSET_REASON = 'it reserves the width of its own frame';

        const straight = seen.filter(([name]) => !(name in FRAMED));
        const ys = straight.map(([, y]) => y);
        const xs = straight.map(([, , x]) => x);
        const drift = Math.max(...ys) - Math.min(...ys);
        // Five pixels: retro's own type metrics put it four out, and a control
        // four pixels from where it was is a control you still hit.
        expect(drift, `vertical drift across ${straight.length} themes: ${JSON.stringify(straight)}`).toBeLessThanOrEqual(5);
        expect(Math.max(...xs) - Math.min(...xs), 'and sideways').toBeLessThanOrEqual(5);

        // And the framed one is inset by what it frames, no more and no less.
        const floor = Math.min(...ys);
        for (const [name, inset] of Object.entries(FRAMED)) {
            const row = seen.find(([theme]) => theme === name);
            expect(row, `${name} is in the sweep`).toBeTruthy();
            expect(row[1] - floor, `${name}: ${INSET_REASON}, so it should sit ${inset}px lower than the unframed themes`).toBeGreaterThanOrEqual(
                inset - 3,
            );
            expect(row[1] - floor, `${name} is inset by more than the frame it draws — something else moved it`).toBeLessThanOrEqual(inset + 3);
        }
    },
);
