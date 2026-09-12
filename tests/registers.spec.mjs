// A register decorates around the boundary, never instead of it [TH87].
//
// The retro register draws a two-tone bevel inside every control. The
// gates measure the token source and cannot see a stylesheet that
// repaints a border; this test reads the painted border and the painted
// ground of a control on the retro fixture and holds them at 3:1 (DI1),
// with the register loaded.

import { readdirSync } from 'node:fs';
import { test, expect } from '@playwright/test';
import { measured } from './paint.mjs';
import { contrast } from '../gates/colour.mjs';

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

for (const control of ['.kp-button', '.kp-field__input']) {
    test(`the retro register keeps DI1 on ${control} [TH87]`, async ({ page }) => {
        await page.goto('/showcase/themes/retro.html');
        await page.waitForSelector(control);
        const painted = await page.evaluate((selector) => {
            const el = document.querySelector(selector);
            const style = getComputedStyle(el);
            const ground = getComputedStyle(el.parentElement);
            return {
                border: style.borderTopColor,
                shadows: style.boxShadow,
                ground: ground.backgroundColor === 'rgba(0, 0, 0, 0)' ? getComputedStyle(document.body).backgroundColor : ground.backgroundColor,
            };
        }, control);
        // The register is on: a bevel is painted.
        expect(painted.shadows).toContain('inset');
        // And the boundary is still the gated one. Drill [KT3]: with
        // `border-color: transparent` added to the register's control
        // rule, the border reads rgba(0, 0, 0, 0) and parse() throws —
        // the first version of parse() read that as black and stayed
        // green, so the drill earned its keep on the test itself.
        const ratio = contrast(parse(painted.border), parse(painted.ground));
        expect(ratio, `${control} border ${painted.border} on ${painted.ground}`).toBeGreaterThanOrEqual(3);
    });
}

// fix-12 — pressing a button changes what it paints, in every theme.
//
// `@layer kp.base, kp.components, kp.register, …` means a layer beats a
// state: a register's `.kp-button:hover { background: … }` outranks the
// components layer's `.kp-button:active`, and the button then stops
// reacting to being held down — while the pointer is on it, which is the
// only time anyone presses it. Kenny found it on shade-dark, 2026-09-11:
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

for (const theme of THEMES) {
    test(`a button reacts to being pressed under ${theme} [fix-12]`, async ({ page }) => {
        await page.goto(`/showcase/themes/${theme}.html`);
        const button = page.locator('.kp-button--primary').first();
        await button.scrollIntoViewIfNeeded();
        // Everything a press is allowed to change, in one vector. Reading
        // only `background-color` called retro red on 2026-09-12: that theme
        // presses by inverting its bevel and shifting its padding, which is
        // a reaction the narrower question could not see.
        const paint = () =>
            button.evaluate((el) => {
                const s = getComputedStyle(el);
                return [s.backgroundColor, s.boxShadow, s.translate, s.paddingBlockStart, s.paddingInlineStart, s.borderColor, s.color].join(' | ');
            });
        await button.hover();
        // Let the hover settle before taking the baseline: read too early and
        // the baseline is the RESTING paint, which the press then differs
        // from for the wrong reason [fix-1].
        await page.waitForTimeout(260);
        const hovered = await paint();
        await page.mouse.down();
        try {
            await measured(
                button,
                (el) => {
                    const s = getComputedStyle(el);
                    return [s.backgroundColor, s.boxShadow, s.translate, s.paddingBlockStart, s.paddingInlineStart, s.borderColor, s.color].join(
                        ' | ',
                    );
                },
                undefined,
                `${theme}: held down, the button paints exactly as it did hovered`,
            ).not.toBe(hovered);
        } finally {
            await page.mouse.up();
        }
        void paint;
    });
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
for (const theme of THEMES) {
    test(`the destructive alert can be read under ${theme} [gap-1]`, async ({ page }) => {
        await page.goto(`/showcase/themes/${theme}.html`);
        const alert = page.locator('.kp-alert--destructive').first();
        await alert.scrollIntoViewIfNeeded();
        const painted = await alert.evaluate((el) => {
            const s = getComputedStyle(el);
            // The ground the words actually stand on, not the one the
            // element declares: a transparent alert shows what is behind it.
            let node = /** @type {HTMLElement} */ (el);
            let bg = s.backgroundColor;
            while (bg === 'rgba(0, 0, 0, 0)' && node.parentElement) {
                node = node.parentElement;
                bg = getComputedStyle(node).backgroundColor;
            }
            return { fg: s.color, bg };
        });
        expect(contrast(parse(painted.fg), parse(painted.bg)), `${painted.fg} on ${painted.bg}`).toBeGreaterThanOrEqual(4.5);
    });
}

// CP1 — the arrival answers a click anywhere, not only on Skip.
//
// Four themes build one: phantom (`card`), retro, terminal and synthwave
// (`boot`). The overlay is `position: fixed; inset: 0`, so until 6.0.0 it
// ate every click for up to 1100ms and only the Skip button ended it — a
// click elsewhere did nothing and gave no sign it had been lost.
// JobTracker reported that as "the theme picker does not work on phantom";
// the picker was fine. Kenny, 2026-09-09: remember it for the next
// version. This is that version.
//
// Drilled 2026-09-12 in firefox: the overlay's own listener removed from
// js/effects.js → red on all four, because the click lands and the
// overlay stays. Restored green.
for (const theme of ['phantom', 'retro', 'terminal', 'synthwave']) {
    test(`the arrival lets go of a click anywhere under ${theme} [CP1]`, async ({ page }) => {
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
    });
}
