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
import { pseudoStyle, style } from './paint.mjs';
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

        test('the lede mark ignites: it settles to the signal [TH120]', async ({ page }) => {
            await open(page, url);
            const mark = page.locator('[data-kp-surface="hero"] mark').first();
            // Scroll-bound (animation-timeline: view()), not a timed
            // one-shot: poll rather than wait for an animationend that may
            // never fire (an already-visible element can start past its
            // own entry range).
            await expect.poll(async () => mark.evaluate((el) => getComputedStyle(el).color), { timeout: 5000 }).toBe(await paint(page, '--primary'));
            // Read from the mark's OWN context, not the page's. The hero
            // remaps --border-strong onto --surface-hero-border, and the two
            // happened to be the same value until 2026-09-12 — so this
            // comparison was right by coincidence and went red the moment
            // the hero's boundary moved on its own.
            const decoration = await mark.evaluate((el) => {
                const painted = getComputedStyle(el).textDecorationColor;
                const probe = document.createElement('span');
                probe.style.color = 'var(--border-strong)';
                el.append(probe);
                const expected = getComputedStyle(probe).color;
                probe.remove();
                return { painted, expected };
            });
            expect(decoration.painted, 'the strong boundary of the surface it stands on').toBe(decoration.expected);
        });

        test('the rule is the oxide, drawn from the leading edge [TH122, scope-16]', async ({ page }) => {
            // The spectral instrument replaced the old sweep of a gradient
            // position with a band that scales out, because the band IS the
            // film here — there is nothing to slide, only more or less of
            // it. Scroll-bound, so poll rather than wait for an
            // animationend that an already-visible element never fires.
            const rule = page.locator('[data-kp-reveal="rule"]').first();
            await open(page, url);
            await rule.scrollIntoViewIfNeeded();
            const band = await pseudo(rule, '::after', ['background-image', 'height', 'transform-origin']);
            expect(band['background-image'], 'the oxide, not a two-stop gradient').toMatch(/conic-gradient/);
            expect(band.height).toBe('2px');
            expect(band['transform-origin'], 'it grows from the leading edge').toMatch(/^0px/);
            await settled(page);
            await expect.poll(async () => (await pseudo(rule, '::after', ['scale'])).scale.trim(), { timeout: 5000 }).toMatch(/^(1|none)$/);
        });

        test("the dividers are the instrument's own scale: a hairline, ticks, the oxide at centre [TH121, scope-16]", async ({ page }) => {
            // The starfield seam is gone with the stars it was made of. What
            // stands here is the edge of a ruler: a hairline that fades at
            // both ends, ticks standing on it, and the film across the
            // middle third.
            await open(page, url);
            const dividers = page.locator('[data-kp-divider]');
            expect(await dividers.count()).toBe(2);
            const first = dividers.first();
            const hairline = await first.evaluate((el) => getComputedStyle(el).backgroundImage);
            expect(hairline, 'a hairline that fades at both ends').toMatch(/linear-gradient/);
            expect(await first.evaluate((el) => getComputedStyle(el).blockSize)).toBe('64px');
            const ticks = await pseudo(first, '::before', ['background-image', 'height']);
            expect(ticks['background-image'], 'the ticks, repeated').toMatch(/repeating-linear-gradient/);
            expect(ticks.height, 'they stand on the line, not across it').toBe('7px');
            const centre = await pseudo(first, '::after', ['background-image', 'opacity']);
            expect(centre['background-image'], 'the oxide across the middle').toMatch(/conic-gradient/);
            expect(Number(centre.opacity)).toBeCloseTo(0.75, 2);
            const second = dividers.nth(1);
            expect(await second.evaluate((el) => getComputedStyle(el).transform), 'the alt divider mirrors').not.toBe('none');
        });

        test('there is no starfield: the ground is plain [Kenny, 2026-09-11]', async ({ page }) => {
            // It had one, and he took it back out: "dark mag zijn sterren weer
            // kwijtspelen op de achtergrond". This test is the other way round
            // from the one it replaces, which asserted 102 points at 0.35 and a
            // shimmer layer above them.
            //
            // Drill: `--fx-texture` put back on the root in css/_rules.css,
            // AND `npm run generate` run — the page loads the generated
            // css/themes.css, so a drill that edits the source without
            // regenerating proves nothing. `18 passed, 2 failed`, one per
            // channel. The first attempt skipped that step and reported
            // green, which is the trap rule 7e is about.
            await open(page, url);
            const ground = await page.evaluate(() => {
                const after = getComputedStyle(document.body, '::after');
                const before = getComputedStyle(document.body, '::before');
                return {
                    after: after.backgroundImage,
                    before: before.backgroundImage,
                    token: getComputedStyle(document.documentElement).getPropertyValue('--fx-texture').trim(),
                };
            });
            expect(ground.token, 'the theme declares no texture at all').toBe('');
            expect(ground.after, 'and nothing is painted on the shared layer').toBe('none');
            expect(ground.before, 'nor on a layer of its own').toBe('none');
        });

        test('the nav dropdown: a quiet panel, its own violet keyboard ring [KT14]', async ({ page }) => {
            await open(page, url);
            const trigger = page.locator('.kp-nav__link[aria-haspopup]').first();
            await trigger.hover();
            const menu = page.locator('.kp-nav__menu').first();
            await expect(menu).toBeVisible();
            await style(menu, 'background-color').toBe(await paint(page, '--card'));
            const link = menu.locator('a').first();
            // Walked to with the keyboard, not focus(): :focus-visible is
            // the selector under test and a focus() that never lands would
            // read the item at rest [G15].
            await tabToSelector(page, '.kp-nav__menu a');
            await style(link, 'outline-color', 'the keyboard state is the theme’s own violet, not the page-wide ink outline').toBe(
                await paint(page, '--primary'),
            );
        });

        test('the button is machined: a cut corner, brackets that close, the oxide along the edge [scope-16]', async ({ page }) => {
            // Three things happen at once and none of them is a colour
            // change — which is the theme. The brackets are the button's own
            // pseudo-elements; the film is `.kp-button__edge`, which the
            // component provides because both were needed at once.
            //
            // Drilled 2026-09-12 in firefox: the `clip-path` rule removed ->
            // red on the cut corner; the hover's `opacity: 1` on the
            // brackets removed -> red on them closing; the edge's
            // `scale: 1 1` removed -> red on the film running out.
            await open(page, url);
            const button = page.locator('[data-kp-surface="hero"] .kp-button').nth(1);
            expect(await button.evaluate((el) => getComputedStyle(el).clipPath), 'the corner is cut, not rounded').toMatch(/polygon/);

            const bracket = () => pseudoStyle(button, '::before', 'opacity');
            await bracket().toBe('0');
            const edge = button.locator('.kp-button__edge');
            expect(await edge.evaluate((el) => getComputedStyle(el).backgroundImage), 'the edge carries the film').toMatch(/conic-gradient/);
            await style(edge, 'scale', 'nothing is drawn at rest').toBe('0 1');

            await button.hover();
            // Polled: all three ease in over the theme's own duration and a
            // single read lands mid-transition [fix-1].
            await bracket().toBe('1');
            await style(edge, 'scale', 'the film runs the width of the control').toMatch(/^(1|1 1)$/);
            await pseudoStyle(button.locator('.kp-button__label'), '', 'scale', 'and the label draws itself in').toBe('0.94');

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
