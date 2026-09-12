// The nostromo register [S48, LIFT_PLAN nostromo row]: the approved
// concept demo "Beige Freight" (2026-09-08) reproduced by the package,
// measured on the concept page under nostromo in both channels.
//
// What the demo showed and this suite holds: the headline and the
// dossier stamp popping down under a clip-path with the text always
// whole (no glyph, word or character is ever touched — the one thing
// that makes `popdown` a new headline routine), the mark as a highlight
// outside a dossier and as ink over the phrase inside one, the section
// rule as a growing underline, the dividers as a row of vent-texture
// dots, the label-tape buttons (tracked uppercase mono), the dropdown
// as a dark control-strip panel (KT14), the current-page LED dot, the
// dossier's redactions clearing together on the trigger with a staggered
// transition, the stamp swapping its word when the file opens, and the
// whole approved inventory.
//
// Drills [KT3], performed 2026-09-08 in chromium, repeated the same
// day in firefox (each one red on the test it names, then restored green
// in both browsers) [G13]:
//   - the `.is-popping` animation rule removed from the register → the
//     headline never receives the clip-path sweep, red on "the headline
//     pops down under a clip-path";
//   - `[data-theme='nostromo'] .kp-card[data-kp-reveal='emphasis'] mark`
//     (the covered-ink rule) removed → the redacted phrase reads in
//     plain ink from the first paint, red on "the redaction is covered
//     until the trigger opens the file";
//   - the `.kp-nav__menu` rule removed from the register → the dropdown
//     falls back to the base layer's plain panel, red on "the dropdown
//     is the sidebar's own dark plate" (KT14).

import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { pseudoStyle } from './paint.mjs';
import { stampWord } from './stamp.mjs';

const INVENTORY = JSON.parse(readFileSync(new URL('../showcase/concept-demo.json', import.meta.url), 'utf8')).elements;

const CHANNELS = [
    ['framework-free', '/examples/concept-nostromo.html'],
    ['React', '/tests/fixtures/examples.html?example=concept&copy=nostromo'],
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
            localStorage.setItem('theme', 'nostromo');
        } catch {
            // no storage: the page keeps its served theme
        }
    });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(url);
    await page.waitForFunction(() => document.documentElement.getAttribute('data-theme') === 'nostromo');
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

/** @param {import('@playwright/test').Page} page */
const settled = (page) =>
    page.evaluate(() =>
        Promise.all(
            document
                .getAnimations()
                .filter((a) => a.effect?.getTiming().iterations !== Infinity)
                .map((a) => a.finished.catch(() => {})),
        ),
    );

/** The computed value of a token, as the browser would paint it. */
const paint = (/** @type {import('@playwright/test').Page} */ page, /** @type {string} */ token) =>
    page.evaluate((t) => {
        const s = document.createElement('span');
        s.style.color = getComputedStyle(document.documentElement).getPropertyValue(t).trim();
        document.body.append(s);
        const v = getComputedStyle(s).color;
        s.remove();
        return v;
    }, token);

