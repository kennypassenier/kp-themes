// The high-contrast register [S48, LIFT_PLAN row 6]: the approved concept
// demo "Ink & Signal" (2026-09-08) reproduced by the package, measured on
// the concept page under high-contrast in both channels.
//
// What the demo showed and this suite holds: the headline's one-shot
// ellipse wipe (clip-path, no character scrambling, text intact
// throughout), the rule drawing left to right under a heading, the
// dossier's three redactions covered by a solid bar and lifting one after
// another on 0/90/180ms delays once the trigger is pressed, the lede's
// marks staying a plain accent plate with no cover-and-clear step, the
// mirrored primary button dropping onto its own 3px offset when pressed,
// the ghost button's bar rising from the bottom edge on hover and focus,
// the two-tone razor-tear dividers, and the nav dropdown carrying its own
// rule (KT14). Two findings this suite does not re-litigate (recorded in
// themes/high-contrast/anatomy.md and the lift report, S49): the headline
// and rule reveals are plain CSS with no [data-kp-effects] gate and no
// session memo — they replay on every load, unlike the other five
// registers' JS-driven reveals — and the ghost button's rising bar
// replaces the demo's literal duplicate-label slide, which the shared
// Button renderer has no markup for.
//
// Drills [KT3], performed 2026-09-08 in chromium, repeated the same
// day in firefox (each one red on the test it names, then restored green
// in both browsers) [G13]:
//   - the headline's `clip-path` + `animation` rule removed from the
//     register → the headline never narrows from the left edge, red on
//     "the headline wipes in from the left, once, on load";
//   - the dossier's `:not(.is-cleared)` covering rule removed → the
//     redaction bars read scaleX(0) before the trigger is ever pressed,
//     red on "the dossier's redactions are covered until the trigger
//     lifts them, staggered";
//   - `.kp-button--mirror`'s box-shadow rule removed → the primary
//     button in the hero carries no offset at rest, red on "the mirrored
//     button drops onto its own offset when pressed".

import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { animationsSeen, recordAnimations, style } from './paint.mjs';

const INVENTORY = JSON.parse(readFileSync(new URL('../showcase/concept-demo.json', import.meta.url), 'utf8')).elements;

