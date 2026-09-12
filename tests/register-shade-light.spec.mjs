// The shade-light register [S48, LIFT_PLAN row 6, SL0–SL4]: the approved
// concept demo "Quiet Margin" (2026-09-08) reproduced by the package,
// measured on the concept page under shade-light in both channels.
//
// What the demo showed and this suite holds: the headline's words
// resolving out of a blur one after another, the lede's marks filling in
// left to right with an accent tint (box-decoration-break: clone across a
// wrapped line), the rule under a heading drawing itself once it scrolls
// into view, the blurred section seam as divider (measured at DI9's
// felt-not-seen opacity), the nav's brand dot and its dropdown's shadow,
// the flat buttons with the one hover-darken the demo names, the dossier's
// redaction bars clearing on the trigger, the dialog rising into place,
// and the whole approved inventory on the page.
//
// Drills [KT3], performed 2026-09-08 in both browsers and restored:
//   - the armed mark rule (`[data-kp-effects] mark:not(.is-cleared)`)
//     removed from the register → the lede's marks paint filled from the
//     first frame, red on "the lede's marks stand empty before the
//     script clears them";
//   - the redaction's covering rule
//     (`[data-kp-effects] .kp-card[...] mark:not(.is-cleared)::after`)
//     removed → the redaction never covers the dossier's marks, red on
//     "the dossier covers its marks before the trigger opens them";
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
    test.describe(`the shade-light register, ${channel}`, () => {
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

        test('the dividers are a blurred seam, felt rather than seen, at or under DI9’s ceiling [TH121, DI9]', async ({ page }) => {
            await open(page, url);
            const dividers = page.locator('[data-kp-divider]');
            expect(await dividers.count()).toBe(2);
            const first = await pseudo(dividers.first(), '::before', ['opacity', 'filter', 'background-image']);
            expect(Number(first.opacity), 'DI9’s 6% ceiling, the demo’s own 5%').toBeLessThanOrEqual(0.06);
            expect(first.filter, 'the seam is blurred, not a hard line').toMatch(/blur/);
            expect(first['background-image']).toMatch(/linear-gradient/);
            const alt = await pseudo(dividers.nth(1), '::before', ['opacity']);
            expect(Number(alt.opacity), 'the accent band, at the ceiling and not over it').toBeLessThanOrEqual(0.06);
        });

        test('the brand carries its own dot, a hovered link underlines in the primary, and the dropdown lifts on a shadow', async ({ page }) => {
            await open(page, url);
            const brand = page.locator('.kp-nav__brand').first();
            const dot = await pseudo(brand, '::before', ['background-color', 'border-radius']);
            expect(dot['background-color'], 'the brand’s dot is the primary').toBe(await paint(page, '--primary'));
            expect(dot['border-radius']).not.toBe('0px');
            const link = page.locator('.kp-nav__link').nth(1);
            await link.hover();
            await expect.poll(() => link.evaluate((el) => getComputedStyle(el).color)).toBe(await paint(page, '--primary'));
            expect(await link.evaluate((el) => getComputedStyle(el).borderBottomColor), 'the underline').toBe(await paint(page, '--primary'));
            const item = page
                .locator('.kp-nav__links > li')
                .filter({ has: page.locator('.kp-nav__menu') })
                .first();
            await item.hover();
            const menu = item.locator('.kp-nav__menu');
            await expect(menu).toBeVisible();
            await style(menu, 'box-shadow', 'the dropdown lifts on a shadow, not a border alone').not.toBe('none');
            await style(menu, 'border-color', 'the boundary stays too').toBe(await paint(page, '--border-strong'));
        });

        test('the buttons are flat: the primary a plate, the ghost underlined, the destructive an outline', async ({ page }) => {
            await open(page, url);
            const primary = page.locator('[data-kp-surface="hero"] .kp-button--primary').first();
            // Flat means nothing is drawn, which is either no shadow at all
            // or the ring channel resting at zero offset, blur and spread —
            // the shape the package's two-channel focus ring keeps at rest
            // (DI2, AR30). Both paint nothing; a real elevation would carry
            // a non-zero length.
            const shadow = await primary.evaluate((el) => getComputedStyle(el).boxShadow);
            expect(shadow === 'none' || /0px 0px 0px 0px/.test(shadow), `no elevation on a button, got ${shadow}`).toBe(true);
            expect(await primary.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(await paint(page, '--primary'));
            await primary.hover();
            await expect.poll(() => primary.evaluate((el) => getComputedStyle(el).backgroundColor)).not.toBe(await paint(page, '--primary'));
            const ghost = page.locator('[data-kp-surface="hero"] .kp-button--ghost').first();
            expect(await ghost.evaluate((el) => getComputedStyle(el).textDecorationLine)).toMatch(/underline/);
            const destructive = page.locator('.kp-button--destructive').first();
            await style(destructive, 'color').toBe(await paint(page, '--destructive'));
            await style(destructive, 'border-color').toBe(await paint(page, '--destructive'));
        });

        test('the dossier covers its marks before the trigger opens them, then clears the redaction bars in order', async ({ page }) => {
            await open(page, url);
            const dossier = page.locator('.kp-card[data-kp-reveal="emphasis"]');
            const marks = dossier.locator('mark');
            expect(await marks.count(), 'the three redacted phrases').toBe(3);
            const covered = await pseudo(marks.first(), '::after', ['clip-path', 'background-color']);
            expect(covered['clip-path'], 'the bar covers the phrase before the trigger').toMatch(/^inset\(0px 0px 0px 0px\)$|^inset\(0px\)$/);
            expect(covered['background-color']).toBe(await paint(page, '--foreground'));
            await dossier.locator('[data-kp-reveal-trigger]').click();
            await expect(marks.first()).toHaveClass(/is-cleared/);
            await settled(page);
            const cleared = await pseudo(marks.first(), '::after', ['clip-path']);
            expect(cleared['clip-path'], 'the bar has cleared').toMatch(/100%.+0px.+0px\)$|100% 0px 0px\)$/);
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

        test('one light at the top left: the control lifts, and the press goes under the surface [scope-12]', async ({ page }) => {
            // Drilled 2026-09-12 in firefox: the rest `box-shadow` removed
            // -> red on the shadow lying to the lower right; the `:active`
            // rule's `inset` removed -> red on the press turning inward.
            // The first attempt reported green: the assertion asked only
            // that the shadow not be `none`, and the base layer leaves a
            // `0px 0px 0px 0px` behind. It reads the offsets now [KT3].
            await open(page, url);
            // The PLAIN button, named explicitly. `.kp-button` with `.first()`
            // reaches the hero's `--mirror` variant, which carries its own
            // later rules — so this test passed with the rule under it
            // removed, until the drill of 2026-09-12 said so [KT3].
            const btn = page.locator('[class="kp-button"]').first();
            const rest = await btn.evaluate((el) => getComputedStyle(el).boxShadow);
            // The OFFSETS, not merely "a shadow". Drilled 2026-09-12: with
            // the rest rule removed the button still reports a box-shadow of
            // `0px 0px 0px 0px` from the base layer, so `not.toBe('none')`
            // stayed green over nothing at all [KT3].
            const offsets = rest.match(/(-?[\d.]+)px (-?[\d.]+)px ([\d.]+)px/);
            expect(offsets, 'a shadow at rest').not.toBeNull();
            expect(Number(offsets[1]), 'it falls to the right of the source').toBeGreaterThan(0);
            expect(Number(offsets[2]), 'and below it').toBeGreaterThan(Number(offsets[1]));
            expect(rest, 'away from the light, not into it').not.toContain('inset');
            await btn.hover();
            await style(btn, 'translate', 'the lift is toward the source').toBe('-1px -1px');
            // The press is instant on the way in, so a short click still
            // shows [Kenny, 2026-09-11, on shade-dark's twin].
            await style(btn, 'transition-duration', 'the lift eases').not.toBe('0s');
            await page.mouse.down();
            await style(btn, 'transition-duration', 'the press does not ease in').toBe('0s');
            expect(await btn.evaluate((el) => getComputedStyle(el).boxShadow), 'and it turns inward').toContain('inset');
            await page.mouse.up();
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
