// The forest register [S48, LIFT_PLAN forest row]: the approved concept demo
// "Contour Register" (2026-09-08) reproduced by the package, measured on
// the concept page under forest in both channels.
//
// What the demo showed and this suite holds: the dossier's redactions
// covered while armed and cleared on the single trigger with a staggered
// crossfade, the section rule drawing in from the left when its heading
// enters the viewport, the headline settled with no routine (its fade and contour
// trace are CSS-only per the demo's own verdict, so this suite checks
// the fade the shared page can show — the trace SVG has no home on the
// generated page, recorded as a finding in themes/forest/anatomy.md), the
// nav dropdown [KT14], the mirror button's sheen, the stamp, and the
// whole approved inventory. The plain lede highlight and the two dividers
// are judged by eye on the catalogue since scope-73
// (page-effects#lede-marks, page-effects#dividers).
//
// Drills [KT3], performed 2026-09-08 in chromium, repeated the same
// day in firefox (each one red on the test it names, then restored green
// in both browsers) [G13]:
//   - the armed cover (`[data-kp-effects] [data-kp-reveal='emphasis']
//     mark:not(.is-cleared)`) removed → the redactions read from the
//     first paint, red on "the redactions are covered while armed";
//   - the rule's `:not(.is-in)::before { width: 0 }` removed → the rule
//     stands drawn before its heading enters the viewport, red on "the
//     rule draws in on scroll".

import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { style } from './paint.mjs';
import { stampWord } from './stamp.mjs';

const INVENTORY = JSON.parse(readFileSync(new URL('../showcase/concept-demo.json', import.meta.url), 'utf8')).elements;

const CHANNELS = [
    ['framework-free', '/examples/concept-forest.html'],
    ['React', '/tests/fixtures/examples.html?example=concept&copy=forest'],
];

/**
 * @param {import('@playwright/test').Page} page
 * @param {string} url
 * @param {{ reduced?: boolean, height?: number }} [options]
 */
async function open(page, url, { reduced = false, height = 900 } = {}) {
    await page.emulateMedia({ reducedMotion: reduced ? 'reduce' : 'no-preference' });
    await page.addInitScript(() => {
        try {
            localStorage.setItem('theme', 'forest');
        } catch {
            // no storage: the page keeps its served theme
        }
    });
    await page.setViewportSize({ width: 1280, height });
    await page.goto(url);
    await page.waitForFunction(() => document.documentElement.getAttribute('data-theme') === 'forest');
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
    test.describe(`the forest register, ${channel}`, { tag: ['@theme:forest', '@component:page-effects', '@component:examples'] }, () => {
        test('the headline settles at rest, no boot overlay and no reveal routine armed', async ({ page }) => {
            await open(page, url);
            expect(await page.locator('.kp-boot').count(), 'forest declares no --kp-arrival').toBe(0);
            const h1 = page.locator('[data-kp-reveal="headline"]').first();
            await settled(page);
            expect(await h1.evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
            expect(await h1.textContent()).toContain('Read the ground before you walk it.');
        });

        test('the dossier redactions are covered while armed and clear on the trigger, staggered [TH120]', async ({ page }) => {
            await open(page, url);
            const dossier = page.locator('.kp-card[data-kp-reveal="emphasis"]');
            const marks = dossier.locator('mark');
            expect(await marks.count()).toBe(3);
            const first = marks.nth(0);
            // Armed (data-kp-effects present, JS attached): covered before
            // the trigger — a plate of ink over the phrase.
            await expect(first).not.toHaveClass(/is-cleared/);
            expect(await first.evaluate((el) => getComputedStyle(el).backgroundColor), 'covered').toBe(await paint(page, '--foreground'));
            expect(await first.evaluate((el) => getComputedStyle(el).color), 'ink hidden').toBe('rgba(0, 0, 0, 0)');
            // The surrounding paragraph's own colour: `color: inherit` on a
            // cleared mark should read whatever ink the dossier's prose
            // uses, not a colour of the mark's own.
            const inkAround = await dossier
                .locator('.kp-card__body p')
                .first()
                .evaluate((el) => getComputedStyle(el).color);
            await dossier.locator('[data-kp-reveal-trigger]').click();
            await expect(marks.nth(0)).toHaveClass(/is-cleared/);
            await expect(marks.nth(2)).toHaveClass(/is-cleared/, { timeout: 2000 });
            await settled(page);
            await style(marks.nth(0), 'background-color', 'cleared').toBe('rgba(0, 0, 0, 0)');
            await style(marks.nth(0), 'color', 'ink reads again, matching its paragraph').toBe(inkAround);
        });

        test('without the module (reduced motion) the redactions read from the first paint [DI7]', async ({ page }) => {
            await open(page, url, { reduced: true });
            const dossier = page.locator('.kp-card[data-kp-reveal="emphasis"]');
            const mark = dossier.locator('mark').first();
            await expect(mark).toHaveClass(/is-cleared/);
            expect(await mark.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe('rgba(0, 0, 0, 0)');
        });

        test('the section rule draws in from the left when its heading enters the viewport [TH122]', async ({ page }) => {
            // A short viewport, so the form section's heading starts below
            // the fold and the rule is genuinely armed, not yet drawn.
            await open(page, url, { height: 500 });
            const rule = page.locator('[data-kp-reveal="rule"]').first();
            await expect(rule).not.toHaveClass(/is-in/);
            const before = await pseudo(rule, '::before', ['width']);
            expect(before.width, 'armed and not yet in view').toBe('0px');
            await rule.scrollIntoViewIfNeeded();
            await expect(rule).toHaveClass(/is-in/, { timeout: 5000 });
            await settled(page);
            const after = await pseudo(rule, '::before', ['width', 'background-color']);
            expect(after.width).toBe('40px');
            expect(after['background-color']).toBe(await paint(page, '--primary'));
        });

        test('the stamp reads the dossier’s own label, rotated, in the destructive ink', async ({ page }) => {
            await open(page, url);
            const card = page.locator('.kp-card[data-kp-label]').first();
            // Measured through the paint, not the declaration: firefox
            // reports `attr()` unresolved and the old `|attr(...)`
            // alternative accepted a stamp that printed nothing [G4].
            const stamp = await pseudo(card, '::before', ['color', 'transform']);
            expect(await stampWord(page, '.kp-card[data-kp-label]', '::before', 'data-kp-label')).toBe('Field copy');
            expect(stamp.color).toBe(await paint(page, '--destructive'));
            expect(stamp.transform).toMatch(/matrix/);
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
