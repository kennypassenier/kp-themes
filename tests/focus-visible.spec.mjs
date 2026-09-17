// The focus ring shows on screen, in every theme [fix-38, DI2].
//
// DI2's gate reads the ring's computed value, and computed style still
// reports an outline a `clip-path` has cut away: dark's chamfer did exactly
// that, and tabbing to one of its buttons changed 0 pixels outside the box
// (formal: 395–526) while every ring check stayed green. So this reads the
// paint. In each theme it reaches a button, a primary button, a field's
// input and a bar link with the keyboard, screenshots the element's box
// grown by PAD pixels focused and again with nothing focused, and counts
// the pixels that changed in the band a ring lives in: everything outside
// the box, and the outermost EDGE pixels inside it (a register that clips
// its corners draws the ring inside, along the edge).
//
// A ring runs around the element, so the band is read per side: on each
// of the four sides, the share of positions along it (columns for top and
// bottom, rows for start and end) where at least one pixel changed. An
// underline, a bottom oxide line or a readout above the control changes
// one side, not four. A share of COVERAGE on every side is required.
//
// Drilled per KT3 on 2026-09-16, firefox, at c9f58c08 before any fix: 11
// of the 22 themes went red (per side, the share that changed; outside and
// edge in pixels):
//   - dark and titanium, button and primary: 0 on every side, 0 outside, 0
//     edge — the chamfer's clip-path cut the ring away;
//   - the field in formal, light, pastel, blueprint, solstice, shade-light:
//     0 everywhere — kp.components' offset shadow on .kp-field__input beat
//     the inner ring in kp.base, and the outer half is the field's ground;
//   - the bar link in pastel and sepia: 0 everywhere; synthwave: top, start,
//     end 0 (only the stripe under the word); grotesk: top 0, start 0.37,
//     end 0.29 (only the rule) — each register's `box-shadow` on the link's
//     hover/focus list took the inner ring off;
//   - titanium's bar link: end 0.05, the current page's plate painted over
//     the ring's end side; in chromium dark's bar link read the same 0.05.
// Every one is green after its fix (css/components.css, and the dark,
// titanium, pastel, sepia, synthwave and grotesk registers).

import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { waitForJudging } from './helpers/catalogue.mjs';
import { useEmptyRegister } from './helpers/empty-register.mjs';

const THEME_NAMES = /** @type {string[]} */ (JSON.parse(readFileSync(new globalThis.URL('../themes/order.json', import.meta.url), 'utf8')));

/** The band outside the box, in CSS px. */
const PAD = 6;
/** How far inside the box's edge the band reaches, in CSS px: a ring drawn inside (grotesk's primary: 2px outline, 2px inner ring) sits 1-4px in, plus a sub-pixel box. */
const EDGE = 5;
/** A pixel has changed when one channel moved at least this far (0..255). */
const CHANNEL = 32;
/** The share of each side that must change. */
const COVERAGE = 0.5;

const TARGETS = [
    { what: 'button', url: '/catalogue/button.html', selector: '#variants .cat-stage .kp-button:not([class*="kp-button--"]):not(:disabled)' },
    { what: 'primary button', url: '/catalogue/button.html', selector: '#variants .cat-stage .kp-button--primary:not(:disabled)' },
    { what: 'field', url: '/catalogue/field.html', selector: '#text .cat-stage .kp-field__input' },
    { what: 'bar link', url: '/catalogue/navigation.html', selector: '#bar .cat-stage .kp-nav__link:not([aria-current])' },
];

/**
 * Compare two PNG screenshots of the same clip in the page and read the
 * band around the box.
 *
 * @param {import('@playwright/test').Page} page
 * @param {Buffer} a
 * @param {Buffer} b
 * @param {{ width: number, height: number, clipWidth: number }} geometry box size and clip width in CSS px
 */
const band = (page, a, b, geometry) =>
    page.evaluate(
        async ([one, two, g]) => {
            /** @param {string} data */
            const pixels = async (data) => {
                const img = await new Promise((resolve, reject) => {
                    const image = new Image();
                    image.onload = () => resolve(image);
                    image.onerror = reject;
                    image.src = `data:image/png;base64,${data}`;
                });
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = /** @type {CanvasRenderingContext2D} */ (canvas.getContext('2d', { willReadFrequently: true }));
                ctx.drawImage(img, 0, 0);
                return { w: img.width, h: img.height, data: ctx.getImageData(0, 0, img.width, img.height).data };
            };
            const [p, q] = await Promise.all([pixels(one), pixels(two)]);
            const scale = p.w / g.clipWidth;
            const sides = { top: new Set(), bottom: new Set(), start: new Set(), end: new Set() };
            let outside = 0;
            let edge = 0;
            for (let y = 0; y < p.h; y++) {
                for (let x = 0; x < p.w; x++) {
                    const i = (y * p.w + x) * 4;
                    const moved = Math.max(
                        Math.abs(p.data[i] - q.data[i]),
                        Math.abs(p.data[i + 1] - q.data[i + 1]),
                        Math.abs(p.data[i + 2] - q.data[i + 2]),
                    );
                    if (moved < g.channel) continue;
                    // Position relative to the box, in CSS px.
                    const cx = x / scale - g.pad;
                    const cy = y / scale - g.pad;
                    const inX = cx >= 0 && cx < g.width;
                    const inY = cy >= 0 && cy < g.height;
                    const inside = inX && inY;
                    const nearTop = cy < g.edge;
                    const nearBottom = cy >= g.height - g.edge;
                    const nearStart = cx < g.edge;
                    const nearEnd = cx >= g.width - g.edge;
                    if (inside && !(nearTop || nearBottom || nearStart || nearEnd)) continue;
                    if (inside) edge++;
                    else outside++;
                    const col = Math.floor(Math.min(Math.max(cx, 0), g.width - 1));
                    const row = Math.floor(Math.min(Math.max(cy, 0), g.height - 1));
                    if (nearTop) sides.top.add(col);
                    if (nearBottom) sides.bottom.add(col);
                    if (nearStart) sides.start.add(row);
                    if (nearEnd) sides.end.add(row);
                }
            }
            const share = (/** @type {Set<number>} */ s, /** @type {number} */ n) => Math.round((s.size / Math.max(1, Math.floor(n))) * 100) / 100;
            return {
                outside,
                edge,
                top: share(sides.top, g.width),
                bottom: share(sides.bottom, g.width),
                start: share(sides.start, g.height),
                end: share(sides.end, g.height),
            };
        },
        [a.toString('base64'), b.toString('base64'), { ...geometry, pad: PAD, edge: EDGE, channel: CHANNEL }],
    );

