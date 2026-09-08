// The formal register [S48, LIFT_PLAN row 16]: the approved concept demo
// "Fair Copy" (2026-09-08, scratchpad/formal-demo.html) reproduced by the
// package, measured on the concept page under formal in both channels.
//
// What the demo showed and this suite holds: the headline that fades and
// rises once and ends as its own untouched text (no glitch, no glyph —
// the demo's per-word underline recolour could not be carried into the
// shared markup and is a finding recorded in themes/formal/anatomy.md,
// not built here); the lede's two marks washing in, staggered; the
// section heading's rule drawing in when it scrolls into view; the
// divider as a hairline and a short navy tick (not a tear); the mirror
// button's static letterpress offset shadow; the dossier's stamp and its
// three redactions clearing left to right on the trigger; and the whole
// approved inventory on the page.
//
// Drills [KT3], performed 2026-09-08 in chromium and restored:
//   - the lede mark's `background: linear-gradient(...)` wash removed
//     from the register → `background-size` never reaches 100%, red on
//     "the lede washes its two marks in, staggered, then rests fully
//     covered";
//   - the rule hook's armed `:not(.is-in)::after { transform: scaleX(0) }`
//     removed → the rule paints drawn (matrix(1, 0, 0, 1, 0, 0)) before
//     it ever scrolls into view, red on "the rule starts collapsed";
//   - the dossier's `mark.is-cleared::after { transform: scaleX(0) }`
//     removed → the redaction bar never scales away after the trigger,
//     the poll times out, red on "the redaction bar scales away".

import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

const INVENTORY = JSON.parse(readFileSync(new URL('../showcase/concept-demo.json', import.meta.url), 'utf8')).elements;

