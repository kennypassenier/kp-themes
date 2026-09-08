// The woodblock register [S48, LIFT_PLAN row 20]: the approved concept demo
// "The Woodblock Pull" (v2, 2026-09-08) reproduced by the package, measured
// on the concept page under woodblock in both channels.
//
// What the demo showed and this suite holds: the kentō headline whose two
// ghost plates (Prussian blue, beni red, mix-blend-mode multiply) converge
// once and settle a pixel or two out of true — visible at rest under every
// motion preference, not only mid-reveal; the lede's marks as an ink tint
// drawn in from the left, at rest already drawn and undrawn only while the
// module has it armed; the carved key line ruling itself under a heading
// on scroll, reusing the base layer's own kp-rule-in; the deckle-edge tear
// and the toji-stitch tear as the two dividers; the navbar's carved bottom
// edge and the dropdown's own kentō mark (KT14); the buttons as
// baren-mottled plates with the "mirror" ghost impression; the dossier's
// own kentō mark, its stamp swapping label on open (S49, A11), and the
// sumi-nuri redaction wipe; and the whole approved inventory on the page.
//
// Drills [KT3], performed 2026-09-08 in chromium and firefox and restored:
//   - the kentō ghost rule (`[data-kp-reveal='headline']::before/::after`)
//     removed from the register → the ghosts read no colour and no
//     mix-blend-mode, red on "the two ghost plates converge";
//   - the armed mark tint (`[data-kp-effects] mark:not(.is-cleared)::after`)
//     removed → the tint never leaves its drawn rest state, red on "the
//     mark is an ink tint drawn in from the left";
//   - the redaction wipe (`.kp-card[data-kp-reveal='emphasis']
//     mark:not(.is-cleared)::before`) removed → the covering bar never
//     appears while armed, red on "the redactions wipe once each".

import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { stampWord } from './stamp.mjs';

const INVENTORY = JSON.parse(readFileSync(new URL('../showcase/concept-demo.json', import.meta.url), 'utf8')).elements;

