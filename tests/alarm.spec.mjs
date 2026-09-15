// The alarm [scope-94].
//
// A full-screen dramatic alert, from the prototype Kenny approved on
// 2026-09-15 (research/alarm/), built with the full drama in all
// twenty-two themes and an auto mode that blocks the page like the
// acknowledged one. This suite holds what the decision promised, in both
// channels [AR7]:
//
//   - ack: only its button closes it (a click, Enter or Space); Escape only
//     with `escape`; a click outside the words and time never do
//   - auto: closes by itself after `seconds`, Escape closes it, Keep open
//     turns it into ack
//   - the promise (and useAlarm's) resolves with the reason
//   - focus stays inside while open and returns to the trigger after
//   - the page behind cannot be clicked or tabbed to
//   - reduced motion runs no animation and shows the words at once
//   - the flash rate from rendered frames stays at 2 per second or under
//     (WCAG 2.3.1 allows 3) in eight themes
//   - the glitch and the flicker run only in cyberpunk, in all 22 themes,
//     and the DI5 report rates what cyberpunk keeps [scope-98]
//   - the headline, the reason and the button read at 4.5:1 or more on their
//     ground in every theme, 7:1 in high-contrast
//   - the two channels render the same tree, and the words the component
//     adds come from the dictionary
//
// The flash and contrast measurements are carried over from
// research/alarm/verify.spec.mjs, where they measured the prototype.

import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { DEFAULT_STRINGS as S } from '../js/strings.js';

const FIXTURE = '/tests/fixtures/alarm.html';

/** @type {string[]} */
const THEMES = JSON.parse(readFileSync(new URL('../themes/order.json', import.meta.url), 'utf8'));

const CHANNELS = [
    { name: 'framework-free', prefix: 'plain' },
    { name: 'React', prefix: 'react' },
];

const OPEN = 'dialog.kp-alarm[open]';

/** @param {string} id */
const at = (id) => `[data-test="${id}"]`;

/** @param {import('@playwright/test').Page} page */
async function open(page) {
    /** @type {string[]} */
    const errors = [];
    page.on('console', (message) => {
        if (message.type() === 'error') errors.push(message.text());
    });
    page.on('pageerror', (error) => errors.push(String(error)));
    await page.goto(FIXTURE);
    await page.waitForSelector(at('react-ack'));
    await page.waitForFunction(() => typeof (/** @type {any} */ (window).showAlarm) === 'function');
    return errors;
}

/** @param {import('@playwright/test').Page} page @param {string} theme */
const wear = (page, theme) => page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);

/** Whether focus is inside the open alarm. @param {import('@playwright/test').Page} page */
const focusInside = (page) => page.evaluate(() => !!document.activeElement?.closest('dialog.kp-alarm[open]'));

