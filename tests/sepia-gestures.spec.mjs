// sepia's two gestures [scope-25, built at scope-101]: "the ink spreading
// into the paper on a press and the rule that is thickest in the middle".
//
// The approved concept demo is research/scope25-gestures/demo.html, blocks 1
// and 2, and it is implemented exactly (Kenny, 2026-09-08): these tests are
// the demo's own checks moved onto the package's concept page. What the demo
// draws and this suite holds:
//
//   - a press grows a brown stain from the point the pointer went down,
//     larger than the button, so the paper ABOVE the press point darkens
//     while the label and the button box stay where they were;
//   - the stain is at the press point and not merely at the button's centre:
//     the paper above the pressed end darkens more than the paper above the
//     far end;
//   - the label stays readable while the button is held: 7:1 or better on
//     the worst pixel of its ground (the demo measured 9.52 primary, 7.41
//     plain, 7.79 ghost);
//   - the rule under a heading and the section divider are one swelled
//     stroke, about 6 device pixels of ink in the middle against about 0.9
//     at the ends at devicePixelRatio 2.222, with no seam, at 1280 and
//     997 px wide;
//   - under reduced motion the stain is at its full size at once and eases
//     nowhere (DI7).
//
// Known costs Kenny accepted at scope-101 and this file re-measures: the
// stain reaches 12px past the button, so it can touch a neighbour closer
// than that, and the heading rule grows from 2px to 4px tall, which moves
// the text under a heading down 2px once, at rest.
//
// Drills [KT3], 2026-09-16 in firefox: every test here was written and run
// BEFORE the register and js/effects.js carried the gestures, and each was
// red on the assertion it names — the paper did not darken (no ::after at
// all), the held contrast read the plain plate, the rule measured a flat
// 2.2 device px across its whole width with ends equal to its middle, and
// `--kp-ink-spread` read '' instead of '0'/'1'. Restored green after.

import { expect, test } from '@playwright/test';

const PAGE = '/examples/concept-sepia.html';

/** The three buttons of the hero row, in the demo's own order. */
const BUTTONS = [
    ['primary', '.kp-button--primary'],
    ['plain', '.kp-button:not([class*="kp-button--"])'],
    ['ghost', '.kp-button--ghost'],
];

/**
 * @param {import('@playwright/test').Page} page
 */
async function open(page, { reduced = false } = {}) {
    await page.emulateMedia({ reducedMotion: reduced ? 'reduce' : 'no-preference' });
    await page.addInitScript(() => {
        try {
            localStorage.setItem('theme', 'sepia');
        } catch {
            // no storage: the page keeps its served theme
        }
    });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(PAGE);
    await page.waitForFunction(() => document.documentElement.getAttribute('data-theme') === 'sepia');
    await page.evaluate(() => document.fonts.ready);
}

/**
 * Decodes a PNG inside the page and hands back its pixels.
 *
 * @param {import('@playwright/test').Page} page
 * @param {Buffer} png
 * @returns {Promise<{ width: number, height: number, rgb: number[] }>}
 */
async function pixels(page, png) {
    return page.evaluate(async (src) => {
        const image = new Image();
        image.src = `data:image/png;base64,${src}`;
        await image.decode();
        const canvas = document.createElement('canvas');
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const ctx = /** @type {CanvasRenderingContext2D} */ (canvas.getContext('2d', { willReadFrequently: true }));
        ctx.drawImage(image, 0, 0);
        return { width: canvas.width, height: canvas.height, rgb: [...ctx.getImageData(0, 0, canvas.width, canvas.height).data] };
    }, png.toString('base64'));
}

const linear = (/** @type {number} */ c) => {
    const v = c / 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};
const luminance = (/** @type {number} */ r, /** @type {number} */ g, /** @type {number} */ b) =>
    0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
