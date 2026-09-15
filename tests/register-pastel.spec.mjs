// The pastel register [S48, LIFT_PLAN row 6]: the approved concept demo
// "Second Pass" (2026-09-08) reproduced by the package, measured on the
// concept page under pastel in both channels.
//
// What the demo showed and this suite holds: no arrival at all and every
// reveal at rest under reduced motion, the headline's overprint duplicate
// springing from a wide mis-registration into its 2px rest position once
// and ending as its own text, the lede's marks filling in mint then
// violet, the app heading's rule growing left to right once it enters the
// viewport, the navbar's dropdown in the theme's own soft radius, the
// buttons' spring lift on hover and settle on press, the dossier's rotated
// stamp swapping its word when the file opens and its redactions fading
// and narrowing away on the trigger, and the whole approved inventory on
// the page. The torn-tab dividers are judged by eye on the catalogue since
// scope-73 (page-effects#dividers).
//
// Drills [KT3], performed 2026-09-08 in chromium, repeated the same
// day in firefox (each one red on the test it names, then restored green
// in both browsers) [G13]:
//   - the armed overprint rule (`[data-kp-effects] … :not(.is-deciphered)
//     ::before`) removed → the duplicate stands at its 2px rest position
//     from the first paint instead of the wide offset, red on "the
//     overprint springs into register";
//   - the armed mark rule (`[data-kp-effects] mark:not(.is-cleared)`)
//     removed → the fill covers the words from the first paint instead of
//     standing at 0%, red on "the lede's marks fill in";
//   - the covered redaction rule (`[data-kp-effects] … mark:not(.is-
//     cleared)::after`) removed → the redaction never covers the words at
//     all, red on "the dossier: the redactions cover the words". Since
//     fix-33 (scope-93) the plate is the mark's own cloned background, so
//     that rule is `[data-kp-effects] … mark:not(.is-cleared)` with
//     `background-size: 100% 100%`, and the test reads the size; the plate
//     narrows away rather than fading and narrowing.

import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { style } from './paint.mjs';
import { stampWord } from './stamp.mjs';

const INVENTORY = JSON.parse(readFileSync(new URL('../showcase/concept-demo.json', import.meta.url), 'utf8')).elements;

