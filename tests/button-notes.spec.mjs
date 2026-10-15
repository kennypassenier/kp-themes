// Kenny's button notes of 2026-09-14, read where he read them
// [scope-80].
//
// He judged catalogue/button.html in Firefox — Variants, States, Sizes and
// the accelerator — and left one note per theme. Each note is a behaviour
// measured here, never a picture (scope-32, scope-73): a colour against the
// colour it runs on, a box against the text's box, a transform before and
// during a press, a mark that is or is not drawn.
//
// Drilled per KT3 on 2026-09-14: every test ran against the registers of
// 34b35d3 and went red, with the measured values beside each below.

import { test, expect } from '@playwright/test';
import { waitForJudging } from './helpers/catalogue.mjs';
import { useEmptyRegister } from './helpers/empty-register.mjs';
import { distance } from '../gates/colour.mjs';

const URL = '/catalogue/button.html';

/**
 * @param {import('@playwright/test').Page} page
 * @param {string} theme
 * @param {'reduce' | 'no-preference'} [reducedMotion]
 */
const open = async (page, theme, reducedMotion = 'reduce') => {
    await page.emulateMedia({ reducedMotion });
    await page.setViewportSize({ width: 1280, height: 900 });
    await useEmptyRegister(page.context());
    await page.goto(URL);
    await waitForJudging(page);
    await page.evaluate((name) => document.documentElement.setAttribute('data-theme', name), theme);
    await expect.poll(() => page.evaluate(() => document.documentElement.getAttribute('data-theme'))).toBe(theme);
};

/** Installs `window.kpRgba`: any CSS colour as [r, g, b, a], channels 0..1. @param {import('@playwright/test').Page} page */
const installRgba = (page) =>
    page.evaluate(() => {
        const ctx = /** @type {CanvasRenderingContext2D} */ (document.createElement('canvas').getContext('2d', { willReadFrequently: true }));
        /** @type {any} */ (window).kpRgba = (/** @type {string} */ css) => {
            ctx.clearRect(0, 0, 1, 1);
            ctx.fillStyle = '#000';
            ctx.fillStyle = css;
            ctx.fillRect(0, 0, 1, 1);
            const d = ctx.getImageData(0, 0, 1, 1).data;
            return [d[0] / 255, d[1] / 255, d[2] / 255, d[3] / 255];
        };
    });

/** @param {number[]} src rgba @param {number[]} dst rgb */
const over = (src, dst) => dst.map((v, i) => src[i] * src[3] + v * (1 - src[3]));

