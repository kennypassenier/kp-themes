// The retro register [S48, LIFT_PLAN row 3, RT1–RT4]: the approved concept
// demo "Bevel 95" (2026-09-08) reproduced by the package, measured on the
// concept page under retro in both channels.
//
// What the demo showed and this suite holds: the POST once per session with
// its Skip and the pixel dissolve that takes it off, the headline clearing
// out of a dither in discrete densities and ending as its own text under a
// hard white shadow, the mark as the selection bar (ink while armed, white
// on navy once selected), the groove ruling itself in under a heading when
// it enters the viewport, the two grooves as dividers (the dithered band and
// the plain two-line one), the title-bar ramp on the brand and the selection
// bar behind a hovered menu item, the raised bevel on a button with the navy
// bevel on the default one, the read-only stamp and the dither brush lifting
// off the dossier's redactions on the trigger, and the whole approved
// inventory on the page.
//
// Drills [KT3], performed 2026-09-08 in both browsers and restored:
//   - the divider's dithered band removed from the register → the first
//     groove paints as a plain one, red on "the dividers are grooves";
//   - `--kp-arrival: boot` removed → no overlay, red on "the page boots";
//   - the armed dither (`[data-kp-effects] … :not(.is-deciphered)::after`)
//     removed → the armed probe reads opacity 0, red on "the headline
//     clears out of a dither";
//   - the dissolve animation (`.is-dissolving::after`) removed → no density
//     of the ladder is ever painted, red on the same test.
//   The first form of the headline test stayed green with the armed rule
//   removed, because the animation's own first frame also paints the full
//   dither: it now probes the armed state by taking `is-deciphered` off the
//   rested element, and asks the capture for a conic density only the
//   ladder produces.

import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

const INVENTORY = JSON.parse(readFileSync(new URL('../showcase/concept-demo.json', import.meta.url), 'utf8')).elements;

