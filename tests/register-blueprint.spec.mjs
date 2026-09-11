// The blueprint register [S48, LIFT_PLAN row 6]: the approved concept
// demo "Working Drawing" (2026-09-08, its fourth version) reproduced by
// the package, measured on the concept page under blueprint in both
// channels.
//
// What the demo showed and this suite holds: the headline settling in
// behind the two live dimension lines (never a fixed width — the
// horizontal one's rendered width tracks the headline's own, the
// vertical one's height is contained by the wrap), the rule drawing
// itself under a heading, the lede's marks washed in with cyan, the
// dropdown redrawn as a title block with numbered leaders, the mitred
// corner on the primary button, the dossier's redactions clearing left to
// right on the trigger, and the whole approved inventory on the page.
//
// Drills [KT3], performed 2026-09-08 in chromium and firefox, restored:
//   - `--kp-measure: live` removed from the register → the module never
//     wraps the headline, red on "the dimension lines are live, not a
//     fixed width" (no `[data-kp-measured]` node at all);
//   - the armed wash (`[data-kp-effects] mark:not(.is-cleared)`) removed
//     → the lede's marks are visible from the first paint, red on "the
//     lede's marks wash in with cyan";
//   - the redaction cover (`[data-kp-effects] … mark:not(.is-cleared)
//     ::after { clip-path: inset(0 0 0 0) }`) removed → the dossier's
//     words are legible before the trigger is pressed, red on "the
//     dossier's redactions are solid ink blocks".

import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { tabToSelector } from './ring.mjs';
import { stampWord } from './stamp.mjs';

const INVENTORY = JSON.parse(readFileSync(new URL('../showcase/concept-demo.json', import.meta.url), 'utf8')).elements;

const CHANNELS = [
    ['framework-free', '/examples/concept-blueprint.html'],
    ['React', '/tests/fixtures/examples.html?example=concept&copy=blueprint'],
];

/**
 * @param {import('@playwright/test').Page} page
 * @param {string} url
 * @param {{ reduced?: boolean, width?: number }} [options]
 */
