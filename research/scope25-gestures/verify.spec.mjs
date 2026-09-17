// Verifies research/scope25-gestures/demo.html in firefox: no console errors
// in any of the three themes; sepia's press stains the paper around the press
// point without moving the label; sepia's rule is thicker in the middle than
// at its ends and has no seam at devicePixelRatio 2.222; in shade-light and
// shade-dark the shadow of a card changes sign as the pointer crosses it,
// while CURRENT does not follow; reduced motion turns the tracking off; and
// the text in the pressed and lit states keeps a contrast of 4.5 or more,
// read from rendered pixels. See playwright.config.mjs beside it.

import process from 'node:process';
import { expect, test } from '@playwright/test';

const DEMO = '/research/scope25-gestures/demo.html';

/** @param {import('@playwright/test').Page} page */
async function open(page) {
    /** @type {string[]} */
    const errors = [];
    page.on('console', (message) => {
        if (message.type() === 'error') errors.push(message.text());
    });
    page.on('pageerror', (error) => errors.push(String(error)));
    await page.goto(DEMO);
    await page.waitForFunction(() => document.documentElement.getAttribute('data-theme') === 'sepia');
    await page.evaluate(() => document.fonts.ready);
    return errors;
}

/** @param {import('@playwright/test').Page} page @param {string} theme */
async function theme(page, theme) {
    await page.locator(`main > .sg-switcher [data-sg-theme="${theme}"]`).click();
    await page.waitForFunction((t) => document.documentElement.getAttribute('data-theme') === t, theme);
    await page.waitForTimeout(300);
}

/**
 * Decodes a PNG in the page and hands back a luminance reader.
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
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = /** @type {CanvasRenderingContext2D} */ (canvas.getContext('2d', { willReadFrequently: true }));
        ctx.drawImage(image, 0, 0);
        return { width: image.width, height: image.height, rgb: [...ctx.getImageData(0, 0, image.width, image.height).data] };
    }, png.toString('base64'));
}

const linear = (c) => {
    const v = c / 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};
const luminance = (r, g, b) => 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

/** The computed colour of an element as 0..255 sRGB channels. */
async function colourOf(locator) {
    return locator.evaluate((el) => {
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = 1;
        const ctx = /** @type {CanvasRenderingContext2D} */ (canvas.getContext('2d'));
        ctx.fillStyle = getComputedStyle(el).color;
        ctx.fillRect(0, 0, 1, 1);
        return [...ctx.getImageData(0, 0, 1, 1).data].slice(0, 3);
    });
}

/**
 * The lowest contrast between an element's text colour and any pixel of the
 * ground behind it: the text is made transparent, the box is captured, and
 * every pixel is compared with the text colour.
 */
async function worstContrast(page, locator) {
    const [r, g, b] = await colourOf(locator);
    const text = luminance(r, g, b);
    await locator.evaluate((el) => el.style.setProperty('color', 'transparent', 'important'));
    const shot = await pixels(page, await locator.screenshot({ animations: 'disabled' }));
    await locator.evaluate((el) => el.style.removeProperty('color'));
    let worst = Infinity;
    let at = [];
    for (let i = 0; i < shot.rgb.length; i += 4) {
        const value = ratio(text, luminance(shot.rgb[i], shot.rgb[i + 1], shot.rgb[i + 2]));
        if (value < worst) [worst, at] = [value, shot.rgb.slice(i, i + 3)];
    }
    if (process.env.SG_DEBUG) console.log('text', [r, g, b], 'worst ground', at, worst.toFixed(2));
    return worst;
}

test('opens with no console errors in sepia, shade-light and shade-dark', async ({ page }) => {
    const errors = await open(page);
    for (const t of ['shade-light', 'shade-dark', 'sepia']) {
        await theme(page, t);
        await page.mouse.move(600, 400);
        await page.waitForTimeout(200);
    }
    expect(errors).toEqual([]);
});