const CHANNELS = [
    ['framework-free', '/examples/concept-retro.html'],
    ['React', '/tests/fixtures/examples.html?example=concept&copy=retro'],
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
            localStorage.setItem('theme', 'retro');
        } catch {
            // no storage: the page keeps its served theme
        }
    });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(url);
    await page.waitForFunction(() => document.documentElement.getAttribute('data-theme') === 'retro');
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
    test.describe(`the retro register, ${channel}`, () => {
        test('the page boots once per session through the POST, and Skip ends it at once [RT2]', async ({ page }) => {
            await open(page, url);
            const boot = page.locator('.kp-boot');
            await expect(boot).toBeVisible();
            // The POST is the demo's own lines now [S49, A1/A11], from the
            // dictionary rather than a percentage counter.
            await expect(boot.locator('.kp-boot__line')).toContainText('KP Modular BIOS');
            const bar = boot.locator('.kp-boot__bar');
            await expect(bar).toBeVisible();
            await expect
                .poll(() => bar.evaluate((el) => Number(getComputedStyle(el).getPropertyValue('--kp-boot-progress'))), 'the bar fills')
                .toBeGreaterThan(0);
            expect(await boot.evaluate((el) => getComputedStyle(el).fontFamily), 'the DOS voice').toMatch(/VT323/);
            await boot.locator('.kp-boot__skip').click();
            await expect(boot).toHaveCount(0, { timeout: 3000 });
            await page.reload();
            await expect(page.locator('[data-kp-surface="app"]').first()).toBeVisible();
            expect(await page.locator('.kp-boot').count(), 'seen this session: no second boot').toBe(0);
        });

        test('under reduced motion there is no boot at all, and every reveal is at rest', async ({ page }) => {
            await open(page, url, { reduced: true });
            expect(await page.locator('.kp-boot').count()).toBe(0);
            await expect(page.locator('[data-kp-reveal="headline"]').first()).toHaveClass(/is-deciphered/);
            expect(await page.locator('[data-kp-surface="hero"] mark:not(.is-cleared)').count()).toBe(0);
            const rule = page.locator('[data-kp-reveal="rule"]').first();
            await expect(rule).toHaveClass(/is-in/);
        });

        test('the headline clears out of a dither and ends as its own text under a hard white shadow [RT2]', async ({ page }) => {
            await page.addInitScript(() => {
                // The ladder is sampled every frame from the moment the
                // dissolve starts: a mutation observer alone sees the class
                // arrive and nothing during the 640ms the densities take.
                window.kpDither = [];
                let sampling = false;
                const sample = () => {
                    const h = document.querySelector('[data-kp-reveal="headline"]');
                    if (!h || h.classList.contains('is-deciphered')) return;
                    const s = getComputedStyle(h, '::after');
                    window.kpDither.push(s.opacity + '|' + s.backgroundImage);
                    requestAnimationFrame(sample);
                };
                new MutationObserver(() => {
                    const h = document.querySelector('[data-kp-reveal="headline"]');
                    if (h && !sampling && h.classList.contains('is-dissolving')) {
                        sampling = true;
                        requestAnimationFrame(sample);
                    }
                }).observe(document, { subtree: true, childList: true, attributes: true });
            });
            await open(page, url);
            await page
                .locator('.kp-boot__skip')
                .click()
                .catch(() => {});
            const h1 = page.locator('[data-kp-reveal="headline"]').first();
            const source = await h1.getAttribute('data-kp-text');
            await expect(h1).toHaveClass(/is-deciphered/, { timeout: 15000 });
            await settled(page);
            expect(await h1.textContent()).toBe(source);
            const after = await pseudo(h1, '::after', ['opacity']);
            expect(after.opacity, 'the dither is gone at rest').toBe('0');
            expect(await h1.evaluate((el) => getComputedStyle(el).fontFamily)).toMatch(/Pixelify Sans/);
            expect(await h1.evaluate((el) => getComputedStyle(el).textShadow), 'the hard white shadow').toMatch(/2px 2px 0px/);
            const ladder = await page.evaluate(() => window.kpDither);
            expect(
                ladder.some((s) => s.startsWith('1|') && /conic-gradient/.test(s)),
                'the dither cleared through its densities',
            ).toBe(true);
            // The armed rest state, probed deterministically: with the rested
            // element made to match :not(.is-deciphered) again, the register's
            // armed rule must cover it with the full dither.
            const armed = await h1.evaluate((el) => {
                el.classList.remove('is-deciphered');
                const s = getComputedStyle(el, '::after');
                const out = { opacity: s.opacity, image: s.backgroundImage };
                el.classList.add('is-deciphered');
                return out;
            });
            expect(armed.opacity, 'covered while armed').toBe('1');
            expect(armed.image).toMatch(/linear-gradient/);
        });

        test('the mark is the selection: ink while armed, white on navy once selected [TH120]', async ({ page }) => {
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
            await page
                .locator('.kp-boot__skip')
                .click()
                .catch(() => {});
            const mark = page.locator('[data-kp-surface="hero"] mark').first();
            await expect(mark).toHaveClass(/is-cleared/, { timeout: 15000 });
            await settled(page);
            await expect.poll(() => mark.evaluate((el) => getComputedStyle(el).backgroundSize), 'the bar covers the words').toMatch(/^100%/);
            expect(await mark.evaluate((el) => getComputedStyle(el).backgroundImage), 'the bar is the element’s own ground').toMatch(
                /linear-gradient/,
            );
            expect(await mark.evaluate((el) => getComputedStyle(el).color), 'white on navy').toBe(await paint(page, '--primary-foreground'));
            const armed = await page.evaluate(() => window.kpArmed);
            expect(
                armed.some((s) => /^0(px|%)/.test(s)),
                'the words stood in ink before the bar dragged across',
            ).toBe(true);
        });

        test('the groove rules itself in under a heading when it enters the viewport, in twelve steps [TH122]', async ({ page }) => {
            await open(page, url);
            await page
                .locator('.kp-boot__skip')
                .click()
                .catch(() => {});
            const rule = page.locator('[data-kp-reveal="rule"]').first();
            await rule.scrollIntoViewIfNeeded();
            await expect(rule).toHaveClass(/is-in/, { timeout: 5000 });
            const groove = await pseudo(rule, '::after', ['height', 'background-image', 'animation-name', 'animation-timing-function']);
            expect(groove.height).toBe('2px');
            expect(groove['background-image'], 'a dark line over a light one').toMatch(/linear-gradient/);
            expect(groove['animation-name']).toBe('kp-rule-in');
            expect(groove['animation-timing-function']).toMatch(/steps\(12/);
            await settled(page);
            await expect.poll(async () => (await pseudo(rule, '::after', ['transform'])).transform).toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
        });

        test('the dividers are grooves: the dithered band first, the plain two-line groove second [TH121]', async ({ page }) => {
            await open(page, url);
            const dividers = page.locator('[data-kp-divider]');
            expect(await dividers.count()).toBe(2);
            const first = await dividers.first().evaluate((el) => ({ h: getComputedStyle(el).height, bg: getComputedStyle(el).backgroundImage }));
            expect(first.h).toBe('8px');
            expect(first.bg, 'the band between the lines is a checkerboard').toMatch(/conic-gradient/);
            expect(first.bg.match(/linear-gradient/g)?.length, 'two groove lines').toBeGreaterThanOrEqual(2);
            const second = await dividers.nth(1).evaluate((el) => ({ h: getComputedStyle(el).height, bg: getComputedStyle(el).backgroundImage }));
            expect(second.h).toBe('2px');
            expect(second.bg).not.toMatch(/conic-gradient/);
        });

        test('the brand is the title bar, a hovered menu item is the selection bar, and the buttons are bevels', async ({ page }) => {
            await open(page, url);
            await page
                .locator('.kp-boot__skip')
                .click()
                .catch(() => {});
            const brand = page.locator('.kp-nav__brand').first();
            expect(await brand.evaluate((el) => getComputedStyle(el).backgroundImage), 'the navy ramp').toMatch(/linear-gradient/);
            expect(await brand.evaluate((el) => getComputedStyle(el).color)).toBe(await paint(page, '--primary-foreground'));
            const link = page.locator('.kp-nav__link').nth(1);
            await link.hover();
            await expect.poll(() => link.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(await paint(page, '--primary'));
            const button = page.locator('[data-kp-surface="hero"] .kp-button').nth(1);
            const shadow = await button.evaluate((el) => getComputedStyle(el).boxShadow);
            expect(shadow.match(/inset/g)?.length, 'the four-inset bevel').toBe(4);
            expect(await button.evaluate((el) => getComputedStyle(el).borderRadius)).toBe('0px');
            const primary = page.locator('[data-kp-surface="hero"] .kp-button--primary').first();
            expect(await primary.evaluate((el) => getComputedStyle(el).backgroundColor), 'the default button is navy').toBe(
                await paint(page, '--primary'),
            );
            expect((await primary.evaluate((el) => getComputedStyle(el).boxShadow)).match(/inset/g)?.length, 'with its own bevel').toBe(4);
        });

        test('the dossier is a Notepad window: the read-only stamp, and the dither brush lifting off on the trigger', async ({ page }) => {
            await open(page, url);
            await page
                .locator('.kp-boot__skip')
                .click()
                .catch(() => {});
            const dossier = page.locator('.kp-card[data-kp-reveal="emphasis"]');
            const stamp = await pseudo(dossier, '::before', ['content', 'rotate', 'border-top-width']);
            // Firefox reports the unresolved attr(); chromium the value.
            expect(stamp.content).toMatch(/READ\ ONLY|attr\(data-kp-label\)/i);
            expect(stamp.rotate).toBe('-8deg');
            expect(stamp['border-top-width']).toBe('2px');
            expect(await dossier.locator('.kp-card__header').evaluate((el) => getComputedStyle(el).backgroundImage), 'the title bar').toMatch(
                /linear-gradient/,
            );
            const mark = dossier.locator('mark').first();
            const covered = await pseudo(mark, '::after', ['clip-path', 'background-image']);
            expect(covered['clip-path'], 'covered before the trigger').toMatch(/^inset\(0(px)?\)$|^inset\(0px 0px 0px 0px\)$/);
            expect(covered['background-image'], 'the 50% dither brush').toMatch(/conic-gradient/);
            await dossier.locator('[data-kp-reveal-trigger]').click();
            await expect(mark).toHaveClass(/is-cleared/);
            await settled(page);
            await expect.poll(async () => (await pseudo(mark, '::after', ['clip-path']))['clip-path'], 'the brush lifted off').toMatch(/100%\)$/);
        });

        test('the selection drags its own words in with the bar, and the fieldset is a groove [S49, A11]', async ({ page }) => {
            await open(page, url);
            const mark = page.locator('[data-kp-surface="hero"] mark').first();
            await expect(mark).toHaveClass(/is-cleared/, { timeout: 15000 });
            // The plate carries a copy of the element's own text, which is
            // what makes white words arrive with the bar rather than after
            // it. Drill [KT3]: `content: attr(data-kp-text)` back to '' →
            // the plate is empty and this reads "none".
            const plate = await pseudo(mark, '::before', ['content', 'color']);
            // Firefox reports `content` with its attr() unresolved; both
            // channels are accepted, and the attribute itself is read
            // below so the words are still checked in either browser.
            expect([(await mark.textContent())?.trim(), 'attr(data-kp-text)']).toContain(plate.content.replace(/^"|"$/g, ''));
            expect(await mark.getAttribute('data-kp-text'), 'the plate reads the element\u2019s own words').toBe((await mark.textContent())?.trim());
            expect(plate.color).toBe(await paint(page, '--primary-foreground'));

            // And the fieldset's groove is the demo's two hairlines: four
            // inset shadows, light against dark on both diagonals.
            const fieldset = page.locator('.kp-fieldset').first();
            if ((await fieldset.count()) > 0) {
                const shadow = await fieldset.evaluate((el) => getComputedStyle(el).boxShadow);
                expect(shadow.match(/inset/g) ?? [], 'four hairlines').toHaveLength(4);
                expect(await fieldset.evaluate((el) => getComputedStyle(el).borderTopWidth)).toBe('0px');
            }
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