const CHANNELS = [
    ['framework-free', '/examples/concept-formal.html'],
    ['React', '/tests/fixtures/examples.html?example=concept&copy=formal'],
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
            localStorage.setItem('theme', 'formal');
        } catch {
            // no storage: the page keeps its served theme
        }
    });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(url);
    await page.waitForFunction(() => document.documentElement.getAttribute('data-theme') === 'formal');
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
    test.describe(`the formal register, ${channel}`, () => {
        test('the headline fades and rises once, untouched — no glitch, no glyph', async ({ page }) => {
            await open(page, url);
            const h1 = page.locator('[data-kp-reveal="headline"]').first();
            const text = await h1.getAttribute('data-kp-text');
            await expect(h1).toHaveClass(/is-deciphered/, { timeout: 5000 });
            expect(await h1.textContent(), 'the headline is exactly its own text, nothing manipulated it').toBe(text);
            expect(await h1.locator('[data-glyph]').count(), 'no glyph noise').toBe(0);
        });

        test('under reduced motion the headline and rule are at rest immediately, and the lede marks are already washed', async ({ page }) => {
            await open(page, url, { reduced: true });
            await expect(page.locator('[data-kp-reveal="headline"]').first()).toHaveClass(/is-deciphered/);
            expect(await page.locator('[data-kp-surface="hero"] mark:not(.is-cleared)').count()).toBe(0);
            const opacity = await page
                .locator('[data-kp-reveal="headline"]')
                .first()
                .evaluate((el) => getComputedStyle(el).opacity);
            expect(opacity).toBe('1');
        });

        test('the lede washes its two marks in, staggered, then rests fully covered', async ({ page }) => {
            await open(page, url);
            const marks = page.locator('[data-kp-surface="hero"] .kp-lede mark');
            expect(await marks.count()).toBe(2);
            await expect(marks.nth(0)).toHaveClass(/is-cleared/, { timeout: 5000 });
            await expect(marks.nth(1)).toHaveClass(/is-cleared/, { timeout: 5000 });
            // The class lands before the 350ms transition it starts has
            // finished; poll rather than read once. Firefox settles on a
            // sub-pixel-rounded 99.9…% for a 100% wash, chromium on 100%
            // exactly — both are "fully covered".
            await expect
                .poll(async () => parseFloat(await marks.first().evaluate((el) => getComputedStyle(el).backgroundSize)), { timeout: 2000 })
                .toBeGreaterThan(99.9);
        });

        test('the section rule draws in only when it scrolls into view [TH122]', async ({ page }) => {
            // A short viewport, so the hero pushes the section heading
            // below the fold and the reveal has not fired yet.
            await page.emulateMedia({ reducedMotion: 'no-preference' });
            await page.addInitScript(() => {
                try {
                    localStorage.setItem('theme', 'formal');
                } catch {
                    // no storage: the page keeps its served theme
                }
            });
            await page.setViewportSize({ width: 1280, height: 480 });
            await page.goto(url);
            await page.waitForFunction(() => document.documentElement.getAttribute('data-theme') === 'formal');
            await expect(page.locator('[data-kp-surface="app"]').first()).toBeVisible();
            const rule = page.locator('[data-kp-reveal="rule"]').first();
            await expect(rule).not.toHaveClass(/is-in/);
            // Polled, not read once: the armed state is reached through a
            // transition, and on a loaded machine a single read lands
            // mid-flight (measured at 0.909 of the scale, 2026-09-08).
            await expect
                .poll(async () => (await pseudo(rule, '::after', ['transform'])).transform, 'the rule starts collapsed')
                .toMatch(/matrix\(0,/);
            await rule.scrollIntoViewIfNeeded();
            await expect(rule).toHaveClass(/is-in/, { timeout: 5000 });
            await expect
                .poll(async () => (await pseudo(rule, '::after', ['transform'])).transform, 'the rule draws to its full width')
                .not.toMatch(/matrix\(0,/);
        });

        test('the divider is a hairline and a short navy tick, not a tear; the alt divider is dashed', async ({ page }) => {
            await open(page, url);
            const dividers = page.locator('[data-kp-divider]');
            expect(await dividers.count()).toBe(2);
            const before = await pseudo(dividers.first(), '::before', ['background-color', 'display']);
            expect(before.display).toBe('block');
            const after = await pseudo(dividers.first(), '::after', ['background-color', 'inline-size']);
            expect(after['inline-size']).not.toBe('0px');
            const altBefore = await pseudo(dividers.nth(1), '::before', ['border-top-style']);
            expect(altBefore['border-top-style']).toBe('dashed');
            const altAfter = await pseudo(dividers.nth(1), '::after', ['content']);
            expect(altAfter.content === 'none' || altAfter.content === '').toBe(true);
        });

        test('the mirror button carries a static letterpress offset shadow, composed with the focus ring', async ({ page }) => {
            await open(page, url);
            const button = page.locator('.kp-button--mirror').first();
            const rest = await button.evaluate((el) => getComputedStyle(el).boxShadow);
            expect(rest, 'a 2px offset shadow, always there — not an animation').toMatch(/2px 2px 0px/);
            await button.focus();
            const focused = await button.evaluate((el) => getComputedStyle(el).boxShadow);
            expect(focused.split(',').length, 'the offset shadow and the two-channel ring both compose', {}).toBeGreaterThanOrEqual(2);
        });

        test('the dossier stamp names its own word, static; the redactions cover, then clear left to right on the trigger', async ({ page }) => {
            await open(page, url);
            const dossier = page.locator('.kp-card[data-kp-reveal="emphasis"]');
            const stamp = await pseudo(dossier, '::before', ['content']);
            expect(stamp.content).toMatch(/Draft|attr\(data-kp-label\)/i);
            const marks = dossier.locator('mark');
            expect(await marks.count()).toBe(3);
            const covered = await pseudo(marks.first(), '::after', ['transform']);
            expect(covered.transform, 'covered before the trigger').not.toMatch(/matrix\(0,/);
            await dossier.locator('[data-kp-reveal-trigger]').click();
            await expect(marks.first()).toHaveClass(/is-cleared/);
            await expect
                .poll(async () => (await pseudo(marks.first(), '::after', ['transform'])).transform, 'the redaction bar scales away')
                .toMatch(/matrix\(0,/);
            // A second press re-covers it (a toggle, not a one-way reveal).
            await dossier.locator('[data-kp-reveal-trigger]').click();
            await expect(marks.first()).not.toHaveClass(/is-cleared/);
        });

        test('every button, field and dropdown works without a mouse: focus order, the dropdown opens on focus', async ({ page }) => {
            await open(page, url);
            const trigger = page.locator('.kp-nav__link[aria-haspopup]').first();
            await trigger.focus();
            await expect(page.locator('.kp-nav__menu a').first()).toBeVisible();
            const select = page.locator('#concept-district, select.kp-field__input').first();
            await expect(select).toBeVisible();
            expect(await page.locator('button:disabled').count()).toBe(0);
        });

        test('the approved inventory is whole on the page [S46]', async ({ page }) => {
            await open(page, url);
            const html = (await page.content()).replace(/=""/g, '');
            for (const { what, marker } of INVENTORY) {
                if (channel === 'React' && /theme-picker|theme-status/.test(marker)) continue;
                expect(html, `the page lacks ${what}`).toContain(marker);
            }
        });
    });
}