test('sepia: a press stains the paper around the press point and the label does not move', async ({ page }) => {
    await open(page);
    const button = page.locator('[data-sg-press] .kp-button--primary');
    await button.scrollIntoViewIfNeeded();
    const label = button.locator('.kp-button__label');
    const box = /** @type {{ x: number, y: number, width: number, height: number }} */ (await button.boundingBox());
    const before = { button: box, label: await label.boundingBox() };
    const at = { x: box.x + 24, y: box.y + box.height / 2 };
    // The paper just above the button, over the press point: outside the button.
    const clip = { x: at.x - 14, y: box.y - 10, width: 28, height: 8 };
    const mean = async () => {
        const shot = await pixels(page, await page.screenshot({ clip }));
        let sum = 0;
        for (let i = 0; i < shot.rgb.length; i += 4) sum += luminance(shot.rgb[i], shot.rgb[i + 1], shot.rgb[i + 2]);
        return sum / (shot.rgb.length / 4);
    };
    await page.mouse.move(box.x + box.width + 200, box.y + box.height + 120);
    await page.waitForTimeout(1200);
    const rest = await mean();
    await page.mouse.move(at.x, at.y);
    await page.mouse.down();
    await page.waitForTimeout(600);
    const pressed = await mean();
    const during = { button: await button.boundingBox(), label: await label.boundingBox() };
    await page.mouse.up();
    expect(pressed, `paper above the press point darkens: ${rest.toFixed(4)} -> ${pressed.toFixed(4)}`).toBeLessThan(rest * 0.93);
    expect(during.label).toEqual(before.label);
    expect(during.button).toEqual(before.button);
    // The CURRENT panel's paper does not stain.
    const current = page.locator('.sg-current .kp-button--primary').first();
    const cbox = /** @type {{ x: number, y: number, width: number, height: number }} */ (await current.boundingBox());
    const cclip = { x: cbox.x + 10, y: cbox.y - 10, width: 28, height: 8 };
    const cRest = await pixels(page, await page.screenshot({ clip: cclip }));
    await page.mouse.move(cbox.x + 24, cbox.y + cbox.height / 2);
    await page.mouse.down();
    await page.waitForTimeout(600);
    const cDown = await pixels(page, await page.screenshot({ clip: cclip }));
    await page.mouse.up();
    expect(cDown.rgb).toEqual(cRest.rgb);
});

test('sepia: reduced motion shows the stain at its full size at once, and none at rest', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page);
    const button = page.locator('[data-sg-press] .kp-button').nth(1);
    await button.scrollIntoViewIfNeeded();
    const read = () => button.evaluate((el) => getComputedStyle(el, '::after').getPropertyValue('--kp-ink-spread').trim());
    expect(await read()).toBe('0');
    const box = /** @type {{ x: number, y: number, width: number, height: number }} */ (await button.boundingBox());
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.waitForTimeout(50);
    expect(await read()).toBe('1');
    await page.mouse.up();
    await page.waitForTimeout(50);
    expect(await read()).toBe('0');
});

