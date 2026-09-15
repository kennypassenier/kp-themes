// The pointer is the light, in the shade pair [scope-101, from scope-25].
//
// Kenny's sentence, verbatim: "the pointer is the light, and the light half
// throws its shade away from it while the dark half is lifted out of shade
// by it". Built from research/scope25-gestures/demo.html, which he approved
// on 2026-09-16, and this file is that demo's own verify.spec.mjs moved onto
// the package's concept pages.
//
// What it holds:
//   - moving the pointer across a card flips the sign of its shadow's x
//     offset, in both halves of the pair;
//   - under reduced motion, and after a Tab, nothing is written and the
//     fixed top-left light of scope-12 is what paints;
//   - the card's body text under shade-dark's brightest patch keeps 4.5 or
//     more, read from rendered pixels rather than from a token pair;
//   - a card carries a shadow at rest, which the approved concept demo left
//     flat and Kenny changed at scope-101;
//   - shade-light's three muted pairs clear 4.5:1, the token change of the
//     same decision.
//
// Drills [KT3], performed 2026-09-16 in firefox (each red on the test it
// names, then restored green):
//   - `--kp-light: pointer` removed from css/shade-light-register.css and
//     css/shade-dark-register.css → the module lights nothing and the
//     shadow never changes sign, red on "flips the sign" in both themes;
//   - the `clear(el)` in `pointerLight()`'s reduced-motion branch
//     (js/effects.js) replaced by a plain `return` → the light kept
//     following after a Tab, red on "a Tab puts the light out";
//   - the card's `box-shadow` rule removed from the shade-light register →
//     red on "a card carries a shadow at rest", on "flips the sign" and on
//     "a Tab puts the light out", all three reading 0;
//   - shade-dark's card patch put back to the 9% the research demo
//     measured before it was cut → red on "keeps 4.5 under the patch", at
//     4.4996 here against the demo's own 4.37. That is the measurement
//     which decided 6%, and 6% measures 4.71 against a 5.12 at rest.

import process from 'node:process';
import { expect, test } from '@playwright/test';

/** The two halves, and the concept page each is read on. */
const PAIR = [
    ['shade-light', '/examples/concept-shade-light.html'],
    ['shade-dark', '/examples/concept-shade-dark.html'],
];

/**
 * @param {import('@playwright/test').Page} page
 * @param {string} theme
 * @param {string} url
 * @param {{ reduced?: boolean }} [options]
 */
async function open(page, theme, url, { reduced = false } = {}) {
    await page.emulateMedia({ reducedMotion: reduced ? 'reduce' : 'no-preference' });
    await page.addInitScript((name) => {
        try {
            localStorage.setItem('theme', name);
        } catch {
            // no storage: the page keeps its served theme
        }
    }, theme);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(url);
    await page.waitForFunction((t) => document.documentElement.getAttribute('data-theme') === t, theme);
    await expect(page.locator('[data-kp-surface="app"]').first()).toBeVisible();
}

/** The x offset of the first shadow in a computed box-shadow, in px. */
const shadowX = (/** @type {string} */ value) => {
    const lengths = value.replace(/(rgb|color|hsl)a?\([^)]*\)/g, '').match(/-?[\d.]+px/g) ?? [];
    return parseFloat(lengths[0] ?? 'NaN');
};

const linear = (/** @type {number} */ c) => {
    const v = c / 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};
const luminance = (/** @type {number} */ r, /** @type {number} */ g, /** @type {number} */ b) =>
    0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
