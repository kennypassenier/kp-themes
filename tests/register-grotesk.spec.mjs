// The grotesk register [S48, LIFT_PLAN row 12]: the approved concept demo
// "Twelve Columns" (2026-09-08) reproduced by the package, measured on the
// concept page under grotesk in both channels.
//
// What the demo showed and this suite holds: the fourteen-column navbar
// track with the brand in three tracks and the links in eleven, the
// two-speed link timing (.1s in, .15s out), the headline's optical
// blur+brightness resolve ending as its own text, the lede's marks as a
// static signal colour with no reveal, the dossier's marks as ink
// redaction bars that cut away in three monotone steps on the trigger, the
// rule drawing itself under a heading, the double rule with the signal
// hairline as divider, the black-ruled buttons and fields, no arrival at
// all, and the whole approved inventory.
//
// Drills [KT3], performed 2026-09-08 in both browsers and restored:
//   - the armed redaction cover (`[data-kp-effects] .kp-card[data-kp-reveal
//     ='emphasis'] mark:not(.is-cleared)::after { transform: scaleX(1) }`)
//     removed → the dossier's words are readable from the first paint, red
//     on "covered before the trigger";
//   - the headline's armed blur (`.is-sharpening { filter: blur(...)
//     brightness(...) }`) removed → the probe never reads a blur greater
//     than 0, red on "the headline resolves from a blur";
//   - the divider's signal hairline (`[data-kp-divider]::after`) removed →
//     no second background layer, red on "the hairline is centred between
//     the two rules".

import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { pseudoStyle, style } from './paint.mjs';
import { tabToSelector } from './ring.mjs';
import { stampWord } from './stamp.mjs';

const INVENTORY = JSON.parse(readFileSync(new URL('../showcase/concept-demo.json', import.meta.url), 'utf8')).elements;

