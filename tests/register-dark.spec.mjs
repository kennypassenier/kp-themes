// The dark register [S48, LIFT_PLAN row 15, DK1–DK4]: the approved
// concept demo "Small Hours" (stars II, 2026-09-08) reproduced by the
// package, measured on the concept page under dark in both channels.
//
// What the demo showed and this suite holds: the headline resolving word
// by word out of a blur, the mark's two readings (the lede's ignite,
// scroll-bound and colour-only; the dossier's redact bar, staggered on
// the trigger), the rule sweeping in under a heading (also scroll-bound),
// the two night-seam dividers, the nav dropdown's own violet keyboard
// ring, the starfield's own texture layers (the 102-point field at 0.35,
// the ten shimmer stars masked to their own small window), and the whole
// approved inventory on the page. There is no arrival: the demo has no
// boot sequence.
//
// Drills [KT3], performed 2026-09-08 in both browsers and restored:
//   - `--kp-reveal-headline: resolve` removed from the register → the
//     module never wraps the headline's words (`routineOf` reads the
//     empty string and takes the "quiet" branch), red on "the headline
//     resolves word by word";
//   - the animation rule on `.is-words [data-word]` removed → the words
//     are wrapped but never animate (`animation-name` reads `none`
//     instead of `kp-resolve`), red on the same test;
//   - the armed redact rule (`[data-kp-effects] … mark:not(.is-cleared)
//     ::after { transform: scaleX(1) }`) removed → the dossier's marks
//     read uncovered before the trigger is ever pressed, red on "the
//     dossier is a log".

import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { tabToSelector } from './ring.mjs';

const INVENTORY = JSON.parse(readFileSync(new URL('../showcase/concept-demo.json', import.meta.url), 'utf8')).elements;

