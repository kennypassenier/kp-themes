// The forest register [S48, LIFT_PLAN forest row]: the approved concept demo
// "Contour Register" (2026-09-08) reproduced by the package, measured on
// the concept page under forest in both channels.
//
// What the demo showed and this suite holds: the plain lede highlight
// (always visible, no reveal), the dossier's redactions covered while
// armed and cleared on the single trigger with a staggered crossfade,
// the section rule drawing in from the left when its heading enters the
// viewport, the razor-tear divider and the second, concentric-ring
// divider, the headline settled with no routine (its fade and contour
// trace are CSS-only per the demo's own verdict, so this suite checks
// the fade the shared page can show — the trace SVG has no home on the
// generated page, recorded as a finding in themes/forest/anatomy.md), the
// nav dropdown [KT14], the mirror button's sheen, the stamp, and the
// whole approved inventory.
//
// Drills [KT3], performed 2026-09-08 in chromium and restored:
//   - the armed cover (`[data-kp-effects] [data-kp-reveal='emphasis']
//     mark:not(.is-cleared)`) removed → the redactions read from the
//     first paint, red on "the redactions are covered while armed";
//   - the razor-tear `clip-path` removed from `[data-kp-divider]` →
//     the divider paints as a plain rectangle, red on "the divider is
//     torn paper";
//   - the rule's `:not(.is-in)::before { width: 0 }` removed → the rule
//     stands drawn before its heading enters the viewport, red on "the
//     rule draws in on scroll".

import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

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
    test.describe(`the forest register, ${channel}`, () => {
        test('the headline settles at rest, no boot overlay and no reveal routine armed', async ({ page }) => {
            await open(page, url);
            expect(await page.locator('.kp-boot').count(), 'forest declares no --kp-arrival').toBe(0);
            const h1 = page.locator('[data-kp-reveal="headline"]').first();
            await settled(page);
            expect(await h1.evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
            expect(await h1.textContent()).toContain('Read the ground before you walk it.');
        });

        test('the plain lede mark is a felt highlight, unconditioned on any reveal state', async ({ page }) => {
            await open(page, url);
            const mark = page.locator('[data-kp-surface="hero"] .kp-lede mark').first();
            await expect(mark).toBeVisible();
            // Outside a data-kp-reveal="emphasis" container this is a plain
            // highlight (the demo's own lede mark), never a redaction — the
            // shared module still discovers it as a "loose" mark and may
            // toggle .is-cleared on its own timer (js/effects.js), but the
            // theme's styling does not key on that class at all, so the
            // paint is identical either way.
            const before = await mark.evaluate((el) => getComputedStyle(el).backgroundColor);
            expect(before, 'the highlight, present immediately').not.toBe('rgba(0, 0, 0, 0)');
            await settled(page);
            await page.waitForTimeout(1700);
            const after = await mark.evaluate((el) => getComputedStyle(el).backgroundColor);
            expect(after, 'unchanged whether or not the module has cleared it').toBe(before);
            // Read the one property, not the whole declaration: firefox
            // hands a CSSStyleDeclaration back from evaluate() as an empty
            // object, so `style.color` there is undefined.
            const colour = await mark.evaluate((el) => getComputedStyle(el).color);
            expect(colour).toBe(await paint(page, '--foreground'));
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
            expect(await marks.nth(0).evaluate((el) => getComputedStyle(el).backgroundColor), 'cleared').toBe('rgba(0, 0, 0, 0)');
            expect(await marks.nth(0).evaluate((el) => getComputedStyle(el).color), 'ink reads again, matching its paragraph').toBe(inkAround);
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

        test('the razor-tear divider is torn paper, and the second divider is two concentric rings [TH121]', async ({ page }) => {
            await open(page, url);
            const dividers = page.locator('[data-kp-divider]');
            expect(await dividers.count()).toBe(2);
            const tear = dividers.nth(0);
            expect(await tear.evaluate((el) => getComputedStyle(el).clipPath), 'torn paper').toMatch(/^polygon\(/);
            const box1 = await tear.boundingBox();
            expect(box1?.height).toBeGreaterThan(0);
            const rings = dividers.nth(1);
            expect(await rings.evaluate((el) => getComputedStyle(el).clipPath), 'the alt divider is not clipped').toBe('none');
            const before = await pseudo(rings, '::before', ['border-top-width', 'border-radius']);
            const after = await pseudo(rings, '::after', ['border-top-width', 'border-radius']);
            expect(before['border-top-width'], 'the outer ring').toBe('2px');
            expect(after['border-top-width'], 'the inner ring is a hairline').toBe('1px');
            expect(before['border-radius']).toMatch(/50%/);
        });

        test('the dropdown is styled in the theme’s own language [KT14]', async ({ page }) => {
            await open(page, url);
            const item = page
                .locator('.kp-nav__links > li')
                .filter({ has: page.locator('.kp-nav__menu') })
                .first();
            await item.locator('.kp-nav__link').first().hover();
            const menu = item.locator('.kp-nav__menu');
            await expect(menu).toBeVisible();
            const style = await menu.evaluate((el) => {
                const s = getComputedStyle(el);
                return { background: s.backgroundColor, border: s.borderTopWidth, boxShadow: s.boxShadow };
            });
            expect(style.background).toBe(await paint(page, '--card'));
            expect(style.border).not.toBe('0px');
            expect(style.boxShadow, 'a lifted card, not a flat panel').not.toBe('none');
        });

        test('the primary button carries the mirror sheen and lifts on hover', async ({ page }) => {
            await open(page, url);
            const btn = page.locator('[data-kp-surface="hero"] .kp-button--primary').first();
            const rest = await btn.evaluate((el) => getComputedStyle(el).backgroundPosition);
            await btn.hover();
            await settled(page);
            await expect.poll(() => btn.evaluate((el) => getComputedStyle(el).backgroundPosition)).not.toBe(rest);
            const lift = await btn.evaluate((el) => getComputedStyle(el).transform);
            expect(lift).not.toBe('none');
        });

        test('the stamp reads the dossier’s own label, rotated, in the destructive ink', async ({ page }) => {
            await open(page, url);
            const card = page.locator('.kp-card[data-kp-label]').first();
            const stamp = await pseudo(card, '::before', ['content', 'color', 'transform']);
            // Firefox reports an attr() content unresolved; chromium
            // resolves it. Both say the stamp reads the card's own label.
            expect(['Field copy', 'attr(data-kp-label)']).toContain(stamp.content.replace(/"/g, ''));
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
