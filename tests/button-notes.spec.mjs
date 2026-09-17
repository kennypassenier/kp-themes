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
import { contrast, distance } from '../gates/colour.mjs';

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

/** The separable `overlay` blend, one channel. @param {number} b backdrop @param {number} s source */
const overlay = (b, s) => (b <= 0.5 ? 2 * b * s : 1 - 2 * (1 - b) * (1 - s));

test.describe('cyberpunk: the charge sweep on every variant [scope-80]', { tag: ['@theme:cyberpunk', '@component:button'] }, () => {
    test('every variant runs the sweep, in a colour at least 3:1 from the face it crosses', async ({ page }) => {
        // Before: the band was white at 0.5 in `overlay` — 1.00:1 on the primary,
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
                const band = stops.map(rgba).find((c) => c[3] > 0) ?? [0, 0, 0, 0];
                const probe = document.createElement('i');
                probe.style.color = getComputedStyle(el).getPropertyValue('--kp-btn-face');
                el.append(probe);
                const face = rgba(getComputedStyle(probe).color);
                probe.remove();
                return {
                    label: el.textContent?.trim(),
                    animation: after.animationName,
                    blend: after.mixBlendMode,
                    band,
                    face,
                    page: rgba(getComputedStyle(document.body).backgroundColor),
                };
            });
            expect(read.animation, `${read.label} runs no sweep`).toBe('kp-charge');
            const face = over(read.face, read.page.slice(0, 3));
            const source = read.blend === 'overlay' ? face.map((b, c) => overlay(b, read.band[c])) : read.band.slice(0, 3);
            const seen = over([...source, read.band[3]], face);
            const ratio = contrast(seen, face);
            if (ratio < 3) faint.push(`${read.label}: ${ratio.toFixed(2)} (${read.blend})`);
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
        await open(page, 'phantom');
        const buttons = page.locator('#variants .cat-stage .kp-button');
        const still = [];
        for (let i = 0; i < (await buttons.count()); i++) {
            const button = buttons.nth(i);
            await button.hover();
            const hovered = await button.evaluate((el) => getComputedStyle(el).transform);
            await page.mouse.down();
            const pressed = await button.evaluate((el) => getComputedStyle(el).transform);
            await page.mouse.up();
            if (pressed === hovered) still.push(`${await button.textContent()}: ${pressed}`);
        }
        await page.mouse.move(0, 0);
        expect(still).toEqual([]);
    });
});

test.describe('retro: the accelerator on every button [scope-80]', { tag: ['@theme:retro', '@component:button'] }, () => {
    test('every live button with a text label underlines a letter when pointed at', async ({ page }) => {
        // Before: only the four buttons of #accelerator, which mark a letter
        // with data-kp-key, drew one; 20 others drew none.
        await open(page, 'retro');
        const buttons = page.locator('.cat-stage .kp-button:not(:disabled)');
        const unmarked = [];
        for (let i = 0; i < (await buttons.count()); i++) {
            const button = buttons.nth(i);
            await button.hover();
            const read = await button.evaluate((el) => {
                const label = el.textContent?.trim() ?? '';
                const drawn = (/** @type {CSSStyleDeclaration} */ cs) =>
                    parseFloat(cs.borderBottomWidth) >= 1 && !/rgba\(0, 0, 0, 0\)|transparent/.test(cs.borderBottomColor);
                const key = el.querySelector('[data-kp-key]');
                if (key) return { label, marked: drawn(getComputedStyle(key)), icon: false };
                // ::first-letter reaches only into a block container. Beside an
                // icon the label's text is its own element, .kp-button__text
                // [scope-83], so the icon is not the "first letter".
                const carrier =
                    el.querySelector(':scope > .kp-button__text, :scope > .kp-button__label > .kp-button__text') ??
                    el.querySelector(':scope > .kp-button__label') ??
                    el;
                const block = /^(inline-block|block|flow-root)$/.test(getComputedStyle(carrier).display);
                return { label, marked: block && drawn(getComputedStyle(carrier, '::first-letter')) };
            });
            if (!read.label) continue;
            if (!read.marked) unmarked.push(read.label.replace(/\s+/g, ' '));
        }
        await page.mouse.move(0, 0);
        // Before scope-83: ['↻ Retry', 'Export ↓'] — an icon beside an
        // unmarked label drew no mark (Kenny, retro-accelerator "Alleen het teken").
        expect(unmarked).toEqual([]);
    });

    test('the mark beside an icon is the first letter of the label, not the icon [scope-83]', async ({ page }) => {
        await open(page, 'retro');
        const read = await page.locator('#icons .cat-stage .kp-button').evaluateAll((buttons) =>
            buttons.map((el) => {
                const text = el.querySelector('.kp-button__text');
                const icon = el.querySelector(':scope > [aria-hidden="true"]');
                return {
                    text: text?.textContent?.trim(),
                    // The icon keeps its own font and draws no border of its own.
                    iconBorder: icon ? getComputedStyle(icon).borderBottomWidth : null,
                };
            }),
        );
        expect(read).toEqual([
            { text: 'Retry', iconBorder: '0px' },
            { text: 'Export', iconBorder: '0px' },
        ]);
    });

    test('no shortcut is promised: the derived mark writes no aria-keyshortcuts', async ({ page }) => {
        await open(page, 'retro');
        await expect(page.locator('.kp-button[aria-keyshortcuts]')).toHaveCount(0);
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
