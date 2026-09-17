// The brutalism marquee has no seam [Kenny's note on page-effects--dividers,
// 2026-09-15, read at @2.222]: where one tile of the hatch meets the next,
// the stripes must run on as if the strip were one drawing.
//
// The fault: the strip is 200% of the band, its tile 50% of the strip, so a
// tile was exactly one band wide — an arbitrary width, never a whole number
// of the stripes' horizontal period (28px across the stripe at -45deg is
// 39.6px along x). Where the marquee carried the tile's end past the eye,
// the stripe that ended there did not meet the one that began.
//
// The reading: the animation is stopped with the old tile boundary (half the
// strip) in the middle of the band, the band is photographed at ratio 1 and
// at 2.222, and along several rows the rising edges of the stripes are
// located. On an unbroken hatch every gap between two edges
// is the same; a seam shows as one gap that is off. The worst gap may differ
// from the median gap by at most 1.5 device pixels.
//
// The fix: the tile is --kp-hatch-tile (40px) wide and holds exactly one
// stripe period along x, and the strip's half is rounded up to whole tiles.
//
// Red run first, in firefox, on 4ccbca61 before the fix: at 1090 and 1010 px
// the worst gap was off by 20-21 device pixels at a ratio of 1 and by 44-46
// at 2.222, in both dividers (1070 px happened to be 1-2 off). After: 0 at 1,
// 1 at 2.222, every width. Photographs in research/brutalism-divider-seam/.

import { writeFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { useEmptyRegister } from './helpers/empty-register.mjs';
import { waitForJudging } from './helpers/catalogue.mjs';

test.describe.configure({ timeout: 120_000 });

const RATIOS = [1, 2.222];
const DIVIDERS = [
    ['plain', '#dividers [data-kp-divider=""]'],
    ['alt', '#dividers [data-kp-divider="alt"]'],
];
// Device pixels a gap may differ from the median gap: the anti-aliasing of
// one edge, and a tile snapped to whole device pixels.
const TOLERANCE = 1.5;
// Band widths in CSS pixels: 1070 is the catalogue stage at a 1400 px
// viewport, 1090 and 1010 leave a band-wide tile about half a stripe period
// out of step, the width Kenny's window happened to give.
const WIDTHS = [1070, 1090, 1010];

/**
 * Locate the rising edges (dark to light) along rows of a PNG, decoded in the page.
 *
 * @param {import('@playwright/test').Page} page
 * @param {Buffer} png
 * @returns {Promise<{ width: number, height: number, rows: number[][] }>}
 */
async function edges(page, png) {
    return page.evaluate(async (b64) => {
        const img = new Image();
        img.src = `data:image/png;base64,${b64}`;
        await img.decode();
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = /** @type {CanvasRenderingContext2D} */ (canvas.getContext('2d'));
        ctx.drawImage(img, 0, 0);
        const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const lum = (x, y) => {
            const i = (y * width + x) * 4;
            return 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
        };
        const rows = [];
        // Rows between the two borders, away from them.
        for (const f of [0.3, 0.4, 0.5, 0.6, 0.7]) {
            const y = Math.round(height * f);
            const line = Array.from({ length: width }, (_, x) => lum(x, y));
            const lo = Math.min(...line);
            const hi = Math.max(...line);
            const mid = (lo + hi) / 2;
            const found = [];
            for (let x = 1; x < width; x++) {
                if (line[x - 1] < mid && line[x] >= mid) found.push(x - 1 + (mid - line[x - 1]) / (line[x] - line[x - 1]));
            }
            rows.push(found);
        }
        return { width, height, rows };
    }, png.toString('base64'));
}

for (const ratio of RATIOS) {
    test(
        `the brutalism marquee hatch runs on across its tile boundary at a ratio of ${ratio}`,
        { tag: ['@theme:brutalism', '@component:page-effects'] },
        async ({ playwright, browserName, baseURL }) => {
            test.skip(browserName !== 'firefox', 'layout.css.devPixelsPerPx is a Gecko preference');
            const browser = await playwright.firefox.launch({ firefoxUserPrefs: { 'layout.css.devPixelsPerPx': String(ratio) } });
            try {
                const context = await browser.newContext({ baseURL, viewport: { width: 1400, height: 900 }, deviceScaleFactor: ratio });
                await useEmptyRegister(context);
                await context.addInitScript(() => localStorage.setItem('theme', 'brutalism'));
                const page = await context.newPage();
                await page.goto('/catalogue/page-effects.html');
                await waitForJudging(page);
                const decoder = await context.newPage();
                for (const [name, selector] of DIVIDERS)
                    for (const bandWidth of WIDTHS) {
                        const band = page.locator(selector);
                        await band.scrollIntoViewIfNeeded();
                        // The band at a set width, the marquee stopped with the strip's half — where one band-wide tile used to end — in its middle.
                        await band.evaluate((el, w) => {
                            el.style.inlineSize = `${w}px`;
                            const strip = parseFloat(getComputedStyle(el, '::before').width);
                            const shift = strip / 2 - el.clientWidth / 2;
                            el.style.setProperty('--seam-shift', `${-shift}px`);
                            if (!document.getElementById('seam-probe')) {
                                const style = document.createElement('style');
                                style.id = 'seam-probe';
                                style.textContent = `[data-kp-divider]::before { animation: none !important; transform: translateX(var(--seam-shift, 0)) !important; }`;
                                document.head.append(style);
                            }
                        }, bandWidth);
                        const shot = await band.screenshot();
                        // SEAM_SHOT=<path prefix> keeps the photographs, for a before/after pair.
                        if (process.env.SEAM_SHOT) writeFileSync(`${process.env.SEAM_SHOT}-${name}-${bandWidth}-${ratio}.png`, shot);
                        const { width, rows } = await edges(decoder, shot);
                        let worst = 0;
                        let median = 0;
                        for (const found of rows) {
                            // The middle 80%, clear of anything fixed to the viewport's edge.
                            const inner = found.filter((x) => x > width * 0.1 && x < width * 0.9);
                            const gaps = inner.slice(1).map((x, i) => x - inner[i]);
                            expect(gaps.length, `${name}: stripes found along a row`).toBeGreaterThan(10);
                            const sorted = [...gaps].sort((a, b) => a - b);
                            median = sorted[Math.floor(sorted.length / 2)];
                            worst = Math.max(worst, ...gaps.map((g) => Math.abs(g - median)));
                        }
                        console.log(
                            `seam · brutalism · ${name} · ${bandWidth}px · @${ratio} · median gap ${median.toFixed(2)} px · worst deviation ${worst.toFixed(2)} px`,
                        );
                        expect
                            .soft(
                                worst,
                                `${name} ${bandWidth}px at ${ratio}: the worst gap between two stripes against the median ${median.toFixed(2)}`,
                            )
                            .toBeLessThanOrEqual(TOLERANCE);
                    }
            } finally {
                await browser.close();
            }
        },
    );
}