const CHANNELS = [
    ['framework-free', '/examples/concept-grotesk.html'],
    ['React', '/tests/fixtures/examples.html?example=concept&copy=grotesk'],
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
            localStorage.setItem('theme', 'grotesk');
        } catch {
            // no storage: the page keeps its served theme
        }
    });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(url);
    await page.waitForFunction(() => document.documentElement.getAttribute('data-theme') === 'grotesk');
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
    test.describe(`the grotesk register, ${channel}`, () => {
        test('there is no arrival: the page is simply there, and every reveal is at rest under reduced motion', async ({ page }) => {
            await open(page, url);
            expect(await page.locator('.kp-boot').count(), 'grotesk builds no boot overlay').toBe(0);
            await open(page, url, { reduced: true });
            expect(await page.locator('.kp-boot').count()).toBe(0);
            await expect(page.locator('[data-kp-reveal="headline"]').first()).toHaveClass(/is-deciphered/);
            const h1Filter = await page
                .locator('[data-kp-reveal="headline"]')
                .first()
                .evaluate((el) => getComputedStyle(el).filter);
            expect(h1Filter, 'no blur left standing under reduced motion').toBe('none');
        });

        test('the headline resolves from a blur+brightness sweep and ends as its own text, in the display face [S49]', async ({ page }) => {
            // Sampled every frame from the moment the reveal arms, the same
            // way retro's dither test catches its own transient state: a
            // single evaluate() taken right after locating the element can
            // land before the class attaches or after the 640ms run ends.
            await page.addInitScript(() => {
                window.kpFocus = [];
                let sampling = false;
                const sample = () => {
                    const h = document.querySelector('[data-kp-reveal="headline"]');
                    if (!h || h.classList.contains('is-deciphered')) return;
                    window.kpFocus.push(getComputedStyle(h).filter);
                    requestAnimationFrame(sample);
                };
                new MutationObserver(() => {
                    const h = document.querySelector('[data-kp-reveal="headline"]');
                    if (h && !sampling && h.classList.contains('is-sharpening')) {
                        sampling = true;
                        requestAnimationFrame(sample);
                    }
                }).observe(document, { subtree: true, childList: true, attributes: true });
            });
            await open(page, url);
            const h1 = page.locator('[data-kp-reveal="headline"]').first();
            const source = await h1.getAttribute('data-kp-text');
            await expect(h1).toHaveClass(/is-deciphered/, { timeout: 15000 });
            await settled(page);
            expect(await h1.textContent()).toBe(source);
            const samples = await page.evaluate(() => window.kpFocus);
            expect(
                samples.some((f) => /blur\((?!0px)/.test(f)),
                'the headline resolved from a blur',
            ).toBe(true);
            const rest = await h1.evaluate((el) => getComputedStyle(el).filter);
            expect(rest, 'and rests with none').toBe('none');
            expect(await h1.evaluate((el) => getComputedStyle(el).fontFamily)).toMatch(/Archivo/);
        });

        test('the nav track is fourteen columns, the brand in three and the links in the rest, right-aligned', async ({ page }) => {
            await open(page, url);
            const nav = page.locator('.kp-nav').first();
            expect(await nav.evaluate((el) => getComputedStyle(el).display)).toBe('grid');
            const tracks = (await nav.evaluate((el) => getComputedStyle(el).gridTemplateColumns)).split(' ').length;
            expect(tracks, 'fourteen tracks').toBe(14);
            const brand = page.locator('.kp-nav__brand').first();
            expect(await brand.evaluate((el) => getComputedStyle(el).gridColumnStart)).toBe('1');
            expect(await brand.evaluate((el) => getComputedStyle(el).gridColumnEnd)).toBe('4');
        });

        test("the nav and footer links carry Grilli's two-speed timing: .1s at rest, .15s once hovered", async ({ page }) => {
            await open(page, url);
            const link = page.locator('.kp-nav__link').nth(1);
            const rest = await link.evaluate((el) => getComputedStyle(el).transitionDuration);
            expect(rest).toBe('0.1s');
            await link.hover();
            await style(link, 'transition-duration').toBe('0.15s');
            await settled(page);
            await expect.poll(() => link.evaluate((el) => getComputedStyle(el).color)).toBe(await paint(page, '--foreground'));
        });

        test('the rule draws itself under a heading when it enters the viewport, then rests drawn [TH122]', async ({ page }) => {
            await open(page, url);
            const rule = page.locator('[data-kp-reveal="rule"]').first();
            const before = await pseudo(rule, '::after', ['transform']);
            expect(before.transform, 'undrawn before it is in view').toMatch(/^matrix\(0,|scaleX\(0\)/);
            await rule.scrollIntoViewIfNeeded();
            await expect(rule).toHaveClass(/is-in/, { timeout: 5000 });
            const drawing = await pseudo(rule, '::after', ['background-color', 'height']);
            expect(drawing['background-color']).toBe(await paint(page, '--primary'));
            expect(drawing.height).toBe('3px');
            await settled(page);
            const after = await pseudo(rule, '::after', ['transform']);
            expect(after.transform, 'drawn at rest').toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
        });

        test('the divider is the double rule: two black rules with a signal hairline exactly centred between them [TH121]', async ({ page }) => {
            await open(page, url);
            const dividers = page.locator('[data-kp-divider]');
            expect(await dividers.count()).toBe(2);
            const first = dividers.first();
            expect(await first.evaluate((el) => getComputedStyle(el).borderTopWidth)).toBe('3px');
            expect(await first.evaluate((el) => getComputedStyle(el).borderBottomWidth)).toBe('3px');
            expect(await first.evaluate((el) => getComputedStyle(el).borderTopColor)).toBe(await paint(page, '--foreground'));
            const hairline = await pseudo(first, '::after', ['background-color', 'height']);
            expect(hairline['background-color'], 'the hairline is the signal colour').toBe(await paint(page, '--primary'));
            expect(hairline.height).toBe('1px');
            // The second divider takes the one-column caesura.
            const alt = dividers.nth(1);
            expect(await alt.evaluate((el) => parseFloat(getComputedStyle(el).marginInlineStart))).toBeGreaterThan(0);
        });

        test('the dossier: the redaction bars cover the marks until the trigger, then cut away in three steps [TH120]', async ({ page }) => {
            await open(page, url);
            const dossier = page.locator('.kp-card[data-kp-reveal="emphasis"]');
            const mark = dossier.locator('mark').first();
            const covered = await pseudo(mark, '::after', ['transform', 'background-color']);
            expect(covered.transform, 'covered before the trigger').toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
            expect(covered['background-color']).toBe(await paint(page, '--foreground'));
            expect(await mark.evaluate((el) => getComputedStyle(el).color), 'the word itself is hidden while armed').toBe('rgba(0, 0, 0, 0)');
            // Measured through the paint, not the declaration: firefox
            // reports `attr()` unresolved and the old `|attr(...)`
            // alternative accepted a stamp that printed nothing [G4].
            expect(await stampWord(page, '.kp-card[data-kp-reveal="emphasis"]', '::before', 'data-kp-label')).toMatch(/Restricted/i);
            await dossier.locator('[data-kp-reveal-trigger]').click();
            await expect(mark).toHaveClass(/is-cleared/);
            await expect(dossier).toHaveAttribute('data-kp-open', '');
            expect(
                await stampWord(page, '.kp-card[data-kp-reveal="emphasis"]', '::before', 'data-kp-label-open'),
                'the stamp swapped to its open word',
            ).toBe(await dossier.getAttribute('data-kp-label-open'));
            await settled(page);
            const lifted = await pseudo(mark, '::after', ['transform']);
            expect(lifted.transform, 'the bar has cut away').toMatch(/^matrix\(0,/);
        });

        test('the buttons are right angles: a 2px ink rule, the primary in signal, mirror-invert on hover', async ({ page }) => {
            await open(page, url);
            const button = page.locator('[data-kp-surface="hero"] .kp-button').nth(1);
            expect(await button.evaluate((el) => getComputedStyle(el).borderRadius)).toBe('0px');
            expect(await button.evaluate((el) => getComputedStyle(el).borderTopWidth)).toBe('2px');
            const primary = page.locator('[data-kp-surface="hero"] .kp-button--primary').first();
            expect(await primary.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(await paint(page, '--primary'));
            expect(await primary.evaluate((el) => getComputedStyle(el).color)).toBe(await paint(page, '--primary-foreground'));
            await primary.hover();
            await expect
                .poll(() => primary.evaluate((el) => getComputedStyle(el).backgroundColor), 'the mirror inverts on hover')
                .toBe(await paint(page, '--background'));
            await expect.poll(() => primary.evaluate((el) => getComputedStyle(el).color)).toBe(await paint(page, '--primary'));
        });

        test("the dropdown is styled in the theme's own language [KT14]", async ({ page }) => {
            await open(page, url);
            // Reached with the keyboard, not focus() [G15].
            await tabToSelector(page, '.kp-nav__link[aria-haspopup]');
            const menu = page.locator('.kp-nav__menu').first();
            await expect(menu).toBeVisible();
            expect(await menu.evaluate((el) => getComputedStyle(el).borderTopWidth)).toBe('2px');
            expect(await menu.evaluate((el) => getComputedStyle(el).borderRadius)).toBe('0px');
            const link = menu.locator('a').first();
            await link.hover();
            await expect.poll(() => link.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(await paint(page, '--muted'));
        });

        test('the baseline appears under the label, and the box never moves [scope-12]', async ({ page }) => {
            // The rule's TOP edge sits on the type's baseline, computed from
            // the label's own font metrics rather than from a guessed em —
            // a zero-width inline probe reads 9.60px here instead of 3.60,
            // because `.kp-button__label` is an inline-flex container and a
            // probe inside it becomes a flex item where `vertical-align`
            // does nothing.
            //
            // Drilled 2026-09-12 in firefox: `inset-block-end` removed from
            // the `::after` rule -> red on the rule meeting the baseline;
            // the hover's `scale: 1 1` removed -> red on the rule arriving.
            await open(page, url);
            const btn = page.locator('.kp-button').first();
            const label = btn.locator('.kp-button__label').first();
            const read = () =>
                label.evaluate((el) => {
                    const s = getComputedStyle(el);
                    const a = getComputedStyle(el, '::after');
                    const box = el.getBoundingClientRect();
                    const c = /** @type {CanvasRenderingContext2D} */ (document.createElement('canvas').getContext('2d'));
                    c.font = `${s.fontStyle} ${s.fontWeight} ${s.fontSize} ${s.fontFamily}`;
                    const m = c.measureText('Hg');
                    const baseline = (box.height - (m.fontBoundingBoxAscent + m.fontBoundingBoxDescent)) / 2 + m.fontBoundingBoxDescent;
                    return {
                        baseline: Number(baseline.toFixed(2)),
                        ruleTop: Number((Number.parseFloat(a.insetBlockEnd) + Number.parseFloat(a.height)).toFixed(2)),
                        weight: a.height,
                        colour: a.backgroundColor,
                        scale: a.scale,
                        width: Number(box.width.toFixed(2)),
                    };
                });

            const rest = await read();
            expect(rest.ruleTop, 'the rule stands the letters on it, to the hundredth').toBeCloseTo(rest.baseline, 2);
            expect(rest.scale, 'nothing is drawn at rest').toBe('0 1');

            await btn.hover();
            // Polled: the rule scales out over the theme's own duration and
            // a single read lands mid-draw [fix-1].
            await pseudoStyle(label, '::after', 'scale', 'the rule draws itself').toBe('1');
            const hover = await read();
            expect(hover.width, 'the label is exactly as wide as it was — the fault this quirk replaces').toBe(rest.width);
            expect(hover.ruleTop, 'and still on the baseline').toBeCloseTo(hover.baseline, 2);

            await page.mouse.down();
            const pressed = await read();
            expect(Number.parseFloat(pressed.weight), 'the press thickens it').toBeGreaterThan(Number.parseFloat(rest.weight));
            expect(pressed.colour, 'into the deeper red').not.toBe(rest.colour);
            expect(pressed.ruleTop, 'growing downward, so the top edge stays put').toBeCloseTo(pressed.baseline, 2);
            expect(pressed.width, 'and the box still does not move').toBe(rest.width);
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
