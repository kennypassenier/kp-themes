// Verifies research/alarm/demo.html in firefox: no console errors, both
// dismissal modes, focus returning to the trigger, no animation under reduced
// motion, and the flash rate measured from rendered frames. See
// playwright.config.mjs beside it for how to run it.

import { expect, test } from '@playwright/test';

const DEMO = '/research/alarm/demo.html';
const THEMES = ['cyberpunk', 'nostromo', 'terminal', 'synthwave', 'formal', 'light'];

/** @param {import('@playwright/test').Page} page */
async function open(page) {
    /** @type {string[]} */
    const errors = [];
    page.on('console', (message) => {
        if (message.type() === 'error') errors.push(message.text());
    });
    page.on('pageerror', (error) => errors.push(String(error)));
    await page.goto(DEMO);
    await page.waitForFunction(() => typeof (/** @type {any} */ (window).showAlarm) === 'function');
    return errors;
}

/** @param {import('@playwright/test').Page} page @param {string} theme */
const setTheme = (page, theme) => page.click(`[data-al-theme="${theme}"]`);

test('no console errors, in all six themes, opening each drama', async ({ page }) => {
    const errors = await open(page);
    for (const theme of THEMES) {
        await setTheme(page, theme);
        await page.click('#al-raise');
        await expect(page.locator('dialog.kp-alarm[open]')).toBeVisible();
        await page.keyboard.press('Enter');
        await expect(page.locator('dialog.kp-alarm')).toHaveCount(0);
    }
    expect(errors).toEqual([]);
});

test('ack: only the button closes it; Escape, a click outside the text and time do not', async ({ page }) => {
    await open(page);
    await page.click('#al-raise');
    const dialog = page.locator('dialog.kp-alarm[open]');
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute('role', 'alertdialog');
    await expect(dialog).toHaveAccessibleName('Access denied');
    await expect(page.locator('dialog.kp-alarm .kp-alarm__ack')).toBeFocused();
    await page.keyboard.press('Escape');
    await page.mouse.click(12, 12);
    await page.keyboard.press('Tab');
    await page.waitForTimeout(1500);
    await expect(dialog).toBeVisible();
    // Tab stayed inside: the page behind is inert.
    const inside = await page.evaluate(() => !!document.activeElement?.closest('dialog.kp-alarm'));
    expect(inside).toBe(true);
    await page.locator('dialog.kp-alarm .kp-alarm__ack').focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('dialog.kp-alarm')).toHaveCount(0);
    await expect(page.locator('#al-raise')).toBeFocused();
    await expect(page.locator('#al-result')).toHaveText('Closed: ack');

    // And a pointer click on the button closes it too.
    await page.click('#al-raise');
    await page.locator('dialog.kp-alarm .kp-alarm__ack').click();
    await expect(page.locator('dialog.kp-alarm')).toHaveCount(0);
    await expect(page.locator('#al-raise')).toBeFocused();
});

test('ack with escape: true closes on Escape', async ({ page }) => {
    await open(page);
    await page.check('#al-escape');
    await page.click('#al-raise');
    await expect(page.locator('dialog.kp-alarm[open]')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('dialog.kp-alarm')).toHaveCount(0);
    await expect(page.locator('#al-result')).toHaveText('Closed: escape');
    await expect(page.locator('#al-raise')).toBeFocused();
});

test('auto: closes by itself after N seconds, with a shrinking bar; Keep open stops it', async ({ page }) => {
    await open(page);
    await page.check('input[name="mode"][value="auto"]');
    await page.fill('#al-seconds', '2');
    const started = Date.now();
    await page.click('#al-raise');
    const dialog = page.locator('dialog.kp-alarm[open]');
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAccessibleDescription(/Closes by itself in 2 seconds/);
    await page.waitForTimeout(1000);
    await expect(dialog).toBeVisible();
    const share = await dialog.evaluate((d) => Number(getComputedStyle(d).getPropertyValue('--kp-alarm-left')));
    expect(share).toBeGreaterThan(0.2);
    expect(share).toBeLessThan(0.8);
    await expect(page.locator('dialog.kp-alarm')).toHaveCount(0, { timeout: 3000 });
    const took = Date.now() - started;
    expect(took).toBeGreaterThanOrEqual(1900);
    expect(took).toBeLessThan(3500);
    await expect(page.locator('#al-raise')).toBeFocused();
    await expect(page.locator('#al-result')).toHaveText('Closed: timeout');

    await page.click('#al-raise');
    await page.locator('dialog.kp-alarm .kp-alarm__keep').click();
    await page.waitForTimeout(2600);
    await expect(page.locator('dialog.kp-alarm[open]')).toBeVisible();
    await expect(page.locator('dialog.kp-alarm .kp-alarm__ack')).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('dialog.kp-alarm')).toHaveCount(0);
});