for (const width of [1280, 997]) {
    test(`sepia: the rule is thicker in the middle than at its ends, with no seam, at devicePixelRatio 2.222, ${width}px wide`, async ({
        playwright,
    }) => {
        const dpr = 2.222;
        const browser = await playwright.firefox.launch({ firefoxUserPrefs: { 'layout.css.devPixelsPerPx': String(dpr) } });
        try {
            const context = await browser.newContext({
                baseURL: test.info().project.use.baseURL,
                deviceScaleFactor: dpr,
                viewport: { width, height: 900 },
            });
            const page = await context.newPage();
            await open(page);
            expect(await page.evaluate(() => devicePixelRatio)).toBeCloseTo(dpr, 2);
            const report = [];
            for (const [name, selector] of [
                ['divider', '[data-sg-rule="divider"]'],
                ['heading rule', '#rule .sg-proposed h2[data-kp-reveal="rule"]'],
            ]) {
                const locator = page.locator(selector);
                await locator.scrollIntoViewIfNeeded();
                await page.waitForTimeout(1200);
                let clip = /** @type {{ x: number, y: number, width: number, height: number }} */ (await locator.boundingBox());
                if (name === 'heading rule') {
                    // The ::after sits under the heading text, 6rem wide.
                    const r = await locator.evaluate((el) => {
                        const s = getComputedStyle(el, '::after');
                        return { w: parseFloat(s.inlineSize), h: parseFloat(s.blockSize) };
                    });
                    clip = { x: clip.x, y: clip.y + clip.height - r.h - 1, width: r.w, height: r.h + 2 };
                }
                const shot = await pixels(page, await page.screenshot({ clip, scale: 'device', animations: 'disabled' }));
                // Ink per column: how much darker than the paper each pixel
                // is, summed down the column, in device pixels of full ink.
                let paper = 0;
                for (let i = 0; i < shot.rgb.length; i += 4) paper = Math.max(paper, luminance(shot.rgb[i], shot.rgb[i + 1], shot.rgb[i + 2]));
                const ink = [];
                for (let x = 0; x < shot.width; x++) {
                    let sum = 0;
                    for (let y = 0; y < shot.height; y++) {
                        const i = (y * shot.width + x) * 4;
                        sum += Math.max(0, paper - luminance(shot.rgb[i], shot.rgb[i + 1], shot.rgb[i + 2])) / paper;
                    }
                    ink.push(sum);
                }
                const at = (f) => ink[Math.round(f * (shot.width - 1))];
                const middle = Math.max(...ink.slice(Math.round(shot.width * 0.45), Math.round(shot.width * 0.55)));
                const ends = Math.max(at(0.02), at(0.98));
                report.push(`${name}: middle ${middle.toFixed(2)}, ends ${at(0.02).toFixed(2)} and ${at(0.98).toFixed(2)} device px of ink`);
                expect(middle, `${name}: middle vs ends`).toBeGreaterThan(ends * 2.5);
                expect(Math.min(at(0.02), at(0.98)), `${name}: the ends are still drawn`).toBeGreaterThan(0.2);
                // A seam: a column or two with much less ink than the columns
                // two to the left and two to the right.
                const seams = [];
                for (let x = 3; x < shot.width - 3; x++) {
                    const side = Math.min(ink[x - 2], ink[x + 2]);
                    if (side > 0.3 && ink[x] < 0.6 * side) seams.push(x);
                }
                expect(seams, `${name}: seams at ${seams.slice(0, 8).join(', ')}`).toEqual([]);
            }
            test.info().annotations.push({ type: 'rule', description: report.join('; ') });
            console.log(`[${width}px] ${report.join('; ')}`);
        } finally {
            await browser.close();
        }
    });
}

/** The x offset of the first shadow in a computed box-shadow, in px. */
const shadowX = (value) => {
    const lengths = value.replace(/(rgb|color|hsl)a?\([^)]*\)/g, '').match(/-?[\d.]+px/g) ?? [];
    return parseFloat(lengths[0] ?? 'NaN');
};

for (const t of ['shade-light', 'shade-dark']) {
    test(`${t}: the card's shadow falls away from the pointer and changes sign as it crosses; CURRENT stays put`, async ({ page }) => {
        await open(page);
        await theme(page, t);
        const card = page.locator('[data-sg-card="due"]');
        const current = page.locator('#light .sg-current .kp-card').first();
        await card.scrollIntoViewIfNeeded();
        const box = /** @type {{ x: number, y: number, width: number, height: number }} */ (await card.boundingBox());
        const y = box.y + box.height / 2;
        const read = async () => ({
            proposed: shadowX(await card.evaluate((el) => getComputedStyle(el).boxShadow)),
            current: await current.evaluate((el) => getComputedStyle(el).boxShadow + getComputedStyle(el).backgroundImage),
        });
        // Across the card, from just inside its left edge to just inside its right.
        await page.mouse.move(box.x + 6, y, { steps: 4 });
        await page.waitForTimeout(150);
        const left = await read();
        await page.mouse.move(box.x + box.width - 6, y, { steps: 12 });
        await page.waitForTimeout(150);
        const right = await read();
        expect(left.proposed, `pointer left of the card: shadow to the right`).toBeGreaterThan(0.5);
        expect(right.proposed, `pointer right of the card: shadow to the left`).toBeLessThan(-0.5);
        expect(right.current).toBe(left.current);
    });
}

