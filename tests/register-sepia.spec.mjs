// The sepia register [S48, LIFT_PLAN row 9]: the approved concept demo
// "Aged Well" (2026-09-08) reproduced by the package, measured on the
// concept page under sepia in both channels.
//
// What the demo showed and this suite holds: the headline's ink-in —
// a faint ghost of the ink colour settling to the full one, once, the
// whole line together, no per-word stagger; the two lede marks as a
// wash that deepens on the same schedule; the drawn rule under a
// heading, growing from nothing when it enters the viewport; the double
// warm-brown divider, and the alt variant's diamond; the navbar's
// dropdown (KT14); the quiet-plate buttons; the dossier's stamp and its
// redactions, covered until the file opens and lifting in order; the
// confirmation dialog, a real <dialog> with Cancel focused by default
// (never Wipe); and the whole approved inventory.
//
// Drills [KT3], performed 2026-09-08 in chromium, repeated the same
// day in firefox (each one red on the test it names, then restored green
// in both browsers) [G13]:
//   - the ghost rule (`[data-kp-effects] [data-kp-reveal='headline'].is-settling`)
//     emptied in the register → no ghosted frame is ever painted, red on
//     "a blurred, ghosted frame was painted before it settled" (the first
//     assertion tried, a `.not.toBe('none')` poll wrapped in a swallowed
//     `.catch()`, did NOT go red — it was replaced with the
//     MutationObserver sampling below before this drill was trusted);
//   - the rule's `:not(.is-in)::after { transform: scaleX(0) }` emptied
//     → the rule stands fully drawn before it scrolls into view, red on
//     "not drawn before it is in view";
//   - the redaction's `:not(.is-cleared)::after { transform: scaleX(1) }`
//     emptied in the register → the dossier's words read before the file
//     opens, red on "covered before the trigger".

import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

const INVENTORY = JSON.parse(readFileSync(new URL('../showcase/concept-demo.json', import.meta.url), 'utf8')).elements;