test('reduced motion: no animation or transition runs, the words are there at once', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page);
    for (const [theme, mode] of [
        ['cyberpunk', 'ack'],
        ['cyberpunk', 'auto'],
        ['light', 'ack'],
    ]) {
        await setTheme(page, theme);
        await page.check(`input[name="mode"][value="${mode}"]`);
        await page.click('#al-raise');
        await expect(page.locator('dialog.kp-alarm[open]')).toBeVisible();
        await page.waitForTimeout(400);
        const state = await page.evaluate(() => {
            const dialog = /** @type {HTMLDialogElement} */ (document.querySelector('dialog.kp-alarm'));
            const running = document.getAnimations().filter((a) => {
                const target = /** @type {KeyframeEffect} */ (a.effect)?.target;
                return target instanceof Element && dialog.contains(target);
            });
            return {
                running: running.map((a) => /** @type {any} */ (a).animationName ?? /** @type {any} */ (a).transitionProperty ?? 'anim'),
                glyphs: dialog.querySelector('.kp-alarm__glyphs')?.textContent,
                motion: dialog.dataset.kpAlarmMotion,
            };
        });
        expect(state.running).toEqual([]);
        expect(state.glyphs).toBe('Access denied');
        expect(state.motion).toBe('still');
        if (mode === 'ack') await page.keyboard.press('Enter');
        else await page.keyboard.press('Escape');
        await expect(page.locator('dialog.kp-alarm')).toHaveCount(0);
    }
});

/**
 * The flash rate from rendered frames. Every animation is paused the moment
 * the alarm opens and stepped through 6 s of its own time (the loops repeat every 5 s) at 30 frames per
 * second, one screenshot per frame. Each frame is cut into overlapping tiles
 * of 170 x 128 CSS px — a quarter of WCAG's 341 x 256 px ten-degree field, the
 * smallest area a flash has to cover to count — and each tile's mean relative
 * luminance and chromaticity are followed through time. A transition is a
 * change of 10% or more from the last extreme, with the darker state under
 * 0.8; a red transition is a u'v' shift over 0.2 to or from a state with
 * R/(R+G+B) >= 0.8. A flash is two opposing transitions; the result is the
 * most flashes any tile shows in any one-second window. An approximation of
 * what a Harding analyser does, not a certified one.
 */