test('reduced motion: the pointer is not tracked, the fixed top-left light stays', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page);
    for (const t of ['shade-light', 'shade-dark']) {
        await theme(page, t);
        const card = page.locator('[data-sg-card="due"]');
        await card.scrollIntoViewIfNeeded();
        const box = /** @type {{ x: number, y: number, width: number, height: number }} */ (await card.boundingBox());
        const read = () => card.evaluate((el) => ({ shadow: getComputedStyle(el).boxShadow, inline: el.style.getPropertyValue('--kp-light-x') }));
        await page.mouse.move(box.x + 6, box.y + box.height / 2);
        await page.waitForTimeout(150);
        const left = await read();
        await page.mouse.move(box.x + box.width - 6, box.y + box.height / 2, { steps: 8 });
        await page.waitForTimeout(150);
        const right = await read();
        expect(right, t).toEqual(left);
        expect(left.inline, `${t}: nothing written`).toBe('');
        expect(shadowX(left.shadow), `${t}: the light at the top left casts to the right`).toBeGreaterThan(0);
    }
});

test('contrast: the text keeps 4.5 or more in the held press (sepia) and the lit card (shade-light, shade-dark)', async ({ page }) => {
    await open(page);
    const found = [];
    await page.locator('.sg-hold').scrollIntoViewIfNeeded();
    for (const label of await page.locator('.sg-proposed.sg-hold .kp-button__label').all()) {
        const name = `sepia held "${(await label.textContent())?.trim()}"`;
        found.push([name, await worstContrast(page, label)]);
    }
    for (const t of ['shade-light', 'shade-dark']) {
        await theme(page, t);
        const over = page.locator('[data-sg-card="over"]');
        await over.scrollIntoViewIfNeeded();
        // The theme's colours ease in; read them once they have arrived.
        await page.waitForTimeout(1500);
        found.push([`${t} lit card body`, await worstContrast(page, over.locator('.kp-card__body p'))]);
        const shipped = page.locator('#light .sg-current .kp-card').first();
        await shipped.scrollIntoViewIfNeeded();
        found.push([`${t} CURRENT card body`, await worstContrast(page, shipped.locator('.kp-card__body p'))]);
        await over.scrollIntoViewIfNeeded();
        found.push([`${t} lit card title`, await worstContrast(page, over.locator('.kp-card__title'))]);
        // The plain button with the real pointer resting on it: lit, and hovered.
        const plain = page.locator('#light .sg-proposed .kp-row > .kp-button').first();
        await plain.scrollIntoViewIfNeeded();
        const pb = /** @type {{ x: number, y: number, width: number, height: number }} */ (await plain.boundingBox());
        await page.mouse.move(pb.x + pb.width / 2, pb.y + pb.height / 2, { steps: 3 });
        await page.waitForTimeout(400);
        found.push([`${t} lit, hovered plain button`, await worstContrast(page, plain.locator('.kp-button__label'))]);
        await page.mouse.move(2, 2);
    }
    const line = found.map(([name, value]) => `${name} ${value.toFixed(2)}`).join('; ');
    console.log(line);
    test.info().annotations.push({ type: 'contrast', description: line });
    for (const [name, value] of found) expect(value, name).toBeGreaterThanOrEqual(4.5);
});