const CHANNELS = [
    ['framework-free', '/examples/concept-high-contrast.html'],
    ['React', '/tests/fixtures/examples.html?example=concept&copy=high-contrast'],
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
            localStorage.setItem('theme', 'high-contrast');
        } catch {
            // no storage: the page keeps its served theme
        }
    });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(url);
    await page.waitForFunction(() => document.documentElement.getAttribute('data-theme') === 'high-contrast');
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
    test.describe(`the high-contrast register, ${channel}`, () => {
        test('the headline wipes in from the left, once, on load, with no character scrambling', async ({ page }) => {
            // Armed before the page exists: the wipe runs once and stops,
            // so a read one moment later is a race and a poll for a value
            // that has already left never finds it [fix-1].
            await recordAnimations(page);
            await open(page, url);
            const h1 = page.locator('[data-kp-reveal="headline"]').first();
            const text = await h1.textContent();
            // The demo's own idiom: no data-glyph spans, no is-deciphered
            // gate on the visible text — the words are on the page from
            // the first paint, only the clip-path narrows in.
            expect(text?.trim().length, 'the words are already the headline, never scrambled').toBeGreaterThan(0);
            await animationsSeen(page, 'the wipe is this register’s own keyframe').toContain('kp-hc-headline-wipe');
            await settled(page);
            expect(await h1.evaluate((el) => getComputedStyle(el).clipPath), 'settled at the full ellipse').toMatch(/ellipse/);
            expect(await h1.textContent()).toBe(text);
        });

        test('under reduced motion there is no animation at all, and every reveal is already at rest', async ({ page }) => {
            await open(page, url, { reduced: true });
            const h1 = page.locator('[data-kp-reveal="headline"]').first();
            expect(await h1.evaluate((el) => getComputedStyle(el).animationName)).toBe('none');
            expect(await h1.evaluate((el) => getComputedStyle(el).clipPath), 'the ellipse is already full').toMatch(/ellipse/);
            const rule = page.locator('[data-kp-reveal="rule"]').first();
            const after = await pseudo(rule, '::after', ['animation-name', 'transform']);
            expect(after['animation-name']).toBe('none');
            expect(after.transform, 'the rule is already drawn').toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
        });

        test('the rule under a heading draws left to right, once, on load [TH122]', async ({ page }) => {
            await open(page, url);
            const rule = page.locator('[data-kp-reveal="rule"]').first();
            const before = await pseudo(rule, '::after', ['animation-name', 'height', 'background-color']);
            expect(before['animation-name']).toBe('kp-hc-rule-wipe');
            expect(before.height).toBe('3px');
            expect(before['background-color'], 'the rule is ink, not the accent').toBe(await paint(page, '--foreground'));
            await settled(page);
            const after = await pseudo(rule, '::after', ['transform']);
            expect(after.transform, 'settled at the full width').toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
        });

        test('the dossier redactions are covered until the trigger lifts them, staggered by 90ms', async ({ page }) => {
            await open(page, url);
            const dossier = page.locator('.kp-card[data-kp-reveal="emphasis"]');
            const marks = dossier.locator('mark');
            expect(await marks.count(), 'the three redacted phrases').toBe(3);
            const first = await pseudo(marks.first(), '::after', ['transform']);
            expect(first.transform, 'the bar covers the word at rest (scaleX(1), the identity matrix)').toMatch(
                /^(none|matrix\(1, 0, 0, 1, 0, 0\))$/,
            );
            expect(await marks.first().evaluate((el) => getComputedStyle(el).color), 'the word is hidden under the bar').toBe('rgba(0, 0, 0, 0)');
            const delay2 = await pseudo(marks.nth(1), '::after', ['transition-delay']);
            const delay3 = await pseudo(marks.nth(2), '::after', ['transition-delay']);
            expect(delay2['transition-delay']).toBe('0.09s');
            expect(delay3['transition-delay']).toBe('0.18s');
            await dossier.locator('[data-kp-reveal-trigger]').click();
            await expect(marks.first()).toHaveClass(/is-cleared/);
            await settled(page);
            const cleared = await pseudo(marks.first(), '::after', ['transform']);
            expect(cleared.transform, 'the bar lifted off').toMatch(/matrix\(0/);
            await style(marks.first(), 'color', 'the word reads again').not.toBe('rgba(0, 0, 0, 0)');
        });

        test('the lede marks are a plain accent plate, with no cover-and-clear step [finding, S49]', async ({ page }) => {
            await open(page, url);
            const mark = page.locator('[data-kp-surface="hero"] .kp-lede mark').first();
            await expect(mark).toBeVisible();
            expect(await mark.evaluate((el) => getComputedStyle(el).backgroundColor), 'always the accent').toBe(await paint(page, '--accent'));
            expect(await mark.evaluate((el) => getComputedStyle(el).color)).toBe(await paint(page, '--accent-foreground'));
        });

        test('the mirrored button drops onto its own offset when pressed, no easing', async ({ page }) => {
            await open(page, url);
            const button = page.locator('[data-kp-surface="hero"] .kp-button--mirror').first();
            const rest = await button.evaluate((el) => getComputedStyle(el).boxShadow);
            expect(rest, 'the flat 3px offset').toMatch(/3px 3px 0px/);
            const box = await button.boundingBox();
            if (!box) throw new Error('the mirrored button has no box');
            await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
            await page.mouse.down();
            const pressed = await button.evaluate((el) => getComputedStyle(el).boxShadow);
            expect(pressed).toBe('none');
            expect(await button.evaluate((el) => getComputedStyle(el).translate), 'dropped onto its own shadow, instantly').toBe('3px 3px');
            await page.mouse.up();
        });

        test('the ghost button has no fill, and a bar rises from the bottom edge on hover', async ({ page }) => {
            await open(page, url);
            const ghost = page.locator('[data-kp-surface="hero"] .kp-button--ghost').first();
            expect(await ghost.evaluate((el) => getComputedStyle(el).backgroundColor), 'no fill at rest').toBe('rgba(0, 0, 0, 0)');
            const restBar = await pseudo(ghost, '::after', ['transform']);
            expect(restBar.transform, 'the bar sits below the edge').toMatch(/matrix\(1, 0, 0, 1, 0,/);
            await ghost.hover();
            await settled(page);
            const hoverBar = await pseudo(ghost, '::after', ['transform']);
            expect(hoverBar.transform, 'the bar rose into place').toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
        });

        test('the razor-tear dividers swap their two tones', async ({ page }) => {
            await open(page, url);
            const dividers = page.locator('[data-kp-divider]');
            expect(await dividers.count()).toBe(2);
            const first = await dividers.first().evaluate((el) => getComputedStyle(el).backgroundColor);
            expect(first, 'ink first').toBe(await paint(page, '--border-strong'));
            const second = await dividers.nth(1).evaluate((el) => getComputedStyle(el).backgroundColor);
            expect(second, 'signal second').toBe(await paint(page, '--accent'));
        });

        test('the nav dropdown carries its own rule [KT14]', async ({ page }) => {
            await open(page, url);
            const trigger = page.locator('.kp-nav__link[aria-haspopup]').first();
            await trigger.hover();
            const menu = page.locator('.kp-nav__menu').first();
            await expect(menu).toBeVisible();
            const style = await menu.evaluate((el) => {
                const s = getComputedStyle(el);
                return { borderWidth: s.borderTopWidth, borderColor: s.borderTopColor };
            });
            expect(style.borderWidth).toBe('2px');
            expect(style.borderColor).toBe(await paint(page, '--border-strong'));
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
