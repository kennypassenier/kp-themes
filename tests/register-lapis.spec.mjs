// The lapis register [S48, LIFT_PLAN row 6]: the approved concept demo
// "Lapis and Leaf" (2026-09-08) reproduced by the package, measured on the
// concept page under lapis in both channels.
//
// What the demo showed and this suite holds: the headline burnishing in
// with one gold clip-path wipe and landing flat gold, the lede's marks
// standing in ivory and then inscribed — ink to gold, an underline drawn
// in — once and staggered, the rule drawing in under a heading, the two
// ruled dividers (the wide one carrying the four-ring frame and the girih
// dot, the narrow one a plain hatch), the girih tile confined to the hero
// and app surfaces with the theme's old page-wide texture turned off, the
// navbar's double-stroke ruling and its dropdown, the buttons (the plain
// ring, the filled gold plate, the mirror gloss), the dossier's seal
// covering its redactions until the trigger clears them on a stagger, and
// the whole approved inventory on the page.
//
// Drills [KT3], performed 2026-09-08 in chromium and restored:
//   - `color: var(--primary)` removed from `[data-kp-reveal='headline']`'s
//     rest rule → the landed headline paints in the inherited h1 colour
//     (ivory), not gold, red on "the headline stands covered before the
//     burnish runs, and lands flat gold";
//   - `--fx-texture-opacity: 0` removed from the root block → the old
//     page-wide girih texture from css/_rules.css shows through again
//     (0.05, not 0), red on both "the old page-wide texture stays off"
//     and "the page-wide texture is turned off";
//   - `background: var(--sidebar-background); color: transparent;`
//     removed from `.kp-card[data-kp-reveal='emphasis'] mark` → the
//     dossier's redacted phrases read transparent-background (the base
//     layer's plain `mark` rule shows through) before the trigger is
//     pressed, red on "the seal covers the redactions before the
//     trigger".

import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

const INVENTORY = JSON.parse(readFileSync(new URL('../showcase/concept-demo.json', import.meta.url), 'utf8')).elements;