for (const [n, theme] of ['cyberpunk', 'nostromo', 'terminal', 'synthwave'].entries()) {
    test(`flash rate in ${theme}, full drama: at most 3 per second, measured, run ${n + 1}`, async ({ page, browser }) => {
        await open(page);
        await setTheme(page, theme);
        await page.mouse.move(1000, 760);
        await page.evaluate(async () => {
            await document.fonts.ready;
            /** @type {any} */ (window).showAlarm({
                title: 'Access denied',
                code: 'Security protocol 7 · lockout',
                detail: 'Three failed attempts on terminal 4. This console is locked for ten minutes.',
                mode: 'ack',
                drama: 'full',
            });
            for (const a of document.getAnimations()) a.pause();
            await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
            for (const a of document.getAnimations()) a.pause();
        });
        const animations = await page.evaluate(() => {
            const dialog = document.querySelector('dialog.kp-alarm');
            return document
                .getAnimations()
                .filter((a) => {
                    const t = /** @type {KeyframeEffect} */ (a.effect)?.target;
                    return t instanceof Element && dialog?.contains(t);
                })
                .map((a) => /** @type {any} */ (a).animationName);
        });
        expect(animations.length).toBeGreaterThan(5);

        const decoder = await browser.newPage();
        await decoder.setContent('<canvas id="c" width="1024" height="768"></canvas>');
        const FPS = 30;
        const frames = [];
        for (let i = 0; i <= 6 * FPS; i++) {
            const t = (i * 1000) / FPS;
            await page.evaluate((time) => {
                for (const a of document.getAnimations()) {
                    a.pause();
                    a.currentTime = time;
                }
            }, t);
            const png = await page.screenshot({ scale: 'css' });
            const tiles = await decoder.evaluate(async (b64) => {
                const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
                const bitmap = await createImageBitmap(new Blob([bytes], { type: 'image/png' }));
                const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('c'));
                const ctx = /** @type {CanvasRenderingContext2D} */ (canvas.getContext('2d', { willReadFrequently: true }));
                ctx.drawImage(bitmap, 0, 0);
                const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const lin = (v) => {
                    const c = v / 255;
                    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
                };
                const out = [];
                for (let y = 0; y + 128 <= height; y += 64) {
                    for (let x = 0; x + 170 <= width; x += 85) {
                        let L = 0,
                            R = 0,
                            G = 0,
                            B = 0,
                            n = 0;
                        for (let yy = y; yy < y + 128; yy += 4) {
                            for (let xx = x; xx < x + 170; xx += 4) {
                                const p = (yy * width + xx) * 4;
                                const r = lin(data[p]),
                                    g = lin(data[p + 1]),
                                    bl = lin(data[p + 2]);
                                L += 0.2126 * r + 0.7152 * g + 0.0722 * bl;
                                R += data[p] / 255;
                                G += data[p + 1] / 255;
                                B += data[p + 2] / 255;
                                n++;
                            }
                        }
                        R /= n;
                        G /= n;
                        B /= n;
                        const rl = lin(R * 255),
                            gl = lin(G * 255),
                            bll = lin(B * 255);
                        const X = 0.4124 * rl + 0.3576 * gl + 0.1805 * bll;
                        const Y = 0.2126 * rl + 0.7152 * gl + 0.0722 * bll;
                        const Z = 0.0193 * rl + 0.1192 * gl + 0.9505 * bll;
                        const d = X + 15 * Y + 3 * Z || 1;
                        out.push({ L: L / n, red: R + G + B > 0 ? R / (R + G + B) : 0, u: (4 * X) / d, v: (9 * Y) / d });
                    }
                }
                return out;
            }, png.toString('base64'));
            frames.push({ t, tiles });
        }
        await decoder.close();

        const tileCount = frames[0].tiles.length;
        let worst = 0;
        let worstRed = 0;
        for (let k = 0; k < tileCount; k++) {
            const series = frames.map((f) => ({ t: f.t, ...f.tiles[k] }));
            const times = [];
            const redTimes = [];
            let anchor = series[0];
            let direction = 0;
            let redAnchor = series[0];
            for (const s of series.slice(1)) {
                const delta = s.L - anchor.L;
                if (Math.abs(delta) >= 0.1 && Math.min(s.L, anchor.L) < 0.8) {
                    const dir = Math.sign(delta);
                    if (dir !== direction) times.push(s.t);
                    direction = dir;
                    anchor = s;
                } else if (Math.sign(delta) === direction && Math.abs(s.L - anchor.L) > 0) {
                    anchor = s;
                }
                const shift = Math.hypot(s.u - redAnchor.u, s.v - redAnchor.v);
                if (shift > 0.2 && (s.red >= 0.8 || redAnchor.red >= 0.8)) {
                    redTimes.push(s.t);
                    redAnchor = s;
                }
            }
            const perSecond = (list) => Math.max(0, ...list.map((t0) => list.filter((t) => t >= t0 && t < t0 + 1000).length / 2));
            worst = Math.max(worst, perSecond(times));
            worstRed = Math.max(worstRed, perSecond(redTimes));
        }
        const tally = Object.entries(animations.reduce((m, a) => ((m[a] = (m[a] ?? 0) + 1), m), {}))
            .map(([k, v]) => `${k}×${v}`)
            .join(' ');
        console.log(
            `[alarm] ${theme}: ${animations.length} animations (${tally}), ${tileCount} tiles, worst ${worst} flashes/s, worst red ${worstRed}/s`,
        );
        expect(worst).toBeLessThanOrEqual(3);
        expect(worstRed).toBeLessThanOrEqual(3);
    });
}

