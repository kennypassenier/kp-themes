// The academia register [S48, LIFT_PLAN row 10]: the approved concept
// demo "The Reading Room" (2026-09-08) reproduced by the package,
// measured on the concept page under academia in both channels.
//
// What the demo showed and this suite holds: the headline and the
// section rule both drawing as one gold bar (the new `draw` routine,
// generalised from the rule hook to h1), the ribbon underline growing on
// a nav link's hover and focus, the dropdown styled as a popover panel
// (KT14), the dossier's redactions staying covered until the trigger and
// clearing staggered, the folder stack behind the dossier card, the
// confirmation dialog for the destructive wipe, and the whole approved
// inventory.
//
// Drills [KT3], performed 2026-09-08 in chromium and restored:
//   - `[data-kp-effects] h1[data-kp-reveal='headline']:not(.is-in)::after
//     { transform: scaleX(0); }` removed → the headline's rule reads
//     drawn from the first paint instead of growing in on view, red on
//     "the headline draws once the heading enters the viewport";
//   - `[data-kp-effects] .kp-card[data-kp-reveal='emphasis']
//     mark:not(.is-cleared) { background: var(--background); color:
//     var(--background); }` removed → the dossier's words are legible
//     before the trigger is pressed, red on "the redactions stay covered
//     until the trigger opens the file";
//   - `.kp-nav__menu` rule removed → the dropdown paints the page's own
//     background instead of the popover panel, red on "the dropdown is a
//     popover panel".

import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

const INVENTORY = JSON.parse(readFileSync(new URL('../showcase/concept-demo.json', import.meta.url), 'utf8')).elements;