const CHANNELS = [
    ['framework-free', '/examples/concept-lapis.html'],
    ['React', '/tests/fixtures/examples.html?example=concept&copy=lapis'],
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
            localStorage.setItem('theme', 'lapis');
        } catch {
            // no storage: the page keeps its served theme
        }
    });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(url);
    await page.waitForFunction(() => document.documentElement.getAttribute('data-theme') === 'lapis');
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
    test.describe(`the lapis register, ${channel}`, () => {
        test('under reduced motion there is no wipe, no page-wide texture, and every reveal is at rest', async ({ page }) => {
            await open(page, url, { reduced: true });
            await expect(page.locator('[data-kp-reveal="headline"]').first()).toHaveClass(/is-deciphered/);
            expect(await page.locator('[data-kp-surface="hero"] mark:not(.is-cleared)').count()).toBe(0);
            const rule = page.locator('[data-kp-reveal="rule"]').first();
            await expect(rule).toHaveClass(/is-in/);
            const texture = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--fx-texture-opacity').trim());
            expect(texture, 'the old page-wide texture stays off').toBe('0');
        });

        test('the headline stands covered before the burnish runs, and lands flat gold as its own text [S49]', async ({ page }) => {
            await page.addInitScript(() => {
                window.kpClip = [];
                new MutationObserver(() => {
                    const h = document.querySelector('[data-kp-reveal="headline"]');
                    if (h && document.documentElement.hasAttribute('data-kp-effects') && !h.classList.contains('is-deciphered')) {
                        window.kpClip.push(getComputedStyle(h).clipPath);
                    }
                }).observe(document, { subtree: true, childList: true, attributes: true });
            });
            await open(page, url);
            const h1 = page.locator('[data-kp-reveal="headline"]').first();
            const source = await h1.getAttribute('data-kp-text');
            await expect(h1).toHaveClass(/is-deciphered/, { timeout: 15000 });
            await settled(page);
            expect(await h1.textContent()).toBe(source);
            expect(await h1.evaluate((el) => getComputedStyle(el).clipPath), 'uncut at rest').toBe('none');
            expect(await h1.evaluate((el) => getComputedStyle(el).color)).toBe(await paint(page, '--primary'));
            const clipped = await page.evaluate(() => window.kpClip);
            expect(
                clipped.some((c) => /inset\(0px 100%/.test(c)),
                'the headline stood fully covered before the wipe opened it',
            ).toBe(true);
        });

        test('the lede marks are the inscription: ivory with no rule, then gold ink and a gold underline, once [TH120]', async ({ page }) => {
            await open(page, url);
            const mark = page.locator('[data-kp-surface="hero"] mark').first();
            await expect(mark).toHaveClass(/is-cleared/, { timeout: 15000 });
            await settled(page);
            expect(await mark.evaluate((el) => getComputedStyle(el).color), 'ink shifts to gold').toBe(await paint(page, '--primary'));
            const border = await mark.evaluate((el) => getComputedStyle(el).borderBottomColor);
            expect(border, 'the underline draws in gold').toBe(await paint(page, '--primary'));
        });

        test('the rule draws in under a heading when it enters the viewport [TH122]', async ({ page }) => {
            await open(page, url);
            const rule = page.locator('[data-kp-reveal="rule"]').first();
            await rule.scrollIntoViewIfNeeded();
            await expect(rule).toHaveClass(/is-in/, { timeout: 5000 });
            const ruling = await pseudo(rule, '::after', ['background-color', 'animation-name']);
            expect(ruling['animation-name']).toBe('kp-rule-in');
            expect(ruling['background-color']).toBe(await paint(page, '--border-strong'));
            await settled(page);
            await expect.poll(async () => (await pseudo(rule, '::after', ['transform'])).transform).toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
        });

        test('the dividers are ruled: the wide one carries the four-ring frame and the girih dot, the narrow one a plain hatch [TH121]', async ({
            page,
        }) => {
            await open(page, url);
            const dividers = page.locator('[data-kp-divider]');
            expect(await dividers.count()).toBe(2);
            const first = await dividers.first().evaluate((el) => ({
                h: getComputedStyle(el).height,
                shadow: getComputedStyle(el).boxShadow,
                bg: getComputedStyle(el).backgroundImage,
            }));
            expect(first.h).toBe('34px');
            expect(first.shadow.match(/inset/g)?.length, 'the four-ring frame').toBe(3);
            expect(first.bg, 'the hatch and the girih dot').toMatch(/repeating-linear-gradient/);
            expect(first.bg, 'the girih dot').toMatch(/radial-gradient/);
            const second = await dividers.nth(1).evaluate((el) => ({ h: getComputedStyle(el).height, shadow: getComputedStyle(el).boxShadow }));
            expect(second.h).toBe('16px');
            expect(second.shadow).toBe('none');
        });

        test('the girih tile is confined to the hero and app surfaces, and the page-wide texture is turned off [DI9]', async ({ page }) => {
            await open(page, url);
            const texture = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--fx-texture-opacity').trim());
            expect(texture, 'the old page-wide texture is turned off in this register').toBe('0');
            const hero = await page
                .locator('[data-kp-surface="hero"]')
                .first()
                .evaluate((el) => getComputedStyle(el).backgroundImage);
            expect(hero, 'the girih tile paints the hero').toMatch(/conic-gradient/);
            const outside = await page
                .locator('.kp-footer')
                .first()
                .evaluate((el) => getComputedStyle(el).backgroundImage);
            expect(outside, 'the tile does not reach the footer').not.toMatch(/conic-gradient/);
        });

        test('the navbar: the double-stroke ruling, the dropdown, and the call to action is a filled gold plate', async ({ page }) => {
            await open(page, url);
            const wrap = page.locator('.kp-nav-wrap');
            expect(await wrap.evaluate((el) => getComputedStyle(el).borderBottomColor)).toBe(await paint(page, '--border-strong'));
            expect(await wrap.evaluate((el) => getComputedStyle(el).boxShadow), 'a second, offset hairline').toBe(
                `${await paint(page, '--border')} 0px 3px 0px -2px`,
            );
            const link = page.locator('.kp-nav__link').nth(1);
            await link.hover();
            await expect.poll(() => link.evaluate((el) => getComputedStyle(el).color)).toBe(await paint(page, '--primary'));
            const cta = page.locator('.kp-nav__link--cta').first();
            expect(await cta.evaluate((el) => getComputedStyle(el).backgroundColor), 'the filled gold plate').toBe(await paint(page, '--primary'));
            await page.locator('.kp-nav__link[aria-haspopup]').first().focus();
            const menu = page.locator('.kp-nav__menu').first();
            await expect(menu).toBeVisible();
            expect(await menu.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(await paint(page, '--popover'));
        });

        test('the buttons: a plain ring, the filled gold plate, and the mirror gloss', async ({ page }) => {
            await open(page, url);
            const primary = page.locator('[data-kp-surface="hero"] .kp-button--primary').first();
            expect(await primary.evaluate((el) => getComputedStyle(el).backgroundColor), 'the filled gold plate').toBe(
                await paint(page, '--primary'),
            );
            const mirror = await primary.evaluate((el) => getComputedStyle(el).boxShadow);
            expect(mirror.match(/inset/g)?.length, 'the mirror gloss (highlight and shadow)').toBe(2);
            const plain = page.locator('[data-kp-surface="hero"] .kp-button').nth(1);
            expect(await plain.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe('rgba(0, 0, 0, 0)');
            await plain.hover();
            await expect.poll(() => plain.evaluate((el) => getComputedStyle(el).color)).toBe(await paint(page, '--primary'));
        });

        test('the dossier: the seal covers the redactions before the trigger, and clears on a stagger', async ({ page }) => {
            await open(page, url);
            const dossier = page.locator('.kp-card[data-kp-reveal="emphasis"]');
            const mark = dossier.locator('mark').first();
            const covered = await mark.evaluate((el) => ({ bg: getComputedStyle(el).backgroundColor, color: getComputedStyle(el).color }));
            expect(covered.bg, 'the seal, a solid void plate').toBe(await paint(page, '--sidebar-background'));
            expect(covered.color, 'the redacted phrase reads no ink').toBe('rgba(0, 0, 0, 0)');
            await dossier.locator('[data-kp-reveal-trigger]').click();
            await expect(mark).toHaveClass(/is-cleared/);
            await settled(page);
            const cleared = await mark.evaluate((el) => getComputedStyle(el).backgroundColor);
            expect(cleared, 'the seal lifted').toBe('rgba(0, 0, 0, 0)');
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
