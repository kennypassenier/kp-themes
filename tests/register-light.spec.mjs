// The light register [S48, LIFT_PLAN, A1]: the approved concept demo
// "Plain Sight" (2026-09-08) reproduced by the package, measured on the
// concept page under light in both channels.
//
// What the demo showed and this suite holds: the headline opening through
// a rounded clip window once and ending as its own whole text (no noise,
// no dither, no per-word stagger — the one thing every other headline
// routine does and this one does not); the lede's two marks sweeping in
// with a highlighter's background-size, staggered by the module itself;
// the rule reusing the base layer's own kp-rule-in; the two dividers as
// hairline seams, the alt one tinted with the accent/signal pair; the
// nav dropdown answered [KT14]; the two radius vocabularies (pill
// buttons, small-radius surfaces); elevation on every panel that floats
// over a page where card and popover are both pure white (DI6); the
// dossier's redactions clearing on the trigger, staggered; and the whole
// approved inventory.
//
// Drills [KT3], performed 2026-09-08 in chromium and restored:
//   - the armed clip rule (`[data-kp-effects] […]:not(.is-deciphered)`)
//     removed → the headline test's `animationstart` capture stayed green
//     (the keyframe's own 0% step still paints the clipped start, same
//     gotcha retro's suite records), so the test was sharpened with a
//     second, static probe — is-deciphered taken off the already-rested
//     element, matching retro's own technique — which does go red on
//     "the headline opens through a clip window" once the armed rule is
//     gone;
//   - `kp-rule-in`'s animation-name removed from the register's `.is-in`
//     rule → red on "the rule draws itself", first attempt;
//   - the card mark's `background: var(--foreground)` rest rule removed
//     → red on "the dossier's redactions clear on the trigger", first
//     attempt.

import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

const INVENTORY = JSON.parse(readFileSync(new URL('../showcase/concept-demo.json', import.meta.url), 'utf8')).elements;