const CHANNELS = [
    ['framework-free', '/examples/concept-dark.html'],
    ['React', '/tests/fixtures/examples.html?example=concept&copy=dark'],
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
            localStorage.setItem('theme', 'dark');
        } catch {
            // no storage: the page keeps its served theme
        }
    });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(url);
    await page.waitForFunction(() => document.documentElement.getAttribute('data-theme') === 'dark');
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
                // Scroll-bound animations (the mark's ignite, the rule's
                // sweep) run on a ViewTimeline, not the document timeline;
                // their `finished` promise never resolves by the clock,
                // only by scroll, so waiting on it here would hang forever.
                .filter((a) => a.effect?.getTiming().iterations !== Infinity && a.timeline === document.timeline)
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
    test.describe(`the dark register, ${channel}`, () => {
        test('there is no arrival, and under reduced motion every reveal is at rest', async ({ page }) => {
            await open(page, url, { reduced: true });
            expect(await page.locator('.kp-boot').count(), 'the demo has no boot sequence').toBe(0);
            await expect(page.locator('[data-kp-reveal="headline"]').first()).toHaveClass(/is-deciphered/);
            const h1 = page.locator('[data-kp-reveal="headline"]').first();
            expect(await h1.locator('[data-word]').count(), 'the words are gone: the element is its text').toBe(0);
            const mark = page.locator('[data-kp-surface="hero"] mark').first();
            expect(await mark.evaluate((el) => getComputedStyle(el).color)).toBe(await paint(page, '--primary'));
            const rule = page.locator('[data-kp-reveal="rule"]').first();
            const after = await pseudo(rule, '::after', ['background-position', 'animation-name']);
            expect(after['animation-name'], 'no scroll-bound animation under reduced motion').toBe('none');
        });

        test('the headline resolves word by word out of a blur and ends as its own text [DK2]', async ({ page }) => {
            await page.addInitScript(() => {
                window.kpWords = 0;
                window.kpAnimated = false;
                new MutationObserver(() => {
                    const h = document.querySelector('[data-kp-reveal="headline"]');
                    if (!h) return;
                    const words = [...h.querySelectorAll('[data-word]')];
                    if (words.length > window.kpWords) window.kpWords = words.length;
                    // Probed while `.is-words` is still on the element, not
                    // only counted: a register that wraps the words but
                    // never animates them (the animation rule removed)
                    // would still pass a bare word-count check.
                    if (h.classList.contains('is-words') && words.some((w) => getComputedStyle(w).animationName === 'kp-resolve')) {
                        window.kpAnimated = true;
                    }
                }).observe(document, { subtree: true, childList: true, attributes: true });
            });
            await open(page, url);
            const h1 = page.locator('[data-kp-reveal="headline"]').first();
            const source = await h1.getAttribute('data-kp-text');
            await expect(h1).toHaveClass(/is-deciphered/, { timeout: 15000 });
            await settled(page);
            expect(await h1.textContent()).toBe(source);
            expect(await h1.locator('[data-word]').count(), 'the words are gone: the element is its text').toBe(0);
            expect(await page.evaluate(() => window.kpWords), 'every word had its span').toBe(source?.split(/\s+/).length);
            expect(await page.evaluate(() => window.kpAnimated), 'the words actually ran kp-resolve while armed').toBe(true);
            expect(await h1.evaluate((el) => getComputedStyle(el).filter), 'the blur is gone at rest').toBe('none');
            expect(await h1.evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
        });

        test('the lede mark ignites: it settles to the violet ink [TH120]', async ({ page }) => {
            await open(page, url);
            const mark = page.locator('[data-kp-surface="hero"] mark').first();
            // Scroll-bound (animation-timeline: view()), not a timed
            // one-shot: poll rather than wait for an animationend that may
            // never fire (an already-visible element can start past its
            // own entry range).
            await expect.poll(async () => mark.evaluate((el) => getComputedStyle(el).color), { timeout: 5000 }).toBe(await paint(page, '--primary'));
            const decoration = await mark.evaluate((el) => getComputedStyle(el).textDecorationColor);
            expect(decoration).toBe(await paint(page, '--border-strong'));
        });

        test('the rule sweeps in under a heading when it enters the viewport [TH122]', async ({ page }) => {
            const rule = page.locator('[data-kp-reveal="rule"]').first();
            await open(page, url);
            await rule.scrollIntoViewIfNeeded();
            const before = await pseudo(rule, '::after', ['background-image', 'height']);
            expect(before['background-image'], 'a violet-to-border gradient').toMatch(/linear-gradient/);
            expect(before.height).toBe('2px');
            await settled(page);
            await expect
                .poll(async () => (await pseudo(rule, '::after', ['background-position']))['background-position'].trim(), { timeout: 5000 })
                .toMatch(/^0(%|px)?( 0(%|px)?)?$/);
        });

        test('the dividers are a night seam: one step darker, a dense local sample, a violet centre line [TH121]', async ({ page }) => {
            await open(page, url);
            const dividers = page.locator('[data-kp-divider]');
            expect(await dividers.count()).toBe(2);
            const first = dividers.first();
            expect(await first.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(await paint(page, '--sidebar-background'));
            expect(await first.evaluate((el) => getComputedStyle(el).blockSize)).toBe('56px');
            const stars = await pseudo(first, '::before', ['opacity', 'background-image']);
            expect(Number(stars.opacity)).toBeCloseTo(0.09, 2);
            expect(stars['background-image'], 'the dense local sample').toMatch(/radial-gradient/);
            const line = await pseudo(first, '::after', ['background-image']);
            expect(line['background-image'], 'the violet centre line').toMatch(/linear-gradient/);
            const second = dividers.nth(1);
            expect(await second.evaluate((el) => getComputedStyle(el).transform), 'the alt divider mirrors').not.toBe('none');
        });

        test('the starfield is a still photograph at 0.35, over DI9’s ceiling and reported [S42]', async ({ page }) => {
            await open(page, url);
            const opacity = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--fx-texture-opacity').trim());
            expect(opacity).toBe('0.35');
            const field = await page.evaluate(() => {
                const s = getComputedStyle(document.body, '::after');
                return { image: s.backgroundImage, opacity: s.opacity, animationName: s.animationName };
            });
            expect(field.image, 'the 102-point field').toMatch(/radial-gradient/);
            expect(field.opacity).toBe('0.35');
            expect(field.animationName, 'a still photograph: nothing here loops').toBe('none');
            const spikes = await page.evaluate(() => {
                const s = getComputedStyle(document.body, '::before');
                return { image: s.backgroundImage, mask: s.maskImage || s.webkitMaskImage, animationName: s.animationName };
            });
            expect(spikes.image, 'the ten shimmer stars').toMatch(/conic-gradient/);
            expect(spikes.animationName).toBe('none');
        });

        test('the nav dropdown: a quiet panel, its own violet keyboard ring [KT14]', async ({ page }) => {
            await open(page, url);
            const trigger = page.locator('.kp-nav__link[aria-haspopup]').first();
            await trigger.hover();
            const menu = page.locator('.kp-nav__menu').first();
            await expect(menu).toBeVisible();
            expect(await menu.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(await paint(page, '--card'));
            const link = menu.locator('a').first();
            // Walked to with the keyboard, not focus(): :focus-visible is
            // the selector under test and a focus() that never lands would
            // read the item at rest [G15].
            await tabToSelector(page, '.kp-nav__menu a');
            const ring = await link.evaluate((el) => getComputedStyle(el).outlineColor);
            expect(ring, 'the keyboard state is the theme’s own violet, not the page-wide ink outline').toBe(await paint(page, '--primary'));
        });

        test('the buttons are a flat panel with an edge, rounded, no bevel', async ({ page }) => {
            await open(page, url);
            const button = page.locator('[data-kp-surface="hero"] .kp-button').nth(1);
            expect(await button.evaluate((el) => getComputedStyle(el).borderRadius)).not.toBe('0px');
            // The base layer's own bevel shadow is offset 0 (--fx-shadow-offset:
            // 0px, this theme's own token) and paints nothing; a real bevel would
            // read a non-zero offset.
            const shadow = await button.evaluate((el) => getComputedStyle(el).boxShadow);
            expect(shadow, 'no bevel: the base shadow is offset to zero').toMatch(/\b0px 0px 0px 0px$/);
            const primary = page.locator('[data-kp-surface="hero"] .kp-button--primary').first();
            expect(await primary.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(await paint(page, '--primary'));
        });

        test('the dossier is a log: the redact bar covers the words until the trigger is pressed', async ({ page }) => {
            await open(page, url);
            const dossier = page.locator('.kp-card[data-kp-reveal="emphasis"]');
            const mark = dossier.locator('mark').first();
            const covered = await pseudo(mark, '::after', ['transform']);
            expect(covered.transform, 'the bar covers the words before the trigger').not.toMatch(/matrix\(0,/);
            expect(await mark.evaluate((el) => getComputedStyle(el).color), 'the ink is hidden while covered').toBe('rgba(0, 0, 0, 0)');
            await dossier.locator('[data-kp-reveal-trigger]').click();
            await expect(mark).toHaveClass(/is-cleared/);
            await settled(page);
            await expect.poll(async () => (await pseudo(mark, '::after', ['transform'])).transform, 'the bar lifted off').toMatch(/matrix\(0,/);
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