for (const channel of CHANNELS) {
    const p = channel.prefix;
    test.describe(`alarm — ${channel.name}`, { tag: ['@component:alarm'] }, () => {
        test.beforeEach(async ({ page }) => {
            await page.emulateMedia({ reducedMotion: 'reduce' });
        });

        test(`ack: only the button closes it — not Escape, a click outside or time; Enter, Space and a click do, ${channel.name}`, async ({
            page,
        }) => {
            const errors = await open(page);
            const trigger = page.locator(at(`${p}-ack`));
            const result = page.locator(at(`${p}-result`));
            await trigger.focus();
            await page.keyboard.press('Enter');
            const dialog = page.locator(OPEN);
            await expect(dialog).toBeVisible();
            await expect(dialog).toHaveAttribute('role', 'alertdialog');
            await expect(dialog).toHaveAttribute('data-kp-alarm-mode', 'ack');
            await expect(dialog).toHaveAccessibleName('Access denied');
            await expect(dialog).toHaveAccessibleDescription(new RegExp(S.alarmPressTo(S.alarmAction).replace('.', '\\.')));
            const ack = dialog.locator('.kp-alarm__ack');
            await expect(ack).toBeFocused();
            await expect(ack).toHaveText(S.alarmAction);

            // Escape (twice: an engine lets a second one past a prevented
            // cancel), a click in the plate's corner, and a wait.
            await page.keyboard.press('Escape');
            await page.keyboard.press('Escape');
            await page.mouse.click(12, 12);
            await page.waitForTimeout(1200);
            await expect(dialog).toBeVisible();
            await expect(result).toHaveText('');

            await ack.focus();
            await page.keyboard.press('Enter');
            await expect(page.locator(OPEN)).toHaveCount(0);
            await expect(result).toHaveText('ack');
            await expect(trigger).toBeFocused();

            // Space closes it too.
            await page.keyboard.press('Enter');
            await expect(page.locator(OPEN)).toBeVisible();
            await page.keyboard.press('Space');
            await expect(page.locator(OPEN)).toHaveCount(0);
            await expect(result).toHaveText('ack');

            // And a pointer.
            await trigger.click();
            await page.locator(`${OPEN} .kp-alarm__ack`).click();
            await expect(page.locator(OPEN)).toHaveCount(0);
            await expect(result).toHaveText('ack');
            await expect(trigger).toBeFocused();
            expect(errors).toEqual([]);
        });

        test(`ack with escape: Escape closes it with the reason escape, ${channel.name}`, async ({ page }) => {
            await open(page);
            const trigger = page.locator(at(`${p}-ack-escape`));
            await trigger.click();
            await expect(page.locator(OPEN)).toBeVisible();
            await page.keyboard.press('Escape');
            await expect(page.locator(OPEN)).toHaveCount(0);
            await expect(page.locator(at(`${p}-result`))).toHaveText('escape');
            await expect(trigger).toBeFocused();
        });

        test(`auto: closes by itself with the reason timeout, the bar shrinking; Escape closes it; Keep open makes it ack, ${channel.name}`, async ({
            page,
        }) => {
            await open(page);
            const trigger = page.locator(at(`${p}-auto`));
            const result = page.locator(at(`${p}-result`));
            const started = Date.now();
            await trigger.click();
            const dialog = page.locator(OPEN);
            await expect(dialog).toHaveAttribute('data-kp-alarm-mode', 'auto');
            await expect(dialog).toHaveAccessibleDescription(new RegExp(S.alarmClosesBy(2).replace('.', '\\.')));
            // The auto alarm focuses itself, so an Enter meant for the page presses nothing.
            await expect(dialog).toBeFocused();
            await page.waitForTimeout(700);
            const share = await dialog.evaluate((d) => Number(getComputedStyle(d).getPropertyValue('--kp-alarm-left')));
            expect(share).toBeGreaterThan(0.2);
            expect(share).toBeLessThan(0.8);
            await expect(dialog.locator('.kp-alarm__left')).toHaveText(S.alarmCountdown(2));
            await expect(page.locator(OPEN)).toHaveCount(0, { timeout: 3000 });
            const took = Date.now() - started;
            expect(took).toBeGreaterThanOrEqual(1900);
            expect(took).toBeLessThan(3500);
            await expect(result).toHaveText('timeout');
            await expect(trigger).toBeFocused();

            // Escape.
            await trigger.click();
            await expect(page.locator(OPEN)).toBeVisible();
            await page.keyboard.press('Escape');
            await expect(page.locator(OPEN)).toHaveCount(0);
            await expect(result).toHaveText('escape');

            // Keep open: the first Tab reaches it, and it stops the clock.
            await trigger.click();
            await page.keyboard.press('Tab');
            const keep = page.locator(`${OPEN} .kp-alarm__keep`);
            await expect(keep).toBeFocused();
            await expect(keep).toHaveText(S.alarmKeepOpen);
            await page.keyboard.press('Enter');
            await expect(page.locator(OPEN)).toHaveAttribute('data-kp-alarm-mode', 'ack');
            await expect(page.locator(`${OPEN} .kp-alarm__ack`)).toBeFocused();
            await page.waitForTimeout(2600);
            await expect(page.locator(OPEN)).toBeVisible();
            // Now an ack alarm: Escape no longer closes it.
            await page.keyboard.press('Escape');
            await expect(page.locator(OPEN)).toBeVisible();
            await expect(page.locator(OPEN)).toHaveAccessibleDescription(new RegExp(S.alarmKeptOpen(S.alarmAction).replace('.', '\\.')));
            await page.keyboard.press('Enter');
            await expect(page.locator(OPEN)).toHaveCount(0);
            await expect(result).toHaveText('ack');
            await expect(trigger).toBeFocused();
        });

        test(`focus stays inside while open and the page behind takes no click and no Tab, ${channel.name}`, async ({ page }) => {
            await open(page);
            const behind = page.locator(at('behind'));
            const box = await behind.boundingBox();
            if (!box) throw new Error('the page behind has no button to aim at');
            for (const id of [`${p}-ack`, `${p}-auto`]) {
                await page.locator(at(id)).click();
                await expect(page.locator(OPEN)).toBeVisible();
                if (id.endsWith('auto')) await page.locator(`${OPEN} .kp-alarm__keep`).focus();
                for (let i = 0; i < 6; i++) {
                    await page.keyboard.press(i % 2 ? 'Shift+Tab' : 'Tab');
                    expect(await focusInside(page), `after ${i + 1} Tab presses`).toBe(true);
                }
                // A real pointer on the spot where the page's button is.
                await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
                await expect(page.locator(at('behind-count'))).toHaveText('0');
                expect(await focusInside(page)).toBe(true);
                await page.keyboard.press('Escape');
                if (await page.locator(OPEN).count()) {
                    await page.locator(`${OPEN} .kp-alarm__ack`).focus();
                    await page.keyboard.press('Enter');
                }
                await expect(page.locator(OPEN)).toHaveCount(0);
            }
            // And with no alarm open, the same click does reach the page.
            await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
            await expect(page.locator(at('behind-count'))).toHaveText('1');
        });

        test(`reduced motion: no animation or transition runs inside, and the words are there at once, ${channel.name}`, async ({ page }) => {
            await open(page);
            for (const theme of ['cyberpunk', 'formal', 'pastel', 'sepia']) {
                await wear(page, theme);
                for (const id of [`${p}-ack`, `${p}-auto`]) {
                    await page.locator(at(id)).click();
                    await expect(page.locator(OPEN)).toBeVisible();
                    await page.waitForTimeout(300);
                    const state = await page.evaluate(() => {
                        const dialog = /** @type {HTMLDialogElement} */ (document.querySelector('dialog.kp-alarm[open]'));
                        const running = document.getAnimations().filter((a) => {
                            const target = /** @type {KeyframeEffect} */ (a.effect)?.target;
                            return target instanceof Element && dialog.contains(target);
                        });
                        const glyphs = /** @type {HTMLElement} */ (dialog.querySelector('.kp-alarm__glyphs'));
                        return {
                            running: running.map(
                                (a) => /** @type {any} */ (a).animationName ?? /** @type {any} */ (a).transitionProperty ?? 'animation',
                            ),
                            glyphs: glyphs.textContent,
                            letter: getComputedStyle(/** @type {Element} */ (glyphs.querySelector('.kp-alarm__char'))).color,
                        };
                    });
                    expect(state.running, `${theme} ${id}`).toEqual([]);
                    expect(state.glyphs).toBe('Access denied');
                    expect(state.letter).not.toBe('rgba(0, 0, 0, 0)');
                    if (id.endsWith('auto')) await page.keyboard.press('Escape');
                    else await page.keyboard.press('Enter');
                    await expect(page.locator(OPEN)).toHaveCount(0);
                }
            }
        });
    });
}

