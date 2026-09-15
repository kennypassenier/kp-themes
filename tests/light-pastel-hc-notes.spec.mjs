// Kenny's review notes of 2026-09-15 on light, pastel and high-contrast,
// read where he read them.
//
// He judged the catalogue in FireDragon and left three notes: light's nav
// links are blue (navigation#bar-collapsed, "redo this for all nav bars in
// this theme"), the added line of the diff can hardly be seen in light and
// pastel (data#diff), and high-contrast's button hover should take the
// border's colour with the Cancel button's effect on Cancel alone
// (button#variants). Each note is a measured property here, never a
// picture (scope-32, scope-73).
//
// Drilled per KT3 on 2026-09-15 in firefox against the registers of
// be9c034a, each red with the value beside it below.

import { expect, test } from '@playwright/test';
import { contrast, distance } from '../gates/colour.mjs';
import { waitForJudging } from './helpers/catalogue.mjs';
import { useEmptyRegister } from './helpers/empty-register.mjs';

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

for (const theme of ['light', 'pastel']) {
    test.describe(`${theme}: the diff's added line [data#diff]`, { tag: [`@theme:${theme}`, '@component:data'] }, () => {
        test('the added line stands off its ground as far as the removed line does, and its line numbers stay readable', async ({ page }) => {
            // Before: the added wash 0.75 ΔE from the diff's ground in light and
            // 0.89 in pastel (1.01:1), against 6.57 and 5.97 for the removed line.
            await open(page, '/catalogue/data.html', theme);
            const read = await page.evaluate(() => {
                const w = /** @type {any} */ (window);
                const added = /** @type {Element} */ (document.querySelector('#diff .kp-diff__line[data-kind="added"]'));
                const removed = /** @type {Element} */ (document.querySelector('#diff .kp-diff__line[data-kind="removed"]'));
                const number = /** @type {Element} */ (added.querySelector('.kp-diff__number'));
                return {
                    added: w.kpGround(added),
                    removed: w.kpGround(removed),
                    under: w.kpGround(added.parentElement),
                    number: w.kpRgba(getComputedStyle(number).color),
                };
            });
            const addedDelta = distance(read.added, read.under);
            const removedDelta = distance(read.removed, read.under);
            expect(addedDelta, `added ΔE ${addedDelta.toFixed(2)} against removed ${removedDelta.toFixed(2)}`).toBeGreaterThanOrEqual(
                Math.max(5, 0.8 * removedDelta),
            );
            expect(contrast(rgb(read.number), read.added), 'the muted line number on the added wash').toBeGreaterThanOrEqual(4.5);
        });
    });
}

test.describe('light: no indigo in the nav bars [navigation#bar-collapsed]', { tag: ['@theme:light', '@component:navigation'] }, () => {
    test('every bar link, dropdown link and search trigger reads in the ink, not the primary, and pointing at it still shows', async ({ page }) => {
        // Eight bars, every link hovered: 30 s alone, so more under a parallel run.
        test.setTimeout(120_000);
        // Before: every bar link rgb(53, 46, 184) — --primary — at rest, on
        // hover, on focus and as the current page, in all eight bars.
        await open(page, '/catalogue/navigation.html', 'light');
        const primary = await page.evaluate(() =>
            /** @type {any} */ (window).kpRgba(getComputedStyle(document.documentElement).getPropertyValue('--primary')),
        );
        const blocks = ['bar', 'dropdown', 'mega-menu', 'bar-collapsed', 'bar-long', 'bar-search', 'bar-sticky', 'app-shell'];
        const selector = blocks.map((b) => `#${b} :is(.kp-nav__link, .kp-nav__search-trigger, .kp-nav__menu a)`).join(', ');
        const items = page.locator(selector);
        const faults = [];
        await page.mouse.move(0, 0);
        for (let i = 0; i < (await items.count()); i++) {
            const item = items.nth(i);
            if (!(await item.isVisible())) continue;
            const read = () =>
                item.evaluate((el) => {
                    const w = /** @type {any} */ (window);
                    return {
                        label: `${el.closest('section')?.id} ${el.textContent?.trim()}`,
                        ink: w.kpRgba(getComputedStyle(el).color),
                        ground: w.kpGround(el),
                    };
                });
            const rest = await read();
            await item.hover({ force: true });
            const hover = await read();
            await page.mouse.move(0, 0);
            for (const [state, s] of [
                ['rest', rest],
                ['hover', hover],
            ]) {
                const ink = rgb(s.ink);
                if (distance(ink, rgb(primary)) < 10) faults.push(`${rest.label} ${state}: in the primary`);
                if (contrast(ink, s.ground) < 4.5) faults.push(`${rest.label} ${state}: ${contrast(ink, s.ground).toFixed(2)}:1`);
            }
        }
        expect(faults).toEqual([]);

        // The bar link at rest and under the pointer are two inks, not one.
        const link = page.locator('#bar .kp-nav__link:not([aria-current])').first();
        const ink = () => link.evaluate((el) => /** @type {any} */ (window).kpRgba(getComputedStyle(el).color));
        const before = await ink();
        await link.hover();
        await expect.poll(async () => distance(rgb(await ink()), rgb(before)), 'the hovered link differs from the resting one').toBeGreaterThan(20);
    });
});