const CHANNELS = [
    ['framework-free', '/examples/concept-woodblock.html'],
    ['React', '/tests/fixtures/examples.html?example=concept&copy=woodblock'],
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
            localStorage.setItem('theme', 'woodblock');
        } catch {
            // no storage: the page keeps its served theme
        }
    });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(url);
    await page.waitForFunction(() => document.documentElement.getAttribute('data-theme') === 'woodblock');
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
    test.describe(`the woodblock register, ${channel}`, () => {
        test('the headline is kentō: two ghost plates in Prussian blue and beni, multiplied, converging once', async ({ page }) => {
            await open(page, url);
            const h1 = page.locator('[data-kp-reveal="headline"]').first();
            await expect.poll(() => h1.getAttribute('data-kp-text')).toBeTruthy();
            const before = await pseudo(h1, '::before', ['content', 'color', 'mix-blend-mode', 'position']);
            const after = await pseudo(h1, '::after', ['content', 'color', 'mix-blend-mode', 'position']);
            expect(before.content).not.toBe('none');
            expect(before.position).toBe('absolute');
            expect(before['mix-blend-mode']).toBe('multiply');
            expect(after['mix-blend-mode']).toBe('multiply');
            expect(before.color, 'the blue plate').toBe(await paint(page, '--primary'));
            expect(after.color, 'the red plate').toBe(await paint(page, '--accent'));
            await settled(page);
            const rest = await pseudo(h1, '::before', ['translate']);
            expect(rest.translate, 'settled slightly out of register, not at 0,0').not.toMatch(/^(none|0px 0px)$/);
        });

        test('under reduced motion the ghosts hold their static offset, visible at rest, and every reveal is at rest', async ({ page }) => {
            await open(page, url, { reduced: true });
            const h1 = page.locator('[data-kp-reveal="headline"]').first();
            const before = await pseudo(h1, '::before', ['translate', 'animation-name']);
            const after = await pseudo(h1, '::after', ['translate', 'animation-name']);
            expect(before['animation-name']).toBe('none');
            expect(after['animation-name']).toBe('none');
            expect(before.translate, 'the fringe stays visible, not hidden').not.toMatch(/^(none|0px 0px)$/);
            expect(after.translate).not.toMatch(/^(none|0px 0px)$/);
            const rule = page.locator('[data-kp-reveal="rule"]').first();
            await expect(rule).toHaveClass(/is-in/);
            expect(await page.locator('[data-kp-surface="hero"] mark:not(.is-cleared)').count()).toBe(0);
        });

        test('a mark is an ink tint drawn in from the left: drawn at rest, undrawn while armed [TH120]', async ({ page }) => {
            await page.addInitScript(() => {
                window.kpArmed = [];
                new MutationObserver(() => {
                    const m = document.querySelector('[data-kp-surface="hero"] mark');
                    if (m && document.documentElement.hasAttribute('data-kp-effects') && !m.classList.contains('is-cleared')) {
                        window.kpArmed.push(getComputedStyle(m, '::after').transform);
                    }
                }).observe(document, { subtree: true, childList: true, attributes: true });
            });
            await open(page, url);
            const mark = page.locator('[data-kp-surface="hero"] mark').first();
            await expect(mark).toHaveClass(/is-cleared/, { timeout: 15000 });
            await settled(page);
            const drawn = await pseudo(mark, '::after', ['transform', 'background-color']);
            expect(drawn.transform, 'the tint is drawn once cleared').toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
            expect(drawn['background-color']).not.toBe('rgba(0, 0, 0, 0)');
            const armed = await page.evaluate(() => window.kpArmed);
            expect(
                armed.some((t) => /matrix\(0,/.test(t)),
                'the tint stood undrawn while armed, before it cleared',
            ).toBe(true);
        });

        test('the carved rule draws itself under a heading when it enters the viewport, reusing kp-rule-in [TH122]', async ({ page }) => {
            await open(page, url);
            const rule = page.locator('[data-kp-reveal="rule"]').first();
            await rule.scrollIntoViewIfNeeded();
            await expect(rule).toHaveClass(/is-in/, { timeout: 5000 });
            const carve = await pseudo(rule, '::after', ['height', 'clip-path', 'animation-name']);
            expect(carve.height).toBe('5px');
            expect(carve['clip-path'], 'the hand-cut edge, not a straight rule').toMatch(/polygon/);
            expect(carve['animation-name']).toBe('kp-rule-in');
            await settled(page);
            await expect.poll(async () => (await pseudo(rule, '::after', ['transform'])).transform).toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
        });

        test('the dividers are the deckle tear and the toji stitch, in ink and in beni [TH121]', async ({ page }) => {
            await open(page, url);
            const dividers = page.locator('[data-kp-divider]');
            expect(await dividers.count()).toBe(2);
            const deckle = await dividers.nth(0).evaluate((el) => ({ h: getComputedStyle(el).height, bg: getComputedStyle(el).backgroundImage }));
            expect(deckle.h).toBe('16px');
            expect(deckle.bg.match(/linear-gradient/g)?.length, 'the zig-zag tooth layers').toBeGreaterThanOrEqual(4);
            const toji = await dividers.nth(1).evaluate((el) => ({ h: getComputedStyle(el).height, bg: getComputedStyle(el).backgroundImage }));
            expect(toji.h).toBe('16px');
            expect(toji.bg, 'a repeating stitch').toMatch(/repeating-linear-gradient/);
        });

        test('the navbar carries its own carved edge, and the dropdown carries its own kentō mark [KT14]', async ({ page }) => {
            await open(page, url);
            const wrap = page.locator('.kp-nav-wrap');
            const edge = await pseudo(wrap, '::after', ['clip-path', 'background-color']);
            expect(edge['clip-path'], 'the hand-cut edge').toMatch(/polygon/);
            const cta = page.locator('.kp-nav__link--cta').first();
            expect(await cta.evaluate((el) => getComputedStyle(el).backgroundImage), 'the baren mottle on the cta plate').toMatch(/radial-gradient/);
            const link = page.locator('.kp-nav__link[aria-haspopup="true"]').first();
            await link.hover();
            const menu = page.locator('.kp-nav__menu').first();
            await expect(menu).toBeVisible();
            const kento = await pseudo(menu, '::before', ['background-image']);
            expect(kento['background-image'], "the dropdown's own kagi mark").toMatch(/linear-gradient/);
        });

        test('the buttons are baren-mottled plates, and the mirrored button carries its own ghost impression', async ({ page }) => {
            await open(page, url);
            const primary = page.locator('[data-kp-surface="hero"] .kp-button--primary').first();
            expect(await primary.evaluate((el) => getComputedStyle(el).backgroundImage), 'the baren mottle').toMatch(/radial-gradient/);
            expect(await primary.evaluate((el) => getComputedStyle(el).backgroundColor), 'the plate is bero').toBe(await paint(page, '--primary'));
            const mirror = page.locator('[data-kp-surface="hero"] .kp-button--mirror').first();
            const ghost = await pseudo(mirror, '::before', ['background-color', 'translate']);
            expect(ghost['background-color'], 'a solid offset plate, not a blur').toBe(await paint(page, '--foreground'));
            expect(ghost.translate).not.toMatch(/^(none|0px 0px)$/);
            expect(await mirror.evaluate((el) => getComputedStyle(el).filter), 'no blurred shadow').toBe('none');
        });

        test('the dossier: its own kentō mark, the stamp swaps label on open [S49, A11], and the redactions wipe once each', async ({ page }) => {
            await open(page, url);
            const dossier = page.locator('.kp-card[data-kp-reveal="emphasis"]');
            const kento = await pseudo(dossier, '::after', ['background-image']);
            expect(kento['background-image'], "the dossier's own kagi mark").toMatch(/linear-gradient/);
            // Measured through the paint: firefox reports `attr()`
            // unresolved and the old `|attr(data-kp-label)` alternative
            // accepted a stamp that printed nothing [G4].
            const DOSSIER = '.kp-card[data-kp-reveal="emphasis"]';
            expect(await stampWord(page, DOSSIER, '::before', 'data-kp-label')).toMatch(/Sealed/i);
            const mark = dossier.locator('mark').first();
            // Measured, not merely "not scaled away": `none` was accepted
            // here, and `none` is also what a `::before` that does not
            // exist reports — the assertion could not tell a covering bar
            // from no bar at all [G5]. What the demo shows is a solid ink
            // bar at full width over the phrase, so that is what is read.
            const covered = await pseudo(mark, '::before', ['transform', 'width', 'height', 'background-color']);
            expect(covered.transform, 'the bar stands at its full width before the trigger').toBe('matrix(1, 0, 0, 1, 0, 0)');
            expect(Number.parseFloat(covered.width), 'and it is a real bar with a box').toBeGreaterThan(0);
            expect(Number.parseFloat(covered.height)).toBeGreaterThan(0);
            expect(covered['background-color'], 'in the ink of the block').toBe(await paint(page, '--foreground'));
            await dossier.locator('[data-kp-reveal-trigger]').click();
            await expect(mark).toHaveClass(/is-cleared/);
            await settled(page);
            await expect.poll(async () => (await pseudo(mark, '::before', ['transform'])).transform, 'the ink bar wiped off').toMatch(/^matrix\(0,/);
            expect(await stampWord(page, DOSSIER, '::before', 'data-kp-label-open'), 'the stamp swapped to its open word').toMatch(/Opened/i);
        });

        test('the spec sheet is the block itself: the grain, and its own kentō mark', async ({ page }) => {
            await open(page, url);
            const spec = page.locator('.kp-spec');
            expect(await spec.evaluate((el) => getComputedStyle(el).backgroundImage), 'the wood-grain layer').toMatch(/repeating-linear-gradient/);
            const kento = await pseudo(spec, '::before', ['background-image']);
            expect(kento['background-image'], "the spec sheet's own kagi mark").toMatch(/linear-gradient/);
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