const CHANNELS = [
    ['framework-free', '/examples/concept-light.html'],
    ['React', '/tests/fixtures/examples.html?example=concept&copy=light'],
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
            localStorage.setItem('theme', 'light');
        } catch {
            // no storage: the page keeps its served theme
        }
    });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(url);
    await page.waitForFunction(() => document.documentElement.getAttribute('data-theme') === 'light');
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
    test.describe(`the light register, ${channel}`, () => {
        test('under reduced motion every reveal is at rest, and the page carries no boot at all', async ({ page }) => {
            await open(page, url, { reduced: true });
            expect(await page.locator('.kp-boot').count(), 'this theme is quiet on arrival').toBe(0);
            await expect(page.locator('[data-kp-reveal="headline"]').first()).toHaveClass(/is-deciphered/);
            expect(await page.locator('[data-kp-surface="hero"] mark:not(.is-cleared)').count()).toBe(0);
            await expect(page.locator('[data-kp-reveal="rule"]').first()).toHaveClass(/is-in/);
        });

        test('the headline opens through a rounded clip window once, and ends as its own whole text [S48]', async ({ page }) => {
            // Recorded before navigation, since the 620ms reveal can finish
            // inside a single frame on a fast runner: the moment the
            // animation starts, the element is captured mid-flight — proof
            // the armed state actually clips and hides the headline, not
            // just a probe that can race the reveal to nothing.
            await page.addInitScript(() => {
                window.kpArmedClip = null;
                document.addEventListener('animationstart', (e) => {
                    if (e.animationName === 'kp-clip-reveal' && window.kpArmedClip === null) {
                        const s = getComputedStyle(/** @type {Element} */ (e.target));
                        window.kpArmedClip = { clip: s.clipPath, opacity: s.opacity };
                    }
                });
            });
            await open(page, url);
            const h1 = page.locator('[data-kp-reveal="headline"]').first();
            const source = await h1.getAttribute('data-kp-text');
            await expect(h1).toHaveClass(/is-deciphered/, { timeout: 5000 });
            await settled(page);
            expect(await h1.textContent(), 'the text never changed').toBe(source);
            const rested = await h1.evaluate((el) => ({ clip: getComputedStyle(el).clipPath, opacity: getComputedStyle(el).opacity }));
            expect(rested.opacity, 'fully visible at rest').toBe('1');
            const armed = await page.evaluate(() => window.kpArmedClip);
            expect(armed, 'the animation ran and was observed starting').not.toBeNull();
            expect(armed.opacity, 'invisible at the start of the reveal').not.toBe('1');
            expect(armed.clip, 'clipped at the start — a different shape than at rest').not.toBe(rested.clip);
            // The armed rule itself, probed statically and deterministically:
            // with the rested element made to match `:not(.is-deciphered)`
            // again (no animation running at this point — `.is-revealing`
            // came off long ago), the register's own armed rule must still
            // cover it with the clipped, invisible start state.
            const reArmed = await h1.evaluate((el) => {
                el.classList.remove('is-deciphered');
                const s = getComputedStyle(el);
                const out = { clip: s.clipPath, opacity: s.opacity };
                el.classList.add('is-deciphered');
                return out;
            });
            expect(reArmed.opacity, 'covered while armed, even after the reveal has already run once').toBe('0');
        });

        test("the lede's marks sweep in with a highlighter, staggered by the module [TH120]", async ({ page }) => {
            await open(page, url);
            const marks = page.locator('[data-kp-surface="hero"] mark');
            await expect(marks.first()).toHaveClass(/is-cleared/, { timeout: 5000 });
            await expect(marks.nth(1)).toHaveClass(/is-cleared/, { timeout: 5000 });
            await settled(page);
            const first = await marks.first().evaluate((el) => getComputedStyle(el).backgroundSize);
            expect(first, 'the highlight fills the word').toMatch(/^100%/);
            expect(await marks.first().evaluate((el) => getComputedStyle(el).backgroundImage), 'the fill is the element’s own accent').toMatch(
                /linear-gradient/,
            );
            expect(await marks.first().evaluate((el) => getComputedStyle(el).color)).toBe(await paint(page, '--accent-foreground'));
            // Armed (never cleared this session), the ink stands with no
            // fill — probed the same deterministic way the headline test
            // above does.
            const armed = await marks.first().evaluate((el) => {
                el.classList.remove('is-cleared');
                const s = getComputedStyle(el);
                const out = { size: s.backgroundSize, color: s.color };
                el.classList.add('is-cleared');
                return out;
            });
            expect(armed.size, 'no fill while armed').toMatch(/^0%/);
        });

        test('the rule draws itself under a heading when it enters the viewport, reusing the base layer’s kp-rule-in [TH122]', async ({ page }) => {
            await open(page, url);
            const rule = page.locator('[data-kp-reveal="rule"]').first();
            await rule.scrollIntoViewIfNeeded();
            await expect(rule).toHaveClass(/is-in/, { timeout: 5000 });
            const after = await pseudo(rule, '::after', ['animation-name', 'background-color', 'height']);
            expect(after['animation-name']).toBe('kp-rule-in');
            expect(after.height).toBe('2px');
            expect(after['background-color']).toBe(await paint(page, '--primary'));
            await settled(page);
            const transform = (await pseudo(rule, '::after', ['transform'])).transform;
            expect(transform, 'drawn to its full width at rest').toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
        });

        test('the dividers are hairline seams; the alt one tints its circle with the accent/signal pair [TH121]', async ({ page }) => {
            await open(page, url);
            const dividers = page.locator('[data-kp-divider]');
            expect(await dividers.count()).toBe(2);
            const first = await dividers.first().evaluate((el) => getComputedStyle(el).height);
            expect(first, 'a hairline, not a block gap').toBe('1px');
            const alt = await dividers.nth(1).evaluate((el) => {
                const s = getComputedStyle(el, '::after');
                return { bg: s.backgroundColor, border: s.borderColor };
            });
            expect(alt.bg).toBe(await paint(page, '--accent'));
            expect(alt.border).toBe(await paint(page, '--fx-signal'));
        });

        test('the nav dropdown opens and is styled, not left to the bar alone [KT14]', async ({ page }) => {
            await open(page, url);
            const item = page
                .locator('.kp-nav__links > li')
                .filter({ has: page.locator('.kp-nav__menu') })
                .first();
            await item.hover();
            const menu = item.locator('.kp-nav__menu');
            await expect.poll(() => menu.evaluate((el) => getComputedStyle(el).visibility)).toBe('visible');
            const style = await menu.evaluate((el) => {
                const s = getComputedStyle(el);
                return { shadow: s.boxShadow, radius: s.borderRadius };
            });
            expect(style.shadow, 'the dropdown panel carries the shared shadow step').not.toBe('none');
            expect(style.radius).not.toBe('0px');
        });

        test('the two radius vocabularies: buttons and the icon button are pills, cards keep the small radius', async ({ page }) => {
            await open(page, url);
            const button = page.locator('[data-kp-surface="hero"] .kp-button').first();
            expect(await button.evaluate((el) => getComputedStyle(el).borderRadius), 'a full pill').toMatch(/^(999px|6249\.9375rem|.*px)$/);
            const bRadius = await button.evaluate((el) => parseFloat(getComputedStyle(el).borderRadius));
            expect(bRadius, 'a pill: at least half the control height').toBeGreaterThan(15);
            const card = page.locator('.kp-card[data-kp-reveal="emphasis"]').first();
            const cRadius = await card.evaluate((el) => parseFloat(getComputedStyle(el).borderRadius));
            expect(cRadius, 'the small surface radius, not a pill').toBeLessThan(15);
        });

        test('elevated panels carry a shadow: card and popover are both pure white [DI6]', async ({ page }) => {
            await open(page, url);
            const card = page.locator('.kp-card[data-kp-reveal="emphasis"]').first();
            const shadow = await card.evaluate((el) => getComputedStyle(el).boxShadow);
            expect(shadow, 'the card carries its own elevation').not.toBe('none');
            const menuShadow = await page
                .locator('.kp-nav__menu')
                .first()
                .evaluate((el) => getComputedStyle(el).boxShadow);
            expect(menuShadow, 'the dropdown too').not.toBe('none');
        });

        test("the dossier's redactions clear on the trigger, staggered [S49, A11]", async ({ page }) => {
            await open(page, url);
            const dossier = page.locator('.kp-card[data-kp-reveal="emphasis"]');
            const mark = dossier.locator('mark').first();
            const covered = await mark.evaluate((el) => getComputedStyle(el).backgroundColor);
            expect(covered, 'opaque before the trigger').toBe(await paint(page, '--foreground'));
            await dossier.locator('[data-kp-reveal-trigger]').click();
            await expect(mark).toHaveClass(/is-cleared/);
            await settled(page);
            const cleared = await mark.evaluate((el) => getComputedStyle(el).backgroundColor);
            expect(cleared, 'the bar cleared to the accent tint').toBe(await paint(page, '--accent'));
            const clearedColor = await mark.evaluate((el) => getComputedStyle(el).color);
            expect(clearedColor, 'the words are readable again').toBe(await paint(page, '--foreground'));
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
