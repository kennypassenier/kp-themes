// Kenny's notes from the review of the dark themes, 2026-09-15, read where
// he read them (FireDragon, the catalogue).
//
// Four notes: dark's and titanium's buttons showed nothing when clicked
// (button.html#states, #variants); the readout above the button never
// appeared in either theme (page-effects.html#button-readout); synthwave's
// Try again on the failed data table had a frame nobody could see
// (table.html#datatable-states); and the two held-open tooltips on
// overlays.html#tooltip sat beside their triggers instead of under them.
// Each is a behaviour measured here, never a picture.
//
// Drilled per KT3 on 2026-09-15, in firefox, against the registers and the
// overlays page of 9a833da: seven of the nine tests went red, with the
// measured value beside each in its own "Before" line; the other two are
// guards on the fixes and say so.

import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';
import { waitForJudging } from './helpers/catalogue.mjs';
import { useEmptyRegister } from './helpers/empty-register.mjs';
import { contrast, distance } from '../gates/colour.mjs';

const THEME_NAMES = JSON.parse(readFileSync(new globalThis.URL('../themes/order.json', import.meta.url), 'utf8'));

/** A theme this file names, checked against the set so a removed theme fails loudly. @param {string} name */
const theme = (name) => {
    if (!THEME_NAMES.includes(name)) throw new Error(`${name} is not in themes/order.json`);
    return name;
};

/**
 * @param {import('@playwright/test').Page} page
 * @param {string} url
 * @param {string} name
 * @param {{ reducedMotion?: 'reduce' | 'no-preference', width?: number, height?: number }} [options]
 */
const openCatalogue = async (page, url, name, { reducedMotion = 'no-preference', width = 1280, height = 900 } = {}) => {
    await page.emulateMedia({ reducedMotion });
    await page.setViewportSize({ width, height });
    await useEmptyRegister(page.context());
    await page.goto(url);
    await waitForJudging(page);
    await wear(page, name);
};

/** @param {import('@playwright/test').Page} page @param {string} name */
const wear = async (page, name) => {
    // catalogue/deps.css imports every register, so the theme's rules are on
    // the page the moment the attribute is.
    await page.evaluate((n) => document.documentElement.setAttribute('data-theme', n), name);
    await expect.poll(() => page.evaluate(() => document.documentElement.getAttribute('data-theme'))).toBe(name);
};

/** Installs `window.kpRgb`: any CSS colour as [r, g, b], channels 0..1. @param {import('@playwright/test').Page} page */
const installRgb = (page) =>
    page.evaluate(() => {
        const ctx = /** @type {CanvasRenderingContext2D} */ (document.createElement('canvas').getContext('2d', { willReadFrequently: true }));
        /** @type {any} */ (window).kpRgb = (/** @type {string} */ css) => {
            ctx.clearRect(0, 0, 1, 1);
            ctx.fillStyle = '#000';
            ctx.fillStyle = css;
            ctx.fillRect(0, 0, 1, 1);
            const d = ctx.getImageData(0, 0, 1, 1).data;
            return [d[0] / 255, d[1] / 255, d[2] / 255];
        };
    });

/* ───────────────────────────── 1 · a press shows, in dark and titanium */

