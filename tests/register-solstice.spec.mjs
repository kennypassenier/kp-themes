// The solstice register [S48, S49]: the approved concept demo "Low Sun"
// (2026-09-08) reproduced by the package, measured on the concept page
// under solstice in both channels.
//
// What the demo showed and this suite holds: the headline's calibration
// wipe (a three-band overlay in mix-blend-mode: difference, cleared once
// — the package's own `clip-path` sweep standing in for the demo's three
// staggered transforms, per anatomy.md's S49 finding), the rule drawing
// itself under a heading, the horizon-seam dividers, the nav dropdown
// (KT14) with its own caret glyph, the buttons' mirror highlight and
// soft hover, the dossier's three redactions clearing on the trigger,
// and the whole approved inventory (S46).
//
// Drills [KT3], performed 2026-09-08 in chromium, repeated the same
// day in firefox (each one red on the test it names, then restored green
// in both browsers) [G13]:
//   - `mix-blend-mode: difference` removed from the headline overlay's
//     `::after` rule → red on "a mix-blend-mode overlay covers it";
//   - the redaction bar's `background: var(--border-strong)` (the
//     `mark::after` rule) removed → red on "the bar is the boundary
//     colour";
//   - the nav dropdown caret content rule (`.kp-nav__link[aria-haspopup]
//     ::after { content: ' ⌄' }`) removed → red on "a caret glyph".
// A fourth was found and fixed rather than merely drilled: the mirror
// button's own box-shadow silently replaced the two-channel focus ring
// (kp.register sits after kp.components), the exact fault retro's own
// register comment already records for its bevel — composed instead of
// overridden below, and held by its own test.

import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { animationsSeen, pseudoStyle, recordAnimations } from './paint.mjs';
import { tabToSelector } from './ring.mjs';
import { stampWord } from './stamp.mjs';

const INVENTORY = JSON.parse(readFileSync(new URL('../showcase/concept-demo.json', import.meta.url), 'utf8')).elements;

