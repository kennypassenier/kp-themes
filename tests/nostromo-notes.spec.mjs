// The direct fixes from Kenny's nostromo notes, read in every theme
// [scope-55, scope-57, scope-60].
//
// Kenny's first full pass through one theme on the review page left
// twenty-three notes; the form of 2026-09-13 approved these as direct
// fixes. Each is read on the catalogue page where he saw it, in all
// twenty-two themes, because a fault he found in nostromo was, measured,
// usually a fault in more than one.
//
// Drilled per KT3 on 2026-09-13: every test ran against the code before the
// fixes and went red, with the measured values recorded beside each.

import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';
import { waitForJudging } from './helpers/catalogue.mjs';
import { useEmptyRegister } from './helpers/empty-register.mjs';
import { contrast as contrast01 } from '../gates/colour.mjs';

// kpPaint reads channels in 0..255; contrast() expects 0..1. Unscaled, every
// ratio came out in the millions and the two 4.5:1 checks could not fail.
/** @param {number[]} ink @param {number[]} ground */
const contrast = (ink, ground) =>
    contrast01(
        ink.map((v) => v / 255),
        ground.map((v) => v / 255),
    );

const THEME_NAMES = JSON.parse(readFileSync(new globalThis.URL('../themes/order.json', import.meta.url), 'utf8'));

/** @param {import('@playwright/test').Page} page @param {string} theme */
const wear = async (page, theme) => {
    await page.evaluate((name) => document.documentElement.setAttribute('data-theme', name), theme);
    await expect.poll(() => page.evaluate(() => document.documentElement.getAttribute('data-theme'))).toBe(theme);
};

/** @param {import('@playwright/test').Page} page @param {string} url */
const open = async (page, url) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    // A catalogue page hides a block once it is judged: an empty register
    // keeps every block on the page, and the reading is waited out.
    const catalogue = url.startsWith('/catalogue/');
    if (catalogue) await useEmptyRegister(page.context());
    await page.goto(url);
    if (catalogue) await waitForJudging(page);
};

/**
 * Installs `window.kpPaint`: an element's ink and the colour it actually
 * sits on, every translucent ground on the way up composited, both as sRGB.
 * A canvas resolves whatever notation the browser reports (Firefox writes
 * `color(srgb …)` for a colour with alpha).
 *
 * @param {import('@playwright/test').Page} page
 */
const installPaint = (page) =>
    page.evaluate(() => {
        const ctx = /** @type {CanvasRenderingContext2D} */ (document.createElement('canvas').getContext('2d', { willReadFrequently: true }));
        /** @param {string} css @returns {number[]} rgba, alpha 0..1 */
        const rgba = (css) => {
            ctx.clearRect(0, 0, 1, 1);
            ctx.fillStyle = '#000';
            ctx.fillStyle = css;
            ctx.fillRect(0, 0, 1, 1);
            const d = ctx.getImageData(0, 0, 1, 1).data;
            return [d[0], d[1], d[2], d[3] / 255];
        };
        /** @param {Element} el */
        const ground = (el) => {
            /** @type {number[][]} */
            const layers = [];
            for (let e = /** @type {Element | null} */ (el); e; e = e.parentElement) {
                const c = rgba(getComputedStyle(e).backgroundColor);
                if (c[3] > 0) layers.push(c);
                if (c[3] >= 1) break;
            }
            let out = [255, 255, 255];
            for (const c of layers.reverse()) out = out.map((v, i) => Math.round(c[i] * c[3] + v * (1 - c[3])));
            return out;
        };
        /** @param {Element} el */
        const paint = (el) => {
            const ink = rgba(getComputedStyle(el).color);
            const under = ground(el);
            return { ink: ink.slice(0, 3).map((v, i) => Math.round(v * ink[3] + under[i] * (1 - ink[3]))), ground: under };
        };
        /** @type {any} */ (window).kpPaint = paint;
    });

test('the progress label reads at 4.5:1 on what is behind it, in every theme [scope-60]', async ({ page }) => {
    // Before: 20 registers painted .kp-progress__value as a plate in --primary
    // under the muted label — formal 1.53, dark 2.12, nostromo 2.20.
    await open(page, '/catalogue/feedback.html');
    await installPaint(page);
    const faint = [];
    for (const theme of THEME_NAMES) {
        await wear(page, theme);
        const p = await page.locator('#progress .kp-progress__value').evaluate((el) => /** @type {any} */ (window).kpPaint(el));
        const ratio = contrast(p.ink, p.ground);
        // shade-light's muted ink is 3.99:1 on its ground by choice, recorded as
        // advice that never refuses (Kenny, 2026-09-09; gates/compliance.mjs).
        // The label may not fall below that recorded reading.
        const floor = theme === 'shade-light' ? 3.99 : 4.5;
        if (ratio < floor - 0.005) faint.push(`${theme}: ${ratio.toFixed(2)} (rgb ${p.ink} on rgb ${p.ground})`);
    }
    expect(faint).toEqual([]);
});

test('every word on a severity toast reads at 4.5:1, its buttons included, in every theme [scope-60]', async ({ page }) => {
    await open(page, '/catalogue/feedback.html');
    await installPaint(page);
    const faint = [];
    for (const theme of THEME_NAMES) {
        await wear(page, theme);
        const reads = await page
            .locator('#toasts [class*="kp-toast--"], #toasts [class*="kp-toast--"] button')
            .evaluateAll((els) => els.map((el) => ({ what: el.className, .../** @type {any} */ (window).kpPaint(el) })));
        for (const r of reads) {
            const ratio = contrast(r.ink, r.ground);
            if (ratio < 4.5) faint.push(`${theme} ${r.what}: ${ratio.toFixed(2)}`);
        }
    }
    expect(faint).toEqual([]);
});
