// The phantom register [S48, LIFT_PLAN row 2, PH1–PH4]: the approved
// concept demo "Calling Card" (2026-09-08) reproduced by the package,
// measured on the concept page under phantom in both channels.
//
// What the demo showed and this suite holds: the card arrival with its
// Skip once per session, the headline whose words shout in one after
// another and end as its own text, the plate a <mark> is shoved under
// (black ink on red once cleared, white while armed), the rail under a
// heading sweeping from grey to red when it enters the viewport, the
// torn-paper divider (three clipped plates, the second mirrored), the
// skewed bar growing behind a hovered nav link and the key-cap button,
// the censor plates of the dossier shearing off on the trigger, and the
// whole approved inventory on the page.
//
// Drills [KT3], performed 2026-09-08 in both browsers and restored:
//   - the divider's clip-path removed from the register → the plates
//     paint whole, red on "the divider is torn paper";
//   - `--kp-arrival: card` removed → no overlay, red on "the page arrives";
//   - the armed fold (`mark:not(.is-cleared)::before { transform: … scaleX(0) }`)
//     removed → the plate never folds away, red on "the plate arrives".

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
            localStorage.setItem('theme', 'phantom');
        } catch {
            // no storage: the page keeps its served theme
        }
    });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(url);
    await page.waitForFunction(() => document.documentElement.getAttribute('data-theme') === 'phantom');
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

