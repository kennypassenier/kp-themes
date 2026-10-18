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
import { parseColour } from './helpers/colour.mjs';
import { reportContrast } from './helpers/contrast-guideline.mjs';

// Motion stays on here: this file reads animations or transitions, and the
// suite runs with reduced motion otherwise (playwright.config.mjs).
test.use({ contextOptions: { reducedMotion: 'no-preference' } });

const FIXTURE = '/tests/fixtures/nav-ghost.html';

/** An opaque colour as sRGB in 0..1; rgb(), color(srgb), oklab() and oklch() all occur. @param {string} css */
const rgb = (css) => {
    const c = parseColour(css);
    return c ? [c.r / 255, c.g / 255, c.b / 255] : null;
};

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
        // Buckets of 16 levels per channel, the winning bucket averaged: a plate
        // drawn as a gradient (solstice's hover) has no single pixel value that
        // repeats, so counting exact values let a small flat glow outvote it.
        /** @type {Map<string, { n: number, sum: number[] }>} */
        const counts = new Map();
        for (let i = 0; i < d.length; i += 4) {
            const key = `${d[i] >> 4},${d[i + 1] >> 4},${d[i + 2] >> 4}`;
            const bucket = counts.get(key) ?? { n: 0, sum: [0, 0, 0] };
            bucket.n += 1;
            for (let c = 0; c < 3; c++) bucket.sum[c] += d[i + c];
            counts.set(key, bucket);
        }
        const [top] = [...counts.values()].sort((a, b) => b.n - a.n);
        return top.sum.map((v) => v / top.n / 255);
    }, png.toString('base64'));

for (const { name } of THEMES) {
    test(
        `${name}: a ghost and an icon button in the bar read against the bar [fix-77]`,
        { tag: ['@component:navigation', '@component:button', `@theme:${name}`] },
        async ({ page }) => {
            await page.goto(FIXTURE);
            await page.evaluate((theme) => document.documentElement.setAttribute('data-theme', theme), name);
            // A theme switch animates its colours; read the settled ones.
            await page.addStyleTag({ content: '*, *::before, *::after { transition: none !important; }' });
            await page.mouse.move(0, 0);
            for (const which of ['ghost', 'icon', 'sticky-ghost', 'sticky-icon']) {
                const control = page.locator(`[data-test="${which}"]`);
                // The plate is read from the screen, as the hover and focus test below reads it: a bar's plate may be a
                // gradient over a transparent `background-color` (cyberpunk's yellow bar), which no walk up the
                // ancestors for a painted ground can see. The button's own ground at rest is transparent, so its
                // box shows the bar's plate; the most frequent colour of that box is the plate, not the glyph.
                const box = await control.boundingBox();
                if (!box) throw new Error(`${which} has no box`);
                const png = await page.screenshot({ clip: box, animations: 'disabled', caret: 'hide' });
                const seen = (await plateOf(page, png)).map((c) => c * 255);
                const read = { ink: await control.evaluate((el) => getComputedStyle(el).color), plate: `rgb(${seen.map(Math.round).join(', ')})` };
                const ink = rgb(read.ink);
                const plate = rgb(read.plate);
                expect(ink && plate, `${which}: ${read.ink} on ${read.plate}`).toBeTruthy();
                const ratio = contrast(/** @type {[number, number, number]} */ (ink), /** @type {[number, number, number]} */ (plate));
                // Contrast is a guideline, not a gate (Kenny, form v44; fix-104).
                if (ratio < 4.5) reportContrast(test.info(), `${name} ${which} at rest, ${read.ink} on ${read.plate}: ${ratio.toFixed(2)}:1`);
            }
        },
    );
}

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
                    // Contrast is a guideline, not a gate (Kenny, form v44; fix-104).
                    if (ratio < 4.5)
                        reportContrast(
                            test.info(),
                            `${name} ${which} ${state}, ink ${ink?.map((c) => Math.round(c * 255))} on plate ${plate.map((c) => Math.round(c * 255))}: ${ratio.toFixed(2)}:1`,
                        );
                    await control.blur();
                }
            }
        },
    );
}
