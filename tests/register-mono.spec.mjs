// The mono register [S48, LIFT_PLAN row 6, MN0–MN4]: the approved concept
// demo "Paper Trail" (2026-09-08) reproduced by the package, measured on
// the concept page under mono in both channels.
//
// What the demo showed and this suite holds: the headline staying whole
// (never split into words or glyphs) while a hard-edge mask sweeps across
// it once, the lede's mark as a static highlight (no clearing effect
// outside the dossier), the rule drawn left to right under a heading, the
// two dividers as an overhanging hairline that fades at both ends, the
// nav link and the ghost button inverting with mix-blend-mode: difference
// as an instant state change, the dossier's redaction bars mask-sweeping
// clear on the trigger staggered 400ms apart, the focus ring in the
// demo's own reversed order, and the whole approved inventory.
//
// Drills [KT3], performed 2026-09-08 in chromium and restored:
//   - the armed hidden mask (`[data-kp-effects] [data-kp-reveal='headline']
//     :not(.is-deciphered)`) removed from the register → the headline
//     carries no mask-image at all on first paint, red on "the headline is
//     hidden behind the mask before it sweeps in";
//   - the nav link's `mix-blend-mode: difference` removed → hovering paints
//     no ::before difference blend, red on "the nav link inverts";
//   - the redaction bar's `mask-image` (`mark::after`) removed → the bar
//     covers nothing measurable, red on "the redaction bar is a masked
//     ink layer over the word".

import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

const INVENTORY = JSON.parse(readFileSync(new URL('../showcase/concept-demo.json', import.meta.url), 'utf8')).elements;

