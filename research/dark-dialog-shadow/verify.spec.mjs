// Verifies research/dark-dialog-shadow/demo.html in firefox: the page opens in
// dark without console errors; every option's separation is re-measured from
// rendered device pixels at devicePixelRatio 1 and 2.222 and has to agree with
// the number the page prints; option 1 (as it ships) has to measure near zero,
// so the demo is proven to show the fault rather than to have quietly fixed it;
// every other option has to lift the dialog off the ground by a measured
// margin; no option moves a single box; and nothing animates. See
// playwright.config.mjs beside it.
//
// The measurement, in one sentence: the page is photographed twice at the same
// scroll position — once as it stands, once with `data-ds-elevation="off"` on
// <html>, which takes every elevation away and changes nothing else — and the
// two photographs are subtracted in CIE L* inside a 24px band round the panel.

import { expect, test } from '@playwright/test';

const DEMO = '/research/dark-dialog-shadow/demo.html';
const OPTIONS = ['ships', 'black', 'oxide', 'plate', 'edge'];
const SURFACES = { dialog: '.kp-dialog', card: '.kp-card', popover: '.kp-popover' };
const BAND = 24;

/** @param {import('@playwright/test').Page} page */
async function open(page) {
    /** @type {string[]} */
    const errors = [];
    page.on('console', (message) => {
        if (message.type() === 'error') errors.push(message.text());
    });
    page.on('pageerror', (error) => errors.push(String(error)));
    await page.goto(DEMO);
    await page.waitForFunction(() => document.documentElement.getAttribute('data-theme') === 'dark');
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);
    return errors;
}

/**
 * Every panel's border box in the block, viewport-relative.
 * @param {import('@playwright/test').Page} page
 * @param {string} option
 */
const rectsOf = (page, option) =>
    page.evaluate(
        ({ o, surfaces }) => {
            /** @type {Record<string, {x: number, y: number, width: number, height: number}>} */
            const out = {};
            for (const [name, selector] of Object.entries(surfaces)) {
                const el = /** @type {HTMLElement} */ (document.querySelector(`#${o} [data-ds-surface="${name}"] ${selector}`));
                const cell = /** @type {HTMLElement} */ (el.closest('[data-ds-surface]'));
                const r = el.getBoundingClientRect();
                const c = cell.getBoundingClientRect();
                out[name] = { x: r.x, y: r.y, width: r.width, height: r.height, inCellX: r.x - c.x, inCellY: r.y - c.y };
            }
            return out;
        },
        { o: option, surfaces: SURFACES },
    );

/**
 * The band around each panel, subtracted between the two photographs.
 * @param {import('@playwright/test').Page} page
 */
const diff = (page, args) =>
    page.evaluate(({ on, off, rects, ratio, band }) => {
        /** @param {string} src */
        const toPixels = async (src) => {
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
            return ctx.getImageData(0, 0, image.width, image.height);
        };
        // CIE L* of an sRGB triple: a scale on which one step is roughly what
        // an eye can just tell apart on a hard edge.
        const lstar = (r, g, b) => {
            const lin = (c) => {
                const v = c / 255;
                return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
            };
            const y = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
            return y > 0.008856 ? 116 * Math.cbrt(y) - 16 : 903.3 * y;
        };
        return Promise.all([toPixels(on), toPixels(off)]).then(([a, b]) => {
            /** @type {Record<string, {any: number, vis: number, band: number, peak: number}>} */
            const out = {};
            for (const [key, rect] of Object.entries(rects)) {
                const x0 = Math.round((rect.x - band) * ratio);
                const y0 = Math.round((rect.y - band) * ratio);
                const x1 = Math.round((rect.x + rect.width + band) * ratio);
                const y1 = Math.round((rect.y + rect.height + band) * ratio);
                const ix0 = Math.round(rect.x * ratio);
                const iy0 = Math.round(rect.y * ratio);
                const ix1 = Math.round((rect.x + rect.width) * ratio);
                const iy1 = Math.round((rect.y + rect.height) * ratio);
                let one = 0;
                let three = 0;
                let total = 0;
                let peak = 0;
                for (let y = Math.max(0, y0); y < Math.min(a.height, y1); y++) {
                    for (let x = Math.max(0, x0); x < Math.min(a.width, x1); x++) {
                        if (x >= ix0 && x < ix1 && y >= iy0 && y < iy1) continue;
                        total++;
                        const i = (y * a.width + x) * 4;
                        const d = Math.abs(lstar(a.data[i], a.data[i + 1], a.data[i + 2]) - lstar(b.data[i], b.data[i + 1], b.data[i + 2]));
                        if (d > peak) peak = d;
                        if (d >= 1) one++;
                        if (d >= 3) three++;
                    }
                }
                out[key] = { any: one, vis: three, band: total, peak: Math.round(peak * 100) / 100 };
            }
            return out;
        });
    }, args);