for (const name of THEME_NAMES) {
    test(
        `${name}: Tab to a button, a primary button, a field and a bar link, and a ring shows around each [fix-38]`,
        { tag: ['@sweep', '@component:button', '@component:field', '@component:navigation'] },
        async ({ page }) => {
            // Before: see the drill at the top of this file.
            await page.emulateMedia({ reducedMotion: 'no-preference' });
            await page.setViewportSize({ width: 1280, height: 900 });
            await useEmptyRegister(page.context());
            /** @type {string[]} */
            const faults = [];
            /** @type {Record<string, unknown>} */
            const readings = {};
            let open = '';
            for (const target of TARGETS) {
                if (open !== target.url) {
                    await page.goto(target.url);
                    await waitForJudging(page);
                    // catalogue/deps.css imports every register, so the theme's
                    // rules are on the page the moment the attribute is.
                    await page.evaluate((n) => document.documentElement.setAttribute('data-theme', n), name);
                    open = target.url;
                }
                const element = page.locator(target.selector).first();
                // In the middle of the window: at its edge the band is cut off
                // (chromium left the bar link at y 860–899 of 900).
                await element.evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
                // The pointer rests in a corner for both pictures: dark's ground
                // follows it, and a hover is not focus.
                await page.mouse.move(0, 0);
                // Reach it with the keyboard: focus what precedes it in the tab
                // order, then Tab.
                await element.evaluate((el) => {
                    const all = [...document.querySelectorAll('a[href], button, input, select, textarea, [tabindex]')].filter(
                        (x) =>
                            /** @type {HTMLElement} */ (x).tabIndex >= 0 &&
                            !(/** @type {HTMLButtonElement} */ (x).disabled) &&
                            x.getBoundingClientRect().width > 0,
                    );
                    const before = /** @type {HTMLElement | undefined} */ (all[all.indexOf(el) - 1]);
                    (before ?? document.body).focus();
                });
                await page.keyboard.press('Tab');
                await expect.poll(() => element.evaluate((el) => el === document.activeElement && el.matches(':focus-visible'))).toBe(true);
                // The box is read once it holds still: a transition the focus
                // starts (cyberpunk's link) or a scroll the Tab starts moves it,
                // and a band measured around a box that has since moved is a
                // band around nothing (firefox read cyberpunk's link at start
                // 0.32, end 0.05 with its ring plainly on all four sides).
                // Finite ones only: terminal's focused link blinks for ever.
                await expect
                    .poll(() =>
                        element.evaluate(
                            (el) => el.getAnimations({ subtree: true }).filter((a) => a.effect?.getTiming().iterations !== Infinity).length,
                        ),
                    )
                    .toBe(0);
                const place = async () => JSON.stringify(await element.boundingBox());
                let still = await place();
                await expect
                    .poll(async () => {
                        const now = await place();
                        const same = now === still;
                        still = now;
                        return same;
                    })
                    .toBe(true);
                const box = /** @type {{ x: number, y: number, width: number, height: number }} */ (JSON.parse(still));
                const clip = { x: box.x - PAD, y: box.y - PAD, width: box.width + PAD * 2, height: box.height + PAD * 2 };
                // `animations: 'disabled'` finishes every transition and stops
                // every endless animation, so both pictures are settled states.
                await page.waitForTimeout(100);
                const focused = await page.screenshot({ clip, animations: 'disabled' });
                await element.evaluate((el) => /** @type {HTMLElement} */ (el).blur());
                await page.waitForTimeout(100);
                const rest = await page.screenshot({ clip, animations: 'disabled' });
                const read = await band(page, focused, rest, { width: box.width, height: box.height, clipWidth: clip.width });
                readings[target.what] = read;
                const thin = /** @type {const} */ (['top', 'bottom', 'start', 'end']).filter((side) => read[side] < COVERAGE);
                if (thin.length)
                    faults.push(`${target.what}: ${thin.map((s) => `${s} ${read[s]}`).join(', ')} (outside ${read.outside}, edge ${read.edge})`);
            }
            test.info().annotations.push({ type: 'readings', description: JSON.stringify(readings) });
            expect(faults, JSON.stringify(readings)).toEqual([]);
        },
    );
}