// The charge sweep this note was written for was replaced by the notched
// ring in the cyberpunk character rounds (approved): on hover the button's
// `::after` draws the ring (`--kp-cp-p: 1`, `animation: none`), in the accent
// and, along the cut edge, the destructive colour. What the note asked still
// holds and is what is read: the hover mark is drawn on every variant, in a
// colour at least 20 apart (OKLab) from the face it sits on.
test.describe('cyberpunk: the hover ring on every variant [scope-80]', { tag: ['@theme:cyberpunk', '@component:button'] }, () => {
    test('every variant draws the ring on hover, in a colour clearly apart from the face it sits on', async ({ page }) => {
        // Before (the sweep): the band was white at 0.5 in `overlay` — 1.00:1 on the primary,
        // 1.03:1 on the bare, secondary and mirror buttons, 1.28:1 on the
        // destructive, 1.16:1 on the ghost.
        await open(page, 'cyberpunk', 'no-preference');
        await installRgba(page);
        const buttons = page.locator('#variants .cat-stage .kp-button');
        const faint = [];
        for (let i = 0; i < (await buttons.count()); i++) {
            const button = buttons.nth(i);
            await button.hover();
            const read = await button.evaluate((el) => {
                const rgba = /** @type {any} */ (window).kpRgba;
                const after = getComputedStyle(el, '::after');
                const stops = after.backgroundImage.match(/(?:rgba?|color)\([^()]*\)/g) ?? [];
                // The ring's body is the last stop (the accent); the first is the cut edge's line.
                const ring = stops.length ? rgba(stops[stops.length - 1]) : [0, 0, 0, 0];
                const probe = document.createElement('i');
                probe.style.color = getComputedStyle(el).getPropertyValue('--kp-btn-face');
                el.append(probe);
                const face = rgba(getComputedStyle(probe).color);
                probe.remove();
                return {
                    label: el.textContent?.trim(),
                    clip: after.clipPath,
                    pressed: getComputedStyle(el).getPropertyValue('--kp-cp-p').trim(),
                    ring,
                    face,
                    page: rgba(getComputedStyle(document.body).backgroundColor),
                };
            });
            // The ring is a clipped plate whose width the hover turns on (`--kp-cp-p: 1`).
            expect(read.clip, `${read.label} draws no ring`).not.toBe('none');
            expect(read.pressed, `${read.label}: the hover does not turn the ring on`).toBe('1');
            const face = over(read.face, read.page.slice(0, 3));
            const seen = over(read.ring, face);
            // Perceptual distance, not luminance contrast: the ring is cyan on the yellow
            // primary face (1.34:1 in luminance, 27 apart in OKLab, plainly two colours),
            // and a ring the colour of its face, the fault of the sweep, reads 0 in either.
            const apart = distance(seen, face);
            if (apart < 20) faint.push(`${read.label}: ${apart.toFixed(1)} apart`);
        }
        await page.mouse.move(0, 0);
        expect(faint).toEqual([]);
    });
});

test.describe('terminal: the cursor on a button [scope-80]', { tag: ['@theme:terminal', '@component:button'] }, () => {
    test('the cursor starts where the label starts, in every variant, state and size', async ({ page }) => {
        // Before: the cursor's top 8.8px into every button, the text's 14.7px
        // (13.2px large, 15.2px small).
        //
        // Read centre to centre, not top to top [fix-51]. A range's box is not
        // the same box in the two engines: measured 2026-09-17 on the same
        // paint, Chromium gives the label a 16.00px box and Firefox a 17.00px
        // one half a pixel higher, so top against top read -1.28px in Chromium
        // and -0.78px in Firefox and a 1px tolerance fitted to Firefox failed
        // the other engine for a difference in measuring sticks. Both engines
        // centre the glyphs in the same line box, so centre against centre
        // reads -1.01px and -1.00px — the same paint, the same number. The
        // fault this guards is nowhere near it: before scope-80 the cursor's
        // centre stood 5.6px above the label's.
        await open(page, 'terminal');
        const buttons = page.locator(':is(#variants, #states, #sizes) .cat-stage .kp-button');
        const off = [];
        for (let i = 0; i < (await buttons.count()); i++) {
            const button = buttons.nth(i);
            await button.hover();
            const read = await button.evaluate((el) => {
                const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
                let text = null;
                for (let n = walker.nextNode(); n; n = walker.nextNode()) {
                    if (!n.textContent?.trim()) continue;
                    const range = document.createRange();
                    range.selectNodeContents(n);
                    text = range.getBoundingClientRect();
                    break;
                }
                const box = el.getBoundingClientRect();
                const after = getComputedStyle(el, '::after');
                return {
                    label: el.textContent?.trim(),
                    caretMiddle: box.top + parseFloat(after.top) + parseFloat(after.height) / 2,
                    textMiddle: text ? text.top + text.height / 2 : NaN,
                };
            });
            const delta = read.caretMiddle - read.textMiddle;
            if (!(Math.abs(delta) <= 1.5)) off.push(`${read.label}: cursor ${delta.toFixed(1)}px from the text`);
        }
        await page.mouse.move(0, 0);
        expect(off).toEqual([]);
    });

    test('the destructive button blinks in the destructive colour', async ({ page }) => {
        // Before: rgb(13, 242, 13), the primary green.
        await open(page, 'terminal');
        await installRgba(page);
        const button = page.locator('#variants .cat-stage .kp-button--destructive');
        await button.hover();
        const read = await button.evaluate((el) => {
            const rgba = /** @type {any} */ (window).kpRgba;
            const stops = getComputedStyle(el, '::after').backgroundImage.match(/(?:rgba?|color)\([^()]*\)/g) ?? [];
            return {
                caret: rgba(stops[0] ?? 'transparent'),
                destructive: rgba(getComputedStyle(document.documentElement).getPropertyValue('--destructive')),
            };
        });
        expect(read.caret).toEqual(read.destructive);
    });

    test("the primary's cursor takes the button's own ink [scope-83]", async ({ page }) => {
        // Kenny, terminal-primary-cursor "Tekstkleur van de knop": a green
        // block on the green primary read as nothing. Before: the cursor was
        // --primary on a --kp-hot-plate face.
        await open(page, 'terminal');
        await installRgba(page);
        const button = page.locator('#variants .cat-stage .kp-button--primary');
        await button.hover();
        const read = await button.evaluate((el) => {
            const rgba = /** @type {any} */ (window).kpRgba;
            const stops = getComputedStyle(el, '::after').backgroundImage.match(/(?:rgba?|color)\([^()]*\)/g) ?? [];
            return { caret: rgba(stops[0] ?? 'transparent'), ink: rgba(getComputedStyle(el).color) };
        });
        await page.mouse.move(0, 0);
        expect(read.caret).toEqual(read.ink);
    });
});