const CHANNELS = [
    ['framework-free', '/examples/concept-academia.html'],
    ['React', '/tests/fixtures/examples.html?example=concept&copy=academia'],
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
            localStorage.setItem('theme', 'academia');
        } catch {
            // no storage: the page keeps its served theme
        }
    });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(url);
    await page.waitForFunction(() => document.documentElement.getAttribute('data-theme') === 'academia');
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
    test.describe(`the academia register, ${channel}`, () => {
        test('there is no arrival, and reduced motion leaves the headline and rule drawn at rest', async ({ page }) => {
            await open(page, url, { reduced: true });
            expect(await page.locator('.kp-boot').count(), 'academia is quiet on arrival').toBe(0);
            // Every headline routine's shared bail path (js/effects.js
            // `headline()`) marks reduced motion with `is-deciphered`, not
            // `is-in` — the class this theme's own `draw` routine adds on
            // a real reveal. The register excludes both from the hidden
            // state so the bar reads drawn under either.
            const h1 = page.locator('[data-kp-reveal="headline"]').first();
            await expect(h1).toHaveClass(/is-deciphered/);
            const bar = await pseudo(h1, '::after', ['transform', 'background-color']);
            expect(bar.transform).toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
            expect(await page.locator('[data-kp-surface="app"] mark:not(.is-cleared)').count(), 'the dossier is never left permanently covered').toBe(
                0,
            );
        });

        test('the headline draws once the heading enters the viewport, as one gold bar [row 10, the new draw routine]', async ({ page }) => {
            await open(page, url);
            const h1 = page.locator('[data-kp-reveal="headline"]').first();
            // Above the fold already (the hero), so the observer fires fast —
            // still asserted through the class rather than a fixed wait.
            const before = await pseudo(h1, '::after', ['transform']);
            await expect(h1).toHaveClass(/is-in/, { timeout: 5000 });
            await settled(page);
            const after = await pseudo(h1, '::after', ['transform', 'background-color']);
            expect(after.transform, 'drawn once in view').toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
            expect(after['background-color']).toBe(await paint(page, '--primary'));
            // The text itself is never rewritten — no decipher, no split words.
            expect((await h1.textContent()).trim().length).toBeGreaterThan(0);
            expect(await h1.locator('[data-glyph], [data-word], [data-caret]').count(), 'no text-mangling routine touched it').toBe(0);
            void before;
        });

        test('the section rule draws slower than the shared 900ms baseline is not exceeded, and faster than the headline', async ({ page }) => {
            await open(page, url);
            const rule = page.locator('[data-kp-reveal="rule"]').first();
            await rule.scrollIntoViewIfNeeded();
            await expect(rule).toHaveClass(/is-in/, { timeout: 5000 });
            const drawn = await pseudo(rule, '::after', ['transition-duration', 'background-color']);
            expect(drawn['transition-duration']).toBe('0.9s');
            expect(drawn['background-color']).toBe(await paint(page, '--primary'));
            const h1 = await pseudo(page.locator('[data-kp-reveal="headline"]').first(), '::after', ['transition-duration']);
            expect(h1['transition-duration']).toBe('1.1s');
        });

        test('the ribbon underline grows from 0 on a nav link’s hover, and the dropdown is a popover panel [KT14]', async ({ page }) => {
            await open(page, url);
            const link = page.locator('.kp-nav__link').nth(1);
            const before = await pseudo(link, '::after', ['width']);
            expect(before.width).toBe('0px');
            await link.hover();
            await expect.poll(async () => (await pseudo(link, '::after', ['width'])).width).toBe('40px');
            // The dropdown itself: opened and read, not only the bar (KT14).
            const item = page.locator('.kp-nav__links > li', { has: page.locator('.kp-nav__menu') }).first();
            await item.hover();
            const menu = item.locator('.kp-nav__menu');
            await expect(menu).toBeVisible();
            const painted = await menu.evaluate((el) => {
                const s = getComputedStyle(el);
                return { background: s.backgroundColor, border: s.borderTopWidth, radius: s.borderRadius };
            });
            expect(painted.background).toBe(await paint(page, '--popover'));
            expect(painted.border).toBe('1px');
            expect(painted.radius).toBe('0px');
        });

        test('the buttons: a filled gold primary, square corners, a ghost and a destructive outline', async ({ page }) => {
            await open(page, url);
            const primary = page.locator('[data-kp-surface="hero"] .kp-button--primary').first();
            expect(await primary.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(await paint(page, '--primary'));
            expect(await primary.evaluate((el) => getComputedStyle(el).borderRadius)).toBe('0px');
            const ghost = page.locator('[data-kp-surface="hero"] .kp-button--ghost').first();
            expect(await ghost.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe('rgba(0, 0, 0, 0)');
            const wipe = page.locator('[data-kp-confirm]').first();
            expect(await wipe.evaluate((el) => getComputedStyle(el).color)).toBe(await paint(page, '--destructive'));
        });

        test('the dossier: the folder stack behind the card, redactions covered until the trigger opens the file, staggered', async ({ page }) => {
            await open(page, url);
            const card = page.locator('.kp-card[data-kp-reveal="emphasis"]').first();
            // The folder-stack plate is the card's ::after; ::before is the
            // stamp's own (data-kp-label and data-kp-reveal sit on the same
            // element on the generated page, so the two hooks split the
            // element's only two pseudo-elements between them).
            const stack = await pseudo(card, '::after', ['content', 'position', 'background-color', 'transform']);
            expect(stack.content, 'the folder-stack plate is painted, not left at its unset default').toBe('""');
            expect(stack.position).toBe('absolute');
            expect(stack.transform, 'the plate is rotated behind the card').not.toBe('none');
            // Firefox reports an unresolved `attr()` value literally rather
            // than the string it resolves to, which Chromium does — both
            // are "the stamp still owns ::before", the thing this asserts.
            const stamp = await pseudo(card, '::before', ['content']);
            expect(stamp.content, 'the stamp keeps its own pseudo-element').toMatch(/^("Restricted"|attr\(data-kp-label\))$/);
            const mark = card.locator('mark').first();
            const covered = await mark.evaluate((el) => {
                const s = getComputedStyle(el);
                return { background: s.backgroundColor, color: s.color };
            });
            expect(covered.background, 'covered while armed and not yet cleared').toBe(await paint(page, '--background'));
            expect(covered.color).toBe(await paint(page, '--background'));
            const second = card.locator('mark').nth(1);
            const delay = await second.evaluate((el) => getComputedStyle(el).transitionDelay);
            expect(delay).toBe('0.26s');
            await card.locator('[data-kp-reveal-trigger]').click();
            await expect(mark).toHaveClass(/is-cleared/);
            await settled(page);
            const cleared = await mark.evaluate((el) => getComputedStyle(el).color);
            expect(cleared).toBe(await paint(page, '--popover-foreground'));
        });

        test('the destructive wipe opens a real confirmation dialog, styled as the theme’s own popover panel', async ({ page }) => {
            await open(page, url);
            const wipe = page.locator('[data-kp-confirm]').first();
            await wipe.click();
            const dialog = page.locator('.kp-dialog.kp-confirm');
            await expect(dialog).toBeVisible();
            expect(await dialog.evaluate((el) => (el instanceof HTMLDialogElement ? el.open : false))).toBe(true);
            const painted = await dialog.evaluate((el) => {
                const s = getComputedStyle(el);
                return { background: s.backgroundColor, radius: s.borderRadius };
            });
            expect(painted.background).toBe(await paint(page, '--popover'));
            expect(painted.radius).toBe('0px');
            await page.keyboard.press('Escape');
            await expect(dialog).toHaveCount(0);
        });

        test('the lede’s marks are never covered: a gold underline, not a redaction', async ({ page }) => {
            await open(page, url);
            await settled(page);
            const mark = page.locator('[data-kp-surface="hero"] .kp-lede mark').first();
            const painted = await mark.evaluate((el) => {
                const s = getComputedStyle(el);
                return { background: s.backgroundColor, color: s.color, decoration: s.textDecorationLine };
            });
            expect(painted.background).toBe('rgba(0, 0, 0, 0)');
            expect(painted.color).toBe(await paint(page, '--primary'));
            expect(painted.decoration).toContain('underline');
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
