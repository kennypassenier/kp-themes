// Verifies research/cyberpunk-dividers/demo.html in firefox: no console
// errors; every option's two dividers have height, span their stage and do
// not overflow it sideways, wide and narrow; motion only where the option
// says so and none under reduced motion; and at devicePixelRatio 2.222 no
// seam, read from rendered device pixels. See playwright.config.mjs beside it.

import { expect, test } from '@playwright/test';

const DEMO = '/research/cyberpunk-dividers/demo.html';
const OPTIONS = ['hazard', 'circuit', 'stream', 'glitch', 'hud', 'ruler'];
const MOVING = ['circuit', 'stream', 'glitch'];
const DIVIDERS = ['[data-kp-divider]:not([data-kp-divider="alt"])', '[data-kp-divider="alt"]'];

/** @param {import('@playwright/test').Page} page */
async function open(page) {
    /** @type {string[]} */
    const errors = [];
    page.on('console', (message) => {
        if (message.type() === 'error') errors.push(message.text());
    });
    page.on('pageerror', (error) => errors.push(String(error)));
    await page.goto(DEMO);
    await page.waitForFunction(() => document.documentElement.getAttribute('data-theme') === 'cyberpunk');
    await page.evaluate(() => document.fonts.ready);
    return errors;
}

test('opens in cyberpunk with no console errors', async ({ page }) => {
    const errors = await open(page);
    await page.waitForTimeout(500);
    expect(errors).toEqual([]);
});

for (const width of [1024, 360]) {
    test(`every option's two dividers have height, span the stage and do not overflow sideways, ${width}px wide`, async ({ page }) => {
        await page.setViewportSize({ width, height: 800 });
        await open(page);
        const rows = await page.evaluate(
            ({ options, dividers }) =>
                options.flatMap((id) =>
                    dividers.map((selector) => {
                        const stage = /** @type {HTMLElement} */ (document.querySelector(`#${id} .cat-stage`));
                        const el = /** @type {HTMLElement} */ (stage.querySelector(`.cd-${id} ${selector}`));
                        const box = el.getBoundingClientRect();
                        const parent = /** @type {HTMLElement} */ (el.parentElement).getBoundingClientRect();
                        return {
                            id,
                            selector,
                            height: box.height,
                            span: Math.abs(box.width - parent.width),
                            own: el.scrollWidth - el.clientWidth,
                            stage: stage.scrollWidth - stage.clientWidth,
                            painted: getComputedStyle(el, '::before').content !== 'none',
                        };
                    }),
                ),
            { options: OPTIONS, dividers: DIVIDERS },
        );
        expect(rows).toHaveLength(12);
        for (const row of rows) {
            const at = `${row.id} ${row.selector}`;
            expect(row.height, `${at}: height`).toBeGreaterThan(20);
            expect(row.span, `${at}: spans its parent`).toBeLessThan(0.5);
            expect(row.own, `${at}: own horizontal overflow`).toBeLessThanOrEqual(0);
            expect(row.stage, `${at}: stage horizontal overflow`).toBeLessThanOrEqual(0);
            expect(row.painted, `${at}: the option paints`).toBe(true);
        }
    });
}

test('motion: only circuit, stream and glitch move, and nothing moves under reduced motion', async ({ page }) => {
    const count = () =>
        page.evaluate((options) => {
            /** @type {Record<string, number>} */
            const out = {};
            for (const id of options) {
                const stage = /** @type {HTMLElement} */ (document.querySelector(`#${id} .cat-stage`));
                out[id] = [...stage.querySelectorAll('[data-kp-divider]')].reduce((n, el) => n + el.getAnimations({ subtree: true }).length, 0);
            }
            return out;
        }, OPTIONS);
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await open(page);
    const moving = await count();
    for (const id of OPTIONS) {
        if (MOVING.includes(id)) expect(moving[id], `${id} moves`).toBeGreaterThan(0);
        else expect(moving[id], `${id} is static`).toBe(0);
    }
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForTimeout(100);
    const still = await count();
    for (const id of OPTIONS) expect(still[id], `${id} under reduced motion`).toBe(0);
});

