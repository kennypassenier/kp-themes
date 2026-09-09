// The synthwave register [S48, LIFT_PLAN row 1, SW1–SW4]: the approved
// concept demo "Outrun Horizon" (2026-09-08) reproduced by the package,
// measured on the concept page under synthwave in both channels.
//
// What the demo showed and this suite holds: the striped sun on the hero
// (a masked disc, static), the floor that drifts and never changes
// luminance, the horizon as divider (a 2px line with its glow), the chrome
// headline that goes through one tracking wipe and one shine and ends as
// its own text, the neon tube a <mark> switches on (dark glass while
// armed, a glow when on), the laser line under a heading, the stripe under
// a hovered nav link, the sun cut on a hovered button, the OSD face on a
// field label, the dossier's tracking noise that clears on its trigger,
// the boot arrival with its Skip once per session, and the whole approved
// inventory on the page.
//
// Drills [KT3], performed 2026-09-08 in both browsers and restored:
//   - the sun's mask-image removed from the register → the disc paints
//     whole, red on "the sun is striped";
//   - `--kp-arrival: boot` removed → no overlay, red on "the page boots";
//   - the tube's rest text-shadow removed → the on state carries no glow,
//     red on "the tube is on".

import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { bootGone, style } from './paint.mjs';

const INVENTORY = JSON.parse(readFileSync(new URL('../showcase/concept-demo.json', import.meta.url), 'utf8')).elements;

const CHANNELS = [
    ['framework-free', '/examples/concept.html'],
    ['React', '/tests/fixtures/examples.html?example=concept'],
];

/**
 * @param {import('@playwright/test').Page} page
 * @param {string} url
 * @param {{ reduced?: boolean }} [options]
 */
async function open(page, url, { reduced = false } = {}) {
    await page.emulateMedia({ reducedMotion: reduced ? 'reduce' : 'no-preference' });
    await page.addInitScript(() => {
        try {
            localStorage.setItem('theme', 'synthwave');
        } catch {
            // no storage: the page keeps its served theme
        }
    });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(url);
    await page.waitForFunction(() => document.documentElement.getAttribute('data-theme') === 'synthwave');
    await expect(page.locator('[data-kp-surface="app"]').first()).toBeVisible();
}

/** @param {import('@playwright/test').Locator} locator @param {string} pseudo @param {string[]} props */
const pseudo = (locator, pseudo, props) =>
    locator.evaluate(
        (el, [p, names]) => {
            const style = getComputedStyle(el, p);
            return Object.fromEntries(names.map((n) => [n, style.getPropertyValue(n)]));
        },
        [pseudo, props],
    );

