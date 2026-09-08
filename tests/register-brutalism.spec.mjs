// The brutalism register [S48, LIFT_PLAN row 5, BR1–BR4]: the approved
// concept demo "Hard Copy" (2026-09-08) reproduced by the package,
// measured on the concept page under brutalism in both channels.
//
// What the demo showed and this suite holds: the headline's words slamming
// onto their yellow offset one after another and ending as its own text,
// the mark as a plate wiped in behind the word (on the paper while armed,
// the yellow plate with the line once landed), the six-pixel bar ruling a
// heading off, the marquee divider as a strip translated -50% that stands
// still under reduced motion, the strip with the yellow hover and the cta
// that lifts and drops, the plates with the line and the shadow, the
// stamp with the pixel outline and the bars sliding off the dossier, no
// arrival at all, and the whole approved inventory.
//
// Drills [KT3], performed 2026-09-08 in both browsers and restored:
//   - the marquee's `inline-size: 200%` strip removed → nothing to
//     translate, red on "the divider is a marquee";
//   - the armed plate (`[data-kp-effects] mark:not(.is-cleared)`) removed →
//     the plate is there from the first paint, red on "the mark is a plate";
//   - the cta's lift on hover removed → no translate, red on "the strip".

import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

const INVENTORY = JSON.parse(readFileSync(new URL('../showcase/concept-demo.json', import.meta.url), 'utf8')).elements;

