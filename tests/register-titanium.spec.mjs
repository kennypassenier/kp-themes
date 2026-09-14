// The titanium register [scope-17, scope-21]: the third world of the
// hypertech page Kenny approved on 2026-09-11 — "Titanium wordt een nieuw
// thema op zichzelf, het is heel mooi."
//
// Not a place but a material. The colour has a cause: anodising grows an
// oxide film whose thickness decides which wavelength survives, so the
// blue-violet on every edge is interference and shifts with the angle you
// look from. That is why the film turns with the pointer here and stands
// still nowhere.
//
// What this suite holds is the handful of things that would make it a
// different theme if they moved: the corner cut on the leading diagonal
// with the tool's bright line along the top, the film catching rather
// than sweeping, sixty milliseconds and linear, and the carbon twill. The
// milled groove between sections is judged by eye on the catalogue since
// scope-73 (page-effects#dividers).
//
// Drills [KT3], performed 2026-09-12 in firefox, each red on the test it
// names and then green again — listed at the test that names them.
import { expect, test } from '@playwright/test';
import { measured, style } from './paint.mjs';

const CHANNELS = [
    ['framework-free', '/examples/concept-titanium.html'],
    ['React', '/tests/fixtures/examples.html?example=concept&copy=titanium'],
];

/**
 * The React fixture serves whatever theme it was built with and switches on
 * the stored one, so the theme has to be set before the page exists — the
 * framework-free page carries it in its own markup. Measured 2026-09-12:
 * without this the fixture stayed on `formal` and all six React tests
 * failed on the theme, not on the register.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} url
 * @param {{ reduced?: boolean }} [options]
 */
async function open(page, url, { reduced = false } = {}) {
    await page.emulateMedia({ reducedMotion: reduced ? 'reduce' : 'no-preference' });
    await page.addInitScript(() => {
        try {
            localStorage.setItem('theme', 'titanium');
        } catch {
            // no storage: the page keeps its served theme
        }
    });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(url);
    await page.waitForFunction(() => document.documentElement.getAttribute('data-theme') === 'titanium');
}

for (const [channel, url] of CHANNELS) {
    test.describe(`the titanium register, ${channel}`, () => {
        test('the film catches rather than sweeps, and turns with the pointer [scope-17, scope-16]', async ({ page }) => {
            // Drilled: the hover's `opacity: 0.26` removed -> red on the
            // film appearing; `mix-blend-mode: screen` removed -> red on it
            // lightening rather than replacing; `--kp-pointer: track`
            // removed -> red on the angle moving.
            await open(page, url);
            const button = page.locator('[class="kp-button"]').first();
            const edge = button.locator('.kp-button__edge');
            expect(await edge.evaluate((el) => getComputedStyle(el).backgroundImage), 'a linear film on a flat face, not a conic one').toMatch(
                /linear-gradient/,
            );
            expect(await edge.evaluate((el) => getComputedStyle(el).mixBlendMode), 'a film is something you see through').toBe('screen');
            await style(edge, 'opacity', 'invisible until the part turns').toBe('0');

            await page.mouse.move(120, 300);
            const before = await edge.evaluate((el) => getComputedStyle(el).backgroundImage);
            await button.hover();
            // Polled: the film fades in over half again the theme's own
            // duration, and a single read lands mid-transition [fix-1].
            await style(edge, 'opacity', 'it catches the light').toBe('0.26');

            // And the angle follows the hand, which is the whole theme.
            await page.mouse.move(1100, 300);
            await measured(edge, (el) => getComputedStyle(el).backgroundImage, undefined, 'the angle moves with the pointer').not.toBe(before);
        });

        test('metal does not ease: sixty milliseconds, linear [scope-17]', async ({ page }) => {
            // Drilled: the whole transition block removed -> red on both.
            await open(page, url);
            const button = page.locator('[class="kp-button"]').first();
            const timing = await button.evaluate((el) => {
                const s = getComputedStyle(el);
                return { duration: s.transitionDuration, ease: s.transitionTimingFunction };
            });
            expect(timing.duration, 'sixty milliseconds').toMatch(/\b0\.06s\b/);
            expect(timing.ease, 'and no curve: a curve is the signature of something with give').toMatch(/^linear/);
        });

        test('the ground is carbon twill under a moving light [scope-17]', async ({ page }) => {
            // Drilled: the two repeating gradients removed -> red on the
            // weave; the radial gradient removed -> red on the light.
            await open(page, url);
            const ground = await page.evaluate(() => getComputedStyle(document.body).backgroundImage);
            expect(ground, 'the light under the hand').toMatch(/radial-gradient/);
            expect((ground.match(/repeating-linear-gradient/g) ?? []).length, 'two diagonals crossing, which is a twill').toBe(2);
        });

        test('nothing moves for someone who asked for less motion [DI7]', async ({ page }) => {
            await open(page, url, { reduced: true });
            const button = page.locator('[class="kp-button"]').first();
            expect(await button.evaluate((el) => getComputedStyle(el).transitionDuration), 'no transition at all').toMatch(/^0s/);
            await page.mouse.move(1100, 700);
            await page.waitForTimeout(200);
            expect(
                await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--kp-px').trim()),
                'and the film does not follow the hand either',
            ).toBe('0.5');
        });
    });
}