const CHANNELS = [
    ['framework-free', '/examples/concept-mono.html'],
    ['React', '/tests/fixtures/examples.html?example=concept&copy=mono'],
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
            localStorage.setItem('theme', 'mono');
        } catch {
            // no storage: the page keeps its served theme
        }
    });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(url);
    await page.waitForFunction(() => document.documentElement.getAttribute('data-theme') === 'mono');
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
    test.describe(`the mono register, ${channel}`, () => {
        test('under reduced motion the headline carries no mask, no redaction bar is armed, and the rule stands drawn', async ({ page }) => {
            await open(page, url, { reduced: true });
            const h1 = page.locator('[data-kp-reveal="headline"]').first();
            await expect(h1).toHaveClass(/is-deciphered/);
            expect(await h1.evaluate((el) => getComputedStyle(el).maskImage), 'no mask at rest').toBe('none');
            expect(await page.locator('[data-kp-surface="app"] .kp-card[data-kp-reveal="emphasis"] mark:not(.is-cleared)').count()).toBe(0);
            const rule = await pseudo(page.locator('[data-kp-reveal="rule"]').first(), '::after', ['transform', 'animation-name']);
            expect(rule['animation-name']).toBe('none');
            expect(rule.transform).toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
        });

        test('the headline stays whole and sweeps into view once, ending as its own text [S48]', async ({ page }) => {
            // The sweep is 600ms, faster than a test can reliably poll for
            // after the page has already settled, so a MutationObserver
            // installed before navigation is the record of what the mask
            // looked like while '.is-revealed' was the class in force.
            await page.addInitScript(() => {
                window.kpWipe = [];
                new MutationObserver(() => {
                    const h = document.querySelector('[data-kp-reveal="headline"]');
                    if (h && h.classList.contains('is-revealed')) {
                        window.kpWipe.push(getComputedStyle(h).maskImage !== 'none');
                    }
                }).observe(document, { subtree: true, childList: true, attributes: true, attributeFilter: ['class'] });
            });
            await open(page, url);
            const h1 = page.locator('[data-kp-reveal="headline"]').first();
            const source = await h1.getAttribute('data-kp-text');
            // Never split into words or glyphs — the demo's own point: the
            // whole line sweeps into view intact.
            expect(await h1.locator('[data-word], [data-glyph]').count(), 'never split into words or glyphs').toBe(0);
            expect(await h1.textContent()).toBe(source);
            await expect(h1).toHaveClass(/is-deciphered/, { timeout: 3000 });
            await settled(page);
            expect(await h1.evaluate((el) => getComputedStyle(el).maskImage), 'plain once the sweep lands').toBe('none');
            expect(await h1.textContent()).toBe(source);
            const wipe = await page.evaluate(() => window.kpWipe);
            expect(wipe.some(Boolean), 'the mask was armed while the class said mid-sweep').toBe(true);
        });

        test("the lede's mark is a static highlight, never a redaction", async ({ page }) => {
            await open(page, url);
            const mark = page.locator('[data-kp-surface="hero"] mark').first();
            await expect(mark).toBeVisible();
            const highlight = { background: await paint(page, '--accent'), color: await paint(page, '--accent-foreground') };
            expect(await mark.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(highlight.background);
            expect(await mark.evaluate((el) => getComputedStyle(el).color)).toBe(highlight.color);
            expect(await pseudo(mark, '::after', ['content'])).toEqual({ content: 'none' });
            // The shared module (js/effects.js, looseMarks) memos every loose
            // mark as seen and may add 'is-cleared' for its own bookkeeping —
            // this register's CSS never keys a rule on that class for a mark
            // outside the dossier, so the paint stays the same highlight
            // regardless, past the module's own delay.
            await page.waitForTimeout(1700);
            expect(await mark.evaluate((el) => getComputedStyle(el).backgroundColor), 'still the same highlight, not a redaction').toBe(
                highlight.background,
            );
            expect(await mark.evaluate((el) => getComputedStyle(el).color), 'still the same highlight, not a redaction').toBe(highlight.color);
        });

        test('the rule draws left to right, once, when its heading enters the viewport [TH122]', async ({ page }) => {
            await open(page, url);
            const rule = page.locator('[data-kp-reveal="rule"]').first();
            await rule.scrollIntoViewIfNeeded();
            await expect(rule).toHaveClass(/is-in/, { timeout: 5000 });
            const drawing = await pseudo(rule, '::after', ['height', 'background-image', 'animation-name']);
            expect(drawing.height).toBe('1px');
            expect(drawing['background-image']).toMatch(/linear-gradient/);
            expect(drawing['animation-name']).toBe('kp-rule-in');
            await settled(page);
            await expect.poll(async () => (await pseudo(rule, '::after', ['transform'])).transform).toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
        });

        test('the dividers are an overhanging hairline that fades at both ends [TH121]', async ({ page }) => {
            await open(page, url);
            const dividers = page.locator('[data-kp-divider]');
            expect(await dividers.count()).toBe(2);
            const plain = await dividers.nth(0).evaluate((el) => getComputedStyle(el).backgroundImage);
            expect(plain).toMatch(/linear-gradient/);
            expect(plain).toMatch(/rgba?\([^)]*, 0\)/);
            expect(await dividers.nth(0).evaluate((el) => getComputedStyle(el).height)).toBe('1px');
            const alt = await dividers.nth(1).evaluate((el) => getComputedStyle(el).backgroundImage);
            expect(alt).toMatch(/linear-gradient/);
            expect(alt, 'the alt divider is a different colour than the plain one').not.toBe(plain);
        });

        test('the nav link and the ghost button invert with mix-blend-mode: difference, an instant state change', async ({ page }) => {
            await open(page, url);
            const link = page.locator('.kp-nav__link').nth(1);
            const before = await pseudo(link, '::before', ['opacity', 'mix-blend-mode', 'transition-duration']);
            expect(before.opacity).toBe('0');
            expect(before['mix-blend-mode']).toBe('difference');
            expect(before['transition-duration'], 'no transition: an instant state change').toBe('0s');
            await link.hover();
            const hovered = await pseudo(link, '::before', ['opacity']);
            expect(hovered.opacity).toBe('1');
            const ghost = page.locator('[data-kp-surface="hero"] .kp-button--ghost').first();
            expect((await pseudo(ghost, '::before', ['opacity', 'mix-blend-mode']))['mix-blend-mode']).toBe('difference');
            await ghost.hover();
            await expect.poll(async () => (await pseudo(ghost, '::before', ['opacity'])).opacity).toBe('1');
        });

        test('the dossier: redaction bars mask-sweep clear on the trigger, staggered 400ms apart', async ({ page }) => {
            await open(page, url);
            const dossier = page.locator('.kp-card[data-kp-reveal="emphasis"]');
            const marks = dossier.locator('mark');
            expect(await marks.count()).toBe(3);
            const first = marks.nth(0);
            const covered = await pseudo(first, '::after', ['mask-position', 'background-color']);
            expect(covered['mask-position']).toBe('0% 0%');
            expect(covered['background-color']).toBe(await paint(page, '--foreground'));
            expect(await first.evaluate((el) => getComputedStyle(el).color), 'the word is covered, not removed').toBe('rgba(0, 0, 0, 0)');
            const delay2 = (await pseudo(marks.nth(1), '::after', ['transition-delay']))['transition-delay'];
            const delay3 = (await pseudo(marks.nth(2), '::after', ['transition-delay']))['transition-delay'];
            expect(delay2).toBe('0.4s');
            expect(delay3).toBe('0.8s');
            await dossier.locator('[data-kp-reveal-trigger]').click();
            await expect(first).toHaveClass(/is-cleared/);
            await settled(page);
            await expect
                .poll(async () => (await pseudo(first, '::after', ['mask-position']))['mask-position'], 'the bar swept clear')
                .toBe('100% 0%');
        });

        test("the focus ring is the demo's own order: paper against the control, ink outside it [DI2]", async ({ page }) => {
            await open(page, url);
            const button = page.locator('[data-kp-surface="hero"] .kp-button').first();
            await button.focus();
            const ring = await button.evaluate((el) => {
                const s = getComputedStyle(el);
                return { outlineColor: s.outlineColor, boxShadow: s.boxShadow };
            });
            expect(ring.outlineColor).toBe(await paint(page, '--foreground'));
            expect(ring.boxShadow).toContain(await paint(page, '--background'));
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