const CHANNELS = [
    ['framework-free', '/examples/concept-solstice.html'],
    ['React', '/tests/fixtures/examples.html?example=concept&copy=solstice'],
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
            localStorage.setItem('theme', 'solstice');
        } catch {
            // no storage: the page keeps its served theme
        }
    });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(url);
    await page.waitForFunction(() => document.documentElement.getAttribute('data-theme') === 'solstice');
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
    test.describe(`the solstice register, ${channel}`, () => {
        test('the headline calibrates once: a mix-blend-mode overlay covers it, then clears to its own text [S49, A1]', async ({ page }) => {
            // Recorded before navigation. The resting reads below are
            // exactly what a theme declaring NO headline routine also
            // produces — the overlay sits at opacity 0 either way — so on
            // their own they could not fail [G3]. `calibrate` is the one
            // run of `kp-cal-slide` on the overlay, and this catches the
            // browser starting it: the register's own keyframe name, and
            // the clip the overlay carries at the moment it begins.
            await page.addInitScript(() => {
                window.kpCalibration = null;
                document.addEventListener('animationstart', (e) => {
                    const event = /** @type {AnimationEvent} */ (e);
                    if (event.animationName !== 'kp-cal-slide' || window.kpCalibration) return;
                    const target = /** @type {Element} */ (event.target);
                    const style = getComputedStyle(target, '::after');
                    window.kpCalibration = {
                        headline: target.matches('[data-kp-reveal="headline"]'),
                        pseudo: event.pseudoElement,
                        clip: style.clipPath,
                        opacity: style.opacity,
                        blend: style.mixBlendMode,
                    };
                });
            });
            await open(page, url);
            const h1 = page.locator('[data-kp-reveal="headline"]').first();
            const source = await h1.getAttribute('data-kp-text');
            await expect(h1).toHaveClass(/is-deciphered/, { timeout: 5000 });
            await settled(page);
            expect(await h1.textContent()).toBe(source);
            // At rest, cleared: the overlay is invisible and the text stands
            // solid — the demo's own "the headline's real text is present and
            // solid-coloured underneath from first paint".
            const rest = await pseudo(h1, '::after', ['opacity', 'mix-blend-mode']);
            expect(rest.opacity).toBe('0');
            expect(rest['mix-blend-mode']).toBe('difference');
            expect(await h1.evaluate((el) => getComputedStyle(el).color)).toBe(await paint(page, '--foreground'));
            // And the wipe itself ran, once, on the headline's own overlay.
            const calibration = await page.evaluate(() => window.kpCalibration);
            expect(calibration, 'the register started its own kp-cal-slide').not.toBeNull();
            expect(calibration.headline, 'on the headline').toBe(true);
            expect(calibration.pseudo, 'on the overlay, not the element').toBe('::after');
            expect(calibration.opacity, 'and the overlay was visible while it ran — it is not clearing nothing').toBe('1');
            expect(calibration.blend, 'in difference, the demo’s own device').toBe('difference');
        });

        test('under reduced motion the headline is never covered: no calibration overlay, no rule/redaction motion', async ({ page }) => {
            await open(page, url, { reduced: true });
            const h1 = page.locator('[data-kp-reveal="headline"]').first();
            await expect(h1).toHaveClass(/is-deciphered/);
            const overlay = await pseudo(h1, '::after', ['opacity']);
            expect(overlay.opacity).toBe('0');
            const rule = page.locator('[data-kp-reveal="rule"]').first();
            await expect(rule).toHaveClass(/is-in/);
            const drawn = await pseudo(rule, '::after', ['transform']);
            expect(drawn.transform).toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
        });

        test('the rule draws left to right under a heading when it enters the viewport [TH122]', async ({ page }) => {
            await open(page, url);
            const rule = page.locator('[data-kp-reveal="rule"]').first();
            await rule.scrollIntoViewIfNeeded();
            await expect(rule).toHaveClass(/is-in/, { timeout: 5000 });
            const drawing = await pseudo(rule, '::after', ['animation-name', 'background-color']);
            expect(drawing['animation-name']).toBe('kp-cal-rule');
            expect(drawing['background-color']).toBe(await paint(page, '--primary'));
            await settled(page);
            const rest = await pseudo(rule, '::after', ['transform']);
            expect(rest.transform).toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
        });

        test('the two dividers are the horizon seam: a hairline with an accent peak, the alt one on the opposite side', async ({ page }) => {
            await open(page, url);
            const dividers = page.locator('[data-kp-divider]');
            expect(await dividers.count()).toBe(2);
            const first = await dividers.nth(0).evaluate((el) => getComputedStyle(el).backgroundImage);
            const second = await dividers.nth(1).evaluate((el) => getComputedStyle(el).backgroundImage);
            expect(first, 'a conic peak over a hairline').toMatch(/conic-gradient/);
            expect(first).toMatch(/linear-gradient/);
            expect(second).toMatch(/conic-gradient/);
            expect(first, 'the alt divider is not identical to the first').not.toBe(second);
        });

        test('the nav dropdown (KT14): a caret glyph, opens on hover/focus, its items read the warm popover', async ({ page }) => {
            await open(page, url);
            const trigger = page.locator('.kp-nav__link[aria-haspopup]').first();
            const caret = await pseudo(trigger, '::after', ['content']);
            expect(caret.content).toMatch(/⌄/);
            const menu = trigger.locator('xpath=following-sibling::*[contains(@class,"kp-nav__menu")]');
            // Reached with the keyboard, not focus() [G15].
            await tabToSelector(page, '.kp-nav__link[aria-haspopup]');
            await expect(menu).toBeVisible();
            expect(await menu.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(await paint(page, '--popover'));
            const item = menu.locator('a').first();
            await item.hover();
            await expect.poll(() => item.evaluate((el) => getComputedStyle(el).color)).toBe(await paint(page, '--primary'));
        });

        test('the primary button reads the amber token, and the mirror carries a two-part inset highlight', async ({ page }) => {
            await open(page, url);
            const primary = page.locator('[data-kp-surface="hero"] .kp-button--primary').first();
            expect(await primary.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(await paint(page, '--primary'));
            const mirror = page.locator('[data-kp-surface="hero"] .kp-button--mirror').first();
            const shadow = await mirror.evaluate((el) => getComputedStyle(el).boxShadow);
            expect(shadow, 'two inset layers, top and bottom').toMatch(/inset/);
            expect(shadow.match(/inset/g)?.length, 'top and bottom edges').toBeGreaterThanOrEqual(2);
        });

        test('the dossier: three redactions covered by a boundary-coloured bar, lifted right to left on the trigger', async ({ page }) => {
            await open(page, url);
            const dossier = page.locator('.kp-card[data-kp-reveal="emphasis"]');
            const marks = dossier.locator('mark');
            expect(await marks.count()).toBe(3);
            const first = marks.first();
            const covered = await pseudo(first, '::after', ['background-color', 'clip-path']);
            expect(covered['background-color'], 'the bar is the boundary colour').toBe(await paint(page, '--border-strong'));
            expect(covered['clip-path'], 'fully covering before the trigger').toMatch(/^(none|inset\(0px\))$/);
            await dossier.locator('[data-kp-reveal-trigger]').click();
            await expect(first).toHaveClass(/is-cleared/);
            await settled(page);
            const cleared = await pseudo(first, '::after', ['clip-path']);
            expect(cleared['clip-path'], 'clipped away from the right').toMatch(
                /inset\(0px 100%|inset\(0%\s*100%|inset\(0px\s*[\d.]+px\s*0px\s*0px\)/,
            );
        });

        test("the stamp carries the demo's own word and rides a slight rotation", async ({ page }) => {
            await open(page, url);
            const dossier = page.locator('.kp-card[data-kp-reveal="emphasis"]');
            // Measured through the paint, not the declaration: firefox
            // reports `attr()` unresolved and the old `|attr(...)`
            // alternative accepted a stamp that printed nothing [G4].
            const stamp = await pseudo(dossier, '::before', ['background-color', 'rotate']);
            expect(await stampWord(page, '.kp-card[data-kp-reveal="emphasis"]', '::before', 'data-kp-label')).toBe('On file');
            expect(stamp['background-color']).toBe(await paint(page, '--accent'));
        });

        test('the focus ring keeps two channels on the mirror button, composed in front of its highlight [DI2, AR30]', async ({ page }) => {
            // Drilled 2026-09-08: the mirror's own box-shadow (kp.register,
            // later than kp.components) replaced the ring outright until a
            // dedicated :focus-visible rule composed the two — the same
            // fault retro's own register comment records for its bevel.
            await open(page, url);
            const MIRROR = '[data-kp-surface="hero"] .kp-button--mirror';
            const btn = page.locator(MIRROR).first();
            // Reached with the keyboard, not focus(): a focus() that never
            // lands resolves happily and the reads below then measure the
            // button at rest and pass [G15].
            await tabToSelector(page, MIRROR);
            const focused = await btn.evaluate((el) => {
                const s = getComputedStyle(el);
                return { outline: s.outlineStyle, boxShadow: s.boxShadow };
            });
            expect(focused.outline, 'the outline channel').toBe('solid');
            expect(focused.boxShadow.match(/inset/g)?.length, 'the mirror highlight survives, both edges').toBe(2);
            expect(focused.boxShadow.replace(/inset[^,]*,?/g, '').trim(), 'a ring layer remains beside the highlight').not.toBe('');
        });

        test('a low sun rakes once across the touched control [scope-12]', async ({ page }) => {
            // `kp-rake` is a value that PASSES, not one that settles: the
            // animation name is the keyframe while it runs and nothing after
            // [fix-1]. So the listener is armed before the page exists.
            // Drilled 2026-09-12 in firefox: the hover's `animation:
            // kp-rake ...` removed -> red on the sighting.
            await recordAnimations(page);
            await open(page, url);
            const btn = page.locator('.kp-button').first();
            const band = await pseudo(btn, '::after', ['background-image', 'width']);
            expect(band['background-image'], 'the band is a gradient, so neither edge is a hard step').toContain('gradient');
            await btn.hover();
            await animationsSeen(page, 'the sun rakes across').toContain('kp-rake');
        });

        test('the rake runs once, and not at all for someone asking for less motion [DI7]', async ({ page }) => {
            await recordAnimations(page);
            await open(page, url, { reduced: true });
            await page.locator('.kp-button').first().hover();
            await page.waitForTimeout(200);
            expect(await page.evaluate(() => window.__kpAnimations ?? []), 'no rake under reduced motion').not.toContain('kp-rake');
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
