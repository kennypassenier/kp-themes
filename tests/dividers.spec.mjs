// The divider shape knob, and pastel's pearls [scope-93].
//
// Kenny, 2026-09-15, on catalogue/page-effects.html#dividers in pastel: "The
// sawtooth isn't really fitting with 'Pastel' which is fluffier and rounder.
// And there should be an option." research/dividers/ proposed the knob
// `data-kp-divider-shape` on html, any ancestor or one divider, the nearest
// winning; his answer to the form was "ik wil pearls" for pastel's own.
//
// Measured, never inferred [KT13]: what a divider draws is its computed mask
// and the pixels it changes against the same page with the divider hidden.
// The fixture loads the package and every register and styles nothing itself
// [KT3].
//
// Drilled per KT3 on 2026-09-15 in firefox:
//   - css/layout.css and css/pastel-register.css as they were at 74d9ac73:
//     five red. Pastel's divider read `mask-image: none` under a polygon clip
//     path; "every shape" read `formal zigzag: mask-image none` and, in dark,
//     1098 of 64512 px drawn for every value (the theme's own hairline);
//     "nearest" read formal's hairline where the ancestor's wave belonged;
//     the crisp test read 1 part-ink pixel in the torn tab's edge.
//   - the drawing scope widened to `@scope (html)`: "never changes a page
//     that does not use it" red in every theme, `formal plain-divider
//     block-size: 8px → 48px` first.
//   - the eight plain rules that write --kp-divider-shape removed: "every
//     shape" and "nearest" red, `formal scallop: mask-image …
//     conic-gradient` — Firefox gave every sibling row the first row's
//     style (see css/layout.css).
//   - pastel's thread drawn as a soft gradient (transparent 46%, black 50%,
//     transparent 54%): the crisp test red at both ratios, `2 of 4 device
//     pixels of the thread are part ink`. A 1.4px thread and a hard-stop
//     gradient thread both stayed green: firefox snaps a mask layer to the
//     device grid.

import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

const FIXTURE = '/tests/fixtures/dividers.html';
const THEMES = /** @type {string[]} */ (JSON.parse(readFileSync(new globalThis.URL('../themes/order.json', import.meta.url), 'utf8')));
const MATRIX = JSON.parse(readFileSync(new globalThis.URL('../themes/hooks.json', import.meta.url), 'utf8'));
const SHAPES = /** @type {string[]} */ (Object.keys(MATRIX.dividerShapes.values));

