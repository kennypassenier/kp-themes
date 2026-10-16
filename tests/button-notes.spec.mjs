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