for (const [channel, url] of CHANNELS) {
    test.describe(`the synthwave register, ${channel}`, () => {
        test('the page boots once per session, and Skip ends it at once [SW2]', async ({ page }) => {
            await open(page, url);
            const boot = page.locator('.kp-boot');
            await expect(boot).toBeVisible();
            await expect(boot.locator('.kp-boot__line')).toContainText(/%/);
            await boot.locator('.kp-boot__skip').click();
            await expect(boot).toHaveCount(0, { timeout: 3000 });
            await page.reload();
            await expect(page.locator('[data-kp-surface="app"]').first()).toBeVisible();
            expect(await page.locator('.kp-boot').count(), 'seen this session: no second boot').toBe(0);
        });

        test('under reduced motion there is no boot at all, and every reveal is at rest', async ({ page }) => {
            await open(page, url, { reduced: true });
            expect(await page.locator('.kp-boot').count()).toBe(0);
            await expect(page.locator('[data-kp-reveal="headline"]').first()).toHaveClass(/is-deciphered/);
            expect(await page.locator('[data-kp-surface="hero"] mark:not(.is-cleared)').count()).toBe(0);
        });

        test('the sun is striped and static; the floor drifts without changing luminance [DI5]', async ({ page }) => {
            await open(page, url);
            await page
                .locator('.kp-boot__skip')
                .click()
                .catch(() => {});
            // The click is dispatched, not finished: the overlay is fixed over
            // the whole page until it is actually removed [TF1].
            await bootGone(page);
            const hero = page.locator('[data-kp-surface="hero"]').first();
            const sun = await pseudo(hero, '::before', ['mask-image', '-webkit-mask-image', 'border-radius', 'animation-name', 'width']);
            expect(sun['mask-image'] || sun['-webkit-mask-image'], 'the sun is striped').toMatch(/linear-gradient/);
            expect(sun['border-radius']).toBe('50%');
            expect(sun['animation-name']).toBe('none');
            expect(parseFloat(sun.width)).toBeGreaterThan(100);
            const floor = await pseudo(hero, '::after', ['animation-name', 'animation-duration', 'transform', 'background-image']);
            expect(floor['animation-name']).toBe('kp-floor-drift');
            expect(parseFloat(floor['animation-duration'])).toBeGreaterThanOrEqual(4);
            expect(floor.transform).toMatch(/matrix3d/);
            expect(floor['background-image']).toMatch(/conic-gradient/);
        });

        test('the divider is the horizon: a 2px line with its glow over a receding grid', async ({ page }) => {
            await open(page, url);
            const divider = page.locator('[data-kp-divider]').first();
            const line = await pseudo(divider, '::before', ['height', 'box-shadow', 'background-color']);
            expect(line.height).toBe('2px');
            expect(line['box-shadow']).not.toBe('none');
            const grid = await pseudo(divider, '::after', ['transform', 'background-image']);
            expect(grid.transform).toMatch(/matrix3d/);
            expect(grid['background-image']).toMatch(/repeating-linear-gradient/);
        });

        test('the headline is chrome, goes through one tracking wipe and one shine, and ends as its own text [SW2]', async ({ page }) => {
            await page.addInitScript(() => {
                window.kpStates = [];
                const seen = new Set();
                new MutationObserver(() => {
                    const h = document.querySelector('[data-kp-reveal="headline"]');
                    if (!h) return;
                    for (const cls of ['is-tracking', 'is-shine', 'is-deciphered']) {
                        if (h.classList.contains(cls) && !seen.has(cls)) {
                            seen.add(cls);
                            window.kpStates.push(cls);
                        }
                    }
                }).observe(document, { subtree: true, attributes: true, attributeFilter: ['class'] });
            });
            await open(page, url);
            await page
                .locator('.kp-boot__skip')
                .click()
                .catch(() => {});
            // The click is dispatched, not finished: the overlay is fixed over
            // the whole page until it is actually removed [TF1].
            await bootGone(page);
            const h1 = page.locator('[data-kp-reveal="headline"]').first();
            const source = await h1.getAttribute('data-kp-text');
            await expect(h1).toHaveClass(/is-deciphered/, { timeout: 15000 });
            expect(await h1.textContent()).toBe(source);
            expect(await h1.locator('[data-glyph]').count(), 'no decipher glyphs: this theme tracks').toBe(0);
            const states = await page.evaluate(() => window.kpStates);
            expect(states.indexOf('is-tracking'), 'the wipe ran').toBeGreaterThanOrEqual(0);
            expect(states.indexOf('is-shine'), 'the shine followed').toBeGreaterThan(states.indexOf('is-tracking'));
            const style = await h1.evaluate((el) => {
                const s = getComputedStyle(el);
                return { clip: s.webkitBackgroundClip || s.backgroundClip, fill: s.webkitTextFillColor, image: s.backgroundImage };
            });
            expect(style.clip).toBe('text');
            expect(style.fill).toBe('rgba(0, 0, 0, 0)');
            expect(style.image).toMatch(/linear-gradient/);
        });

        test('the tube is on: a near-white core with a glow, dark glass while armed [TH120]', async ({ page }) => {
            await page.addInitScript(() => {
                window.kpArmed = [];
                new MutationObserver(() => {
                    const m = document.querySelector('[data-kp-surface="hero"] mark');
                    if (m && document.documentElement.hasAttribute('data-kp-effects') && !m.classList.contains('is-cleared')) {
                        window.kpArmed.push(getComputedStyle(m).textShadow);
                    }
                }).observe(document, { subtree: true, childList: true, attributes: true });
            });
            await open(page, url);
            await page
                .locator('.kp-boot__skip')
                .click()
                .catch(() => {});
            // The click is dispatched, not finished: the overlay is fixed over
            // the whole page until it is actually removed [TF1].
            await bootGone(page);
            const mark = page.locator('[data-kp-surface="hero"] mark').first();
            await expect(mark).toHaveClass(/is-cleared/, { timeout: 15000 });
            // The animation ends before the rest state is read.
            await page.evaluate(() =>
                Promise.all(
                    document
                        .getAnimations()
                        .filter((a) => a.effect?.getTiming().iterations !== Infinity)
                        .map((a) => a.finished.catch(() => {})),
                ),
            );
            const on = await mark.evaluate((el) => ({ shadow: getComputedStyle(el).textShadow, color: getComputedStyle(el).color }));
            expect(on.shadow, 'the tube is on').not.toBe('none');
            const armed = await page.evaluate(() => window.kpArmed);
            expect(
                armed.some((s) => s === 'none'),
                'dark glass while armed',
            ).toBe(true);
        });

        test('the laser line draws from the centre when its heading enters the viewport [TH122]', async ({ page }) => {
            await open(page, url);
            await page
                .locator('.kp-boot__skip')
                .click()
                .catch(() => {});
            // The click is dispatched, not finished: the overlay is fixed over
            // the whole page until it is actually removed [TF1].
            await bootGone(page);
            const rule = page.locator('[data-kp-reveal="rule"]').first();
            await rule.scrollIntoViewIfNeeded();
            await expect(rule).toHaveClass(/is-in/, { timeout: 5000 });
            const line = await pseudo(rule, '::after', ['transform-origin', 'height', 'transform']);
            expect(line['transform-origin']).toMatch(/^\d/);
            expect(line.height).toBe('2px');
            await page.evaluate(() =>
                Promise.all(
                    document
                        .getAnimations()
                        .filter((a) => a.effect?.getTiming().iterations !== Infinity)
                        .map((a) => a.finished.catch(() => {})),
                ),
            );
            expect((await pseudo(rule, '::after', ['transform'])).transform).toMatch(/none|matrix\(1,/);
        });

        test('the nav link carries the stripe on hover, and the button the sun cut', async ({ page }) => {
            await open(page, url);
            await page
                .locator('.kp-boot__skip')
                .click()
                .catch(() => {});
            // The click is dispatched, not finished: the overlay is fixed over
            // the whole page until it is actually removed [TF1].
            await bootGone(page);
            const link = page.locator('.kp-nav__link').nth(1);
            const before = await pseudo(link, '::after', ['transform']);
            expect(before.transform).toMatch(/matrix\(0,/);
            await link.hover();
            await expect.poll(async () => (await pseudo(link, '::after', ['transform'])).transform).toMatch(/none|matrix\(1,/);
            expect((await pseudo(link, '::after', ['background-image']))['background-image']).toMatch(/linear-gradient/);
            const button = page.locator('[data-kp-surface="hero"] .kp-button').first();
            await button.hover();
            await expect.poll(async () => (await pseudo(button, '::before', ['animation-name']))['animation-name']).toBe('kp-sun-cut');
            expect(await button.evaluate((el) => getComputedStyle(el).borderTopWidth)).toBe('2px');
        });

        test('the field label and the dossier stamp are in the OSD face, and the noise clears on the trigger', async ({ page }) => {
            await open(page, url);
            await page
                .locator('.kp-boot__skip')
                .click()
                .catch(() => {});
            // The click is dispatched, not finished: the overlay is fixed over
            // the whole page until it is actually removed [TF1].
            await bootGone(page);
            const label = page.locator('.kp-field__label').first();
            await style(label, 'font-family').toMatch(/VT323/);
            await expect
                .poll(() =>
                    page.evaluate(async () => {
                        await document.fonts.ready;
                        return [...document.fonts].some((f) => f.status === 'loaded' && /VT323/.test(f.family));
                    }),
                )
                .toBe(true);
            const dossier = page.locator('.kp-card[data-kp-reveal="emphasis"]');
            const stamp = await pseudo(dossier, '::before', ['content']);
            expect(stamp.content).toMatch(/●/);
            const mark = dossier.locator('mark').first();
            expect((await pseudo(mark, '::after', ['transform'])).transform, 'covered before the trigger').toMatch(/matrix\(1,/);
            await dossier.locator('[data-kp-reveal-trigger]').click();
            await expect(mark).toHaveClass(/is-cleared/);
            await page.evaluate(() =>
                Promise.all(
                    document
                        .getAnimations()
                        .filter((a) => a.effect?.getTiming().iterations !== Infinity)
                        .map((a) => a.finished.catch(() => {})),
                ),
            );
            expect((await pseudo(mark, '::after', ['transform'])).transform, 'the noise cleared').toMatch(/matrix\(0,/);
        });

        test('the approved inventory is whole on the page [S46]', async ({ page }) => {
            await open(page, url);
            // The browser serialises a bare attribute as `="";` the inventory
            // writes it the way the generator does.
            const html = (await page.content()).replace(/=""/g, '');
            for (const { what, marker } of INVENTORY) {
                if (channel === 'React' && /theme-picker|theme-status/.test(marker)) continue;
                expect(html, `the page lacks ${what}`).toContain(marker);
            }
        });
    });
}
