// The compare pages: one page per theme, the whole concept demo under
// 4.0.0 on the left and under the current build on the right, the
// measured differences said above the pair and marked on the demo where
// they show [MR-R6-COMPARE, C5, Kenny's third reading of 2026-09-08].
//
// The third reading found two things the second version's tests had not:
// every theme section was visible at once (`.kp-stack` sets display and
// beats the hidden attribute — the test checked the attribute, not the
// paint), and a theme whose only difference is typography showed a near
// empty frame. So these tests ask for what is painted: one theme per
// page, the demo whole in both frames (every element of the approved
// inventory), the marks on exactly the pieces the measurement names and
// every mark visible, the left frame really 4.0.0, the right really the
// current build, and the frames scrolling together.
//
// Drills [KT3], performed 2026-09-08 in both browsers and restored:
//   - the MARKS map emptied in the generator → no mark on cyberpunk, red
//     on "the marks name the touched pieces";
//   - the left frame's stylesheet list given the current themes.css →
//     the left declares the 5.0.0 hero token, red on "the left is 4.0.0";
//   - the sync listener's `scrollTo` removed → the other frame stays at
//     0, red on "the frames scroll together".
//
// Flake, named [8a]: CI run 34163234434 (chromium only, 2026-09-07) saw
// the right frame stay at 0 in the scroll test; the page now attaches its
// sync to a frame that loaded before the script ran, and the test waits
// for both documents before it scrolls.

import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { THEMES } from '../js/theme-registry.js';

const INVENTORY = JSON.parse(readFileSync(new URL('../showcase/concept-demo.json', import.meta.url), 'utf8')).elements.filter(
    // The picker and its status line stay outside the frames on purpose.
    (e) => !/theme-picker|theme-status/.test(e.marker),
);

/** @param {import('@playwright/test').Page} page @param {string} theme */
async function open(page, theme) {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1400, height: 900 });
    await page.goto(`/examples/compare-${theme}.html`);
    await expect(page.locator(`[data-compare-theme="${theme}"]`)).toBeVisible();
    const pair = page.locator('[data-compare-pair=""]');
    for (const side of ['old', 'new']) {
        await expect(pair.frameLocator(`iframe[data-compare-side="${side}"]`).locator('[data-kp-surface="app"]')).toBeVisible();
    }
    return pair;
}

/** @param {import('@playwright/test').FrameLocator} frame */
const marks = (frame) =>
    frame.locator('[data-compare-mark]').evaluateAll((els) =>
        els.map((e) => ({
            label: e.getAttribute('data-compare-mark'),
            visible: getComputedStyle(e).display !== 'none' && e.getBoundingClientRect().height > 0,
        })),
    );

/** @param {import('@playwright/test').FrameLocator} frame */
const identity = (frame) =>
    frame.locator('html').evaluate((html) => ({
        theme: html.getAttribute('data-theme'),
        heroSource: getComputedStyle(html).getPropertyValue('--surface-hero-bg').trim(),
    }));

/**
 * The source the frame was served, as text: the inventory's markers are
 * written the way the generator writes them (`<div data-kp-divider>`),
 * and a browser serialises the same attribute as `data-kp-divider=""`.
 * @param {import('@playwright/test').Page} page @param {import('@playwright/test').Locator} iframe
 */
const served = async (page, iframe) => {
    const src = await iframe.getAttribute('src');
    const response = await page.request.get(new URL(src ?? '', page.url()).toString());
    return response.text();
};

