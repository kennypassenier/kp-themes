// Cyberpunk's section divider is the data stream [scope-96], implemented
// from research/cyberpunk-dividers/demo.html (option 3) in place of the
// razor tear. Measured on the concept page, which lays the two seams out
// as a consumer would: a plain divider after the hero, and the alt divider
// after the app surface, before the footer.
//
// What is held: both seams draw the stream (two masked tiles, 144px and
// 216px, over the ground of the surface below and under the scan
// hairline); under motion both layers run, the alt seam in reverse, and
// the mask really moves; under reduced motion nothing runs; at
// devicePixelRatio 2.222 no tile edge leaves a seam; and synthwave and
// nostromo paint exactly what they paint with the cyberpunk register
// switched off.
//
// Drills [KT3], performed 2026-09-15 in firefox and restored:
//   - the `mask-image` of `[data-kp-divider]::before` removed → "the dash
//     tile" red;
//   - the no-preference `animation` of `[data-kp-divider]::before` removed →
//     "kp-stream-144 runs" red;
//   - a planted seam (a full-width dash tile at mask-size 144.45px, added
//     as a style tag) → the device-pixel reading found a seam at every tile
//     edge, red.

import { expect, test } from '@playwright/test';

const URL = '/examples/concept.html?theme=cyberpunk';
const SEAMS = [
    ['after the hero', '[data-kp-divider]:not([data-kp-divider="alt"])'],
    ['the alt seam', '[data-kp-divider="alt"]'],
];

/**
 * @param {import('@playwright/test').Page} page
 * @param {string} [url]
 */
async function open(page, url = URL) {
    await page.goto(url);
    const theme = new globalThis.URL(url, 'http://x').searchParams.get('theme');
    await page.waitForFunction((t) => document.documentElement.getAttribute('data-theme') === t, theme);
    await page.evaluate(() => document.fonts.ready);
}