for (const name of [theme('dark'), theme('titanium')]) {
    test.describe(`${name}: a click is seen [Kenny's note, 2026-09-15]`, { tag: [`@theme:${name}`, '@component:button'] }, () => {
        test('every live button in Variants and States paints differently the moment it is pressed, and nothing in its row moves', async ({
            page,
        }) => {
            // Before: in dark the only change was the ground, easing over 220ms,
            // so read at the moment of the press it had moved 3.2 to 8.1 from
            // hover (OKLab distance) and Go back and Working… painted exactly
            // what hover painted; in titanium the grounds moved 0.4 to 2.9 —
            // the bare, secondary, ghost and mirror from rgb(55, 60, 67) towards
            // rgb(58, 63, 69) — with the same two unchanged.
            await openCatalogue(page, '/catalogue/button.html', name);
            await installRgb(page);
            const buttons = page.locator(':is(#variants, #states) .cat-stage .kp-button:not(:disabled)');
            const count = await buttons.count();
            expect(count).toBeGreaterThanOrEqual(9);
            const faults = [];
            for (let i = 0; i < count; i++) {
                const button = buttons.nth(i);
                await button.scrollIntoViewIfNeeded();
                const label = (await button.textContent())?.trim();
                // Everything a press is allowed to change, read at once: no
                // polling, because the fault was precisely a press that had not
                // arrived yet when the click was over.
                const read = () =>
                    button.evaluate((el) => {
                        const self = /** @type {HTMLElement} */ (el);
                        const s = getComputedStyle(self);
                        const before = getComputedStyle(self, '::before');
                        const after = getComputedStyle(self, '::after');
                        const inner = self.querySelector('.kp-button__label');
                        const edge = self.querySelector('.kp-button__edge');
                        return {
                            ground: /** @type {any} */ (window).kpRgb(s.backgroundColor),
                            paint: [
                                s.backgroundColor,
                                s.borderColor,
                                s.color,
                                s.boxShadow,
                                s.translate,
                                s.transform,
                                `${before.opacity} ${before.translate}`,
                                `${after.opacity} ${after.translate}`,
                                inner ? getComputedStyle(inner).scale : '',
                                edge ? getComputedStyle(edge).blockSize : '',
                            ].join(' | '),
                            // The layout box of the button (offsets ignore a translate)
                            // and the rects of everything beside it.
                            layout: [
                                `${self.offsetLeft},${self.offsetTop},${self.offsetWidth},${self.offsetHeight}`,
                                ...[...(self.parentElement?.children ?? [])]
                                    .filter((c) => c !== self)
                                    .map((c) => {
                                        const r = c.getBoundingClientRect();
                                        return `${r.x.toFixed(2)},${r.y.toFixed(2)},${r.width.toFixed(2)},${r.height.toFixed(2)}`;
                                    }),
                            ].join(' ; '),
                        };
                    });
                const box = await button.boundingBox();
                if (!box) continue;
                await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
                // Let hover finish: the press is compared with where hover left it.
                await expect
                    .poll(() => button.evaluate((el) => el.getAnimations({ subtree: true }).length), { message: `${label}: hover settles` })
                    .toBe(0);
                const hovered = await read();
                const clip = { x: box.x - 6, y: box.y - 6, width: box.width + 12, height: box.height + 12 };
                const hoveredPixels = await page.screenshot({ clip, animations: 'allow' });
                await page.mouse.down();
                const pressed = await read();
                const pressedPixels = await page.screenshot({ clip, animations: 'allow' });
                await page.mouse.up();
                await page.mouse.move(0, 0);
                if (pressed.paint === hovered.paint) faults.push(`${label}: pressed paints what hover painted (${pressed.paint})`);
                if (pressedPixels.equals(hoveredPixels)) faults.push(`${label}: not one pixel differs pressed from hovered`);
                if (pressed.layout !== hovered.layout) faults.push(`${label}: the row moved, ${hovered.layout} → ${pressed.layout}`);
                // The ground itself, where the press changes it, by more than a hair
                // (the States block's own rule: ten steps).
                const step = distance(hovered.ground, pressed.ground);
                if (hovered.paint.split(' | ')[0] !== pressed.paint.split(' | ')[0] && step < 10)
                    faults.push(`${label}: the pressed ground is ${step.toFixed(1)} from hover, under 10`);
            }
            expect(faults).toEqual([]);
        });

        test('with reduced motion the press still shows, and nothing runs on the way in or out', async ({ page }) => {
            // A guard, not the drill: green on 9a833da too, because without
            // motion there were no transitions to outrun. It holds that the fix
            // above did not buy its visibility with movement.
            await openCatalogue(page, '/catalogue/button.html', name, { reducedMotion: 'reduce' });
            const button = page.locator('#states .cat-stage .kp-button:not([class*="kp-button--"]):not(:disabled)').first();
            await button.scrollIntoViewIfNeeded();
            const paint = () =>
                button.evaluate((el) => {
                    const s = getComputedStyle(el);
                    return `${s.backgroundColor} | ${s.boxShadow} | ${s.translate} | ${getComputedStyle(el, '::before').translate}`;
                });
            const running = () =>
                button.evaluate((el) => [el, ...el.querySelectorAll('*')].flatMap((n) => n.getAnimations({ subtree: false })).length);
            await button.hover();
            await expect.poll(running).toBe(0);
            const hovered = await paint();
            await page.mouse.down();
            expect(await paint()).not.toBe(hovered);
            expect(await running()).toBe(0);
            await page.mouse.up();
            expect(await running()).toBe(0);
            await page.mouse.move(0, 0);
        });
    });
}

/* ───────────────────────────── 2 · the readout appears above the button */

/**
 * The pixels of a clip, once as painted and once with the element hidden.
 *
 * @param {import('@playwright/test').Page} page
 * @param {import('@playwright/test').Locator} element
 * @param {{ x: number, y: number, width: number, height: number }} clip
 */