test('the two channels render the same tree [AR7]', { tag: ['@component:alarm'] }, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page);
    /** An outline of the open alarm: tags, classes, roles, aria and data attributes, text; ids and noise glyphs normalised. */
    const outline = () =>
        page.evaluate(() => {
            const dialog = /** @type {HTMLElement} */ (document.querySelector('dialog.kp-alarm[open]'));
            const base = dialog.id;
            /** @param {Element} el @param {number} depth @returns {string[]} */
            const walk = (el, depth) => {
                const attrs = [...el.attributes]
                    .filter((a) => !['style', 'data-n1', 'data-n2', 'open', 'data-kp-alarm-attached'].includes(a.name))
                    .map((a) => `${a.name}=${a.value.split(base).join('ID')}`)
                    .sort()
                    .join(' ');
                const own = [...el.childNodes]
                    .filter((n) => n.nodeType === Node.TEXT_NODE)
                    .map((n) => n.textContent)
                    .join('');
                return [`${'  '.repeat(depth)}<${el.tagName.toLowerCase()} ${attrs}> ${own}`, ...[...el.children].flatMap((c) => walk(c, depth + 1))];
            };
            return walk(dialog, 0);
        });
    await page.locator(at('plain-ack')).click();
    const plain = await outline();
    await page.keyboard.press('Enter');
    await page.locator(at('react-ack')).click();
    const react = await outline();
    await page.keyboard.press('Enter');
    expect(react).toEqual(plain);
    expect(plain.length).toBeGreaterThan(20);
});