test.describe('the cyberpunk data stream divider [scope-96]', { tag: ['@theme:cyberpunk', '@component:page-effects', '@component:examples'] }, () => {
    test('both seams draw the stream: 28px, two dash tiles over the ground below, under the hairline', async ({ page }) => {
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.setViewportSize({ width: 1280, height: 900 });
        await open(page);
        const rows = await page.evaluate((seams) => {
            const probe = document.createElement('div');
            document.body.append(probe);
            const colour = (/** @type {string} */ token) => {
                probe.style.backgroundColor = `var(${token})`;
                return getComputedStyle(probe).backgroundColor;
            };
            const grounds = { hero: colour('--background'), alt: colour('--sidebar-background') };
            probe.remove();
            return seams.map(([name, selector]) => {
                const el = /** @type {HTMLElement} */ (document.querySelector(selector));
                const own = getComputedStyle(el);
                const before = getComputedStyle(el, '::before');
                const after = getComputedStyle(el, '::after');
                const box = el.getBoundingClientRect();
                return {
                    name,
                    height: box.height,
                    width: box.width,
                    viewport: document.documentElement.clientWidth,
                    ground: own.backgroundColor,
                    expectedGround: name === 'the alt seam' ? grounds.alt : grounds.hero,
                    hairline: own.backgroundImage,
                    beforeMask: before.maskImage,
                    beforeSize: before.maskSize,
                    beforeRepeat: before.maskRepeat,
                    afterMask: after.maskImage,
                    afterSize: after.maskSize,
                    afterRepeat: after.maskRepeat,
                };
            });
        }, SEAMS);
        for (const row of rows) {
            expect(row.height, `${row.name}: height`).toBeCloseTo(28, 1);
            expect(row.ground, `${row.name}: the ground of the surface below`).toBe(row.expectedGround);
            expect(row.hairline, `${row.name}: the scan hairline`).toContain('linear-gradient');
            expect(row.beforeMask, `${row.name}: the dash tile`).toContain("viewBox='0 0 144 28'");
            expect(row.beforeSize, `${row.name}: the dash tile size`).toBe('144px 28px');
            expect(row.beforeRepeat).toBe('repeat-x');
            expect(row.afterMask, `${row.name}: the packet tile`).toContain("viewBox='0 0 216 28'");
            expect(row.afterSize, `${row.name}: the packet tile size`).toBe('216px 28px');
            expect(row.afterRepeat).toBe('repeat-x');
        }
    });

    test('under motion both layers of both seams run, the alt seam in reverse, and the mask moves', async ({ page }) => {
        await page.emulateMedia({ reducedMotion: 'no-preference' });
        await page.setViewportSize({ width: 1280, height: 900 });
        await open(page);
        const rows = await page.evaluate(
            (seams) =>
                seams.map(([name, selector]) => {
                    const el = /** @type {HTMLElement} */ (document.querySelector(selector));
                    const animations = /** @type {CSSAnimation[]} */ (el.getAnimations({ subtree: true }));
                    const moved = animations.map((animation) => {
                        animation.pause();
                        const pseudo = /** @type {KeyframeEffect} */ (animation.effect).pseudoElement ?? null;
                        animation.currentTime = 1000;
                        const a = getComputedStyle(el, pseudo).maskPosition;
                        animation.currentTime = 3000;
                        const b = getComputedStyle(el, pseudo).maskPosition;
                        return a !== b;
                    });
                    return {
                        name,
                        names: animations.map((a) => a.animationName).sort(),
                        directions: animations.map((a) => a.effect?.getComputedTiming().direction),
                        durations: animations.map((a) => a.effect?.getComputedTiming().duration),
                        moved,
                    };
                }),
            SEAMS,
        );
        for (const row of rows) {
            expect(row.names, `${row.name}: kp-stream-144 runs, and kp-stream-216`).toEqual(['kp-stream-144', 'kp-stream-216']);
            for (const direction of row.directions) expect(direction, row.name).toBe(row.name === 'the alt seam' ? 'reverse' : 'normal');
            for (const duration of row.durations) expect(duration, row.name).toBe(8000);
            expect(row.moved, `${row.name}: the mask position changes over the loop`).toEqual([true, true]);
        }
    });

    test('under reduced motion neither seam animates', async ({ page }) => {
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await open(page);
        const counts = await page.evaluate(
            (seams) =>
                seams.map(([, selector]) => /** @type {HTMLElement} */ (document.querySelector(selector)).getAnimations({ subtree: true }).length),
            SEAMS,
        );
        expect(counts).toEqual([0, 0]);
    });

    // A seam is a column of one or two device pixels much darker than the ink
    // on both sides of it: a tile edge the paint did not close. The reading is
    // research/cyberpunk-dividers/verify.spec.mjs's own. Dash gaps are four
    // device pixels or wider, so they do not read as one. Firefox only, at
    // Kenny's own zoom (layout.css.devPixelsPerPx): in chromium the same
    // reading was not repeatable (2026-09-15, three runs of one width at one
    // parked time gave a blank photograph once and different columns each
    // time), so it proves nothing there.
    for (const width of [1024, 997, 853]) {
        test(`no seam at devicePixelRatio 2.222, ${width}px wide, mid-motion`, async ({ browserName, playwright }, testInfo) => {
            test.skip(browserName !== 'firefox', 'the device-pixel reading is repeatable in firefox only');
            test.setTimeout(120_000);
            const ratio = 2.222;
            const browser = await playwright.firefox.launch({ firefoxUserPrefs: { 'layout.css.devPixelsPerPx': String(ratio) } });
            try {
                const context = await browser.newContext({
                    baseURL: testInfo.project.use.baseURL,
                    deviceScaleFactor: ratio,
                    viewport: { width, height: 800 },
                    reducedMotion: 'no-preference',
                });
                const page = await context.newPage();
                await open(page);
                expect(await page.evaluate(() => devicePixelRatio)).toBeCloseTo(ratio, 2);
                // Every animation parked at an arbitrary moment, so a moving
                // tile is read at a fractional offset.
                await page.evaluate(() => {
                    for (const animation of document.getAnimations()) {
                        animation.pause();
                        animation.currentTime = 1337;
                    }
                });
                const found = [];
                for (const [name, selector] of SEAMS) {
                    const locator = page.locator(selector);
                    await locator.scrollIntoViewIfNeeded();
                    const cssWidth = (await locator.boundingBox())?.width ?? 0;
                    const png = (await locator.screenshot({ scale: 'device', animations: 'allow' })).toString('base64');
                    const result = await page.evaluate(async (src) => {
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
                        const lum = (/** @type {number} */ x, /** @type {number} */ y) => {
                            const i = (y * image.width + x) * 4;
                            return 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
                        };
                        let inked = 0;
                        const out = [];
                        for (let x = 2; x < image.width - 3; x++) {
                            let rows = 0;
                            for (let y = 0; y < image.height; y++) {
                                if (lum(x, y) >= 80) inked++;
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
                        return { width: image.width, inked, seams: out };
                    }, png);
                    // The reading has something to read: the photograph is in
                    // device pixels and the dashes are ink on it.
                    expect(result.width, `${name}: device pixels`).toBeGreaterThan(cssWidth * ratio - 4);
                    expect(result.inked, `${name}: dashes to read`).toBeGreaterThan(1000);
                    if (result.seams.length) found.push(`${name}: ${result.seams.slice(0, 5).join(', ')}`);
                }
                expect(found, found.join('\n')).toEqual([]);
            } finally {
                await browser.close();
            }
        });
    }

    test('synthwave and nostromo paint their own dividers, exactly as with the cyberpunk register switched off', async ({ page }) => {
        await page.emulateMedia({ reducedMotion: 'no-preference' });
        await page.setViewportSize({ width: 1280, height: 900 });
        for (const theme of ['synthwave', 'nostromo']) {
            await open(page, `/examples/concept.html?theme=${theme}`);
            const read = () =>
                page.evaluate(
                    (seams) =>
                        JSON.stringify(
                            seams.map(([, selector]) => {
                                const el = /** @type {HTMLElement} */ (document.querySelector(selector));
                                return [
                                    [null, '::before', '::after'].map((pseudo) => {
                                        const s = getComputedStyle(el, pseudo);
                                        return [
                                            s.blockSize,
                                            s.backgroundImage,
                                            s.backgroundColor,
                                            s.maskImage,
                                            s.maskPosition,
                                            s.clipPath,
                                            s.borderTopWidth,
                                            s.content,
                                            s.animationName,
                                        ];
                                    }),
                                    el
                                        .getAnimations({ subtree: true })
                                        .map((a) => /** @type {CSSAnimation} */ (a).animationName)
                                        .sort(),
                                ];
                            }),
                        ),
                    SEAMS,
                );
            const withRegister = await read();
            expect(withRegister, `${theme}: no stream keyframe`).not.toContain('kp-stream');
            await page.evaluate(() => {
                const link = /** @type {HTMLLinkElement} */ (document.querySelector('link[href$="cyberpunk-register.css"]'));
                link.disabled = true;
            });
            await page.waitForTimeout(100);
            expect(await read(), `${theme}: the cyberpunk register changes this theme's dividers`).toBe(withRegister);
        }
    });
});