/** What the mask of each shape is made of, as a computed value reads. */
const MADE_OF = {
    zigzag: /conic-gradient/,
    scallop: /radial-gradient\(circle farthest-side at 50% 0/,
    wave: /viewBox='0 0 40 10'|viewBox=%270 0 40 10%27|0%200%2040%2010/,
    cloud: /viewBox='0 0 60 16'|viewBox=%270 0 60 16%27|0%200%2060%2016/,
    pearls: /radial-gradient\(circle closest-side/,
    line: /linear-gradient\(90deg/,
    none: /^none$/,
};

/** @param {import('@playwright/test').Page} page @param {string} theme */
const wear = async (page, theme) => {
    await page.evaluate((name) => document.documentElement.setAttribute('data-theme', name), theme);
    await expect.poll(() => page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--primary') !== '')).toBe(true);
};

/** @param {import('@playwright/test').Page} page */
const open = async (page, width = 1024) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width, height: 900 });
    await page.goto(FIXTURE);
    await page.evaluate(() => document.fonts.ready);
};

/**
 * Every computed property of an element and its two pseudo elements, custom
 * properties left out.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} selector
 */
const computed = (page, selector) =>
    page.evaluate((sel) => {
        const out = {};
        for (const el of document.querySelectorAll(sel)) {
            for (const pseudo of ['', '::before', '::after']) {
                const s = getComputedStyle(el, pseudo || null);
                for (let i = 0; i < s.length; i++) {
                    const name = s[i];
                    if (!name.startsWith('--'))
                        out[`${el.getAttribute('data-test') ?? el.getAttribute('data-kp-divider')}${pseudo} ${name}`] = s.getPropertyValue(name);
                }
            }
        }
        return out;
    }, selector);

/** @param {import('@playwright/test').Page} page @param {string} test */
const mask = (page, test) =>
    page.locator(`[data-test="${test}"]`).evaluate((el) => {
        const s = getComputedStyle(el);
        return {
            image: s.maskImage,
            size: s.maskSize,
            position: s.maskPosition,
            repeat: s.maskRepeat,
            clip: s.clipPath,
            height: s.height,
            background: s.backgroundColor,
        };
    });

/**
 * How many pixels each divider under `scope` changes on the page, against
 * the same page with the dividers hidden; decoded in the page.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} scope
 */
const drawn = async (page, scope) => {
    const boxes = await page.locator(`${scope} [data-kp-divider]`).evaluateAll((els) =>
        els.map((el) => {
            const r = el.getBoundingClientRect();
            return {
                x: r.left + scrollX,
                y: r.top + scrollY,
                width: r.width,
                height: r.height,
                shape: el.closest('[data-kp-divider-shape]')?.getAttribute('data-kp-divider-shape'),
                alt: el.getAttribute('data-kp-divider') === 'alt',
            };
        }),
    );
    const shot = async () => (await page.screenshot({ fullPage: true })).toString('base64');
    const shown = await shot();
    await page.addStyleTag({ content: `${scope} [data-kp-divider] { visibility: hidden !important; }` });
    const hidden = await shot();
    await page.evaluate(() => document.querySelector('style:last-of-type')?.remove());
    return page.evaluate(
        async ({ a, b, boxes: list }) => {
            const decode = async (src) => {
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
                return { data: ctx.getImageData(0, 0, image.width, image.height).data, width: image.width };
            };
            const [one, two] = [await decode(a), await decode(b)];
            return list.map((box) => {
                let count = 0;
                for (let y = Math.ceil(box.y); y < Math.floor(box.y + box.height); y++) {
                    for (let x = Math.ceil(box.x); x < Math.floor(box.x + box.width); x++) {
                        const i = (y * one.width + x) * 4;
                        if (Math.hypot(one.data[i] - two.data[i], one.data[i + 1] - two.data[i + 1], one.data[i + 2] - two.data[i + 2]) > 8) count++;
                    }
                }
                return { ...box, count, area: Math.floor(box.width) * Math.floor(box.height) };
            });
        },
        { a: shown, b: hidden, boxes },
    );
};

test.describe('pastel draws pearls as its own divider [scope-93]', { tag: ['@theme:pastel', '@component:layout'] }, () => {
    test('with no shape named, pastel draws the same mask the knob draws for pearls, plum above and mint above the footer', async ({ page }) => {
        // Before: mask-image none and clip-path polygon(0% 0%, 100% 0%, …),
        // the torn tab, 51.2px high.
        await open(page);
        await wear(page, 'pastel');
        await page.locator('[data-test="shaped"]').evaluate((el) => el.setAttribute('data-kp-divider-shape', 'pearls'));
        const own = await mask(page, 'plain-divider');
        const knob = await mask(page, 'shaped-divider');
        expect(own.image).toMatch(MADE_OF.pearls);
        expect(own.clip).toBe('none');
        expect(own).toEqual(knob);
        const inks = await page.evaluate(() => {
            const probe = (/** @type {string} */ token) => {
                const el = document.createElement('i');
                el.style.color = `var(${token})`;
                document.body.append(el);
                const value = getComputedStyle(el).color;
                el.remove();
                return value;
            };
            return { primary: probe('--primary'), mint: probe('--accent-foreground') };
        });
        expect(own.background, 'the plain divider is plum').toBe(inks.primary);
        expect((await mask(page, 'plain-alt')).background, 'the alt divider keeps its mint').toBe(inks.mint);
        expect((await mask(page, 'shaped-alt')).background, 'and keeps it under the knob').toBe(inks.mint);
        const [plain, alt] = await drawn(page, '[data-test="plain"]');
        expect(plain.count, 'pearls draw on the page').toBeGreaterThan(plain.area * 0.02);
        expect(alt.count).toBeGreaterThan(alt.area * 0.02);
    });
});

test.describe('the divider shape knob [scope-93]', { tag: ['@component:layout', '@component:page-effects'] }, () => {
    test('every shape draws its own mask in every theme, and none draws nothing', { tag: ['@sweep'] }, async ({ page }) => {
        // Before: every divider under a shape drew the theme's own drawing,
        // mask-image none in 21 themes, and `none` drew the theme's tear.
        test.setTimeout(180_000);
        await open(page);
        const found = [];
        for (const theme of THEMES) {
            await wear(page, theme);
            const masks = await page.locator('[data-test="every"] [data-kp-divider]').evaluateAll((els) =>
                els.map((el) => ({
                    shape: el.parentElement?.getAttribute('data-kp-divider-shape') ?? '',
                    image: getComputedStyle(el).maskImage,
                })),
            );
            for (const { shape, image } of masks) {
                if (!MADE_OF[shape].test(image)) found.push(`${theme} ${shape}: mask-image ${image.slice(0, 80)}`);
            }
            for (const box of await drawn(page, '[data-test="every"]')) {
                const name = `${theme} ${box.shape}${box.alt ? ' alt' : ''}`;
                if (box.shape === 'none') {
                    if (box.count > 0) found.push(`${name}: ${box.count} px drawn where nothing should be`);
                } else if (box.count < box.area * 0.02) {
                    found.push(`${name}: ${box.count} of ${box.area} px drawn`);
                }
            }
        }
        expect(found, found.join('\n')).toEqual([]);
        expect(SHAPES.sort()).toEqual(Object.keys(MADE_OF).sort());
    });

    test('the nearest element that names a shape wins, and theme brings the register back', async ({ page }) => {
        // Before: nest-wave, nest-own and nest-deep all drew formal's hairline
        // (mask-image none).
        await open(page);
        for (const theme of ['formal', 'pastel']) {
            await wear(page, theme);
            expect((await mask(page, 'nest-wave')).image, `${theme}: the ancestor's wave`).toMatch(MADE_OF.wave);
            expect((await mask(page, 'nest-own')).image, `${theme}: the divider's own pearls beat the ancestor`).toMatch(MADE_OF.pearls);
            expect((await mask(page, 'nest-deep')).image, `${theme}: scallop inside theme inside wave`).toMatch(MADE_OF.scallop);
            const reference = await computed(page, '[data-test="reference"]');
            const strip = (/** @type {Record<string, string>} */ o) =>
                Object.fromEntries(Object.entries(o).map(([k, v]) => [k.replace(/^[a-z-]+/, ''), v]));
            expect(strip(await computed(page, '[data-test="nest-theme"]')), `${theme}: theme under wave is the register's drawing`).toEqual(
                strip(reference),
            );
            expect(strip(await computed(page, '[data-test="nest-own-theme"]')), `${theme}: theme on the divider itself`).toEqual(strip(reference));
        }
        // On html, and a tile set on one divider is read there.
        await page.evaluate(() => document.documentElement.setAttribute('data-kp-divider-shape', 'cloud'));
        expect((await mask(page, 'plain-divider')).image).toMatch(MADE_OF.cloud);
        const before = (await mask(page, 'plain-divider')).size;
        await page.locator('[data-test="plain-divider"]').evaluate((el) => el.style.setProperty('--kp-divider-tile', '2rem'));
        expect((await mask(page, 'plain-divider')).size, 'the tile is read on the divider').not.toBe(before);
        expect((await mask(page, 'plain-divider')).size).toContain('96px 25.6px');
    });

    test(
        'the knob never changes a page that does not use it: every theme computes as with the layout layer off',
        { tag: ['@sweep'] },
        async ({ page }) => {
            // The other 21 themes keep their drawing exactly [scope-93]. Measured
            // on catalogue/page-effects.html#dividers before and after the change
            // too: the full computed style of every element and pseudo element in
            // the stage hashed identically in 21 themes in firefox and chromium,
            // and only pastel's changed.
            test.setTimeout(120_000);
            await open(page);
            const found = [];
            for (const theme of THEMES) {
                await wear(page, theme);
                const on = await computed(page, '[data-test="plain"] [data-kp-divider]');
                await page.evaluate(() => /** @type {HTMLLinkElement} */ (document.getElementById('layout').sheet.disabled = true));
                const off = await computed(page, '[data-test="plain"] [data-kp-divider]');
                await page.evaluate(() => /** @type {HTMLLinkElement} */ (document.getElementById('layout').sheet.disabled = false));
                for (const key of Object.keys(off)) if (on[key] !== off[key]) found.push(`${theme} ${key}: ${off[key]} → ${on[key]}`);
            }
            expect(found, found.slice(0, 20).join('\n')).toEqual([]);
        },
    );

    test('no shape scrolls a 320px page sideways, in any theme', { tag: ['@sweep'] }, async ({ page }) => {
        test.setTimeout(180_000);
        await open(page, 320);
        const found = [];
        for (const theme of THEMES) {
            await wear(page, theme);
            for (const shape of [...SHAPES, 'theme']) {
                await page.evaluate((s) => document.documentElement.setAttribute('data-kp-divider-shape', s), shape);
                const wide = await page.evaluate(() => document.documentElement.scrollWidth);
                if (wide > 320) found.push(`${theme} ${shape}: the page is ${wide}px wide`);
            }
        }
        expect(found, found.join('\n')).toEqual([]);
    });
});

// Kenny browses zoomed: 1.25 is a desktop scaled by a quarter. Firefox takes
// it as a preference at launch.
for (const ratio of [1, 1.25]) {
    test(
        `the pearls' thread is crisp at devicePixelRatio ${ratio}: every device pixel of it full ink or none [scope-93]`,
        { tag: ['@theme:pastel', '@component:layout'] },
        async ({ playwright, browserName, baseURL }) => {
            // Measured 2026-09-15: firefox 0 partial pixels at both ratios;
            // chromium 0 at 1 and 2 to 3 at 1.25, where it does not snap a mask
            // layer to the device grid and the divider's top falls between
            // two device pixels. Kenny judges in FireDragon, a firefox.
            test.skip(browserName !== 'firefox', 'chromium does not snap a mask layer to device pixels at a fractional ratio (measured)');
            const browser = await playwright.firefox.launch({ firefoxUserPrefs: { 'layout.css.devPixelsPerPx': String(ratio) } });
            try {
                const context = await browser.newContext({ baseURL, deviceScaleFactor: ratio });
                const page = await context.newPage();
                await open(page);
                expect(await page.evaluate(() => devicePixelRatio)).toBe(ratio);
                await wear(page, 'pastel');
                const partial = [];
                for (const test_ of ['plain-divider', 'plain-alt']) {
                    const locator = page.locator(`[data-test="${test_}"]`);
                    await locator.scrollIntoViewIfNeeded();
                    const clip = /** @type {{x: number, y: number, width: number, height: number}} */ (await locator.boundingBox());
                    const shown = (await page.screenshot({ clip, scale: 'device' })).toString('base64');
                    await locator.evaluate((el) => /** @type {HTMLElement} */ (el.style.visibility = 'hidden'));
                    const hidden = (await page.screenshot({ clip, scale: 'device' })).toString('base64');
                    await locator.evaluate((el) => /** @type {HTMLElement} */ (el.style.visibility = ''));
                    // The thread alone: the column that changes the fewest
                    // pixels and still changes some, between two beads.
                    const column = await page.evaluate(
                        async ({ a, b }) => {
                            const decode = async (src) => {
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
                                return { data: ctx.getImageData(0, 0, image.width, image.height).data, width: image.width, height: image.height };
                            };
                            const [one, two] = [await decode(a), await decode(b)];
                            let best = null;
                            for (let x = 0; x < one.width; x++) {
                                const d = [];
                                for (let y = 0; y < one.height; y++) {
                                    const i = (y * one.width + x) * 4;
                                    d.push(
                                        Math.hypot(one.data[i] - two.data[i], one.data[i + 1] - two.data[i + 1], one.data[i + 2] - two.data[i + 2]),
                                    );
                                }
                                const drawn = d.filter((v) => v > 8);
                                if (drawn.length > 0 && (best === null || drawn.length < best.length)) best = drawn;
                            }
                            return best ?? [];
                        },
                        { a: shown, b: hidden },
                    );
                    const full = Math.max(...column);
                    expect(column.length, `${test_}: a thread is drawn`).toBeGreaterThan(0);
                    const soft = column.filter((v) => v < full * 0.85);
                    if (soft.length > 0)
                        partial.push(
                            `${test_}: ${soft.length} of ${column.length} device pixels of the thread are part ink (${column.map(Math.round).join(', ')})`,
                        );
                }
                expect(partial, partial.join('\n')).toEqual([]);
            } finally {
                await browser.close();
            }
        },
    );
}
