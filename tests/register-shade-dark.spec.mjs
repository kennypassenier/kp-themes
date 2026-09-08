// The shade-dark register [S48, LIFT_PLAN row 24, SD1–SD4]: the approved
// concept demo "Undertow Editorial" (2026-09-08) reproduced by the
// package, measured on the concept page under shade-dark in both
// channels.
//
// What the demo showed and this suite holds: the headline's words arriving
// out of a blur, the rule drawing itself in on scroll, the hero button and
// the dossier card settling out of the same blur once on load, the loose
// hero mark as a static signal plate (never covered), the dossier's marks
// as ink plates that clear left to right on the trigger, the two-channel
// focus ring, the divider's radial swell, and the whole approved inventory.
//
// Drills [KT3], performed 2026-09-08 in chromium, repeated the same
// day in firefox (each one red on the test it names, then restored green
// in both browsers) [G13]:
//   - the loose-mark rule (`[data-theme='shade-dark'] mark { background:
//     var(--fx-signal); ... }`) removed → the hero mark painted no
//     background at all, red on "the lede mark is a signal plate";
//   - `[data-theme='shade-dark'][data-kp-effects] .kp-card[data-kp-reveal=
//     'emphasis'] mark:not(.is-cleared) { color: transparent; }` removed →
//     the redacted phrase read its own text before the trigger, red on
//     "covered before the trigger";
//   - the rule's `:not(.is-in)::after { transform: scaleX(0); }` removed →
//     the rule stood fully drawn while still off-screen, red on "scaleX(0)
//     while off-screen".

import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { tabToSelector } from './ring.mjs';

const INVENTORY = JSON.parse(readFileSync(new URL('../showcase/concept-demo.json', import.meta.url), 'utf8')).elements;