for (const [channel, url] of CHANNELS) {
    test.describe(`the phantom register, ${channel}`, () => {
        test('the page arrives as a calling card once per session, and Skip ends it at once [PH2]', async ({ page }) => {
            await open(page, url);
            const boot = page.locator('.kp-boot');
            await expect(boot).toBeVisible();
            await expect(boot.locator('.kp-boot__line')).toHaveText(/phantom/i);
            expect(await boot.locator('.kp-boot__line').evaluate((el) => getComputedStyle(el).textTransform)).toBe('uppercase');
            await boot.locator('.kp-boot__skip').click();
            await expect(boot).toHaveCount(0, { timeout: 3000 });
            await page.reload();
            await expect(page.locator('[data-kp-surface="app"]').first()).toBeVisible();
            expect(await page.locator('.kp-boot').count(), 'seen this session: no second card').toBe(0);
        });

        test('under reduced motion there is no card at all, and every reveal is at rest', async ({ page }) => {
            await open(page, url, { reduced: true });
            expect(await page.locator('.kp-boot').count()).toBe(0);
            await expect(page.locator('[data-kp-reveal="headline"]').first()).toHaveClass(/is-deciphered/);
            expect(await page.locator('[data-kp-surface="hero"] mark:not(.is-cleared)').count()).toBe(0);
        });

        test('the headline shouts in word by word and ends as its own text [PH2]', async ({ page }) => {
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
            await page
                .locator('.kp-boot__skip')
                .click()
                .catch(() => {});
            const h1 = page.locator('[data-kp-reveal="headline"]').first();
            const source = await h1.getAttribute('data-kp-text');
            await expect(h1).toHaveClass(/is-deciphered/, { timeout: 15000 });
            expect(await h1.textContent()).toBe(source);
            expect(await h1.locator('[data-word]').count(), 'the words are gone: the element is its text').toBe(0);
            expect(await page.evaluate(() => window.kpWords), 'every word had its span').toBe(source?.split(/\s+/).length);
            const shadow = await h1.evaluate((el) => getComputedStyle(el).textShadow);
            expect(shadow.split(/px,\s*/).length, 'a hard black shadow and one red offset').toBeGreaterThanOrEqual(2);
            expect(await h1.evaluate((el) => getComputedStyle(el).fontStyle)).toBe('italic');
        });

        test('the plate arrives: white while armed, black ink on red once cleared [TH120]', async ({ page }) => {
            await page.addInitScript(() => {
                window.kpArmed = [];
                new MutationObserver(() => {
                    const m = document.querySelector('[data-kp-surface="hero"] mark');
                    if (m && document.documentElement.hasAttribute('data-kp-effects') && !m.classList.contains('is-cleared')) {
                        window.kpArmed.push(getComputedStyle(m, '::before').transform);
                    }
                }).observe(document, { subtree: true, childList: true, attributes: true });
            });
            await open(page, url);
            await page
                .locator('.kp-boot__skip')
                .click()
                .catch(() => {});
            const mark = page.locator('[data-kp-surface="hero"] mark').first();
            await expect(mark).toHaveClass(/is-cleared/, { timeout: 15000 });
            await settled(page);
            const on = await pseudo(mark, '::before', ['transform', 'background-color']);
            expect(on.transform, 'the plate is under the word').not.toMatch(/matrix\(0,/);
            expect(on['background-color']).not.toBe('rgba(0, 0, 0, 0)');
            const ink = await mark.evaluate((el) => getComputedStyle(el).color);
            const primaryInk = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--primary-foreground').trim());
            expect(ink, 'black ink on the plate').toBe(
                await page.evaluate((c) => {
                    const s = document.createElement('span');
                    s.style.color = c;
                    document.body.append(s);
                    const v = getComputedStyle(s).color;
                    s.remove();
                    return v;
                }, primaryInk),
            );
            const armed = await page.evaluate(() => window.kpArmed);
            expect(
                armed.some((t) => /matrix\(0,/.test(t)),
                'the plate was folded away while armed',
            ).toBe(true);
        });

        test('the rail sweeps from grey to red when its heading enters the viewport [TH122]', async ({ page }) => {
            await open(page, url);
            await page
                .locator('.kp-boot__skip')
                .click()
                .catch(() => {});
            const rule = page.locator('[data-kp-reveal="rule"]').first();
            await rule.scrollIntoViewIfNeeded();
            await expect(rule).toHaveClass(/is-in/, { timeout: 5000 });
            const rail = await pseudo(rule, '::after', ['transform', 'height', 'background-image', 'background-size']);
            expect(rail.transform, 'the slab is skewed').toMatch(/matrix\(1, 0, -0\.4/);
            expect(rail.height).toBe('10px');
            expect(rail['background-image']).toMatch(/linear-gradient/);
            expect(rail['background-size']).toMatch(/220%/);
            await expect
                .poll(async () => (await pseudo(rule, '::after', ['background-position']))['background-position'])
                .toMatch(/^0(%|px) 0(%|px)$/);
        });

        test('the divider is torn paper: three clipped plates, the second one mirrored [TH121]', async ({ page }) => {
            await open(page, url);
            const dividers = page.locator('[data-kp-divider]');
            expect(await dividers.count()).toBe(2);
            const paper = await pseudo(dividers.first(), '::before', ['clip-path', 'background-color']);
            const red = await pseudo(dividers.first(), '::after', ['clip-path', 'background-color']);
            expect(paper['clip-path']).toMatch(/polygon/);
            expect(red['clip-path']).toMatch(/polygon/);
            expect(paper['background-color']).not.toBe(red['background-color']);
            expect(await dividers.first().evaluate((el) => getComputedStyle(el).height)).toBe('58px');
            expect(await dividers.nth(1).evaluate((el) => getComputedStyle(el).transform), 'the second tear is mirrored').toMatch(/matrix\(-1,/);
        });

        test('the skewed bar grows behind a hovered nav link; the button is a key cap that fills on hover', async ({ page }) => {
            await open(page, url);
            await page
                .locator('.kp-boot__skip')
                .click()
                .catch(() => {});
            const link = page.locator('.kp-nav__link').nth(1);
            expect((await pseudo(link, '::before', ['width'])).width).toBe('0px');
            expect((await pseudo(link, '::before', ['transform'])).transform, 'the bar is skewed').toMatch(/matrix\(1, 0, -0\.28/);
            await link.hover();
            await expect.poll(async () => parseFloat((await pseudo(link, '::before', ['width'])).width)).toBeGreaterThan(40);
            const button = page.locator('[data-kp-surface="hero"] .kp-button').nth(1);
            const plate = await pseudo(button, '::before', ['transform', 'border-top-width']);
            expect(plate.transform, 'the plate is skewed').toMatch(/matrix\(1, 0, -0\.14/);
            expect(plate['border-top-width']).toBe('2px');
            expect(await button.evaluate((el) => getComputedStyle(el).transform), 'the label stays upright').toBe('none');
            await button.hover();
            await expect.poll(async () => parseFloat((await pseudo(button, '::after', ['width'])).width)).toBeGreaterThan(40);
        });

        test('the dossier stamp is a rotated red plate, and the censor plates shear off on the trigger', async ({ page }) => {
            await open(page, url);
            await page
                .locator('.kp-boot__skip')
                .click()
                .catch(() => {});
            const dossier = page.locator('.kp-card[data-kp-reveal="emphasis"]');
            const stamp = await pseudo(dossier, '::before', ['content', 'transform', 'background-color']);
            // Firefox reports the unresolved attr(); chromium the value.
            expect(stamp.content).toMatch(/Classified|attr\(data-kp-label\)/i);
            expect(stamp.transform).toMatch(/matrix\(0\.99/);
            const mark = dossier.locator('mark').first();
            expect((await pseudo(mark, '::after', ['transform'])).transform, 'covered before the trigger').not.toMatch(/matrix\(0,|, 0, 0, 0\)/);
            await dossier.locator('[data-kp-reveal-trigger]').click();
            await expect(mark).toHaveClass(/is-cleared/);
            await settled(page);
            await expect
                .poll(async () => (await pseudo(mark, '::after', ['transform'])).transform, 'the plate sheared off')
                .toMatch(/matrix\(0,|, 0, 0, 0\)|^matrix\(0/);
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