const paintedBy = async (page, element, clip) => {
    const withIt = await page.screenshot({ clip, animations: 'disabled' });
    await element.evaluate((el) => /** @type {HTMLElement} */ (el).style.setProperty('visibility', 'hidden'));
    const without = await page.screenshot({ clip, animations: 'disabled' });
    await element.evaluate((el) => /** @type {HTMLElement} */ (el).style.removeProperty('visibility'));
    return !withIt.equals(without);
};

for (const name of [theme('dark'), theme('titanium')]) {
    test.describe(`${name}: the readout shows over the chamfer [Kenny's note, 2026-09-15]`, { tag: [`@theme:${name}`, '@component:button'] }, () => {
        test('hovered, the readout paints above the control; at rest it paints nothing', async ({ page }) => {
            // Before: at opacity 1 on hover and not one pixel painted, in both
            // themes and both engines — the chamfer's clip-path cut away
            // everything outside the button's box, the readout included.
            await openCatalogue(page, '/catalogue/page-effects.html', name, { reducedMotion: 'reduce' });
            const button = page.locator('#button-readout .cat-stage .kp-button').first();
            const readout = button.locator('.kp-button__readout');
            await button.scrollIntoViewIfNeeded();
            await page.mouse.move(0, 0);
            const box = /** @type {{ x: number, y: number, width: number, height: number }} */ (await button.boundingBox());
            const above = { x: box.x - 16, y: box.y - 28, width: box.width + 32, height: 28 };
            expect(await paintedBy(page, readout, above), 'at rest the readout paints nothing').toBe(false);
            await button.hover();
            await expect.poll(() => readout.evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
            expect(await paintedBy(page, readout, above), 'hovered, the readout paints above the control').toBe(true);
            await page.mouse.move(0, 0);
        });

        test('the room made for the readout shows nothing else: the focus ring the chamfer cuts away stays cut', async ({ page }) => {
            // A guard on the fix rather than the drill: the strip above the
            // control is an island, stopped short of the ring. Read with the
            // readout hidden, the strip must paint exactly what the plain
            // chamfer paints — measured on the first try with the seam at the
            // ring's own width, firefox left a hairline of the outline in it.
            await openCatalogue(page, '/catalogue/page-effects.html', name, { reducedMotion: 'reduce' });
            const button = page.locator('#button-readout .cat-stage .kp-button').first();
            const readout = button.locator('.kp-button__readout');
            await button.scrollIntoViewIfNeeded();
            await page.locator('#button-readout .cat-stage .kp-button').nth(1).focus();
            await page.keyboard.press('Shift+Tab');
            await expect.poll(() => button.evaluate((el) => el.matches(':focus-visible'))).toBe(true);
            await page.mouse.move(0, 0);
            const box = /** @type {{ x: number, y: number, width: number, height: number }} */ (await button.boundingBox());
            const above = { x: box.x - 16, y: box.y - 28, width: box.width + 32, height: 28 };
            await readout.evaluate((el) => /** @type {HTMLElement} */ (el).style.setProperty('visibility', 'hidden'));
            const island = await page.screenshot({ clip: above, animations: 'disabled' });
            // The plain chamfer: the same polygon without the island, which is
            // what a button without a readout wears.
            await button.evaluate((el) => {
                const plain = document.createElement('button');
                plain.className = el.className;
                el.after(plain);
                /** @type {HTMLElement} */ (el).style.setProperty('clip-path', getComputedStyle(plain).clipPath);
                plain.remove();
            });
            const plain = await page.screenshot({ clip: above, animations: 'disabled' });
            await button.evaluate((el) => /** @type {HTMLElement} */ (el).style.removeProperty('clip-path'));
            await readout.evaluate((el) => /** @type {HTMLElement} */ (el).style.removeProperty('visibility'));
            expect(island.equals(plain)).toBe(true);
        });
    });
}

/* ───────────────────────────── 3 · synthwave's Try again keeps its frame */

test.describe(
    "synthwave: a framed button on the destructive plate [Kenny's note, 2026-09-15]",
    { tag: [`@theme:${theme('synthwave')}`, '@component:datatable', '@component:button'] },
    () => {
        test("the frame of every framed button on a destructive alert is the alert label's own ink, at least 3:1 on the plate", async ({ page }) => {
            // Before: the frame was the primary pink, rgb(255, 71, 130), on the red
            // plate rgb(254, 67, 80): 1.06:1, on both Try again buttons of the page
            // (#datatable-states and #empty). The label reads 5.59:1 there.
            await openCatalogue(page, '/catalogue/table.html', 'synthwave', { reducedMotion: 'reduce' });
            await installRgb(page);
            const read = await page.evaluate(() => {
                const rgb = /** @type {any} */ (window).kpRgb;
                return [...document.querySelectorAll('.cat-stage .kp-alert--destructive')]
                    .filter((alert) => alert.getBoundingClientRect().height > 0)
                    .flatMap((alert) =>
                        [...alert.querySelectorAll('.kp-button:not(.kp-button--ghost)')].map((b) => ({
                            block: b.closest('.cat-block')?.id,
                            text: b.textContent?.trim(),
                            frame: rgb(getComputedStyle(b).borderTopColor),
                            label: rgb(getComputedStyle(/** @type {Element} */ (alert.querySelector('.kp-alert__label'))).color),
                            plate: rgb(getComputedStyle(alert).backgroundColor),
                        })),
                    );
            });
            expect(read.map((r) => r.block).sort()).toEqual(['datatable-states', 'empty']);
            for (const r of read) {
                expect(r.frame, `${r.block} ${r.text}: the frame is the label's ink`).toEqual(r.label);
                expect(contrast(r.frame, r.plate), `${r.block} ${r.text}: frame on plate`).toBeGreaterThanOrEqual(3);
            }
        });
    },
);

/* ───────────────────────────── 4 · the held-open tooltips drop down */

test.describe(
    "every theme: a tooltip on the overlays page sits under its trigger [Kenny's phantom note, 2026-09-15]",
    { tag: ['@sweep', '@component:overlays', '@component:catalogue'] },
    () => {
        for (const [width, height] of [
            [1920, 1000],
            [1400, 900],
        ]) {
            test(`all four tooltips of #tooltip open under their trigger's start edge, at ${width}×${height}`, async ({ page }) => {
                // Twenty-two themes, two of them hovered open and closed each time.
                test.setTimeout(120_000);
                // Before: the two held open (data-kp-tooltip-owner="catalogue", so
                // js/overlays.js leaves them alone) had no anchor-name and no
                // position-anchor, and position-area fell back to the static
                // position: top level with the trigger's top (-32px from its bottom)
                // and 0px after its end, in every one of the 22 themes, both sizes,
                // both engines. The two live ones were right: 4px under, start-aligned.
                await openCatalogue(page, '/catalogue/overlays.html', theme('phantom'), { reducedMotion: 'reduce', width, height });
                const anchors = page.locator('#tooltip .kp-tooltip-anchor');
                await expect(anchors).toHaveCount(4);
                await page.locator('#tooltip').scrollIntoViewIfNeeded();
                const place = (/** @type {number} */ i) =>
                    anchors.nth(i).evaluate((a) => {
                        const trigger = /** @type {Element} */ (a.firstElementChild).getBoundingClientRect();
                        const tip = /** @type {HTMLElement} */ (a.querySelector('.kp-tooltip'));
                        const r = tip.getBoundingClientRect();
                        // How far under the trigger's bottom it starts, and how far its start
                        // edge sits from the trigger's middle (a theme may offset a tooltip a
                        // little, as sepia does by 13px; beside the trigger is past the middle).
                        return tip.hidden
                            ? 'hidden'
                            : `under ${Math.round(r.top - trigger.bottom)}, start ${Math.round(r.left - trigger.left)}, past the middle ${Math.round(r.left - (trigger.left + trigger.width / 2))}`;
                    });
                const misplaced = [];
                for (const name of THEME_NAMES) {
                    await wear(page, name);
                    for (let i = 0; i < 4; i++) {
                        const trigger = anchors.nth(i).locator('.kp-button');
                        // The live two open on a hover, after a moment; then Escape and away.
                        if (i >= 2) await trigger.hover();
                        await expect.poll(() => place(i), { message: `${name} #${i} opens` }).not.toBe('hidden');
                        const where = await place(i);
                        const [, under, , past] = /** @type {RegExpMatchArray} */ (
                            where.match(/under (-?\d+), start (-?\d+), past the middle (-?\d+)/)
                        ).map(Number);
                        if (under < 0 || under > 12 || past >= 0) misplaced.push(`${name} #${i}: ${where}`);
                        if (i >= 2) {
                            await page.mouse.move(0, 0);
                            await expect.poll(() => place(i)).toBe('hidden');
                        }
                    }
                }
                expect(misplaced).toEqual([]);
            });
        }
    },
);