test.describe('phantom: the primary is pressed like the others [scope-80]', { tag: ['@theme:phantom', '@component:button'] }, () => {
    test('pressing any variant moves it from where hovering put it', async ({ page }) => {
        // Before: the primary read matrix(1, 0, 0, 1, 3, 3) hovered and pressed.
        // Since the key-cap grammar [G17] the buttons are skewed (`transform`
        // is the skew alone, the same in every state) and the press travels in
        // the `translate` property: 3px 3px for a variant, 5px 5px for the
        // primary (hovered 3px 3px), so the pose is read from both.
        await open(page, 'phantom');
        const pose = (/** @type {Element} */ el) => {
            const s = getComputedStyle(el);
            return `${s.transform} | translate ${s.translate}`;
        };
        const buttons = page.locator('#variants .cat-stage .kp-button');
        const still = [];
        for (let i = 0; i < (await buttons.count()); i++) {
            const button = buttons.nth(i);
            await button.hover();
            const hovered = await button.evaluate(pose);
            await page.mouse.down();
            const pressed = await button.evaluate(pose);
            await page.mouse.up();
            if (pressed === hovered) still.push(`${await button.textContent()}: ${pressed}`);
        }
        await page.mouse.move(0, 0);
        expect(still).toEqual([]);
    });
});

test.describe('titanium: the primary answers the pointer [scope-80]', { tag: ['@theme:titanium', '@component:button'] }, () => {
    test('hover moves the primary at least 10 from rest, and pressed at least 10 from hover', async ({ page }) => {
        // Before: rest to hover 4.9 in OKLab distance, hover to pressed 15.5.
        await open(page, 'titanium');
        await installRgba(page);
        const button = page.locator('#variants .cat-stage .kp-button--primary');
        const ground = () => button.evaluate((el) => /** @type {any} */ (window).kpRgba(getComputedStyle(el).backgroundColor).slice(0, 3));
        await button.scrollIntoViewIfNeeded();
        await page.mouse.move(0, 0);
        const rest = await ground();
        await button.hover();
        const hovered = await ground();
        await page.mouse.down();
        const pressed = await ground();
        await page.mouse.up();
        await page.mouse.move(0, 0);
        expect(distance(rest, hovered), `rest ${rest} → hover ${hovered}`).toBeGreaterThanOrEqual(10);
        expect(distance(hovered, pressed), `hover ${hovered} → pressed ${pressed}`).toBeGreaterThanOrEqual(10);
    });
});