const CHANNELS = [
    ['framework-free', '/examples/concept-pastel.html'],
    ['React', '/tests/fixtures/examples.html?example=concept&copy=pastel'],
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
            localStorage.setItem('theme', 'pastel');
        } catch {
            // no storage: the page keeps its served theme
        }
    });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(url);
    await page.waitForFunction(() => document.documentElement.getAttribute('data-theme') === 'pastel');
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
    test.describe(`the pastel register, ${channel}`, { tag: ['@theme:pastel', '@component:page-effects', '@component:examples'] }, () => {
        test('there is no arrival: the page is simply there, and every reveal is at rest under reduced motion', async ({ page }) => {
            await open(page, url);
            expect(await page.locator('.kp-boot').count(), 'a risograph page does not boot').toBe(0);
            await open(page, url, { reduced: true });
            expect(await page.locator('.kp-boot').count()).toBe(0);
            await expect(page.locator('[data-kp-reveal="headline"]').first()).toHaveClass(/is-deciphered/);
            expect(await page.locator('[data-kp-surface="hero"] mark:not(.is-cleared)').count()).toBe(0);
            const rule = page.locator('[data-kp-reveal="rule"]').first();
            await expect(rule).toHaveClass(/is-in/);
            const before = await pseudo(page.locator('[data-kp-reveal="headline"]').first(), '::before', ['transform', 'opacity']);
            expect(before.opacity, 'the overprint sits at its rest position, not mid-flight').toBe('0.55');
        });

        test('the headline overprint springs from a wide mis-registration into its 2px rest position once [X0]', async ({ page }) => {
            await page.addInitScript(() => {
                window.kpArmed = [];
                new MutationObserver(() => {
                    const h = document.querySelector('[data-kp-reveal="headline"]');
                    if (h && document.documentElement.hasAttribute('data-kp-effects') && !h.classList.contains('is-deciphered')) {
                        window.kpArmed.push(getComputedStyle(h, '::before').transform);
                    }
                }).observe(document, { subtree: true, childList: true, attributes: true });
            });
            await open(page, url);
            const h1 = page.locator('[data-kp-reveal="headline"]').first();
            const source = await h1.getAttribute('data-kp-text');
            await expect(h1).toHaveClass(/is-deciphered/, { timeout: 15000 });
            await settled(page);
            expect(await h1.textContent(), 'the text is never touched').toBe(source);
            const rest = await pseudo(h1, '::before', ['transform', 'opacity', 'mix-blend-mode', 'content']);
            expect(rest.transform, 'rest is the measured 2px offset').toBe('matrix(1, 0, 0, 1, 2, 2)');
            expect(rest.opacity).toBe('0.55');
            expect(rest['mix-blend-mode']).toBe('multiply');
            expect(rest.content, 'the duplicate is the element’s own text').toMatch(/attr\(data-kp-text\)|"Ink that never quite lines up\."/);
            const armed = await page.evaluate(() => window.kpArmed);
            expect(
                armed.some((t) => t.includes('14') || /matrix\(1, 0, 0, 1, 14/.test(t)),
                'the duplicate started wide before it registered',
            ).toBe(true);
            // The armed rest state, probed deterministically: with the
            // rested element made to match :not(.is-deciphered) again, the
            // register's armed rule must cover it with the wide offset.
            const forced = await h1.evaluate((el) => {
                el.classList.remove('is-deciphered');
                const s = getComputedStyle(el, '::before');
                const out = { transform: s.transform, opacity: s.opacity };
                el.classList.add('is-deciphered');
                return out;
            });
            expect(forced.transform, 'wide while armed').toBe('matrix(1, 0, 0, 1, 14, 10)');
            expect(forced.opacity, 'invisible while armed').toBe('0');
        });

        test('the lede’s marks fill in, mint then violet [TH120]', async ({ page }) => {
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
            const marks = page.locator('[data-kp-surface="hero"] .kp-lede mark');
            await expect(marks.first()).toHaveClass(/is-cleared/, { timeout: 15000 });
            await expect(marks.nth(1)).toHaveClass(/is-cleared/, { timeout: 15000 });
            await settled(page);
            await expect.poll(() => marks.first().evaluate((el) => getComputedStyle(el).backgroundSize), 'the plate fills the word').toMatch(/^100%/);
            expect(await marks.first().evaluate((el) => getComputedStyle(el).backgroundColor), 'mint first').toBe(await paint(page, '--accent'));
            expect(await marks.nth(1).evaluate((el) => getComputedStyle(el).backgroundColor), 'violet second').toBe(await paint(page, '--info'));
            const armed = await page.evaluate(() => window.kpArmed);
            expect(
                armed.some((s) => /^0(px|%)/.test(s)),
                'the fill grew in, it was not simply there',
            ).toBe(true);
            // The armed rest state, probed deterministically: with the
            // filled mark made to match :not(.is-cleared) again, the
            // register's armed rule must stand it at zero fill.
            const forced = await marks.first().evaluate((el) => {
                el.classList.remove('is-cleared');
                const size = getComputedStyle(el).backgroundSize;
                el.classList.add('is-cleared');
                return size;
            });
            expect(forced, 'zero fill while armed').toMatch(/^0(px|%)/);
        });

        test('the app heading’s rule grows left to right once it enters the viewport [TH122]', async ({ page }) => {
            await open(page, url);
            const rule = page.locator('[data-kp-reveal="rule"]').first();
            await rule.scrollIntoViewIfNeeded();
            await expect(rule).toHaveClass(/is-in/, { timeout: 5000 });
            const drawn = await pseudo(rule, '::after', ['width', 'background-color', 'animation-name']);
            expect(drawn['animation-name']).toBe('kp-draw');
            expect(drawn['background-color']).toBe(await paint(page, '--primary'));
            await settled(page);
            await expect.poll(async () => (await pseudo(rule, '::after', ['width'])).width).not.toBe('0px');
        });

        test('the dossier: the rotated stamp swaps its word when the file opens, and the redactions cover the words until then', async ({ page }) => {
            await open(page, url);
            const dossier = page.locator('.kp-card[data-kp-reveal="emphasis"]');
            // Measured through the paint, not the declaration: firefox
            // reports `attr()` unresolved and the old `|attr(...)`
            // alternative accepted a stamp that printed nothing [G4].
            const stamp = await pseudo(dossier, '::before', ['rotate', 'background-color', 'color']);
            expect(await stampWord(page, '.kp-card[data-kp-reveal="emphasis"]', '::before', 'data-kp-label')).toMatch(/Proof approved/i);
            expect(stamp.rotate).toBe('-3deg');
            const mark = dossier.locator('mark').first();
            const covered = await pseudo(mark, '', ['background-size', 'color', 'box-decoration-break', '-webkit-box-decoration-break']);
            expect(covered['background-size'], 'covered before the trigger').toBe('100% 100%');
            expect(covered.color, 'the words wear no ink under the plate').toBe('rgba(0, 0, 0, 0)');
            expect([covered['box-decoration-break'], covered['-webkit-box-decoration-break']], 'the plate is cloned onto every line').toContain(
                'clone',
            );
            await dossier.locator('[data-kp-reveal-trigger]').click();
            await expect(mark).toHaveClass(/is-cleared/);
            // The stamp changes when the file opens, as the demo's does
            // [S49, A11]. Drill [KT3]: the [data-kp-open] rule removed →
            // the stamp keeps saying "Proof approved", red here.
            await expect(dossier).toHaveAttribute('data-kp-open', '');
            expect(
                await stampWord(page, '.kp-card[data-kp-reveal="emphasis"]', '::before', 'data-kp-label-open'),
                'the stamp swapped to its open word',
            ).toBe(await dossier.getAttribute('data-kp-label-open'));
            await settled(page);
            await expect
                .poll(async () => (await pseudo(mark, '', ['background-size']))['background-size'], 'the redaction narrowed away')
                .toBe('0% 100%');
        });

        // The fade came back [scope-94]: fix-33 moved the plate from mark::after
        // (which faded its opacity over 220ms) to the mark's cloned background,
        // and the fade went with it. The plate's ink is now
        // color-mix(--foreground, alpha) over the registered number
        // --kp-redact-alpha, transitioned beside the narrowing. Sampled every
        // frame from the moment the phrase is cleared: somewhere in between the
        // alpha is neither the covered 1 nor the cleared 0. Drill [KT3]: the
        // `--kp-redact-alpha 220ms ease` transition removed, or the @property
        // rule removed (an unregistered property flips at the end), and no
        // sample lies between.
        for (const reduced of [false, true]) {
            test(`the dossier: the redaction plate ${reduced ? 'clears at once under reduced motion' : 'fades while it narrows'} [scope-94]`, async ({
                page,
            }) => {
                await open(page, url, { reduced });
                const dossier = page.locator('.kp-card[data-kp-reveal="emphasis"]');
                const mark = dossier.locator('mark').first();
                if (reduced) {
                    // Reduced motion puts the dossier at rest, opened: no plate,
                    // and no transition that could fade one.
                    await expect(mark).toHaveClass(/is-cleared/);
                    const rest = await pseudo(mark, '', ['--kp-redact-alpha', 'background-size', 'transition-property']);
                    expect(rest['--kp-redact-alpha'].trim(), 'at rest: no plate ink').toBe('0');
                    expect(rest['background-size']).toBe('0% 100%');
                    expect(rest['transition-property'], 'nothing fades under reduced motion').not.toMatch(/kp-redact-alpha|background-size/);
                    return;
                }
                expect((await pseudo(mark, '', ['--kp-redact-alpha']))['--kp-redact-alpha'].trim(), 'covered: the plate at full ink').toBe('1');
                expect((await pseudo(mark, '', ['background-image']))['background-image'], 'the plate is painted').not.toBe('none');
                await mark.evaluate((el) => {
                    const w = /** @type {any} */ (window);
                    w.kpAlphaSamples = [];
                    const sample = () => w.kpAlphaSamples.push(Number(getComputedStyle(el).getPropertyValue('--kp-redact-alpha')));
                    new MutationObserver((_, observer) => {
                        if (!el.classList.contains('is-cleared')) return;
                        observer.disconnect();
                        sample();
                        const start = performance.now();
                        const tick = () => {
                            sample();
                            if (performance.now() - start < 900) requestAnimationFrame(tick);
                        };
                        requestAnimationFrame(tick);
                    }).observe(el, { attributes: true, attributeFilter: ['class'] });
                });
                await dossier.locator('[data-kp-reveal-trigger]').click();
                await expect(mark).toHaveClass(/is-cleared/);
                await expect.poll(() => page.evaluate(() => /** @type {any} */ (window).kpAlphaSamples.at(-1)), 'the plate ends cleared').toBe(0);
                await page.waitForTimeout(1000);
                const samples = /** @type {number[]} */ (await page.evaluate(() => /** @type {any} */ (window).kpAlphaSamples));
                const between = samples.filter((a) => a > 0.01 && a < 0.99);
                if (reduced) expect(between, `no fade under reduced motion: ${samples.join(', ')}`).toEqual([]);
                else expect(between.length, `mid-reveal alpha between 1 and 0: ${samples.map((a) => a.toFixed(2)).join(', ')}`).toBeGreaterThan(0);
            });
        }

        test('the wipe confirmation is a real dialog, styled in the theme’s own boundary and radius', async ({ page }) => {
            await open(page, url);
            const wipe = page.locator('[data-kp-form] [type="reset"], [data-kp-form] button:has-text("Wipe")').first();
            await wipe.click();
            const dialog = page.locator('dialog[open], .kp-dialog:visible, .kp-confirm:visible').first();
            await expect(dialog).toBeVisible({ timeout: 3000 });
            await style(dialog, 'border-radius').toBe('17.6px');
            await style(dialog, 'background-color').toBe(await paint(page, '--card'));
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