const CHANNELS = [
    ['framework-free', '/examples/concept.html'],
    ['React', '/tests/fixtures/examples.html?example=concept'],
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
            localStorage.setItem('theme', 'brutalism');
        } catch {
            // no storage: the page keeps its served theme
        }
    });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(url);
    await page.waitForFunction(() => document.documentElement.getAttribute('data-theme') === 'brutalism');
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
    test.describe(`the brutalism register, ${channel}`, () => {
        test('there is no arrival: the page is simply there, and every reveal is at rest under reduced motion', async ({ page }) => {
            await open(page, url);
            expect(await page.locator('.kp-boot').count(), 'printed matter does not boot').toBe(0);
            await open(page, url, { reduced: true });
            expect(await page.locator('.kp-boot').count()).toBe(0);
            await expect(page.locator('[data-kp-reveal="headline"]').first()).toHaveClass(/is-deciphered/);
            expect(await page.locator('[data-kp-surface="hero"] mark:not(.is-cleared)').count()).toBe(0);
            const strip = await pseudo(page.locator('[data-kp-divider]').first(), '::before', ['animation-name']);
            expect(strip['animation-name'], 'the marquee stands still').toBe('none');
        });

        test('the headline slams in word by word onto its yellow offset and ends as its own text [BR2]', async ({ page }) => {
            await page.addInitScript(() => {
                window.kpWords = 0;
                new MutationObserver(() => {
                    const h = document.querySelector('[data-kp-reveal="headline"]');
                    if (!h) return;
                    const n = h.querySelectorAll('[data-word]').length;
                    if (n > window.kpWords) window.kpWords = n;
                }).observe(document, { subtree: true, childList: true });
            });
            await open(page, url);
            const h1 = page.locator('[data-kp-reveal="headline"]').first();
            const source = await h1.getAttribute('data-kp-text');
            await expect(h1).toHaveClass(/is-deciphered/, { timeout: 15000 });
            expect(await h1.textContent()).toBe(source);
            expect(await h1.locator('[data-word]').count(), 'the words are gone: the element is its text').toBe(0);
            expect(await page.evaluate(() => window.kpWords), 'every word had its span').toBe(source?.split(/\s+/).length);
            expect(await h1.evaluate((el) => getComputedStyle(el).textTransform)).toBe('uppercase');
            expect(await h1.evaluate((el) => getComputedStyle(el).fontFamily)).toMatch(/Archivo Black/);
        });

        test('the mark is a plate: on the paper while armed, the yellow plate with the line once landed [TH120]', async ({ page }) => {
            await page.addInitScript(() => {
                window.kpArmed = [];
                new MutationObserver(() => {
                    const m = document.querySelector('[data-kp-surface="hero"] mark');
                    if (m && document.documentElement.hasAttribute('data-kp-effects') && !m.classList.contains('is-cleared')) {
                        window.kpArmed.push(getComputedStyle(m).backgroundSize);
                    }
                }).observe(document, { subtree: true, childList: true, attributes: true });
            });
            await open(page, url);
            const mark = page.locator('[data-kp-surface="hero"] mark').first();
            await expect(mark).toHaveClass(/is-cleared/, { timeout: 15000 });
            await settled(page);
            await expect.poll(() => mark.evaluate((el) => getComputedStyle(el).backgroundSize), 'the plate is behind the words').toMatch(/^100%/);
            expect(await mark.evaluate((el) => getComputedStyle(el).backgroundImage)).toMatch(/linear-gradient/);
            expect(await mark.evaluate((el) => getComputedStyle(el).borderBottomWidth), 'closed by the one line weight').toBe('3px');
            const armed = await page.evaluate(() => window.kpArmed);
            expect(
                armed.some((s) => /^0(px|%)/.test(s)),
                'the words stood on the paper before the plate arrived',
            ).toBe(true);
        });

        test('the six-pixel bar rules a heading off when it enters the viewport [TH122]', async ({ page }) => {
            await open(page, url);
            const rule = page.locator('[data-kp-reveal="rule"]').first();
            await rule.scrollIntoViewIfNeeded();
            await expect(rule).toHaveClass(/is-in/, { timeout: 5000 });
            const bar = await pseudo(rule, '::after', ['height', 'background-color', 'animation-name']);
            expect(bar.height).toBe('6px');
            expect(bar['background-color']).toBe(await paint(page, '--border-strong'));
            expect(bar['animation-name']).toBe('kp-rule-in');
            await settled(page);
            await expect.poll(async () => (await pseudo(rule, '::after', ['transform'])).transform).toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
        });

        test('the divider is a marquee: a strip twice the band, translating, the second one the other way [TH121]', async ({ page }) => {
            await open(page, url);
            const dividers = page.locator('[data-kp-divider]');
            expect(await dividers.count()).toBe(2);
            for (const i of [0, 1]) {
                const d = dividers.nth(i);
                expect(await d.evaluate((el) => getComputedStyle(el).height)).toBe('46px');
                const strip = await pseudo(d, '::before', [
                    'width',
                    'animation-name',
                    'animation-duration',
                    'animation-iteration-count',
                    'background-image',
                ]);
                const band = await d.evaluate((el) => el.getBoundingClientRect().width);
                expect(parseFloat(strip.width), 'twice the band').toBeCloseTo(band * 2, -1);
                expect(strip['animation-name']).toBe('kp-marquee');
                expect(parseFloat(strip['animation-duration'])).toBe(42);
                expect(strip['animation-iteration-count']).toBe('infinite');
                expect(strip['background-image']).toMatch(/repeating-linear-gradient/);
            }
            expect((await pseudo(dividers.nth(1), '::before', ['animation-direction']))['animation-direction']).toBe('reverse');
            expect(await dividers.nth(1).evaluate((el) => getComputedStyle(el).backgroundColor), 'the second band is the plate').toBe(
                await paint(page, '--secondary'),
            );
        });

        test('the strip: a hovered item is the yellow plate with the line, and the cta lifts away from its shadow', async ({ page }) => {
            await open(page, url);
            const link = page.locator('.kp-nav__link').nth(1);
            await link.hover();
            await expect.poll(() => link.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(await paint(page, '--secondary'));
            expect(await link.evaluate((el) => getComputedStyle(el).borderTopWidth)).toBe('3px');
            const cta = page.locator('.kp-nav__link--cta').first();
            expect(await cta.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(await paint(page, '--primary'));
            expect(await cta.evaluate((el) => getComputedStyle(el).boxShadow), 'the shadow').toMatch(/6px 6px 0px 0px/);
            await cta.hover();
            await expect.poll(() => cta.evaluate((el) => getComputedStyle(el).translate), 'lifted').toBe('-2px -2px');
            await expect.poll(() => cta.evaluate((el) => getComputedStyle(el).boxShadow), 'the shadow grows').toMatch(/8px 8px 0px 0px/);
        });

        test('the buttons are plates with the line and the shadow; the primary is the ink with the yellow ink', async ({ page }) => {
            await open(page, url);
            const button = page.locator('[data-kp-surface="hero"] .kp-button').nth(1);
            expect(await button.evaluate((el) => getComputedStyle(el).borderTopWidth)).toBe('3px');
            expect(await button.evaluate((el) => getComputedStyle(el).borderRadius)).toBe('0px');
            expect(await button.evaluate((el) => getComputedStyle(el).boxShadow)).toMatch(/6px 6px 0px 0px/);
            expect(await button.evaluate((el) => getComputedStyle(el).backgroundColor), 'yellow is the default').toBe(
                await paint(page, '--secondary'),
            );
            const primary = page.locator('[data-kp-surface="hero"] .kp-button--primary').first();
            expect(await primary.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(await paint(page, '--primary'));
            expect(await primary.evaluate((el) => getComputedStyle(el).color)).toBe(await paint(page, '--primary-foreground'));
            const label = page.locator('.microlabel').first();
            const outline = await label.evaluate((el) => getComputedStyle(el).boxShadow.split(/,(?![^(]*\))/));
            expect(outline, 'the pixel outline: four hard box-shadows, one per side').toHaveLength(4);
            for (const layer of outline) expect(layer).toMatch(/(-?3px 0px|0px -?3px) 0px 0px$/);
            expect(await label.evaluate((el) => getComputedStyle(el).borderTopWidth), 'and no border').toBe('0px');
        });

        test('the dossier: the tilted stamp with the pixel outline, and the bars sliding off on the trigger', async ({ page }) => {
            await open(page, url);
            const dossier = page.locator('.kp-card[data-kp-reveal="emphasis"]');
            const stamp = await pseudo(dossier, '::before', ['content', 'rotate', 'background-color']);
            expect(stamp.content).toMatch(/Classified|attr\(data-kp-label\)/i);
            expect(stamp.rotate).toBe('-7deg');
            expect(stamp['background-color']).toBe(await paint(page, '--fx-signal'));
            const mark = dossier.locator('mark').first();
            const covered = await pseudo(mark, '::after', ['transform', 'background-color']);
            expect(covered.transform, 'covered before the trigger').toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
            expect(covered['background-color']).toBe(await paint(page, '--foreground'));
            await dossier.locator('[data-kp-reveal-trigger]').click();
            await expect(mark).toHaveClass(/is-cleared/);
            await settled(page);
            await expect.poll(async () => (await pseudo(mark, '::after', ['transform'])).transform, 'the bar slid off').toMatch(/^matrix\(0,/);
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
