// The shade-light register [S48, LIFT_PLAN row 6, SL0–SL4]: the approved
// concept demo "Quiet Margin" (2026-09-08) reproduced by the package,
// measured on the concept page under shade-light in both channels.
//
// What the demo showed and this suite holds: the headline's words
// resolving out of a blur one after another, the lede's marks filling in
// left to right with an accent tint (box-decoration-break: clone across a
// wrapped line), the rule under a heading drawing itself once it scrolls
// into view, the nav's brand dot and its dropdown's shadow, the flat
// buttons with the one hover-darken the demo names, the dossier's
// redaction bars clearing on the trigger, the dialog rising into place,
// and the whole approved inventory on the page. The blurred section seam
// as divider is judged by eye on the catalogue since scope-73
// (page-effects#dividers).
//
// Drills [KT3], performed 2026-09-08 in both browsers and restored:
//   - the armed mark rule (`[data-kp-effects] mark:not(.is-cleared)`)
//     removed from the register → the lede's marks paint filled from the
//     first frame, red on "the lede's marks stand empty before the
//     script clears them";
//   - the redaction's covering rule
//     (`[data-kp-effects] .kp-card[...] mark:not(.is-cleared)::after`)
//     removed → the redaction never covers the dossier's marks, red on
//     "the dossier covers its marks before the trigger opens them" (since
//     fix-33, scope-93, the plate is the mark's own cloned background and
//     that rule sets its background-size, which the test reads);
//   - `[data-kp-reveal='headline'].is-words [data-word]`'s animation
//     removed → the words never receive the `kp-word-in` name, red on
//     "the headline's words resolve through a blur".

import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { animationsSeen, recordAnimations, style } from './paint.mjs';

const INVENTORY = JSON.parse(readFileSync(new URL('../showcase/concept-demo.json', import.meta.url), 'utf8')).elements;

const CHANNELS = [
    ['framework-free', '/examples/concept-shade-light.html'],
    ['React', '/tests/fixtures/examples.html?example=concept&copy=shade-light'],
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
            localStorage.setItem('theme', 'shade-light');
        } catch {
            // no storage: the page keeps its served theme
        }
    });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(url);
    await page.waitForFunction(() => document.documentElement.getAttribute('data-theme') === 'shade-light');
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
    test.describe(`the shade-light register, ${channel}`, { tag: ['@theme:shade-light', '@component:page-effects', '@component:examples'] }, () => {
        test('the headline’s words resolve out of a blur, one after another, and end as their own text [TH119, SL2]', async ({ page }) => {
            // Armed before the page exists, because the keyframe that
            // proves this register is its own runs and then stops: reading
            // `animationName` one moment after load answered "" in Kenny's
            // verify run of 2026-09-10, and polling for a value that has
            // already left never finds it [fix-1].
            await recordAnimations(page);
            await open(page, url);
            const h1 = page.locator('[data-kp-reveal="headline"]').first();
            const source = await h1.getAttribute('data-kp-text');
            const words = h1.locator('[data-word]');
            expect(await words.count(), 'the module wrapped the words').toBeGreaterThan(1);
            await animationsSeen(page, 'the demo’s own keyframe, not shout or slam').toContain('kp-word-in');
            await expect(h1).toHaveClass(/is-deciphered/, { timeout: 15000 });
            await settled(page);
            expect(await h1.textContent()).toBe(source);
        });

        test('under reduced motion there is no blur at all, and every reveal is at rest', async ({ page }) => {
            await open(page, url, { reduced: true });
            const h1 = page.locator('[data-kp-reveal="headline"]').first();
            await expect(h1).toHaveClass(/is-deciphered/);
            const source = await h1.getAttribute('data-kp-text');
            expect(await h1.textContent()).toBe(source);
            expect(await page.locator('[data-kp-surface="hero"] mark:not(.is-cleared)').count()).toBe(0);
            const rule = page.locator('[data-kp-reveal="rule"]').first();
            await expect(rule).toHaveClass(/is-in/);
        });

        test('the lede’s marks stand empty before the script clears them, then fill left to right in the accent [TH120]', async ({ page }) => {
            await page.addInitScript(() => {
                window.kpArmedSize = [];
                new MutationObserver(() => {
                    const m = document.querySelector('[data-kp-surface="hero"] mark');
                    if (m && document.documentElement.hasAttribute('data-kp-effects') && !m.classList.contains('is-cleared')) {
                        window.kpArmedSize.push(getComputedStyle(m).backgroundSize);
                    }
                }).observe(document, { subtree: true, childList: true, attributes: true });
            });
            await open(page, url);
            const mark = page.locator('[data-kp-surface="hero"] mark').first();
            await expect(mark).toHaveClass(/is-cleared/, { timeout: 15000 });
            await settled(page);
            await expect.poll(() => mark.evaluate((el) => getComputedStyle(el).backgroundSize), 'the fill covers the word').toMatch(/^100%/);
            expect(await mark.evaluate((el) => getComputedStyle(el).backgroundImage), 'a tint, not a swap of the ink').toMatch(/linear-gradient/);
            expect(await mark.evaluate((el) => getComputedStyle(el).color), 'the ink never changes').toBe(await paint(page, '--foreground'));
            const armed = await page.evaluate(() => window.kpArmedSize);
            expect(
                armed.some((s) => /^0(px|%)/.test(s)),
                'the mark stood empty while armed, before the fill ran',
            ).toBe(true);
        });

        test('the rule draws itself under a heading when it enters the viewport, once [TH122]', async ({ page }) => {
            await open(page, url);
            const rule = page.locator('[data-kp-reveal="rule"]').first();
            await rule.scrollIntoViewIfNeeded();
            await expect(rule).toHaveClass(/is-in/, { timeout: 5000 });
            const drawn = await pseudo(rule, '::after', ['background-color', 'animation-name']);
            expect(drawn['animation-name']).toBe('kp-rule-in');
            expect(drawn['background-color']).toBe(await paint(page, '--primary'));
            await settled(page);
            await expect.poll(async () => (await pseudo(rule, '::after', ['transform'])).transform).toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
        });

        test('the dossier covers its marks before the trigger opens them, then clears the redaction bars in order', async ({ page }) => {
            await open(page, url);
            const dossier = page.locator('.kp-card[data-kp-reveal="emphasis"]');
            const marks = dossier.locator('mark');
            expect(await marks.count(), 'the three redacted phrases').toBe(3);
            const covered = await pseudo(marks.first(), '', ['background-size', 'background-image']);
            expect(covered['background-size'], 'the bar covers the phrase before the trigger').toMatch(/^100% /);
            expect(covered['background-image']).toContain(await paint(page, '--foreground'));
            await dossier.locator('[data-kp-reveal-trigger]').click();
            await expect(marks.first()).toHaveClass(/is-cleared/);
            await settled(page);
            await expect
                .poll(async () => (await pseudo(marks.first(), '', ['background-size']))['background-size'], 'the bar has cleared')
                .toMatch(/^0(%|px) /);
        });

        test('the dialog rises into place with the deep shadow and the dimmed backdrop', async ({ page }) => {
            await open(page, url);
            const trigger = page.locator('[data-kp-confirm]').first();
            await trigger.scrollIntoViewIfNeeded();
            await trigger.click();
            const dialog = page.locator('dialog[open]').first();
            await expect(dialog).toBeVisible();
            await style(dialog, 'animation-name').toBe('kp-dialog-in');
            await style(dialog, 'box-shadow').not.toBe('none');
            await settled(page);
            await expect.poll(async () => await dialog.evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
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