const CHANNELS = [
    ['framework-free', '/examples/concept-shade-dark.html'],
    ['React', '/tests/fixtures/examples.html?example=concept&copy=shade-dark'],
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
            localStorage.setItem('theme', 'shade-dark');
        } catch {
            // no storage: the page keeps its served theme
        }
    });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(url);
    await page.waitForFunction(() => document.documentElement.getAttribute('data-theme') === 'shade-dark');
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
    test.describe(`the shade-dark register, ${channel}`, () => {
        test('the headline arrives word by word out of a blur, and ends as its own text [TH119]', async ({ page }) => {
            // Recorded before navigation. At rest the headline is simply
            // its own text with no wrappers — which is also exactly what a
            // theme declaring NO headline routine produces, so the reads
            // below could not fail on their own [G3]. `focus` is the word
            // routine: every word in its own span, each running the
            // register's `kp-focus` out of a blur. Caught while `is-words`
            // is still on the element, and the animation read off the word
            // itself rather than counted — a register that wrapped the
            // words but never animated them would pass a bare count.
            await page.addInitScript(() => {
                window.kpWords = 0;
                window.kpBlurred = false;
                new MutationObserver(() => {
                    const h = document.querySelector('[data-kp-reveal="headline"]');
                    if (!h) return;
                    const words = [...h.querySelectorAll('[data-word]')];
                    if (words.length > window.kpWords) window.kpWords = words.length;
                    if (!h.classList.contains('is-words')) return;
                    for (const word of words) {
                        const style = getComputedStyle(word);
                        if (style.animationName === 'kp-focus' && style.filter !== 'none') window.kpBlurred = true;
                    }
                }).observe(document, { subtree: true, childList: true, attributes: true });
            });
            await open(page, url);
            const h1 = page.locator('[data-kp-reveal="headline"]').first();
            const source = await h1.getAttribute('data-kp-text');
            expect(source).toBeTruthy();
            await expect(h1).toHaveAttribute('aria-label', source ?? '');
            await expect(h1).toHaveClass(/is-deciphered/, { timeout: 15000 });
            expect(await h1.textContent()).toBe(source);
            expect(await h1.locator('[data-word]').count(), 'no word wrappers remain once at rest').toBe(0);
            expect(await page.evaluate(() => window.kpWords), 'every word had its own span while the routine ran').toBe(source?.split(/\s+/).length);
            expect(await page.evaluate(() => window.kpBlurred), 'and each ran the register’s own kp-focus, out of a real blur').toBe(true);
            expect(await h1.evaluate((el) => getComputedStyle(el).filter), 'nothing is left blurred at rest').toBe('none');
        });

        test('under reduced motion the headline, the rule, the hero button and the dossier marks are all at rest', async ({ page }) => {
            await open(page, url, { reduced: true });
            await expect(page.locator('[data-kp-reveal="headline"]').first()).toHaveClass(/is-deciphered/);
            const rule = page.locator('[data-kp-reveal="rule"]').first();
            expect((await pseudo(rule, '::after', ['transform'])).transform).toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
            const cta = page.locator('[data-kp-surface="hero"] [data-kp-reveal="emphasis"]').first();
            expect(await cta.evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
            // The module still marks a loose mark `is-cleared` at rest (its
            // own bookkeeping), but the register's plate never keys off that
            // class for a loose mark — the signal background is unconditional.
            const mark = page.locator('[data-kp-surface="hero"] mark').first();
            expect(await mark.evaluate((el) => getComputedStyle(el).backgroundColor), 'the lede mark is never covered').toBe(
                await paint(page, '--fx-signal'),
            );
        });

        test('the lede mark is a static signal plate, never covered or cleared away [S49]', async ({ page }) => {
            await open(page, url);
            const mark = page.locator('[data-kp-surface="hero"] mark').first();
            await expect(mark).toBeVisible();
            // Drilled: removing the loose-mark rule below leaves this
            // `rgba(0, 0, 0, 0)` — the theme's default `mark` background.
            expect(await mark.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(await paint(page, '--fx-signal'));
            expect(await mark.evaluate((el) => getComputedStyle(el).color)).toBe(await paint(page, '--fx-signal-foreground'));
            // The text is always there and always coloured, whether or not
            // the effects module has run yet.
            expect((await mark.textContent())?.length).toBeGreaterThan(0);
        });

        test('the rule draws itself in when its heading enters the viewport, and stands drawn without the script [TH122]', async ({ page }) => {
            await page.addInitScript(() => {
                document.addEventListener('readystatechange', () => {
                    if (document.readyState !== 'interactive') return;
                    const spacer = document.createElement('div');
                    spacer.style.height = '1600px';
                    document.body.prepend(spacer);
                });
            });
            await open(page, url);
            const rule = page.locator('[data-kp-reveal="rule"]').first();
            const scale = () => rule.evaluate((el) => getComputedStyle(el, '::after').transform);
            // Drilled: removing `:not(.is-in)::after { transform: scaleX(0); }`
            // leaves this `matrix(1, ...)` while still off-screen, red.
            const before = await scale();
            expect(before, 'scaleX(0) while off-screen').toMatch(/matrix\(0,/);
            await rule.scrollIntoViewIfNeeded();
            await expect(rule).toHaveClass(/is-in/);
            await settled(page);
            await expect.poll(scale).toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
        });

        test('the hero button and the dossier card settle out of the blur once, on load [S49 finding]', async ({ page }) => {
            await open(page, url);
            const cta = page.locator('[data-kp-surface="hero"] [data-kp-reveal="emphasis"]').first();
            await expect.poll(() => cta.evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
            // `blur(0)` and `none` paint identically; the browser reports
            // whichever the keyframe's own end state wrote.
            expect(await cta.evaluate((el) => getComputedStyle(el).filter)).toMatch(/^(none|blur\(0px\))$/);
            const card = page.locator('.kp-card[data-kp-reveal="emphasis"]').first();
            await expect.poll(() => card.evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
        });

        test('the dossier: the marks are covered, clear left to right on the trigger, and stand plain without the script [TH120]', async ({
            page,
        }) => {
            await open(page, url);
            const dossier = page.locator('.kp-card[data-kp-reveal="emphasis"]').first();
            const trigger = dossier.locator('[data-kp-reveal-trigger]');
            const marks = dossier.locator('mark');
            await expect(trigger).toHaveAttribute('aria-pressed', 'false');
            // Drilled: removing `mark:not(.is-cleared) { color: transparent; }`
            // leaves the phrase in `--card-foreground` before the trigger — red.
            const before = await marks.first().evaluate((el) => getComputedStyle(el).color);
            expect(before, 'covered before the trigger').toBe('rgba(0, 0, 0, 0)');
            expect((await marks.first().textContent())?.length, 'the text is always in the DOM').toBeGreaterThan(0);
            const plate = await pseudo(marks.first(), '::after', ['transform']);
            expect(plate.transform, 'the plate covers the phrase before clearance').toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
            await trigger.click();
            await expect(trigger).toHaveAttribute('aria-pressed', 'true');
            await expect(marks.last()).toHaveClass(/is-cleared/);
            await settled(page);
            const after = await pseudo(marks.first(), '::after', ['transform']);
            expect(after.transform, 'the plate has receded').toMatch(/^matrix\(0,/);
            expect(await marks.first().evaluate((el) => getComputedStyle(el).color)).toBe(await paint(page, '--card-foreground'));
            await trigger.click();
            await expect(marks.first()).not.toHaveClass(/is-cleared/);
        });

        test('the focus ring keeps two channels: an outline in the foreground, a moat in the ground [DI2]', async ({ page }) => {
            await open(page, url);
            const PRIMARY = '[data-kp-surface="hero"] .kp-button--primary';
            const primary = page.locator(PRIMARY).first();
            // Reached with the keyboard, not focus(): a focus() that never
            // lands resolves happily and the reads below then measure the
            // button at rest and pass [G15].
            await tabToSelector(page, PRIMARY);
            const ring = await primary.evaluate((el) => {
                const s = getComputedStyle(el);
                return { outlineColor: s.outlineColor, outlineStyle: s.outlineStyle, boxShadow: s.boxShadow };
            });
            expect(ring.outlineStyle).toBe('solid');
            expect(ring.outlineColor).toBe(await paint(page, '--foreground'));
            expect(ring.boxShadow, 'the outer moat in the ground').toContain(await paint(page, '--background'));
        });

        test('the dividers swell in the next surface’s own tone, no literal blur() filter', async ({ page }) => {
            await open(page, url);
            const dividers = page.locator('[data-kp-divider]');
            expect(await dividers.count()).toBe(2);
            for (const i of [0, 1]) {
                const d = dividers.nth(i);
                const before = await pseudo(d, '::before', ['background-image', 'filter']);
                expect(before['background-image']).toMatch(/radial-gradient/);
                expect(before.filter).toBe('none');
                const after = await pseudo(d, '::after', ['background-image', 'opacity']);
                expect(after['background-image']).toMatch(/linear-gradient/);
            }
        });

        test('the dropdown is styled in the theme’s own language [KT14]', async ({ page }) => {
            await open(page, url);
            const parent = page
                .locator('.kp-nav__links > li')
                .filter({ has: page.locator('.kp-nav__menu') })
                .first();
            const link = parent.locator(':scope > a').first();
            await link.hover();
            const menu = parent.locator('.kp-nav__menu');
            await expect.poll(() => menu.evaluate((el) => getComputedStyle(el).visibility)).toBe('visible');
            expect(await menu.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(await paint(page, '--card'));
            const item = menu.locator('a').first();
            await item.hover();
            await expect.poll(() => item.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(await paint(page, '--secondary'));
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
