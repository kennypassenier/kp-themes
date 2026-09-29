// A ghost or icon button in the bar wears the bar's ink [fix-77].
//
// The homelab dashboard put a "?" ghost button and a bell icon button in its
// `.kp-nav` (2026-09-29). `.kp-button--ghost` paints `var(--foreground)`, the
// page's ink, and several registers repaint it the same way, so on a bar with
// its own plate the button read 1.20:1 in cyberpunk (the page's light ink on
// the yellow bar) and 1.00:1 in nostromo. The theme picker's trigger in the
// same bar inherits the bar's colour and read 15.6:1. What holds now, in all
// 22 themes, since the fault was per register: at rest, the ghost's text and
// the icon button's glyph clear 4.5:1 against the plate behind them.

import { expect, test } from '@playwright/test';
import { THEMES } from '../js/theme-registry.js';
import { contrast } from '../js/contrast.js';

const FIXTURE = '/tests/fixtures/nav-ghost.html';

/** An opaque colour as sRGB in 0..1; `color(srgb …)` and `rgb(…)` both occur. @param {string} css */
const rgb = (css) => {
    const srgb = css.match(/color\(srgb ([\d.]+) ([\d.]+) ([\d.]+)/);
    if (srgb) return [Number(srgb[1]), Number(srgb[2]), Number(srgb[3])];
    const m = css.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const [r, g, b] = m[1].split(/[\s,/]+/).filter(Boolean);
    return [Number(r) / 255, Number(g) / 255, Number(b) / 255];
};

for (const { name } of THEMES) {
    test(
        `${name}: a ghost and an icon button in the bar read against the bar [fix-77]`,
        { tag: ['@component:navigation', '@component:button', `@theme:${name}`] },
        async ({ page }) => {
            await page.goto(FIXTURE);
            await page.evaluate((theme) => document.documentElement.setAttribute('data-theme', theme), name);
            // A theme switch animates its colours; read the settled ones.
            await page.addStyleTag({ content: '*, *::before, *::after { transition: none !important; }' });
            for (const which of ['ghost', 'icon']) {
                const read = await page.locator(`[data-test="${which}"]`).evaluate((el) => {
                    let ground = null;
                    const clear = (/** @type {Element} */ node) =>
                        /rgba\(0, 0, 0, 0\)|transparent|\/ 0\)$/.test(getComputedStyle(node).backgroundColor);
                    // The plate is the nearest box that paints a ground; the
                    // button's own ground at rest is transparent.
                    ground = el.parentElement;
                    while (ground && clear(ground)) ground = ground.parentElement;
                    return { ink: getComputedStyle(el).color, plate: ground ? getComputedStyle(ground).backgroundColor : 'rgb(255, 255, 255)' };
                });
                const ink = rgb(read.ink);
                const plate = rgb(read.plate);
                expect(ink && plate, `${which}: ${read.ink} on ${read.plate}`).toBeTruthy();
                const ratio = contrast(/** @type {[number, number, number]} */ (ink), /** @type {[number, number, number]} */ (plate));
                expect(ratio, `${name} ${which}: ${read.ink} on ${read.plate}`).toBeGreaterThanOrEqual(4.5);
            }
        },
    );
}