const ratio = (/** @type {number} */ a, /** @type {number} */ b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

/**
 * Decodes a PNG in the page and hands back its pixels.
 * @param {import('@playwright/test').Page} page @param {Buffer} png
 * @returns {Promise<{ width: number, height: number, rgb: number[] }>}
 */
async function pixels(page, png) {
    return page.evaluate(async (src) => {
        const image = await new Promise((resolve) => {
            const im = new Image();
            im.onload = () => resolve(im);
            im.src = `data:image/png;base64,${src}`;
        });
        const canvas = document.createElement('canvas');
        canvas.width = /** @type {HTMLImageElement} */ (image).width;
        canvas.height = /** @type {HTMLImageElement} */ (image).height;
        const ctx = /** @type {CanvasRenderingContext2D} */ (canvas.getContext('2d', { willReadFrequently: true }));
        ctx.drawImage(/** @type {HTMLImageElement} */ (image), 0, 0);
        return { width: canvas.width, height: canvas.height, rgb: [...ctx.getImageData(0, 0, canvas.width, canvas.height).data] };
    }, png.toString('base64'));
}

/** Any CSS colour, as 0..255 sRGB channels, resolved by the browser. */
const channels = (/** @type {import('@playwright/test').Page} */ page, /** @type {string} */ value) =>
    page.evaluate((v) => {
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = 1;
        const ctx = /** @type {CanvasRenderingContext2D} */ (canvas.getContext('2d'));
        ctx.fillStyle = v;
        ctx.fillRect(0, 0, 1, 1);
        return [...ctx.getImageData(0, 0, 1, 1).data].slice(0, 3);
    }, value);

/**
 * The lowest contrast between an element's text colour and any pixel of the
 * ground behind it [KT13: the paint, not the token]: the text is made
 * transparent, the box is captured, and every pixel is compared with it.
 * @param {import('@playwright/test').Page} page
 * @param {import('@playwright/test').Locator} locator
 */
async function worstContrast(page, locator) {
    const [r, g, b] = await channels(page, await locator.evaluate((el) => getComputedStyle(el).color));
    const text = luminance(r, g, b);
    await locator.evaluate((el) => /** @type {HTMLElement} */ (el).style.setProperty('color', 'transparent', 'important'));
    const shot = await pixels(page, await locator.screenshot({ animations: 'disabled' }));
    await locator.evaluate((el) => /** @type {HTMLElement} */ (el).style.removeProperty('color'));
    let worst = Infinity;
    for (let i = 0; i < shot.rgb.length; i += 4) worst = Math.min(worst, ratio(text, luminance(shot.rgb[i], shot.rgb[i + 1], shot.rgb[i + 2])));
    if (process.env.KP_DEBUG) console.log('worst under the text', worst.toFixed(2));
    return worst;
}

for (const [theme, url] of PAIR) {
    test.describe(`the pointer light, ${theme}`, { tag: [`@theme:${theme}`, '@component:page-effects', '@component:examples'] }, () => {
        test('the card’s shade falls away from the pointer and flips its sign as the pointer crosses it', async ({ page }) => {
            await open(page, theme, url);
            const card = page.locator('.kp-card').first();
            await card.scrollIntoViewIfNeeded();
            const box = /** @type {{ x: number, y: number, width: number, height: number }} */ (await card.boundingBox());
            const y = box.y + box.height / 2;
            const read = () => card.evaluate((el) => getComputedStyle(el).boxShadow);
            await page.mouse.move(box.x + 6, y, { steps: 4 });
            await page.waitForTimeout(200);
            const left = shadowX(await read());
            await page.mouse.move(box.x + box.width - 6, y, { steps: 12 });
            await page.waitForTimeout(200);
            const right = shadowX(await read());
            test.info().annotations.push({
                type: 'light',
                description: `${theme}: x ${left.toFixed(2)} from the left, ${right.toFixed(2)} from the right`,
            });
            expect(left, 'pointer at the left edge: the shade falls to the right').toBeGreaterThan(0.5);
            expect(right, 'pointer at the right edge: the shade falls to the left').toBeLessThan(-0.5);
        });

        test('a card carries a shadow at rest, at the fixed top-left light [scope-101]', async ({ page }) => {
            await open(page, theme, url);
            const card = page.locator('.kp-card').first();
            await card.scrollIntoViewIfNeeded();
            const shadow = await card.evaluate((el) => getComputedStyle(el).boxShadow);
            expect(shadow, 'the card is no longer flat').not.toBe('none');
            expect(shadowX(shadow), 'no pointer: the light is at the top left, so the shade falls right').toBeGreaterThan(0);
        });

        test('under reduced motion nothing is written and the fixed top-left light stays', async ({ page }) => {
            await open(page, theme, url, { reduced: true });
            const card = page.locator('.kp-card').first();
            await card.scrollIntoViewIfNeeded();
            const box = /** @type {{ x: number, y: number, width: number, height: number }} */ (await card.boundingBox());
            const read = () =>
                card.evaluate((el) => ({
                    shadow: getComputedStyle(el).boxShadow,
                    written: /** @type {HTMLElement} */ (el).style.getPropertyValue('--kp-light-x'),
                }));
            await page.mouse.move(box.x + 6, box.y + box.height / 2);
            await page.waitForTimeout(200);
            const left = await read();
            await page.mouse.move(box.x + box.width - 6, box.y + box.height / 2, { steps: 8 });
            await page.waitForTimeout(200);
            expect(await read(), 'the shade does not move').toEqual(left);
            expect(left.written, 'the module wrote nothing').toBe('');
            expect(shadowX(left.shadow), 'the light at the top left casts to the right').toBeGreaterThan(0);
        });

        test('a Tab puts the light out and gives the fixed one back', async ({ page }) => {
            await open(page, theme, url);
            const card = page.locator('.kp-card').first();
            await card.scrollIntoViewIfNeeded();
            const box = /** @type {{ x: number, y: number, width: number, height: number }} */ (await card.boundingBox());
            const written = () => card.evaluate((el) => /** @type {HTMLElement} */ (el).style.getPropertyValue('--kp-light-x'));
            await page.mouse.move(box.x + box.width - 6, box.y + box.height / 2, { steps: 4 });
            await page.waitForTimeout(200);
            expect(await written(), 'the pointer lit it').not.toBe('');
            await page.keyboard.press('Tab');
            await page.waitForTimeout(200);
            expect(await written(), 'a keyboard has no pointer').toBe('');
            expect(shadowX(await card.evaluate((el) => getComputedStyle(el).boxShadow))).toBeGreaterThan(0);
        });
    });
}

test.describe(
    'the pointer light, measured',
    { tag: ['@theme:shade-dark', '@theme:shade-light', '@component:page-effects', '@component:examples'] },
    () => {
        test('shade-dark: the card’s text keeps 4.5 or more under the brightest patch', async ({ page }) => {
            await open(page, 'shade-dark', '/examples/concept-shade-dark.html');
            const card = page.locator('.kp-card').first();
            await card.scrollIntoViewIfNeeded();
            const body = card.locator('.kp-card__body p:not(.microlabel)').last();
            const title = card.locator('.kp-card__title');
            // The pointer parked off the card: the rest reading the demo
            // measured at 5.12.
            await page.mouse.move(4, 4);
            await page.waitForTimeout(300);
            const rest = await worstContrast(page, body);
            // The pointer on the card's own centre: distance 0, so `near` is 1
            // and the 6% patch is at its full strength, centred under the text.
            const box = /** @type {{ x: number, y: number, width: number, height: number }} */ (await card.boundingBox());
            await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 8 });
            await page.waitForTimeout(400);
            const lit = await worstContrast(page, body);
            const litTitle = await worstContrast(page, title);
            const line = `body ${rest.toFixed(2)} at rest, ${lit.toFixed(2)} lit; title ${litTitle.toFixed(2)} lit`;
            console.log(`shade-dark card under the patch: ${line}`);
            test.info().annotations.push({ type: 'contrast', description: line });
            expect(lit, 'the lit body text').toBeGreaterThanOrEqual(4.5);
            expect(litTitle, 'the lit title').toBeGreaterThanOrEqual(4.5);
            expect(lit, 'the patch costs contrast, and the demo measured how much').toBeLessThan(rest);
        });

        test('shade-light: every muted pair clears 4.5 [scope-101, shade-light-contrast]', async ({ page }) => {
            await open(page, 'shade-light', '/examples/concept-shade-light.html');
            const token = (/** @type {string} */ name) =>
                page.evaluate((t) => getComputedStyle(document.documentElement).getPropertyValue(t).trim(), name);
            const ink = await channels(page, await token('--muted-foreground'));
            const body = await channels(page, await token('--foreground'));
            /** @type {[string, number, number][]} */
            const found = [];
            for (const ground of ['--muted', '--background', '--card']) {
                const on = await channels(page, await token(ground));
                const ground_ = luminance(on[0], on[1], on[2]);
                found.push([ground, ratio(luminance(ink[0], ink[1], ink[2]), ground_), ratio(luminance(body[0], body[1], body[2]), ground_)]);
            }
            const line = found.map(([g, muted, plain]) => `${g} ${muted.toFixed(2)} (body ${plain.toFixed(2)})`).join('; ');
            console.log(`shade-light muted: ${line}`);
            test.info().annotations.push({ type: 'contrast', description: line });
            for (const [ground, muted] of found) expect(muted, `muted-foreground on ${ground}`).toBeGreaterThanOrEqual(4.5);
        });
    },
);