test.describe('high-contrast: the hover takes the border colour [button#variants]', { tag: ['@theme:high-contrast', '@component:button'] }, () => {
    test("every variant's hover ground is its own border colour, readable, with the inset bars on Cancel, Save changes and Delete account alone [scope-93]", async ({
        page,
    }) => {
        // Before: every variant but the mirror hovered to rgb(0, 0, 0) — the
        // primary under a rgb(0, 51, 153) border, the destructive under
        // rgb(163, 0, 0) — each with a white inset bar down both sides.
        await open(page, '/catalogue/button.html', 'high-contrast');
        const buttons = page.locator('#variants .cat-stage').first().locator('.kp-button');
        const faults = [];
        for (let i = 0; i < (await buttons.count()); i++) {
            const button = buttons.nth(i);
            await button.hover();
            const read = await button.evaluate((el) => {
                const w = /** @type {any} */ (window);
                const cs = getComputedStyle(el);
                return {
                    label: el.textContent?.trim(),
                    bars: ['kp-button--ghost', 'kp-button--primary', 'kp-button--destructive'].some((c) => el.classList.contains(c)),
                    ground: w.kpRgba(cs.backgroundColor),
                    border: w.kpRgba(cs.borderTopColor),
                    ink: w.kpRgba(cs.color),
                    insetBars: /inset/.test(cs.boxShadow),
                };
            });
            if (read.ground[3] < 1 || distance(rgb(read.ground), rgb(read.border)) > 0.5)
                faults.push(
                    `${read.label}: hover ground ${read.ground.map((v) => Math.round(v * 255))} against border ${read.border.map((v) => Math.round(v * 255))}`,
                );
            if (contrast(rgb(read.ink), rgb(read.ground)) < 4.5)
                faults.push(`${read.label}: ink ${contrast(rgb(read.ink), rgb(read.ground)).toFixed(2)}:1 on hover`);
            if (read.insetBars !== read.bars) faults.push(`${read.label}: inset bars ${read.insetBars ? 'drawn' : 'missing'}`);
        }
        await page.mouse.move(0, 0);
        expect(faults).toEqual([]);
    });

    test('a pressed primary and destructive button keep their ink readable', async ({ page }) => {
        // Before: both pressed to the secondary grey rgb(214, 214, 214) under
        // their white ink, 1.45:1.
        await open(page, '/catalogue/button.html', 'high-contrast');
        for (const variant of ['primary', 'destructive']) {
            const button = page.locator(`#variants .cat-stage .kp-button--${variant}`).first();
            await button.hover();
            await page.mouse.down();
            const read = await button.evaluate((el) => {
                const w = /** @type {any} */ (window);
                return { ground: w.kpRgba(getComputedStyle(el).backgroundColor), ink: w.kpRgba(getComputedStyle(el).color) };
            });
            await page.mouse.up();
            expect(contrast(rgb(read.ink), rgb(read.ground)), `${variant} pressed`).toBeGreaterThanOrEqual(4.5);
        }
    });
});