const ratio = (/** @type {number} */ a, /** @type {number} */ b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

/** The computed text colour of an element as 0..255 sRGB channels. */
const colourOf = (/** @type {import('@playwright/test').Locator} */ locator) =>
    locator.evaluate((el) => {
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = 1;
        const ctx = /** @type {CanvasRenderingContext2D} */ (canvas.getContext('2d'));
        ctx.fillStyle = getComputedStyle(el).color;
        ctx.fillRect(0, 0, 1, 1);
        return [...ctx.getImageData(0, 0, 1, 1).data].slice(0, 3);
    });

/**
 * The lowest contrast between an element's text colour and any pixel of the
 * ground behind it [KT13: the paint, not the declaration]: the text is made
 * transparent, the box is photographed, and every pixel is compared with the
 * colour the text would have had.
 *
 * @param {import('@playwright/test').Page} page
 * @param {import('@playwright/test').Locator} locator
 */
async function worstContrast(page, locator) {
    const [r, g, b] = await colourOf(locator);
    const text = luminance(r, g, b);
    await locator.evaluate((el) => /** @type {HTMLElement} */ (el).style.setProperty('color', 'transparent', 'important'));
    const shot = await pixels(page, await locator.screenshot({ animations: 'disabled' }));
    await locator.evaluate((el) => /** @type {HTMLElement} */ (el).style.removeProperty('color'));
    let worst = Infinity;
    for (let i = 0; i < shot.rgb.length; i += 4) worst = Math.min(worst, ratio(text, luminance(shot.rgb[i], shot.rgb[i + 1], shot.rgb[i + 2])));
    return worst;
}

/** The mean luminance of a clip of the page. */
async function meanLuminance(page, clip) {
    const shot = await pixels(page, await page.screenshot({ clip }));
    let sum = 0;
    for (let i = 0; i < shot.rgb.length; i += 4) sum += luminance(shot.rgb[i], shot.rgb[i + 1], shot.rgb[i + 2]);
    return sum / (shot.rgb.length / 4);
}

test.describe('sepia · the ink on a press [scope-25, scope-101]', { tag: ['@theme:sepia', '@component:button', '@component:page-effects'] }, () => {
    test('the paper above the press point darkens, at the point pressed, and no label moves', async ({ page }) => {
        await open(page);
        const button = page.locator('.kp-row:has(.kp-button--primary)').first().locator('.kp-button--primary');
        await button.scrollIntoViewIfNeeded();
        const label = button.locator('.kp-button__label');
        const box = /** @type {{ x: number, y: number, width: number, height: number }} */ (await button.boundingBox());
        const before = { button: box, label: await label.boundingBox() };
        const at = { x: box.x + 24, y: box.y + box.height / 2 };
        // Two strips of paper 10px above the button: one over the press
        // point, one over the far end of the same button.
        const near = { x: at.x - 14, y: box.y - 10, width: 28, height: 8 };
        const far = { x: box.x + box.width - 38, y: box.y - 10, width: 28, height: 8 };

        await page.mouse.move(box.x + box.width + 240, box.y + box.height + 160);
        await page.waitForTimeout(1200);
        const rest = { near: await meanLuminance(page, near), far: await meanLuminance(page, far) };

        await page.mouse.move(at.x, at.y);
        await page.mouse.down();
        await page.waitForTimeout(600);
        const held = { near: await meanLuminance(page, near), far: await meanLuminance(page, far) };
        const during = { button: await button.boundingBox(), label: await label.boundingBox() };
        await page.mouse.up();

        const drop = (a, b) => (1 - b / a) * 100;
        console.log(
            `sepia press · paper above the press point ${rest.near.toFixed(4)} -> ${held.near.toFixed(4)} (${drop(rest.near, held.near).toFixed(1)}% darker); above the far end ${rest.far.toFixed(4)} -> ${held.far.toFixed(4)} (${drop(rest.far, held.far).toFixed(1)}%)`,
        );
        expect(held.near, `the paper above the press point darkens by more than 7%`).toBeLessThan(rest.near * 0.93);
        expect(drop(rest.near, held.near), `the stain is at the press point, not merely at the centre`).toBeGreaterThan(drop(rest.far, held.far) + 2);
        expect(during.label, 'the label does not move').toEqual(before.label);
        expect(during.button, 'the button does not move or resize').toEqual(before.button);
    });

    test('the label keeps 7:1 or better while the button is held', async ({ page }) => {
        await open(page);
        const row = page.locator('.kp-row:has(.kp-button--primary)').first();
        await row.scrollIntoViewIfNeeded();
        /** @type {Array<[string, number]>} */
        const found = [];
        for (const [name, selector] of BUTTONS) {
            const button = row.locator(selector).first();
            const box = /** @type {{ x: number, y: number, width: number, height: number }} */ (await button.boundingBox());
            await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
            await page.mouse.down();
            await page.waitForTimeout(600);
            found.push([name, await worstContrast(page, button.locator('.kp-button__label'))]);
            await page.mouse.up();
            await page.mouse.move(4, 4);
            await page.waitForTimeout(400);
        }
        console.log(`sepia press · held label contrast · ${found.map(([n, v]) => `${n} ${v.toFixed(2)}`).join(', ')}`);
        for (const [name, value] of found) expect(value, `${name}, held`).toBeGreaterThanOrEqual(7);
    });

    test('reduced motion puts the stain at its full size at once, and eases nowhere [DI7]', async ({ page }) => {
        await open(page, { reduced: true });
        const button = page.locator('.kp-row:has(.kp-button--primary)').first().locator('.kp-button:not([class*="kp-button--"])').first();
        await button.scrollIntoViewIfNeeded();
        const spread = () => button.evaluate((el) => getComputedStyle(el, '::after').getPropertyValue('--kp-ink-spread').trim());
        const eases = () => button.evaluate((el) => getComputedStyle(el, '::after').transitionDuration);
        expect(await spread(), 'no stain at rest').toBe('0');
        expect(await eases(), 'nothing eases under reduced motion').toMatch(/^0s(, 0s)*$/);
        const box = /** @type {{ x: number, y: number, width: number, height: number }} */ (await button.boundingBox());
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await page.mouse.down();
        await page.waitForTimeout(50);
        expect(await spread(), 'the full stain, within one frame of the press').toBe('1');
        await page.mouse.up();
        await page.waitForTimeout(50);
        expect(await spread(), 'gone again as soon as the press ends').toBe('0');
    });
});

// ── The swelled rule ────────────────────────────────────────────────────
// One stretched shape: 0.5px at the ends, 3px in the middle. Stretching a
// path sideways keeps its vertical profile, so the ends stay hairlines at
// every width and there is no tile edge to split at any device pixel ratio.

const RULES = [
    ['divider', '[data-kp-divider=""]'],
    ['heading rule', 'h2[data-kp-reveal="rule"]'],
];

for (const width of [1280, 997]) {
    test(
        `sepia · the rule is thickest in the middle, with no seam, at devicePixelRatio 2.222 and ${width}px wide [scope-25, scope-101]`,
        { tag: ['@theme:sepia', '@component:page-effects'] },
        async ({ playwright, browserName, baseURL }) => {
            test.skip(browserName !== 'firefox', 'layout.css.devPixelsPerPx is a Gecko preference');
            const dpr = 2.222;
            const browser = await playwright.firefox.launch({ firefoxUserPrefs: { 'layout.css.devPixelsPerPx': String(dpr) } });
            try {
                const context = await browser.newContext({ baseURL, deviceScaleFactor: dpr, viewport: { width, height: 900 } });
                await context.addInitScript(() => {
                    try {
                        localStorage.setItem('theme', 'sepia');
                    } catch {
                        // no storage: the page keeps its served theme
                    }
                });
                const page = await context.newPage();
                await page.goto(PAGE);
                await page.waitForFunction(() => document.documentElement.getAttribute('data-theme') === 'sepia');
                await page.evaluate(() => document.fonts.ready);
                expect(await page.evaluate(() => devicePixelRatio)).toBeCloseTo(dpr, 2);
                /** @type {string[]} */
                const report = [];
                for (const [name, selector] of RULES) {
                    const locator = page.locator(selector).first();
                    await locator.scrollIntoViewIfNeeded();
                    // The rule under a heading draws itself on scroll.
                    await page.waitForTimeout(1500);
                    let clip = /** @type {{ x: number, y: number, width: number, height: number }} */ (await locator.boundingBox());
                    if (name === 'heading rule') {
                        const r = await locator.evaluate((el) => {
                            const s = getComputedStyle(el, '::after');
                            return { w: parseFloat(s.inlineSize), h: parseFloat(s.blockSize) };
                        });
                        clip = { x: clip.x, y: clip.y + clip.height - r.h - 1, width: r.w, height: r.h + 2 };
                    }
                    const shot = await pixels(page, await page.screenshot({ clip, scale: 'device', animations: 'disabled' }));
                    // Ink per column: how much darker than the paper each
                    // pixel is, summed down the column, in device pixels of
                    // full ink.
                    let paper = 0;
                    for (let i = 0; i < shot.rgb.length; i += 4) paper = Math.max(paper, luminance(shot.rgb[i], shot.rgb[i + 1], shot.rgb[i + 2]));
                    /** @type {number[]} */
                    const ink = [];
                    for (let x = 0; x < shot.width; x++) {
                        let sum = 0;
                        for (let y = 0; y < shot.height; y++) {
                            const i = (y * shot.width + x) * 4;
                            sum += Math.max(0, paper - luminance(shot.rgb[i], shot.rgb[i + 1], shot.rgb[i + 2])) / paper;
                        }
                        ink.push(sum);
                    }
                    const at = (/** @type {number} */ f) => ink[Math.round(f * (shot.width - 1))];
                    const middle = Math.max(...ink.slice(Math.round(shot.width * 0.45), Math.round(shot.width * 0.55)));
                    const ends = Math.max(at(0.02), at(0.98));
                    report.push(`${name}: middle ${middle.toFixed(2)}, ends ${at(0.02).toFixed(2)} and ${at(0.98).toFixed(2)} device px of ink`);
                    expect(middle, `${name}: about 6 device px of ink in the middle`).toBeGreaterThan(4);
                    expect(middle, `${name}: middle against ends`).toBeGreaterThan(ends * 2.5);
                    expect(Math.min(at(0.02), at(0.98)), `${name}: the ends are still drawn`).toBeGreaterThan(0.2);
                    // A seam: a column with much less ink than the columns two
                    // to its left and two to its right.
                    /** @type {number[]} */
                    const seams = [];
                    for (let x = 3; x < shot.width - 3; x++) {
                        const side = Math.min(ink[x - 2], ink[x + 2]);
                        if (side > 0.3 && ink[x] < 0.6 * side) seams.push(x);
                    }
                    expect(seams, `${name}: seams at ${seams.slice(0, 8).join(', ')}`).toEqual([]);
                }
                console.log(`sepia rule · ${width}px @${dpr} · ${report.join('; ')}`);
            } finally {
                await browser.close();
            }
        },
    );
}