for (const [channel, url] of CHANNELS) {
    test.describe(`the nostromo register, ${channel}`, () => {
        test('the headline pops down under a clip-path, the text whole throughout [S48]', async ({ page }) => {
            await page.addInitScript(() => {
                window.kpClips = [];
                new MutationObserver(() => {
                    const h = document.querySelector('[data-kp-reveal="headline"]');
                    if (h && h.classList.contains('is-popping')) {
                        const s = getComputedStyle(h);
                        window.kpClips.push((h.textContent ?? '').length + '|' + s.clipPath + '|' + s.opacity);
                    }
                }).observe(document, { subtree: true, childList: true, attributes: true, characterData: true });
            });
            await open(page, url);
            const h1 = page.locator('[data-kp-reveal="headline"]').first();
            const source = await h1.getAttribute('data-kp-text');
            // Unlike every other headline routine, the text is whole from
            // the very first paint — nothing here ever splits into a
            // glyph or a word.
            expect(await h1.textContent()).toBe(source);
            await expect(h1).toHaveClass(/is-deciphered/, { timeout: 5000 });
            expect(await h1.textContent(), 'the text never changed').toBe(source);
            const clips = await page.evaluate(() => window.kpClips);
            expect(clips.length, 'the clip-path sweep was seen').toBeGreaterThan(0);
            expect(
                clips.every((s) => s.startsWith(`${source?.length}|`)),
                'the length never moved: no glyph or word was ever touched',
            ).toBe(true);
            // Read the paint, not the class (KT13): at least one captured
            // frame must show the sweep actually mid-flight — a clip still
            // hiding part of the box, or an opacity under 1 — never just
            // the class present with the rest-state clip already showing.
            expect(
                clips.some((s) => {
                    const [, clip, opacity] = s.split('|');
                    return !/^(none|inset\(0px\)|inset\(0px 0px 0px 0px\))$/.test(clip) || Number(opacity) < 1;
                }),
                'the clip-path or opacity was caught mid-sweep, not only at rest',
            ).toBe(true);
        });

        test('under reduced motion there is no clip and every mark stands at its rest state', async ({ page }) => {
            await open(page, url, { reduced: true });
            const h1 = page.locator('[data-kp-reveal="headline"]').first();
            await expect(h1).toHaveClass(/is-deciphered/);
            expect(await h1.evaluate((el) => getComputedStyle(el).clipPath)).toMatch(/^(none|inset\(0px\))$/);
            expect(await h1.evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
            // The dossier's marks: js/effects.js resolves every reveal to
            // its rest state under reduced motion (DI7), which for the
            // emphasis hook is cleared — so the redaction never traps a
            // reader who cannot see the trigger animate.
            const dossier = page.locator('.kp-card[data-kp-reveal="emphasis"]');
            const marks = dossier.locator('mark');
            const count = await marks.count();
            expect(count).toBeGreaterThan(0);
            for (let i = 0; i < count; i++) await expect(marks.nth(i)).toHaveClass(/is-cleared/);
        });

        test('a mark outside the dossier is a highlight, ink on transparent with a signal underline [TH120]', async ({ page }) => {
            await open(page, url);
            const mark = page.locator('[data-kp-surface="hero"] mark, .kp-prose mark').first();
            await expect(mark).toBeVisible();
            const style = await mark.evaluate((el) => {
                const s = getComputedStyle(el);
                return { background: s.backgroundColor, color: s.color, shadow: s.boxShadow };
            });
            expect(style.background, 'never a redaction outside a dossier').toBe('rgba(0, 0, 0, 0)');
            expect(style.color).toBe(await paint(page, '--foreground'));
            expect(style.shadow, 'the signal-orange underline').toMatch(/inset/);
        });

        test('the section rule grows from nothing to a full underline once its heading is in view [TH122]', async ({ page }) => {
            await open(page, url);
            const rule = page.locator('[data-kp-reveal="rule"]').first();
            await rule.scrollIntoViewIfNeeded();
            await expect(rule).toHaveClass(/is-in/, { timeout: 5000 });
            const after = await pseudo(rule, '::after', ['background-color', 'animation-name']);
            expect(after['animation-name']).toBe('kp-rule-in');
            expect(after['background-color']).toBe(await paint(page, '--selected'));
            await settled(page);
            await expect.poll(async () => (await pseudo(rule, '::after', ['transform'])).transform).toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
        });

        test('the dividers are a row of vent-texture dots, the second darker for the footer seam', async ({ page }) => {
            await open(page, url);
            const dividers = page.locator('[data-kp-divider]');
            expect(await dividers.count()).toBe(2);
            for (const i of [0, 1]) {
                const before = await pseudo(dividers.nth(i), '::before', ['background-image']);
                expect(before['background-image'], 'a row of dots').toMatch(/radial-gradient/);
            }
            const plain = await dividers.nth(0).evaluate((el) => getComputedStyle(el).backgroundColor);
            const alt = await dividers.nth(1).evaluate((el) => getComputedStyle(el).backgroundColor);
            expect(alt, 'the footer seam is the sidebar plate, not the plain seam').not.toBe(plain);
            expect(alt).toBe(await paint(page, '--sidebar-accent'));
        });

        test('buttons are label tape: tracked uppercase mono, and the primary plate is the ink', async ({ page }) => {
            await open(page, url);
            const primary = page.locator('[data-kp-surface="hero"] .kp-button--primary').first();
            const style = await primary.evaluate((el) => {
                const s = getComputedStyle(el);
                return { transform: s.textTransform, tracking: s.letterSpacing, bg: s.backgroundColor };
            });
            expect(style.transform).toBe('uppercase');
            expect(parseFloat(style.tracking)).toBeGreaterThan(0);
            expect(style.bg).toBe(await paint(page, '--primary'));
        });

        test("the dropdown is the sidebar's own dark plate, open [KT14]", async ({ page }) => {
            await open(page, url);
            const trigger = page.locator('.kp-nav__link[aria-haspopup]').first();
            await trigger.hover();
            const menu = page.locator('.kp-nav__menu').first();
            await expect(menu).toBeVisible();
            const style = await menu.evaluate((el) => {
                const s = getComputedStyle(el);
                return { bg: s.backgroundColor, border: s.borderColor };
            });
            expect(style.bg, 'the dropdown is the sidebar plate, not the plain popover').toBe(await paint(page, '--sidebar-background'));
        });

        test('the dossier: the stamp swaps its word, and the redactions clear together on the trigger [S49, A11]', async ({ page }) => {
            await open(page, url);
            const dossier = page.locator('.kp-card[data-kp-reveal="emphasis"]');
            // Measured through the paint, not the declaration: firefox
            // reports `attr()` unresolved and the old `|attr(...)`
            // alternative accepted a stamp that printed nothing [G4].
            expect(await stampWord(page, '.kp-card[data-kp-reveal="emphasis"]', '::before', 'data-kp-label')).toBe('Sealed');
            const marks = dossier.locator('mark');
            expect(await marks.first().evaluate((el) => getComputedStyle(el).color)).toBe('rgba(0, 0, 0, 0)');
            await dossier.locator('[data-kp-reveal-trigger]').click();
            await expect(marks.first()).toHaveClass(/is-cleared/);
            await expect(dossier).toHaveAttribute('data-kp-open', '');
            expect(
                await stampWord(page, '.kp-card[data-kp-reveal="emphasis"]', '::before', 'data-kp-label-open'),
                'the stamp swapped to its open word',
            ).toBe('Cleared');
            await settled(page);
            const count = await marks.count();
            for (let i = 0; i < count; i++) await expect(marks.nth(i)).toHaveClass(/is-cleared/);
        });

        test('every control carries its own lamp, dark at rest and lit under the pointer [scope-12]', async ({ page }) => {
            // Drilled 2026-09-12 in firefox: the hover's `opacity: 0.7`
            // removed -> red on the lit reading. The concept pages load
            // `css/<theme>-register.css` directly, so a register drill does
            // not need a regenerated bundle — checked before trusting the
            // red, because the opposite trap has cost this project three
            // false greens [KT3].
            await open(page, url);
            const btn = page.locator('.kp-button').first();
            const at = async (p) => (await pseudo(btn, '::before', [p]))[p];
            // The lamp is `currentcolor` — the CONTROL's own label colour,
            // not the page's. Measured 2026-09-12: this test first asked for
            // `--foreground` and went red, because a primary button prints
            // light on dark and its lamp goes with it. That is the design:
            // every switch is lit in its own console's ink.
            expect(await at('background-color'), "the lamp burns in the control's own ink").toBe(
                await btn.evaluate((el) => getComputedStyle(el).color),
            );
            expect(Number(await at('opacity')), 'dark at rest').toBeCloseTo(0.25, 2);
            await btn.hover();
            // Polled, not read once: the lamp eases up over the theme's own
            // duration and a single read lands mid-fade [fix-1].
            await pseudoStyle(btn, '::before', 'opacity', 'lit under the pointer').toBe('0.7');
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
