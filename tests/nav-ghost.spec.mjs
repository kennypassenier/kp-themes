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

// Motion stays on here: this file reads animations or transitions, and the
// suite runs with reduced motion otherwise (playwright.config.mjs).
test.use({ reducedMotion: 'no-preference' });

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
            for (const which of ['ghost', 'icon', 'sticky-ghost', 'sticky-icon']) {
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

/**
 * The colour a hovered control's plate paints most, read from the screen:
 * a hover plate may be the button's ground, a veil, an inset shadow or a
 * register's `::before` sweep, so the pixels are the one honest reading.
 * @param {import('@playwright/test').Page} page
 * @param {Buffer} png
 */
const plateOf = (page, png) =>
    page.evaluate(async (data) => {
        const img = new Image();
        img.src = `data:image/png;base64,${data}`;
        await img.decode();
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = /** @type {CanvasRenderingContext2D} */ (canvas.getContext('2d', { willReadFrequently: true }));
        ctx.drawImage(img, 0, 0);
        const d = ctx.getImageData(0, 0, img.width, img.height).data;
        /** @type {Map<string, number>} */
        const counts = new Map();
        for (let i = 0; i < d.length; i += 4) {
            const key = `${d[i]},${d[i + 1]},${d[i + 2]}`;
            counts.set(key, (counts.get(key) ?? 0) + 1);
        }
        const [top] = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
        return top.split(',').map((n) => Number(n) / 255);
    }, png.toString('base64'));

for (const { name } of THEMES) {
    test(
        `${name}: a hovered or focused ghost and icon button in the bar still read against what is under them [fix-82]`,
        { tag: ['@component:navigation', '@component:button', `@theme:${name}`] },
        async ({ page }) => {
            // The homelab dashboard's second round (2026-09-29): fix-77 made the
            // resting ink the bar's, but the hover plates stayed the page's —
            // nostromo 1.12:1, high-contrast 1.00:1, phantom 3.56:1 hovered.
            await page.goto(FIXTURE);
            await page.evaluate((theme) => document.documentElement.setAttribute('data-theme', theme), name);
            await page.addStyleTag({ content: '*, *::before, *::after { transition: none !important; animation: none !important; }' });
            for (const which of ['ghost', 'icon', 'sticky-ghost', 'sticky-icon']) {
                const control = page.locator(`[data-test="${which}"]`);
                for (const state of ['hover', 'focus']) {
                    await page.mouse.move(0, 0);
                    if (state === 'hover') await control.hover();
                    else {
                        await control.focus();
                        await page.keyboard.press('Shift+Tab');
                        await page.keyboard.press('Tab');
                    }
                    const box = await control.boundingBox();
                    if (!box) throw new Error(`${which} has no box`);
                    const png = await page.screenshot({ clip: box, animations: 'disabled', caret: 'hide' });
                    const plate = await plateOf(page, png);
                    const ink = rgb(await control.evaluate((el) => getComputedStyle(el).color));
                    const ratio = contrast(/** @type {[number, number, number]} */ (ink), /** @type {[number, number, number]} */ (plate));
                    expect(
                        ratio,
                        `${name} ${which} ${state}: ink ${ink?.map((c) => Math.round(c * 255))} on plate ${plate.map((c) => Math.round(c * 255))}`,
                    ).toBeGreaterThanOrEqual(4.5);
                    await control.blur();
                }
            }
        },
    );
}