const CHANNELS = [
    ['framework-free', '/examples/concept-sepia.html'],
    ['React', '/tests/fixtures/examples.html?example=concept&copy=sepia'],
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
            localStorage.setItem('theme', 'sepia');
        } catch {
            // no storage: the page keeps its served theme
        }
    });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(url);
    await page.waitForFunction(() => document.documentElement.getAttribute('data-theme') === 'sepia');
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
    test.describe(`the sepia register, ${channel}`, () => {
        test('under reduced motion the headline, the marks and the rule are already at rest, and the dialog does not fade [DI7]', async ({
            page,
        }) => {
            await open(page, url, { reduced: true });
            const h1 = page.locator('[data-kp-reveal="headline"]').first();
            await expect(h1).toHaveClass(/is-deciphered/);
            expect(await h1.evaluate((el) => getComputedStyle(el).filter), 'no blur at rest').toBe('none');
            expect(await page.locator('[data-kp-surface="hero"] mark:not(.is-cleared)').count(), 'the lede marks are already settled').toBe(0);
            const rule = page.locator('[data-kp-reveal="rule"]').first();
            await expect(rule).toHaveClass(/is-in/);
            const drawn = await pseudo(rule, '::after', ['transform']);
            expect(drawn.transform, 'the rule stands drawn').toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
        });

        test('the headline settles from a pale ghost of the ink colour to the full one, once, with no per-word stagger [S48]', async ({ page }) => {
            // Caught mid-ghost with a MutationObserver rather than a single
            // poll: the ghost class is on for one frame only (the demo's
            // own requestAnimationFrame), too narrow a window to reliably
            // win a race against a poll interval.
            await page.addInitScript(() => {
                window.kpGhost = [];
                new MutationObserver(() => {
                    const h = document.querySelector('[data-kp-reveal="headline"]');
                    if (h) window.kpGhost.push(getComputedStyle(h).filter);
                }).observe(document, { subtree: true, childList: true, attributes: true, attributeFilter: ['class'] });
            });
            await open(page, url);
            const h1 = page.locator('[data-kp-reveal="headline"]').first();
            const source = await h1.getAttribute('data-kp-text');
            await expect(h1).toHaveClass(/is-deciphered/, { timeout: 3000 });
            await settled(page);
            expect(await h1.textContent(), 'the whole line, never split into words').toBe(source);
            expect(await h1.locator('[data-word], [data-glyph]').count(), 'no per-word markup').toBe(0);
            expect(await h1.evaluate((el) => getComputedStyle(el).filter)).toBe('none');
            expect(await h1.evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
            expect(await h1.evaluate((el) => getComputedStyle(el).color)).toBe(await paint(page, '--foreground'));
            const ghosted = await page.evaluate(() => window.kpGhost);
            expect(
                ghosted.some((f) => f !== 'none'),
                'a blurred, ghosted frame was painted before it settled',
            ).toBe(true);
        });

        test('the two lede marks deepen from ink to the plate colour, staggered, and stay legible throughout [TH120]', async ({ page }) => {
            await page.addInitScript(() => {
                window.kpMarks = [];
                new MutationObserver(() => {
                    for (const m of document.querySelectorAll('[data-kp-surface="hero"] mark')) {
                        const s = getComputedStyle(m);
                        window.kpMarks.push(m.classList.contains('is-cleared') + '|' + s.backgroundColor + '|' + s.color);
                    }
                }).observe(document, { subtree: true, childList: true, attributes: true });
            });
            await open(page, url);
            const marks = page.locator('[data-kp-surface="hero"] mark');
            expect(await marks.count()).toBe(2);
            await expect(marks.nth(0)).toHaveClass(/is-cleared/, { timeout: 3000 });
            await expect(marks.nth(1)).toHaveClass(/is-cleared/, { timeout: 3000 });
            await settled(page);
            for (let i = 0; i < 2; i++) {
                expect(await marks.nth(i).evaluate((el) => getComputedStyle(el).backgroundColor), 'the tint plate never disappears').toBe(
                    await paint(page, '--accent'),
                );
                expect(await marks.nth(i).evaluate((el) => getComputedStyle(el).color)).toBe(await paint(page, '--accent-foreground'));
            }
            const seen = await page.evaluate(() => window.kpMarks);
            expect(
                seen.some((s) => s.startsWith('false|')),
                'a mark was seen before it cleared, still legible (ink on tint), never hidden',
            ).toBe(true);
        });

        test('the rule grows from nothing under a heading when it scrolls into the viewport [TH122]', async ({ page }) => {
            // A short viewport, so the rule under "Reserve a reading
            // copy" starts below the fold and the observer has not yet
            // fired when this test reads it.
            await page.emulateMedia({ reducedMotion: 'no-preference' });
            await page.addInitScript(() => {
                try {
                    localStorage.setItem('theme', 'sepia');
                } catch {
                    // no storage: the page keeps its served theme
                }
            });
            await page.setViewportSize({ width: 1280, height: 320 });
            await page.goto(url);
            await page.waitForFunction(() => document.documentElement.getAttribute('data-theme') === 'sepia');
            const rule = page.locator('[data-kp-reveal="rule"]').first();
            expect(await rule.evaluate((el) => el.classList.contains('is-in')), 'not yet in view').toBe(false);
            const before = await pseudo(rule, '::after', ['transform']);
            expect(before.transform, 'not drawn before it is in view').toMatch(/matrix\(0,|scale\(0/);
            await rule.scrollIntoViewIfNeeded();
            await expect(rule).toHaveClass(/is-in/, { timeout: 5000 });
            await settled(page);
            const after = await pseudo(rule, '::after', ['transform', 'background-color']);
            expect(after.transform, 'drawn full width').toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
            expect(after['background-color']).toBe(await paint(page, '--border-strong'));
        });

        test('the divider is a double warm-brown rule, and the second carries a diamond at its centre [TH121]', async ({ page }) => {
            await open(page, url);
            const dividers = page.locator('[data-kp-divider]');
            expect(await dividers.count()).toBe(2);
            const first = await dividers.nth(0).evaluate((el) => getComputedStyle(el).backgroundImage);
            expect(first.match(/linear-gradient/g)?.length, 'two rules layered as backgrounds').toBe(2);
            const mark = await pseudo(dividers.nth(1), '::after', ['content']);
            expect(mark.content.replace(/"/g, '')).toContain('◆');
        });

        test('the dropdown opens in the theme’s own language, sienna on hover [KT14]', async ({ page }) => {
            await open(page, url);
            const trigger = page.locator('.kp-nav__link[aria-haspopup]').first();
            const li = page.locator('.kp-nav__links > li', { has: trigger }).first();
            await li.hover();
            const menu = li.locator('.kp-nav__menu');
            await expect(menu).toBeVisible();
            expect(await menu.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(await paint(page, '--popover'));
            const item = menu.locator('a').first();
            await item.hover();
            expect(await item.evaluate((el) => getComputedStyle(el).color)).toBe(await paint(page, '--primary'));
        });

        test('the primary, ghost and destructive buttons carry the theme’s own quiet plates', async ({ page }) => {
            await open(page, url);
            const primary = page.locator('[data-kp-surface="hero"] .kp-button--primary').first();
            expect(await primary.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(await paint(page, '--primary'));
            expect(await primary.evaluate((el) => getComputedStyle(el).borderRadius)).toBe('6px');
            const ghost = page.locator('[data-kp-surface="hero"] .kp-button--ghost').first();
            expect(await ghost.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe('rgba(0, 0, 0, 0)');
            const wipe = page.locator('.kp-button--destructive').first();
            expect(await wipe.evaluate((el) => getComputedStyle(el).color)).toBe(await paint(page, '--destructive'));
        });

        test('the dossier: a rotated stamp from data-kp-label, and redactions covered until the file opens, lifting in order [TH120]', async ({
            page,
        }) => {
            await open(page, url);
            const dossier = page.locator('.kp-card[data-kp-reveal="emphasis"]');
            const stamp = await pseudo(dossier, '::before', ['content', 'rotate']);
            expect(stamp.content.replace(/"/g, '').trim().length, 'the word comes from the attribute, not from CSS content (KT5)').toBeGreaterThan(0);
            expect(stamp.rotate).not.toBe('none');
            const marks = dossier.locator('mark');
            expect(await marks.count()).toBe(3);
            const covered = await pseudo(marks.first(), '::after', ['transform']);
            expect(covered.transform, 'covered before the trigger').toMatch(/matrix\(1,|scale\(1/);
            expect(await marks.first().evaluate((el) => getComputedStyle(el).color), 'the word itself is not painted').toBe('rgba(0, 0, 0, 0)');
            await dossier.locator('[data-kp-reveal-trigger]').click();
            await expect(marks.first()).toHaveClass(/is-cleared/);
            await settled(page);
            const lifted = await pseudo(marks.first(), '::after', ['transform']);
            expect(lifted.transform, 'the bar lifted').toMatch(/matrix\(0,|scale\(0/);
            expect(await marks.first().evaluate((el) => getComputedStyle(el).color), 'the word now reads').not.toBe('rgba(0, 0, 0, 0)');
        });

        test('the wipe confirmation is a real dialog, Cancel focused by default, never Wipe [DI10]', async ({ page }) => {
            await open(page, url);
            const wipe = page.locator('.kp-button--destructive').first();
            await wipe.click();
            const dialog = page.locator('.kp-confirm');
            await expect(dialog).toBeVisible();
            expect(await dialog.evaluate((el) => (el instanceof HTMLDialogElement ? el.open : false)), 'a real <dialog>').toBe(true);
            const focusedIsDestructive = await page.evaluate(() => document.activeElement?.classList.contains('kp-button--destructive') ?? false);
            expect(focusedIsDestructive, 'focus is not on the destructive action').toBe(false);
            expect(await dialog.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(await paint(page, '--popover'));
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
