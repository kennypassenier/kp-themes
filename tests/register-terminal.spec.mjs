// The terminal register [S48, LIFT_PLAN row 4, TM1–TM4]: the approved
// concept demo "Green Phosphor" (2026-09-08) reproduced by the package,
// measured on the concept page under terminal in both channels.
//
// What the demo showed and this suite holds: the POST once per session
// with its Skip and the tube collapsing, the headline typing itself with
// a block caret riding the last glyph and ending as its own text in the
// bloom, the mark as inverse video (phosphor in a dim frame while armed,
// void on phosphor once the line lands), the dashed rule typing itself
// out under a heading, the two dividers of dashes with a plus at each
// end, the shell line whose hovered item is inverse video and whose cta
// is bracketed, the bracketed buttons and the plate, the block cursor
// inside the focused field at the caret (R6-Q7), the bracketed stamp and
// the cells clearing off the dossier's redactions, the sweep and the
// bezel on the glass, and the whole approved inventory.
//
// Drills [KT3], performed 2026-09-08 in both browsers and restored:
//   - `--kp-caret: block` removed from the register → the module writes
//     no column and the field paints no block, red on "the cursor lives
//     in the box";
//   - `--kp-arrival: boot` removed → no overlay, red on "the page boots";
//   - the armed inverse (`[data-kp-effects] mark:not(.is-cleared)`)
//     removed → the mark is inverted from the first paint, red on "the
//     mark is inverse video".

import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { bootGone, style } from './paint.mjs';

const INVENTORY = JSON.parse(readFileSync(new URL('../showcase/concept-demo.json', import.meta.url), 'utf8')).elements;