test('only cyberpunk: in synthwave and nostromo each option wrapper paints exactly what the theme paints without it', async ({ page }) => {
    await open(page);
    // A copy of one wrapper with the option classes taken off: the theme's
    // own divider, the reference every option wrapper must equal.
    await page.evaluate(() => {
        const copy = /** @type {HTMLElement} */ (document.querySelector('#scope .cd-opt').cloneNode(true));
        copy.className = '';
        copy.id = 'cd-reference';
        document.querySelector('#scope .cd-scope-grid')?.append(copy);
    });
    for (const theme of ['synthwave', 'nostromo']) {
        await page.click(`[data-cd-theme="${theme}"]`);
        await page.waitForFunction((t) => document.documentElement.getAttribute('data-theme') === t, theme);
        await page.waitForTimeout(300);
        const leaked = await page.evaluate(() => {
            const read = (/** @type {Element} */ el) =>
                JSON.stringify(
                    [null, '::before', '::after'].map((pseudo) => {
                        const s = getComputedStyle(el, pseudo);
                        return [s.blockSize, s.backgroundImage, s.backgroundColor, s.maskImage, s.clipPath, s.borderTopWidth, s.content];
                    }),
                );
            const reference = read(/** @type {Element} */ (document.querySelector('#cd-reference [data-kp-divider]')));
            return [...document.querySelectorAll('#scope .cd-opt')]
                .filter((wrapper) => read(/** @type {Element} */ (wrapper.querySelector('[data-kp-divider]'))) !== reference)
                .map((wrapper) => wrapper.className);
        });
        expect(leaked, `${theme}: an option leaked outside cyberpunk`).toEqual([]);
    }
});

// A seam is a column of one or two device pixels much darker than the ink on
// both sides of it: a tile edge the paint did not close. Chevron gaps, pad
// holes and barcode gaps are all four device pixels or wider, so they do not
// read as one.
for (const width of [1024, 997, 853]) {
    test(`no seam at devicePixelRatio 2.222, ${width}px wide, at rest and mid-motion`, async ({ playwright }) => {
        test.setTimeout(240_000);
        const ratio = 2.222;
        const browser = await playwright.firefox.launch({ firefoxUserPrefs: { 'layout.css.devPixelsPerPx': String(ratio) } });
        try {
            const context = await browser.newContext({
                baseURL: test.info().project.use.baseURL,
                deviceScaleFactor: ratio,
                viewport: { width, height: 800 },
            });
            const page = await context.newPage();
            await open(page);
            expect(await page.evaluate(() => devicePixelRatio)).toBeCloseTo(ratio, 2);
            // Every animation parked at an arbitrary moment, so a moving tile
            // is read at a fractional offset.
            await page.evaluate(() => {
                for (const animation of document.getAnimations()) {
                    animation.pause();
                    animation.currentTime = 1337;
                }
            });
            const found = [];
            for (const id of ['current', ...OPTIONS]) {
                for (const selector of DIVIDERS) {
                    const locator = page.locator(`#${id} .cat-stage ${selector}`);
                    await locator.scrollIntoViewIfNeeded();
                    const png = (await locator.screenshot({ scale: 'device', animations: 'allow' })).toString('base64');
                    const seams = await page.evaluate(async (src) => {
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
                        const { data } = ctx.getImageData(0, 0, image.width, image.height);
                        const lum = (x, y) => {
                            const i = (y * image.width + x) * 4;
                            return 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
                        };
                        const out = [];
                        for (let x = 2; x < image.width - 3; x++) {
                            let rows = 0;
                            for (let y = 0; y < image.height; y++) {
                                for (const w of [1, 2]) {
                                    const left = lum(x - 1, y);
                                    const right = lum(x + w, y);
                                    const side = Math.min(left, right);
                                    if (side < 80 || Math.abs(left - right) > 0.25 * Math.max(left, right)) continue;
                                    let dark = true;
                                    for (let k = 0; k < w; k++) if (lum(x + k, y) > 0.6 * side) dark = false;
                                    if (dark) {
                                        rows++;
                                        break;
                                    }
                                }
                            }
                            if (rows >= 3) out.push(`x=${x} (${rows} rows)`);
                        }
                        return out;
                    }, png);
                    if (seams.length) found.push(`${id} ${selector}: ${seams.slice(0, 5).join(', ')}`);
                }
            }
            expect(found, found.join('\n')).toEqual([]);
        } finally {
            await browser.close();
        }
    });
}