test('contrast of the headline and the detail on their ground, per theme (reported)', async ({ page }) => {
    await open(page);
    for (const theme of THEMES) {
        await setTheme(page, theme);
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.click('#al-raise');
        const numbers = await page.evaluate(() => {
            const dialog = /** @type {HTMLElement} */ (document.querySelector('dialog.kp-alarm'));
            const canvas = document.createElement('canvas');
            canvas.width = canvas.height = 1;
            const ctx = /** @type {CanvasRenderingContext2D} */ (canvas.getContext('2d', { willReadFrequently: true }));
            const rgba = (css) => {
                ctx.clearRect(0, 0, 1, 1);
                ctx.fillStyle = css;
                ctx.fillRect(0, 0, 1, 1);
                return [...ctx.getImageData(0, 0, 1, 1).data];
            };
            const bodyBg = rgba(getComputedStyle(document.body).backgroundColor);
            const page = bodyBg[3] > 0 ? bodyBg : rgba(getComputedStyle(document.documentElement).backgroundColor);
            const drama = dialog.dataset.kpAlarmDrama;
            const groundEl = drama === 'full' ? dialog : /** @type {HTMLElement} */ (dialog.querySelector('.kp-alarm__panel'));
            const g = rgba(getComputedStyle(groundEl).backgroundColor);
            const a = g[3] / 255;
            const ground = [0, 1, 2].map((i) => g[i] * a + page[i] * (1 - a));
            const lum = (c) =>
                [0, 1, 2]
                    .map((i) => {
                        const v = c[i] / 255;
                        return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
                    })
                    .reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i], 0);
            const ratio = (fg) => {
                const [hi, lo] = [lum(fg), lum(ground)].sort((x, y) => y - x);
                return Math.round(((hi + 0.05) / (lo + 0.05)) * 100) / 100;
            };
            return {
                drama,
                title: ratio(rgba(getComputedStyle(/** @type {Element} */ (dialog.querySelector('.kp-alarm__title'))).color)),
                detail: ratio(rgba(getComputedStyle(/** @type {Element} */ (dialog.querySelector('.kp-alarm__detail'))).color)),
            };
        });
        console.log(`[alarm] contrast ${theme}: ${JSON.stringify(numbers)}`);
        expect(numbers.title).toBeGreaterThanOrEqual(3);
        expect(numbers.detail).toBeGreaterThanOrEqual(4.5);
        await page.keyboard.press('Enter');
        await expect(page.locator('dialog.kp-alarm')).toHaveCount(0);
    }
});

// Screenshots for a human look, only when ALARM_SHOTS names a folder: each
// theme's alarm settled (motion still), one mid-flight, and the theme grid.
test('screenshots (ALARM_SHOTS only)', async ({ page }) => {
    const dir = process.env.ALARM_SHOTS;
    test.skip(!dir, 'set ALARM_SHOTS to a folder');
    await open(page);
    for (const theme of THEMES) {
        await setTheme(page, theme);
        await page.evaluate(() => {
            void (
                /** @type {any} */ (window).showAlarm({
                    title: 'Access denied',
                    code: 'Security protocol 7 · lockout',
                    detail: 'Three failed attempts on terminal 4. This console is locked for ten minutes.',
                    motion: 'still',
                })
            );
        });
        await page.waitForTimeout(300);
        await page.screenshot({ path: `${dir}/alarm-${theme}.png` });
        await page.keyboard.press('Enter');
    }
    await setTheme(page, 'cyberpunk');
    await page.check('input[name="mode"][value="auto"]');
    await page.fill('#al-seconds', '10');
    await page.click('#al-raise');
    await page.waitForTimeout(250);
    await page.screenshot({ path: `${dir}/alarm-auto-midflight.png` });
    await page.keyboard.press('Escape');
    await page.locator('#themes').scrollIntoViewIfNeeded();
    await page.screenshot({ path: `${dir}/alarm-grid.png` });
});