const CHANNELS = [
    ['framework-free', '/examples/concept-terminal.html'],
    ['React', '/tests/fixtures/examples.html?example=concept&copy=terminal'],
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
            localStorage.setItem('theme', 'terminal');
        } catch {
            // no storage: the page keeps its served theme
        }
    });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(url);
    await page.waitForFunction(() => document.documentElement.getAttribute('data-theme') === 'terminal');
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
    test.describe(`the terminal register, ${channel}`, () => {
        test('the page boots once per session through the POST, and Skip ends it at once [TM2]', async ({ page }) => {
            await open(page, url);
            const boot = page.locator('.kp-boot');
            await expect(boot).toBeVisible();
            // The POST is the demo's own lines now [S49, A1/A11], from the
            // dictionary rather than a percentage counter.
            await expect(boot.locator('.kp-boot__line')).toContainText('KP-THEMES BIOS');
            expect(await boot.evaluate((el) => getComputedStyle(el).textShadow), 'the bloom').not.toBe('none');
            await boot.locator('.kp-boot__skip').click();
            await expect(boot).toHaveCount(0, { timeout: 3000 });
            await page.reload();
            await expect(page.locator('[data-kp-surface="app"]').first()).toBeVisible();
            expect(await page.locator('.kp-boot').count(), 'seen this session: no second boot').toBe(0);
        });

        test('under reduced motion there is no boot, the sweep rests above the glass, and every reveal is at rest', async ({ page }) => {
            await open(page, url, { reduced: true });
            expect(await page.locator('.kp-boot').count()).toBe(0);
            await expect(page.locator('[data-kp-reveal="headline"]').first()).toHaveClass(/is-deciphered/);
            expect(await page.locator('[data-kp-surface="hero"] mark:not(.is-cleared)').count()).toBe(0);
            const sweep = await pseudo(page.locator('html'), '::after', ['animation-name', 'top', 'position']);
            expect(sweep['animation-name']).toBe('none');
            expect(sweep.position).toBe('fixed');
            expect(sweep.top).toBe('-140px');
        });

        test('the headline types itself with a block caret and ends as its own text in the bloom [TM2]', async ({ page }) => {
            await page.addInitScript(() => {
                window.kpTyped = [];
                new MutationObserver(() => {
                    const h = document.querySelector('[data-kp-reveal="headline"]');
                    const c = h?.querySelector('[data-caret]');
                    if (h && c && h.classList.contains('is-typing')) {
                        const s = getComputedStyle(c);
                        window.kpTyped.push((h.textContent ?? '').length + '|' + s.display + '|' + s.width + '|' + s.backgroundColor);
                    }
                }).observe(document, { subtree: true, childList: true, attributes: true, characterData: true });
            });
            await open(page, url);
            await page
                .locator('.kp-boot__skip')
                .click()
                .catch(() => {});
            // The click is dispatched, not finished: the overlay is fixed over
            // the whole page until it is actually removed [TF1].
            await bootGone(page);
            const h1 = page.locator('[data-kp-reveal="headline"]').first();
            const source = await h1.getAttribute('data-kp-text');
            await expect(h1).toHaveClass(/is-deciphered/, { timeout: 15000 });
            expect(await h1.textContent()).toBe(source);
            expect(await h1.locator('[data-caret]').count(), 'the caret leaves with the last glyph').toBe(0);
            await style(h1, 'text-shadow', 'the bloom').not.toBe('none');
            await style(h1, 'color').toBe(await paint(page, '--primary'));
            const typed = await page.evaluate(() => window.kpTyped);
            expect(typed.length, 'the caret was seen while typing').toBeGreaterThan(3);
            expect(
                typed.some((s) => /\|inline-block\|/.test(s) && !/rgba\(0, 0, 0, 0\)$/.test(s)),
                'the caret is a painted block',
            ).toBe(true);
            const lengths = typed.map((s) => Number(s.split('|')[0]));
            expect(Math.max(...lengths) - Math.min(...lengths), 'the text grew glyph by glyph').toBeGreaterThan(3);
        });

        test('the mark is inverse video: phosphor in a dim frame while armed, void on phosphor once the line lands [TH120]', async ({ page }) => {
            await page.addInitScript(() => {
                window.kpArmed = [];
                new MutationObserver(() => {
                    const m = document.querySelector('[data-kp-surface="hero"] mark');
                    if (m && document.documentElement.hasAttribute('data-kp-effects') && !m.classList.contains('is-cleared')) {
                        const s = getComputedStyle(m);
                        window.kpArmed.push(s.backgroundColor + '|' + s.boxShadow);
                    }
                }).observe(document, { subtree: true, childList: true, attributes: true });
            });
            await open(page, url);
            await page
                .locator('.kp-boot__skip')
                .click()
                .catch(() => {});
            // The click is dispatched, not finished: the overlay is fixed over
            // the whole page until it is actually removed [TF1].
            await bootGone(page);
            const mark = page.locator('[data-kp-surface="hero"] mark').first();
            await expect(mark).toHaveClass(/is-cleared/, { timeout: 15000 });
            await settled(page);
            await style(mark, 'background-color', 'the phosphor as ground').toBe(await paint(page, '--foreground'));
            await style(mark, 'color', 'the void as ink').toBe(await paint(page, '--background'));
            const armed = await page.evaluate(() => window.kpArmed);
            expect(
                armed.some((s) => s.startsWith('rgba(0, 0, 0, 0)|') && /inset/.test(s)),
                'the words stood in phosphor inside a dim frame before the line landed',
            ).toBe(true);
        });

        test('the dashed rule types itself out under a heading when it enters the viewport [TH122]', async ({ page }) => {
            await open(page, url);
            await page
                .locator('.kp-boot__skip')
                .click()
                .catch(() => {});
            // The click is dispatched, not finished: the overlay is fixed over
            // the whole page until it is actually removed [TF1].
            await bootGone(page);
            const rule = page.locator('[data-kp-reveal="rule"]').first();
            await rule.scrollIntoViewIfNeeded();
            await expect(rule).toHaveClass(/is-in/, { timeout: 5000 });
            const dashes = await pseudo(rule, '::after', ['height', 'background-image', 'animation-name', 'animation-timing-function']);
            expect(dashes.height).toBe('1px');
            expect(dashes['background-image'], 'dashes').toMatch(/repeating-linear-gradient/);
            expect(dashes['animation-name']).toBe('kp-rule-in');
            expect(dashes['animation-timing-function']).toMatch(/steps\(12/);
            await settled(page);
            await expect.poll(async () => (await pseudo(rule, '::after', ['transform'])).transform).toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
        });

        test('the dividers are dashes with a plus at each end; the second doubles the line [TH121]', async ({ page }) => {
            await open(page, url);
            const dividers = page.locator('[data-kp-divider]');
            expect(await dividers.count()).toBe(2);
            for (const i of [0, 1]) {
                const d = dividers.nth(i);
                expect(await d.evaluate((el) => getComputedStyle(el).backgroundImage)).toMatch(/repeating-linear-gradient/);
                // Firefox reports the raw content string; chromium the same.
                expect((await pseudo(d, '::before', ['content'])).content).toMatch(/\+/);
                expect((await pseudo(d, '::after', ['content'])).content).toMatch(/\+/);
            }
            expect(
                (await dividers.nth(1).evaluate((el) => getComputedStyle(el).backgroundImage)).match(/repeating-linear-gradient/g)?.length,
                'two lines',
            ).toBe(2);
            expect(await dividers.nth(1).evaluate((el) => getComputedStyle(el).height)).toBe('48px');
        });

        test('the shell line: a hovered item is inverse video, the cta is bracketed, the buttons are brackets and a plate', async ({ page }) => {
            await open(page, url);
            await page
                .locator('.kp-boot__skip')
                .click()
                .catch(() => {});
            // The click is dispatched, not finished: the overlay is fixed over
            // the whole page until it is actually removed [TF1].
            await bootGone(page);
            const link = page.locator('.kp-nav__link').nth(1);
            await link.hover();
            await expect.poll(() => link.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(await paint(page, '--primary'));
            expect(await link.evaluate((el) => getComputedStyle(el).color)).toBe(await paint(page, '--primary-foreground'));
            const cta = page.locator('.kp-nav__link--cta').first();
            expect((await pseudo(cta, '::before', ['content'])).content).toMatch(/\[/);
            await style(cta, 'color').toBe(await paint(page, '--accent'));
            const button = page.locator('[data-kp-surface="hero"] .kp-button').nth(1);
            await style(button, 'border-radius').toBe('0px');
            await style(button, 'background-color').toBe('rgba(0, 0, 0, 0)');
            const primary = page.locator('[data-kp-surface="hero"] .kp-button--primary').first();
            await style(primary, 'background-color', 'the plate').toBe(await paint(page, '--primary'));
            const ghost = page.locator('[data-kp-surface="hero"] .kp-button--ghost').first();
            expect((await pseudo(ghost, '::before', ['content', 'opacity'])).opacity, 'the brackets wait for the pointer').toBe('0');
            await ghost.hover();
            await expect.poll(async () => (await pseudo(ghost, '::before', ['opacity'])).opacity).toBe('1');
        });

        test('the cursor lives in the box: a block of one cell at the caret, in the focused field [R6-Q7]', async ({ page }) => {
            await open(page, url);
            await page
                .locator('.kp-boot__skip')
                .click()
                .catch(() => {});
            // The click is dispatched, not finished: the overlay is fixed over
            // the whole page until it is actually removed [TF1].
            await bootGone(page);
            const input = page.locator('input.kp-field__input[type="text"], input.kp-field__input:not([type])').first();
            await input.scrollIntoViewIfNeeded();
            await style(input, 'background-image', 'no block before focus').toBe('none');
            await input.click();
            await input.type('kenny');
            const focused = await input.evaluate((el) => {
                const s = getComputedStyle(el);
                return { image: s.backgroundImage, size: s.backgroundSize, col: el.style.getPropertyValue('--kp-col'), caret: s.caretColor };
            });
            expect(focused.image, 'the block is a background layer').toMatch(/linear-gradient/);
            expect(focused.col, 'the module wrote the column').toBe('5');
            expect(focused.caret, 'the native caret steps aside').toBe('rgba(0, 0, 0, 0)');
            const label = page.locator('.kp-field:focus-within .kp-field__label').first();
            expect((await pseudo(label, '::after', ['animation-name']))['animation-name'], 'no cursor after the label any more').toBe('none');
            await page.keyboard.press('Home');
            await expect.poll(() => input.evaluate((el) => el.style.getPropertyValue('--kp-col'))).toBe('0');
            await page.keyboard.press('Tab');
            await expect.poll(() => input.evaluate((el) => el.style.getPropertyValue('--kp-col'))).toBe('');
        });

        test('the dossier: a bracketed stamp, and the cells clearing off the redactions on the trigger', async ({ page }) => {
            await open(page, url);
            await page
                .locator('.kp-boot__skip')
                .click()
                .catch(() => {});
            // The click is dispatched, not finished: the overlay is fixed over
            // the whole page until it is actually removed [TF1].
            await bootGone(page);
            const dossier = page.locator('.kp-card[data-kp-reveal="emphasis"]');
            const stamp = await pseudo(dossier, '::before', ['content', 'color']);
            expect(stamp.content).toMatch(/\[/);
            expect(stamp.color).toBe(await paint(page, '--accent'));
            const mark = dossier.locator('mark').first();
            const covered = await pseudo(mark, '::after', ['transform', 'background-image']);
            expect(covered.transform, 'covered before the trigger').toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
            expect(covered['background-image'], 'a run of cells').toMatch(/repeating-linear-gradient/);
            await dossier.locator('[data-kp-reveal-trigger]').click();
            await expect(mark).toHaveClass(/is-cleared/);
            await settled(page);
            await expect.poll(async () => (await pseudo(mark, '::after', ['transform'])).transform, 'the cells cleared off').toMatch(/^matrix\(0,/);
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