test.describe('the compare pages', () => {
    test('cyberpunk: the statement names the rewritten register, the demo is whole on both sides, and the marks name the touched pieces', async ({
        page,
    }) => {
        const pair = await open(page, 'cyberpunk');
        const lines = await page.locator('[data-compare-lines] li').allTextContents();
        expect(lines.join(' ')).toMatch(/register is rewritten/);
        expect(lines.join(' ')).toMatch(/Two surfaces/);
        const old = pair.frameLocator('iframe[data-compare-side="old"]');
        const current = pair.frameLocator('iframe[data-compare-side="new"]');
        for (const side of ['old', 'new']) {
            const html = await served(page, pair.locator(`iframe[data-compare-side="${side}"]`));
            for (const { what, marker } of INVENTORY) expect(html, `the ${side} frame lacks ${what}`).toContain(marker);
        }
        const found = await marks(current);
        const labels = new Set(found.map((m) => m.label));
        expect([...labels], 'the marks name the touched pieces').toEqual(
            expect.arrayContaining(['Navigation', 'Buttons', 'Fields', 'Dossier', 'Tear', 'Two surfaces', 'Typography', 'Palette']),
        );
        expect(
            found.filter((m) => !m.visible),
            'every mark is painted',
        ).toEqual([]);
        // The same marks on the left, so the eye finds the same piece on both sides.
        expect(new Set((await marks(old)).map((m) => m.label))).toEqual(labels);
        expect((await identity(old)).theme).toBe('cyberpunk');
        expect((await identity(current)).theme).toBe('cyberpunk');
        expect((await identity(old)).heroSource, 'the left is 4.0.0').toBe('');
        expect((await identity(current)).heroSource, 'the right is the current build').not.toBe('');
    });

    // pastel: the type is the headline of its 5.0.0 change, and its
    // palette is marked too since the lift, because the demo's own lift
    // distance moved (--fx-lift 3px → 2px). The measurement, not the
    // test, decides which categories are marked.
    test('pastel: the statement is about typography, the demo is whole, and the type is marked', async ({ page }) => {
        const pair = await open(page, 'pastel');
        const lines = await page.locator('[data-compare-lines] li').allTextContents();
        expect(lines.join(' ')).toMatch(/Typography: Instrument Sans/);
        expect(lines.join(' ')).toMatch(/nothing visible changed/);
        const old = pair.frameLocator('iframe[data-compare-side="old"]');
        const current = pair.frameLocator('iframe[data-compare-side="new"]');
        const found = await marks(current);
        expect(new Set(found.map((m) => m.label)), 'the type is marked, and the palette since the lift moved --fx-lift').toEqual(
            new Set(['Typography', 'Palette']),
        );
        expect(found.filter((m) => !m.visible)).toEqual([]);
        expect((await identity(old)).theme).toBe('pastel');
        const html = await served(page, pair.locator('iframe[data-compare-side="old"]'));
        for (const { what, marker } of INVENTORY) expect(html, `the left frame lacks ${what}`).toContain(marker);
        // And the face really differs: Instrument Sans loads on the right, not on the left.
        const loaded = (frame) =>
            frame.locator('html').evaluate(async () => {
                await document.fonts.ready;
                return [...document.fonts].some((f) => f.status === 'loaded' && f.family.replace(/^["']|["']$/g, '') === 'Instrument Sans');
            });
        await expect.poll(() => loaded(current)).toBe(true);
        expect(await loaded(old)).toBe(false);
    });

    // R6-Q2 was decided on this page (Kenny, 2026-09-08, "Naar 0,06") and
    // then overtaken the same evening: he chose the second starfield demo,
    // and S49 makes an approved demo the specification. So dark paints at
    // its register's own value, over DI9's ceiling, with a ceiling of its
    // own in the texture gate and the overrun reported (S42). The proposal
    // pair is gone either way — there is nothing left to propose.
    test('dark: the texture statement names what the register paints, the texture is marked, and no proposal pair remains', async ({ page }) => {
        const pair = await open(page, 'dark');
        const lines = await page.locator('[data-compare-lines] li').allTextContents();
        expect(lines.join(' ')).toMatch(/Texture: the layer painted at 0\.5 in 4\.0\.0 and paints at 0\.238 now/);
        expect(lines.join(' '), "the statement names the theme's own ceiling and says the overrun is reported").toMatch(
            /this theme's own 0\.35 from its approved demo, the overrun reported/,
        );
        expect(await page.locator('[data-compare-pair="texture"]').count(), 'no proposal pair: the decision is taken').toBe(0);
        const current = pair.frameLocator('iframe[data-compare-side="new"]');
        expect(new Set((await marks(current)).map((m) => m.label))).toEqual(expect.objectContaining(new Set(['Texture', 'Typography'])));
        const opacity = (side) =>
            pair
                .frameLocator(`iframe[data-compare-side="${side}"]`)
                .locator('html')
                .evaluate((html) => parseFloat(getComputedStyle(html).getPropertyValue('--fx-texture-opacity')));
        await expect.poll(() => opacity('old')).toBeGreaterThan(0.4);
        // The right frame paints the register's own 0.35 layer, not the
        // base layer's 0.06: that is what a reader of this page sees, and
        // what the demo Kenny chose asks for.
        await expect.poll(() => opacity('new')).toBeCloseTo(0.35, 2);
        // The left frame wears dark, not the visitor's stored theme: the 4.0.0
        // module applies the stored one after the frame script (Kenny saw formal).
        await page.evaluate(() => localStorage.setItem('theme', 'formal'));
        await page.reload();
        await expect(pair.frameLocator('iframe[data-compare-side="old"]').locator('[data-kp-surface="app"]')).toBeVisible();
        await expect.poll(() => pair.frameLocator('iframe[data-compare-side="old"]').locator('html').getAttribute('data-theme')).toBe('dark');
    });

    test('the frames of a pair scroll together', async ({ page }) => {
        const pair = await open(page, 'cyberpunk');
        const left = pair.locator('iframe[data-compare-side="old"]');
        await expect
            .poll(() =>
                left.evaluate(
                    (frame) =>
                        frame.contentDocument.readyState === 'complete' &&
                        frame.contentDocument.documentElement.scrollHeight > frame.contentWindow.innerHeight + 300,
                ),
            )
            .toBe(true);
        await left.evaluate((frame) => frame.contentWindow.scrollTo(0, 300));
        await expect
            .poll(() => pair.locator('iframe[data-compare-side="new"]').evaluate((frame) => frame.contentWindow.scrollY), { timeout: 3000 })
            .toBeGreaterThan(200);
    });

    test('one theme per page: the index links all 24, each page marks its own and shows no other', async ({ page }) => {
        await page.goto('/examples/compare.html');
        expect(await page.locator('[data-theme-link]').count()).toBe(THEMES.length);
        await open(page, 'nostromo');
        await expect(page.locator('[data-theme-link="nostromo"]')).toHaveAttribute('aria-current', 'page');
        expect(await page.locator('[data-compare-theme]').count()).toBe(1);
        expect(await page.locator('h1').first().textContent()).toMatch(/Nostromo/);
        // The page wears its own theme, not the visitor's stored one (the
        // third reading: a pastel page in cyberpunk chrome).
        await page.evaluate(() => localStorage.setItem('kp-theme', 'cyberpunk'));
        await page.reload();
        await expect.poll(() => page.locator('html').getAttribute('data-theme')).toBe('nostromo');
        // What the paint says, not the attribute: this is the fault of the
        // second version, where every section was visible at once.
        expect(await page.locator('iframe').evaluateAll((els) => els.filter((e) => getComputedStyle(e).display !== 'none').length)).toBe(2);
    });
});