/**
 * Re-measures every option at one device pixel ratio, and reports the boxes it
 * saw with the elevation on and off.
 * @param {import('@playwright/test').Page} page
 * @param {number} ratio
 */
async function measureAll(page, ratio) {
    /** @type {Record<string, any>} */
    const measured = {};
    /** @type {string[]} */
    const moved = [];
    for (const option of OPTIONS) {
        // A whole number of CSS pixels, and the same viewport position for
        // every option. Dark's pool of pointer light is fixed to the viewport,
        // so how much light there is behind a panel depends on where in the
        // viewport it stands: park every option on the same patch of ground and
        // the five are comparable, and a re-run measures the same thing.
        await page.evaluate((o) => {
            const row = /** @type {HTMLElement} */ (document.querySelector(`#${o} .ds-row`));
            window.scrollTo(0, Math.round(row.getBoundingClientRect().top + window.scrollY - 200));
        }, option);
        await page.waitForTimeout(250);
        const on = await rectsOf(page, option);
        const shotOn = (await page.screenshot({ scale: 'device', animations: 'disabled' })).toString('base64');
        await page.evaluate(() => document.documentElement.setAttribute('data-ds-elevation', 'off'));
        await page.waitForTimeout(150);
        const off = await rectsOf(page, option);
        const shotOff = (await page.screenshot({ scale: 'device', animations: 'disabled' })).toString('base64');
        await page.evaluate(() => document.documentElement.removeAttribute('data-ds-elevation'));
        for (const name of Object.keys(SURFACES)) {
            for (const field of ['x', 'y', 'width', 'height']) {
                const delta = Math.abs(on[name][field] - off[name][field]);
                if (delta > 0.05) moved.push(`${option}/${name}: ${field} moved ${delta.toFixed(2)}px when the elevation came off`);
            }
        }
        measured[option] = { boxes: on, bands: await diff(page, { on: shotOn, off: shotOff, rects: on, ratio, band: BAND }) };
    }
    return { measured, moved };
}

test('opens in dark with no console errors', async ({ page }) => {
    const errors = await open(page);
    await page.waitForTimeout(500);
    expect(errors).toEqual([]);
});

test('nothing on the page animates: every option is paint at rest', async ({ page }) => {
    await open(page);
    const animations = await page.evaluate(() => document.getAnimations().length);
    expect(animations, 'an option animates something').toBe(0);
});

test('every surface stands in exactly the same place in all five options', async ({ page }) => {
    await open(page);
    /** @type {Record<string, any>} */
    const boxes = {};
    for (const option of OPTIONS) boxes[option] = await rectsOf(page, option);
    for (const name of Object.keys(SURFACES)) {
        const reference = boxes.ships[name];
        for (const option of OPTIONS.slice(1)) {
            const box = boxes[option][name];
            expect(box.width, `${option}/${name}: width`).toBeCloseTo(reference.width, 1);
            expect(box.height, `${option}/${name}: height`).toBeCloseTo(reference.height, 1);
            expect(box.inCellX, `${option}/${name}: position in its cell, inline`).toBeCloseTo(reference.inCellX, 1);
            expect(box.inCellY, `${option}/${name}: position in its cell, block`).toBeCloseTo(reference.inCellY, 1);
        }
    }
});

