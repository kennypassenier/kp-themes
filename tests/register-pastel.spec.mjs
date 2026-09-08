// The pastel register [S48, LIFT_PLAN row 6]: the approved concept demo
// "Second Pass" (2026-09-08) reproduced by the package, measured on the
// concept page under pastel in both channels.
//
// What the demo showed and this suite holds: no arrival at all and every
// reveal at rest under reduced motion, the headline's overprint duplicate
// springing from a wide mis-registration into its 2px rest position once
// and ending as its own text, the lede's marks filling in mint then
// violet, the app heading's rule growing left to right once it enters the
// viewport, the torn-tab divider as two different zig-zags, the navbar's
// dropdown in the theme's own soft radius, the buttons' spring lift on
// hover and settle on press, the dossier's rotated stamp swapping its
// word when the file opens and its redactions fading and narrowing away
// on the trigger, and the whole approved inventory on the page.
//
// Drills [KT3], performed 2026-09-08 in chromium and restored:
//   - the armed overprint rule (`[data-kp-effects] … :not(.is-deciphered)
//     ::before`) removed → the duplicate stands at its 2px rest position
//     from the first paint instead of the wide offset, red on "the
//     overprint springs into register";
//   - the armed mark rule (`[data-kp-effects] mark:not(.is-cleared)`)
//     removed → the fill covers the words from the first paint instead of
//     standing at 0%, red on "the lede's marks fill in";
//   - the covered redaction rule (`[data-kp-effects] … mark:not(.is-
//     cleared)::after`) removed → the redaction never covers the words at
//     all, red on "the dossier: the redactions cover the words".

import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

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
    test.describe(`the pastel register, ${channel}`, () => {
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

        test('the two dividers are torn tabs: different zig-zags, plum then mint-ink', async ({ page }) => {
            await open(page, url);
            const dividers = page.locator('[data-kp-divider]');
            expect(await dividers.count()).toBe(2);
            const first = await dividers.first().evaluate((el) => ({
                clip: getComputedStyle(el).clipPath,
                bg: getComputedStyle(el).backgroundColor,
            }));
            const second = await dividers.nth(1).evaluate((el) => ({
                clip: getComputedStyle(el).clipPath,
                bg: getComputedStyle(el).backgroundColor,
            }));
            expect(first.clip, 'a jagged cut, not a straight edge').toMatch(/polygon/);
            expect(second.clip).toMatch(/polygon/);
            expect(first.clip, 'the two tears are different cuts').not.toBe(second.clip);
            expect(first.bg).toBe(await paint(page, '--primary'));
            expect(second.bg).toBe(await paint(page, '--accent-foreground'));
        });

        test('the dropdown is styled in the theme’s own radius [KT14], and the buttons spring on hover', async ({ page }) => {
            await open(page, url);
            const menu = page.locator('.kp-nav__menu').first();
            expect(await menu.evaluate((el) => getComputedStyle(el).borderRadius)).toBe('12.8px');
            expect(await menu.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(await paint(page, '--card'));
            // The dropdown opens on hover of its trigger; the item inside
            // is not actionable until then.
            await page.locator('[aria-haspopup="true"]').first().hover();
            const item = menu.locator('a').first();
            await expect(item).toBeVisible();
            await item.hover();
            await expect.poll(() => item.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(await paint(page, '--accent'));
            const button = page.locator('[data-kp-surface="hero"] .kp-button').nth(1);
            const restTranslate = await button.evaluate((el) => getComputedStyle(el).translate);
            await button.hover();
            await expect.poll(() => button.evaluate((el) => getComputedStyle(el).translate), 'the springy lift').not.toBe(restTranslate);
        });

        test('the dossier: the rotated stamp swaps its word when the file opens, and the redactions cover the words until then', async ({ page }) => {
            await open(page, url);
            const dossier = page.locator('.kp-card[data-kp-reveal="emphasis"]');
            const stamp = await pseudo(dossier, '::before', ['content', 'rotate', 'background-color', 'color']);
            expect(stamp.content).toMatch(/Proof approved|attr\(data-kp-label\)/i);
            expect(stamp.rotate).toBe('-3deg');
            const mark = dossier.locator('mark').first();
            const covered = await pseudo(mark, '::after', ['opacity', 'transform']);
            expect(covered.opacity, 'covered before the trigger').toBe('1');
            expect(covered.transform, 'no shrink yet').toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
            await dossier.locator('[data-kp-reveal-trigger]').click();
            await expect(mark).toHaveClass(/is-cleared/);
            // The stamp changes when the file opens, as the demo's does
            // [S49, A11]. Drill [KT3]: the [data-kp-open] rule removed →
            // the stamp keeps saying "Proof approved", red here.
            await expect(dossier).toHaveAttribute('data-kp-open', '');
            const opened = await pseudo(dossier, '::before', ['content']);
            expect([await dossier.getAttribute('data-kp-label-open'), 'attr(data-kp-label-open)']).toContain(opened.content.replace(/^"|"$/g, ''));
            await settled(page);
            await expect.poll(async () => (await pseudo(mark, '::after', ['opacity'])).opacity, 'the redaction faded away').toBe('0');
        });

        test('the wipe confirmation is a real dialog, styled in the theme’s own boundary and radius', async ({ page }) => {
            await open(page, url);
            const wipe = page.locator('[data-kp-form] [type="reset"], [data-kp-form] button:has-text("Wipe")').first();
            await wipe.click();
            const dialog = page.locator('dialog[open], .kp-dialog:visible, .kp-confirm:visible').first();
            await expect(dialog).toBeVisible({ timeout: 3000 });
            expect(await dialog.evaluate((el) => getComputedStyle(el).borderRadius)).toBe('17.6px');
            expect(await dialog.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(await paint(page, '--card'));
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