test('the words the alarm adds come from the dictionary, per alarm, in both channels [KT5]', { tag: ['@component:alarm'] }, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page);
    await page.locator(at('react-strings')).click();
    const react = page.locator(OPEN);
    await expect(react.locator('.kp-alarm__keep')).toHaveText('Openhouden');
    await expect(react.locator('.kp-alarm__left')).toHaveText('Sluit over 30 s');
    await page.keyboard.press('Escape');
    await expect(page.locator(at('react-result'))).toHaveText('escape');

    await page.evaluate(() => {
        void (
            /** @type {any} */ (window).showAlarm({
                title: 'Toegang geweigerd',
                mode: 'auto',
                seconds: 30,
                strings: { alarmKeepOpen: 'Openhouden', alarmCountdown: (/** @type {number} */ n) => `Sluit over ${n} s` },
            })
        );
    });
    const plain = page.locator(OPEN);
    await expect(plain.locator('.kp-alarm__keep')).toHaveText('Openhouden');
    await expect(plain.locator('.kp-alarm__left')).toHaveText('Sluit over 30 s');
    await page.keyboard.press('Escape');
    await expect(page.locator(OPEN)).toHaveCount(0);
});

test('a declarative trigger raises the alarm it describes and hears why it closed', { tag: ['@component:alarm'] }, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page);
    const trigger = page.locator(at('plain-declarative'));
    await trigger.click();
    const dialog = page.locator(OPEN);
    await expect(dialog).toHaveAccessibleName('Intrusion detected');
    await expect(dialog).toHaveAttribute('data-kp-alarm-mode', 'auto');
    await expect(dialog.locator('.kp-alarm__code')).toHaveText('Perimeter · east wing');
    await expect(page.locator(OPEN)).toHaveCount(0, { timeout: 3500 });
    await expect(page.locator(at('plain-result'))).toHaveText('timeout');
    await expect(trigger).toBeFocused();
});

