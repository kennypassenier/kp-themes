// Kenny's per-theme answers of 2026-09-15 [scope-93], read where he read them.
//
// hc-filled-hover (high-contrast, removed 2026-10-08, its test went with it): the filled
// Save changes and Delete account showed no hover, because their hover ground
// was their border colour, which is their fill. light-indigo "Ook daar weg",
// and on navigation#app-shell "blauw moet uit navbar": no indigo left in a
// navigation in light. retro-scrollbars, retro's pressed destructive button and retro's call
// to action (retro removed 2026-10-09, their tests went with it). cta-plates "Gelijktrekken":
// room between a call to action's words and its plate. Each is a measured
// property here, never a picture (scope-32, scope-73).
//
// Drilled per KT3 on 2026-09-15 in firefox against the registers of
// 74d9ac73, each red with the value beside it below.

import { expect, test } from '@playwright/test';
import { contrast, distance } from '../gates/colour.mjs';
import { waitForJudging } from './helpers/catalogue.mjs';
import { useEmptyRegister } from './helpers/empty-register.mjs';
import { reportContrast } from './helpers/contrast-guideline.mjs';

/**
 * @param {import('@playwright/test').Page} page
 * @param {string} url
 * @param {string} theme
 */
const open = async (page, url, theme) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1280, height: 900 });
    await useEmptyRegister(page.context());
    await page.goto(url);
    await waitForJudging(page);
    await page.evaluate((name) => document.documentElement.setAttribute('data-theme', name), theme);
    await expect.poll(() => page.evaluate(() => document.documentElement.getAttribute('data-theme'))).toBe(theme);
    await page.evaluate(() => {
        const ctx = /** @type {CanvasRenderingContext2D} */ (document.createElement('canvas').getContext('2d', { willReadFrequently: true }));
        /** Any CSS colour as [r, g, b, a], channels 0..1. @param {string} css */
        const rgba = (css) => {
            ctx.clearRect(0, 0, 1, 1);
            ctx.fillStyle = '#000';
            ctx.fillStyle = css;
            ctx.fillRect(0, 0, 1, 1);
            const d = ctx.getImageData(0, 0, 1, 1).data;
            return [d[0] / 255, d[1] / 255, d[2] / 255, d[3] / 255];
        };
        /** The opaque colour an element's box shows, its translucent ancestors composited. @param {Element | null} el */
        const ground = (el) => {
            const layers = [];
            for (let e = el; e; e = e.parentElement) {
                const c = rgba(getComputedStyle(e).backgroundColor);
                if (c[3] === 0) continue;
                layers.push(c);
                if (c[3] >= 1) break;
            }
            let acc = [1, 1, 1];
            for (const c of layers.reverse()) acc = acc.map((v, i) => c[i] * c[3] + v * (1 - c[3]));
            return acc;
        };
        Object.assign(window, { kpRgba: rgba, kpGround: ground });
    });
};

/** @param {number[]} c */
const rgb = (c) => /** @type {[number, number, number]} */ (c.slice(0, 3));

/* ───────────────────────────── 6 · room around a call to action's plate */

// Forest stands for the registers that draw a plate. Until 2026-10-04
// solstice, Shade (dark), Lapis and nostromo ran the same test; Kenny trimmed
// them (form v9, trim-copies): their plates are in the approved screenshots.
for (const theme of ['forest']) {
    test.describe(
        `${theme}: the call to action’s words keep off its plate [page-effects#nav-cta]`,
        { tag: [`@theme:${theme}`, '@component:navigation'] },
        () => {
            test('where the link draws a plate, at least 12px lie between the words and each inline edge', async ({ page }) => {
                // Before: 0px on both sides in all five (padding-inline 0px).
                await open(page, '/catalogue/page-effects.html', theme);
                const read = await page
                    .locator('#nav-cta .kp-nav__link--cta')
                    .first()
                    .evaluate((el) => {
                        const s = getComputedStyle(el);
                        const r = el.getBoundingClientRect();
                        const range = document.createRange();
                        range.selectNodeContents(el);
                        const words = range.getBoundingClientRect();
                        return {
                            plate: s.backgroundColor !== 'rgba(0, 0, 0, 0)' || parseFloat(s.borderLeftWidth) > 0 || s.backgroundImage !== 'none',
                            start: words.left - r.left,
                            end: r.right - words.right,
                        };
                    });
                expect(read.plate, 'the link draws a plate').toBe(true);
                expect(read.start, 'room at the start').toBeGreaterThanOrEqual(12);
                expect(read.end, 'room at the end').toBeGreaterThanOrEqual(12);
            });
        },
    );
}