for (const ratio of [1, 2.222]) {
    test(`separation at devicePixelRatio ${ratio}: measured, printed and judged`, async ({ playwright }) => {
        test.setTimeout(300_000);
        const browser = await playwright.firefox.launch({ firefoxUserPrefs: { 'layout.css.devPixelsPerPx': String(ratio) } });
        try {
            const context = await browser.newContext({
                baseURL: test.info().project.use.baseURL,
                deviceScaleFactor: ratio,
                viewport: { width: 1280, height: 900 },
            });
            const page = await context.newPage();
            await open(page);
            expect(await page.evaluate(() => devicePixelRatio)).toBeCloseTo(ratio, 2);
            const { measured, moved } = await measureAll(page, ratio);
            expect(moved, moved.join('\n')).toEqual([]);

            // 1 · The page prints what a run measures. Two runs of the
            // measuring script give identical counts, but a count taken in
            // another browser session drifts by a few percent — antialiasing
            // lands differently — so the bars allow 8 % on a count and 20 % on
            // a peak. The options are one to two orders of magnitude apart, so
            // a bar that wide still catches a changed or a missing option.
            /** @type {string[]} */
            const wrong = [];
            for (const option of OPTIONS) {
                for (const surface of Object.keys(SURFACES)) {
                    const band = measured[option].bands[surface];
                    for (const [field, value] of Object.entries({ any: band.any, vis: band.vis, band: band.band, peak: band.peak })) {
                        const key = `${option}/${surface}/${ratio}/${field}`;
                        const printed = await page.locator(`[data-ds-cell="${key}"]`).textContent();
                        const number = Number(String(printed).replace(/[^0-9.].*$/, ''));
                        const slack = field === 'peak' ? Math.max(0.2, value * 0.2) : Math.max(60, value * 0.08);
                        if (!(Math.abs(number - value) <= slack))
                            wrong.push(`${key}: the page prints ${printed?.trim()}, this run measured ${value}`);
                    }
                }
            }
            expect(wrong, wrong.join('\n')).toEqual([]);

            // 2 · Option 1 measures near zero. If this ever fails the demo has
            // stopped showing the fault it exists to show. Its worst surface is
            // the card, which stands in the middle of the pointer's pool of
            // light and so has the most light to lose: 5.6 % of its band moves
            // by one step, and its darkest pixel anywhere is 5.92 of 100.
            for (const surface of Object.keys(SURFACES)) {
                const band = measured.ships.bands[surface];
                expect(band.vis / band.band, `ships/${surface}: visibly changed share`).toBeLessThan(0.08);
                expect(band.peak, `ships/${surface}: largest difference`).toBeLessThan(6.5);
            }

            // 3 · Every other option lifts the dialog off the ground by a
            // margin an eye can see, and beats what ships on all three
            // surfaces. The weakest of the four on the dialog is the black
            // shadow, at 24 % of the band and a peak of 7.07; the strictest
            // bar here is the hard plate's, which changes a tenth of the band
            // because a 6px riser is a tenth of a 24px band, every pixel of it
            // well past the threshold.
            for (const option of OPTIONS.slice(1)) {
                const dialog = measured[option].bands.dialog;
                expect(dialog.vis / dialog.band, `${option}/dialog: visibly changed share`).toBeGreaterThan(0.09);
                expect(dialog.peak, `${option}/dialog: largest difference`).toBeGreaterThan(6.5);
                for (const surface of Object.keys(SURFACES)) {
                    expect(measured[option].bands[surface].peak, `${option}/${surface}: beats what ships`).toBeGreaterThan(
                        measured.ships.bands[surface].peak,
                    );
                }
            }
        } finally {
            await browser.close();
        }
    });
}