test(
    'the headline reads at 4.5:1 or more on its ground, in every theme (7:1 in high-contrast), and the detail line and the button too',
    { tag: ['@component:alarm', '@sweep'] },
    async ({ page }) => {
        await page.emulateMedia({ reducedMotion: 'reduce' });
        const errors = await open(page);
        /** @type {string[]} */
        const low = [];
        for (const theme of THEMES) {
            await wear(page, theme);
            await page.evaluate(() => {
                void (/** @type {any} */ (window).showAlarm({ .../** @type {any} */ (window).kpAlarmOptions }));
            });
            await expect(page.locator(OPEN)).toBeVisible();
            const numbers = await page.evaluate(() => {
                const dialog = /** @type {HTMLElement} */ (document.querySelector('dialog.kp-alarm[open]'));
                const canvas = document.createElement('canvas');
                canvas.width = canvas.height = 1;
                const ctx = /** @type {CanvasRenderingContext2D} */ (canvas.getContext('2d', { willReadFrequently: true }));
                /** @param {string} css */
                const rgba = (css) => {
                    ctx.clearRect(0, 0, 1, 1);
                    ctx.fillStyle = css;
                    ctx.fillRect(0, 0, 1, 1);
                    return [...ctx.getImageData(0, 0, 1, 1).data];
                };
                /** @param {number[]} top @param {number[]} under */
                const over = (top, under) => {
                    const a = top[3] / 255;
                    return [0, 1, 2].map((i) => top[i] * a + under[i] * (1 - a));
                };
                // The page's ground, then the plate over it, then the panel over that.
                let ground = over(rgba(getComputedStyle(document.documentElement).backgroundColor), [255, 255, 255]);
                ground = over(rgba(getComputedStyle(document.body).backgroundColor), ground);
                ground = over(rgba(getComputedStyle(dialog).backgroundColor), ground);
                ground = over(rgba(getComputedStyle(/** @type {Element} */ (dialog.querySelector('.kp-alarm__panel'))).backgroundColor), ground);
                /** @param {number[]} c */
                const lum = (c) =>
                    [0, 1, 2]
                        .map((i) => {
                            const v = c[i] / 255;
                            return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
                        })
                        .reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i], 0);
                /** @param {string} css */
                const ratio = (css) => {
                    const [hi, lo] = [lum(over(rgba(css), ground)), lum(ground)].sort((x, y) => y - x);
                    return Math.round(((hi + 0.05) / (lo + 0.05)) * 100) / 100;
                };
                return {
                    title: ratio(getComputedStyle(/** @type {Element} */ (dialog.querySelector('.kp-alarm__title'))).color),
                    detail: ratio(getComputedStyle(/** @type {Element} */ (dialog.querySelector('.kp-alarm__detail'))).color),
                    button: (() => {
                        const b = getComputedStyle(/** @type {Element} */ (dialog.querySelector('.kp-alarm__ack')));
                        const face = over(rgba(b.backgroundColor), ground);
                        const [hi, lo] = [lum(over(rgba(b.color), face)), lum(face)].sort((x, y) => y - x);
                        return Math.round(((hi + 0.05) / (lo + 0.05)) * 100) / 100;
                    })(),
                };
            });
            console.log(`[alarm] contrast ${theme}: ${JSON.stringify(numbers)}`);
            const floor = theme === 'high-contrast' ? 7 : 4.5;
            if (numbers.title < floor) low.push(`${theme}: headline ${numbers.title}`);
            if (numbers.detail < floor) low.push(`${theme}: detail ${numbers.detail}`);
            if (numbers.button < floor) low.push(`${theme}: button label ${numbers.button}`);
            await page.locator(`${OPEN} .kp-alarm__ack`).focus();
            await page.keyboard.press('Enter');
            await expect(page.locator(OPEN)).toHaveCount(0);
        }
        expect(low).toEqual([]);
        expect(errors).toEqual([]);
    },
);

/**
 * The glitch lives in cyberpunk alone [scope-98]. Kenny, judging formal's and
 * pastel's portraits: "het alarm geeft nog altijd het glitch effect, dat enkel
 * bij cyberpunk thuishoort". The package's default alarm arrives whole; the
 * flicker, the jitter, the chromatic split, the decode, the caret, the
 * marching hazard bars and the sweeping scan band are parts a register opts
 * into, and only cyberpunk's does. Read from the animations the engine runs
 * inside an open alarm, motion on, in all 22 themes.
 */