async function open(page, url, { reduced = false, width = 1280 } = {}) {
    await page.emulateMedia({ reducedMotion: reduced ? 'reduce' : 'no-preference' });
    await page.addInitScript(() => {
        try {
            localStorage.setItem('theme', 'blueprint');
        } catch {
            // no storage: the page keeps its served theme
        }
    });
    await page.setViewportSize({ width, height: 900 });
    await page.goto(url);
    await page.waitForFunction(() => document.documentElement.getAttribute('data-theme') === 'blueprint');
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
    test.describe(`the blueprint register, ${channel}`, () => {
        test('under reduced motion the headline stands, the measurement frame stands at its measured size, and every mark is cleared', async ({
            page,
        }) => {
            await open(page, url, { reduced: true });
            const h1 = page.locator('[data-kp-reveal="headline"]').first();
            expect(await h1.evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
            expect(await page.locator('[data-kp-surface="hero"] mark:not(.is-cleared)').count()).toBe(0);
            const rule = page.locator('[data-kp-reveal="rule"]').first();
            await expect(rule).toHaveClass(/is-in/);
            const bracket = page.locator('[data-kp-measure-bracket]').first();
            expect(await bracket.evaluate((el) => getComputedStyle(el).animationName), 'no entrance').toBe('none');
            expect(await bracket.evaluate((el) => getComputedStyle(el).opacity), 'and the frame still stands').toBe('1');
            expect(await page.locator('[data-kp-measure]').first().textContent(), 'the readout still reports, without playing an entrance').toMatch(
                /\d+ × \d+ px/,
            );
        });

        test('the headline settles in with a plain fade, never a decipher — the text is whole throughout', async ({ page }) => {
            await page.addInitScript(() => {
                window.kpSeen = [];
                new MutationObserver(() => {
                    const h = document.querySelector('[data-kp-reveal="headline"]');
                    if (h) window.kpSeen.push(h.textContent ?? '');
                }).observe(document, { subtree: true, childList: true, attributes: true, characterData: true });
            });
            await open(page, url);
            const h1 = page.locator('[data-kp-reveal="headline"]').first();
            const source = await h1.getAttribute('data-kp-text');
            await expect.poll(async () => h1.evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
            expect(await h1.textContent()).toBe(source);
            const seen = await page.evaluate(() => window.kpSeen);
            // Never noise glyphs, never a partial word — the text is the
            // source string at every observed instant, which is what
            // "never a decipher" means at the DOM level.
            expect(
                seen.every((t) => t === '' || t === source),
                'the headline text never changed shape',
            ).toBe(true);
        });

        test('the measurement frame reports the box it holds, and follows it [scope-18]', async ({ page }) => {
            // It replaced two dimension lines on 2026-09-11: Kenny asked for
            // those in round four and then saw the command-table demo's
            // brackets — "dan is de demo hier niet voor niks geweest". The
            // brackets report the box they hold rather than one edge of it,
            // so one readout replaces two labels.
            //
            // Drill: `measure()` returned early in js/effects.js — `14 passed,
            // 4 failed`, this test and the reduced-motion one, in both
            // channels. No wrap, no brackets, no readout.
            await open(page, url);
            await settled(page);
            const h1 = page.locator('[data-kp-reveal="headline"]').first();
            const wrap = page.locator('[data-kp-measured]').first();
            const readout = page.locator('[data-kp-measure]').first();

            expect(await page.locator('[data-kp-measure-bracket]').count(), 'four corners').toBe(4);

            const box = await h1.evaluate((el) => {
                const r = el.getBoundingClientRect();
                return { w: Math.round(r.width), h: Math.round(r.height) };
            });
            await expect.poll(() => readout.textContent(), { message: 'the readout is the box it holds' }).toBe(`${box.w} × ${box.h} px`);

            // The frame follows the box. A WIDER page does not move it — the
            // headline has a measure of its own and stayed at 496px, which
            // the first version of this test did not notice and its own
            // guard caught. Narrower does: the text rewraps.
            const before = await readout.textContent();
            await page.setViewportSize({ width: 760, height: 900 });
            await expect.poll(() => readout.textContent(), { message: 'the readout reports again when the box changes' }).not.toBe(before);
            const after = await h1.evaluate((el) => {
                const r = el.getBoundingClientRect();
                return `${Math.round(r.width)} × ${Math.round(r.height)} px`;
            });
            expect(await readout.textContent(), 'and what it reports is the box it now holds').toBe(after);
        });

        test('the lede’s marks wash in with cyan, one after another', async ({ page }) => {
            await page.addInitScript(() => {
                window.kpArmed = [];
                new MutationObserver(() => {
                    const m = document.querySelector('[data-kp-surface="hero"] .kp-lede mark');
                    if (m && document.documentElement.hasAttribute('data-kp-effects') && !m.classList.contains('is-cleared')) {
                        window.kpArmed.push(getComputedStyle(m).backgroundSize);
                    }
                }).observe(document, { subtree: true, childList: true, attributes: true });
            });
            await open(page, url);
            const marks = page.locator('[data-kp-surface="hero"] .kp-lede mark');
            await expect(marks.first()).toHaveClass(/is-cleared/, { timeout: 5000 });
            await settled(page);
            const style = await marks.first().evaluate((el) => {
                const s = getComputedStyle(el);
                return { size: s.backgroundSize, image: s.backgroundImage };
            });
            expect(style.size).toMatch(/^100%/);
            expect(style.image, 'the wash is the primary token, not a literal colour').toMatch(/gradient/);
            const armed = await page.evaluate(() => window.kpArmed);
            expect(
                armed.some((s) => /^0(px|%)/.test(s)),
                'the wash was hidden before it cleared in',
            ).toBe(true);
        });

        test('the rule draws itself left to right under a heading when it enters the viewport [TH122]', async ({ page }) => {
            await open(page, url);
            const rule = page.locator('[data-kp-reveal="rule"]').first();
            await rule.scrollIntoViewIfNeeded();
            await expect(rule).toHaveClass(/is-in/, { timeout: 5000 });
            const line = await pseudo(rule, '::after', ['background-color', 'animation-name', 'animation-timing-function']);
            expect(line['background-color']).toBe(await paint(page, '--primary'));
            expect(line['animation-name']).toBe('kp-rule-in');
            expect(line['animation-timing-function']).toMatch(/ease-out/);
            await settled(page);
            await expect.poll(async () => (await pseudo(rule, '::after', ['transform'])).transform).toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
        });

        test('the dropdown is a title block: the ground colour, one hairline, a cyan top rule and numbered leaders [KT14]', async ({ page }) => {
            await open(page, url);
            const menu = page.locator('.kp-nav__menu').first();
            // Reached with the keyboard, not focus() [G15].
            await tabToSelector(page, '.kp-nav__links > li:first-child > .kp-nav__link');
            await expect(menu).toBeVisible();
            const panel = await menu.evaluate((el) => {
                const s = getComputedStyle(el);
                return { background: s.backgroundColor, border: s.borderColor, radius: s.borderRadius };
            });
            expect(panel.background).toBe(await paint(page, '--background'));
            expect(panel.border).toBe(await paint(page, '--border-strong'));
            const rule = await pseudo(menu, '::before', ['background-color', 'block-size']);
            expect(rule['background-color']).toBe(await paint(page, '--primary'));
            const firstItem = menu.locator('a').first();
            const leader = await pseudo(firstItem, '::before', ['content']);
            // Firefox resolves the counter to "01"; chromium reports the
            // unresolved expression, counter(kp-menu-item) included.
            expect(leader.content).toMatch(/01|counter\(/i);
            await firstItem.hover();
            await expect.poll(() => firstItem.evaluate((el) => getComputedStyle(el).backgroundColor)).not.toBe('rgba(0, 0, 0, 0)');
        });

        test('the mirrored button keeps the one chamfer, and the primary is the cyan plate', async ({ page }) => {
            await open(page, url);
            const primary = page.locator('[data-kp-surface="hero"] .kp-button--primary').first();
            expect(await primary.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(await paint(page, '--primary'));
            const mirror = page.locator('[data-kp-surface="hero"] .kp-button--mirror').first();
            const clip = await mirror.evaluate((el) => getComputedStyle(el).clipPath);
            expect(clip, 'the mitred corner').toMatch(/polygon/);
        });

        test('the dossier’s redactions are solid ink blocks that clear left to right on the trigger, staggered', async ({ page }) => {
            await open(page, url);
            const dossier = page.locator('.kp-card[data-kp-reveal="emphasis"]');
            // Measured through the paint, not the declaration: firefox
            // reports `attr()` unresolved and the old `|attr(...)`
            // alternative accepted a stamp that printed nothing [G4].
            expect(await stampWord(page, '.kp-card[data-kp-reveal="emphasis"]', '::before', 'data-kp-label')).toMatch(/Approved/i);
            const mark = dossier.locator('mark').first();
            const covered = await pseudo(mark, '::after', ['clip-path', 'background-color']);
            expect(covered['clip-path'], 'covered before the trigger').toMatch(/^inset\(0(px)?\)$|^inset\(0px 0px 0px 0px\)$/);
            expect(covered['background-color']).toBe(await paint(page, '--border'));
            await dossier.locator('[data-kp-reveal-trigger]').click();
            await expect(mark).toHaveClass(/is-cleared/);
            await settled(page);
            await expect.poll(async () => (await pseudo(mark, '::after', ['clip-path']))['clip-path'], 'the block narrowed away').toMatch(/100%\)$/);
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