// The finding that decides option 3, pinned: a dialog in the top layer is a
// scroll container by the UA stylesheet (`dialog:modal { overflow: auto }`), so
// it clips its own pseudo-elements and the oxide halo cannot reach outside it.
// A filter is not a descendant and survives, which is why the other four
// options open unchanged.
test('a modal dialog clips its pseudo-elements, so option 3 opens with the four-shadow fallback', async ({ page }) => {
    await open(page);
    const frozen = await page.evaluate(() => {
        const el = /** @type {Element} */ (document.querySelector('#oxide [data-ds-surface="dialog"] .kp-dialog'));
        return { overflow: getComputedStyle(el).overflow, shadow: getComputedStyle(el).boxShadow, halo: getComputedStyle(el, '::after').content };
    });
    expect(frozen.overflow, 'a frozen dialog does not clip').toBe('visible');
    expect(frozen.halo, 'the frozen dialog wears the halo').toBe('""');
    expect(frozen.shadow, 'the frozen dialog needs no fallback').toBe('none');

    await page.click('[data-kp-dialog="ds-live-oxide"]');
    await page.waitForFunction(() => document.getElementById('ds-live-oxide')?.matches(':modal'));
    const modal = await page.evaluate(() => {
        const el = /** @type {Element} */ (document.getElementById('ds-live-oxide'));
        return { overflow: getComputedStyle(el).overflow, shadow: getComputedStyle(el).boxShadow, filter: getComputedStyle(el).filter };
    });
    expect(modal.overflow, 'a modal dialog is a scroll container and clips').toBe('auto');
    expect(modal.shadow.split('rgb').length - 1, 'the modal wears the four-wavelength fallback').toBe(4);
    await page.keyboard.press('Escape');

    // The other four arrive in the top layer exactly as they stand.
    for (const option of ['ships', 'black', 'plate', 'edge']) {
        await page.click(`[data-kp-dialog="ds-live-${option}"]`);
        await page.waitForFunction((o) => document.getElementById(`ds-live-${o}`)?.matches(':modal'), option);
        const shape = await page.evaluate((o) => {
            const el = /** @type {Element} */ (document.getElementById(`ds-live-${o}`));
            const frozenEl = /** @type {Element} */ (document.querySelector(`#${o} [data-ds-surface="dialog"] .kp-dialog`));
            return [getComputedStyle(el).filter, getComputedStyle(frozenEl).filter];
        }, option);
        expect(shape[0], `${option}: the modal casts what the frozen copy casts`).toBe(shape[1]);
        expect(shape[0], `${option}: the modal casts something`).not.toBe('none');
        await page.keyboard.press('Escape');
        await page.waitForTimeout(150);
    }
});

test('dark only: in titanium the five dialogs of the scope block are identical', async ({ page }) => {
    await open(page);
    const read = () =>
        page.evaluate(() =>
            [...document.querySelectorAll('#scope .ds-cell')].map((cell) => {
                const el = /** @type {Element} */ (cell.querySelector('.kp-dialog'));
                return [null, '::before', '::after'].map((pseudo) => {
                    const s = getComputedStyle(el, pseudo);
                    return [s.filter, s.boxShadow, s.backgroundImage, s.content, s.opacity].join('|');
                });
            }),
        );
    for (const theme of ['titanium', 'nostromo']) {
        await page.click(`[data-ds-theme="${theme}"]`);
        await page.waitForFunction((t) => document.documentElement.getAttribute('data-theme') === t, theme);
        await page.waitForTimeout(300);
        const shapes = await read();
        for (const shape of shapes.slice(1)) expect(shape, `${theme}: an option leaked outside dark`).toEqual(shapes[0]);
    }
    await page.click('[data-ds-theme="dark"]');
    await page.waitForFunction(() => document.documentElement.getAttribute('data-theme') === 'dark');
    await page.waitForTimeout(300);
    const inDark = await read();
    const distinct = new Set(inDark.map((shape) => shape.join('¶')));
    expect(distinct.size, 'in dark the five options must differ from each other').toBe(5);
});