const GLITCH = [
    'kp-alarm-cyberpunk-flicker',
    'kp-alarm-jitter',
    'kp-alarm-slice-in',
    'kp-alarm-slice',
    'kp-alarm-decode-letter',
    'kp-alarm-decode-noise',
    'kp-alarm-caret',
    'kp-alarm-march',
    'kp-alarm-sweep',
];
test('the glitch and the flicker run only in cyberpunk, in all 22 themes [scope-98]', { tag: ['@component:alarm', '@sweep'] }, async ({ page }) => {
    test.setTimeout(120_000);
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    const errors = await open(page);
    expect(THEMES.length).toBe(22);
    /** @type {Record<string, string[]>} */
    const seen = {};
    for (const theme of THEMES) {
        await wear(page, theme);
        const names = await page.evaluate(async () => {
            void (/** @type {any} */ (window).showAlarm({ .../** @type {any} */ (window).kpAlarmOptions, mode: 'ack' }));
            await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
            const dialog = /** @type {HTMLDialogElement} */ (document.querySelector('dialog.kp-alarm[open]'));
            const list = document
                .getAnimations()
                .filter((a) => {
                    const t = /** @type {KeyframeEffect} */ (a.effect)?.target;
                    return t instanceof Element && dialog.contains(t);
                })
                .map((a) => /** @type {any} */ (a).animationName ?? `transition ${/** @type {any} */ (a).transitionProperty}`);
            dialog.close('ack');
            return [...new Set(list)].sort();
        });
        seen[theme] = names;
    }
    console.log(`[alarm] animations per theme: ${JSON.stringify(seen)}`);
    for (const theme of THEMES) {
        const glitch = seen[theme].filter((name) => GLITCH.includes(name));
        if (theme === 'cyberpunk') expect(glitch.sort(), 'cyberpunk keeps every part of its glitch').toEqual([...GLITCH].sort());
        else expect(glitch, `${theme} runs no glitch`).toEqual([]);
        expect(seen[theme].length, `${theme} still arrives with motion`).toBeGreaterThan(1);
    }
    expect(errors).toEqual([]);
});

/**
 * The DI5 report for the flicker cyberpunk keeps [scope-98]: every glitch
 * keyframe that steps opacity is rated from its TIMINGS row (js/effects.js,
 * the same arithmetic as reports/di5.md) and must read under 2.5 opposing
 * changes a second, a margin under WCAG's three.
 *
 * Until scope-100 the package's kp-alarm-flicker-in (0 -> 1 -> 0.3 -> 1 in
 * 600 ms, once) read 3.00/s here and the test was marked as an expected
 * failure. Kenny: "Ondieper, en opnieuw kijken" — cyberpunk's own
 * kp-alarm-cyberpunk-flicker (0 -> 0.6 -> 0.52 -> 1) reads 1.00/s.
 */
test('the DI5 report rates every flicker cyberpunk keeps under 2.5 per second [scope-98, scope-100]', { tag: ['@component:alarm'] }, async () => {
    const { TIMINGS } = await import('../js/effects.js');
    const { flashesPerSecond } = await import('../gates/check-motion.mjs');
    /** @type {string[]} */
    const over = [];
    for (const name of GLITCH) {
        const row = /** @type {any} */ (TIMINGS)[name];
        expect(row, `${name} has a TIMINGS row`).toBeTruthy();
        if (row.property !== 'opacity') continue;
        const rate = flashesPerSecond(
            row.luminanceSteps.map((/** @type {number} */ opacity, /** @type {number} */ stop) => ({ stop, opacity })),
            row.durationMs,
            row.cycles,
        );
        console.log(`[alarm] DI5 ${name}: ${rate.toFixed(2)}/s`);
        if (rate >= 2.5) over.push(`${name} ${rate.toFixed(2)}/s`);
    }
    expect(over).toEqual([]);
});

/**
 * The flash rate from rendered frames, carried over from the prototype's
 * check (research/alarm/verify.spec.mjs). Every animation is paused the
 * moment the alarm opens and stepped through 6 s of its own time (the loops
 * repeat every 5 s) at 30 frames per second, one screenshot per frame. Each
 * frame is cut into overlapping tiles of 170 x 128 CSS px — a quarter of
 * WCAG's 341 x 256 px ten-degree field — and each tile's mean relative
 * luminance and chromaticity are followed through time. A transition is a
 * change of 10% or more from the last extreme, with the darker state under
 * 0.8; a red transition is a u'v' shift over 0.2 to or from a state with
 * R/(R+G+B) >= 0.8. A flash is two opposing transitions; the result is the
 * most flashes any tile shows in any one-second window. An approximation of
 * what a Harding analyser does, not a certified one. WCAG allows 3; this
 * holds 2, a margin of one.
 */
const FLASH_THEMES = ['cyberpunk', 'synthwave', 'nostromo', 'terminal', 'formal', 'pastel', 'retro', 'sepia'];
for (const theme of FLASH_THEMES) {
    test(
        `flash rate in ${theme}: at most 2 per second, measured from rendered frames [WCAG 2.3.1]`,
        { tag: ['@component:alarm', `@theme:${theme}`] },
        async ({ page, browser }) => {
            test.setTimeout(180_000);
            await page.setViewportSize({ width: 1024, height: 768 });
            await open(page);
            await wear(page, theme);
            await page.mouse.move(1000, 760);
            await page.evaluate(async () => {
                await document.fonts.ready;
                void (/** @type {any} */ (window).showAlarm({ .../** @type {any} */ (window).kpAlarmOptions, mode: 'ack' }));
                for (const a of document.getAnimations()) a.pause();
                await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
                for (const a of document.getAnimations()) a.pause();
            });
            const animations = await page.evaluate(() => {
                const dialog = document.querySelector('dialog.kp-alarm[open]');
                return document
                    .getAnimations()
                    .filter((a) => {
                        const t = /** @type {KeyframeEffect} */ (a.effect)?.target;
                        return t instanceof Element && dialog?.contains(t);
                    })
                    .map((a) => /** @type {any} */ (a).animationName ?? /** @type {any} */ (a).transitionProperty);
            });
            // Formal's and pastel's alarms arrive on transitions and a register
            // keyframe or two [scope-98]; the neutral default runs five.
            expect(animations.length, 'the alarm runs its motion').toBeGreaterThan(2);

            const decoder = await browser.newPage();
            await decoder.setContent('<canvas id="c" width="1024" height="768"></canvas>');
            const FPS = 30;
            /** @type {{ t: number, tiles: { L: number, red: number, u: number, v: number }[] }[]} */
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
                    /** @param {number} v */
                    const lin = (v) => {
                        const c = v / 255;
                        return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
                    };
                    const out = [];
                    for (let y = 0; y + 128 <= height; y += 64) {
                        for (let x = 0; x + 170 <= width; x += 85) {
                            let L = 0;
                            let R = 0;
                            let G = 0;
                            let B = 0;
                            let n = 0;
                            for (let yy = y; yy < y + 128; yy += 4) {
                                for (let xx = x; xx < x + 170; xx += 4) {
                                    const q = (yy * width + xx) * 4;
                                    L += 0.2126 * lin(data[q]) + 0.7152 * lin(data[q + 1]) + 0.0722 * lin(data[q + 2]);
                                    R += data[q] / 255;
                                    G += data[q + 1] / 255;
                                    B += data[q + 2] / 255;
                                    n++;
                                }
                            }
                            R /= n;
                            G /= n;
                            B /= n;
                            const rl = lin(R * 255);
                            const gl = lin(G * 255);
                            const bl = lin(B * 255);
                            const X = 0.4124 * rl + 0.3576 * gl + 0.1805 * bl;
                            const Y = 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
                            const Z = 0.0193 * rl + 0.1192 * gl + 0.9505 * bl;
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
                /** @type {number[]} */
                const times = [];
                /** @type {number[]} */
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
                /** @param {number[]} list */
                const perSecond = (list) => Math.max(0, ...list.map((t0) => list.filter((t) => t >= t0 && t < t0 + 1000).length / 2));
                worst = Math.max(worst, perSecond(times));
                worstRed = Math.max(worstRed, perSecond(redTimes));
            }
            console.log(
                `[alarm] flash ${theme}: ${animations.length} animations, ${tileCount} tiles, worst ${worst} flashes/s, worst red ${worstRed}/s`,
            );
            expect(worst).toBeLessThanOrEqual(2);
            expect(worstRed).toBeLessThanOrEqual(2);
        },
    );
}
