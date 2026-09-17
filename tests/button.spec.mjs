// The button: the two-part focus ring, the register, and the size scale
// [AR30, TH110, TH111].
//
// Three separate faults, three separate measurements:
//
//   (a) the ring    — `.kp-button` set its own `box-shadow` in
//                     @layer kp.components and the later layer replaced
//                     the inner half of the ring `:focus-visible` paints
//                     in @layer kp.base. Half a ring in every theme.
//   (b) the register— every button rule in css/cyberpunk-register.css
//                     selected `[data-slot='button']`, which
//                     css/components.css never writes, so the register
//                     reached no button of this package's own.
//   (c) the sizes   — there was one size.
//
// The fixture loads the package's three stylesheets and nothing else, so
// nothing measured here can have come from the page (rule 7e, KT3).

import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
// The ring measurement lives in tests/ring.mjs since W4, because the
// assembly suite measures the same ring on the destructive item inside a
// row menu and two copies of it would drift apart.
import { tabTo, wearTheme, wholeRing } from './ring.mjs';

const FIXTURE = '/tests/fixtures/button.html';

/** @type {string[]} */
const THEMES = JSON.parse(readFileSync(new URL('../themes/order.json', import.meta.url), 'utf8'));

/** The 24px WCAG 2.5.8 asks of a pointer target — the floor css/_density.css already holds. */
const TARGET_FLOOR = 24;

/** @param {import('@playwright/test').Page} page @param {string} testId */
const metrics = (page, testId) =>
    page.evaluate((id) => {
        const el = /** @type {HTMLElement} */ (document.querySelector(`[data-test="${id}"]`));
        const s = getComputedStyle(el);
        return {
            height: el.getBoundingClientRect().height,
            minHeight: Number.parseFloat(s.minHeight),
            fontSize: Number.parseFloat(s.fontSize),
            padding: Number.parseFloat(s.paddingInlineStart) + Number.parseFloat(s.paddingInlineEnd),
        };
    }, testId);

test.describe('the button', { tag: ['@component:button'] }, () => {
    test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: 1280, height: 900 });
        await page.goto(FIXTURE);
        await page.waitForSelector('[data-test="react-md"]');
    });

    // ── (a) The ring ──────────────────────────────────────────────────
    //
    // Drill [KT3]: the `.kp-button:focus-visible` rule removed from
    // css/components.css — the box-shadow falls back to the brutalist
    // offset alone, `rgb(127, 138, 159) 0px 0px 0px 0px` in formal, and all
    // every theme is named. That is what the released package paints, and it
    // is the state this test was watched failing in before the rule was
    // written (rule 8).
    for (const [channel, id] of [
        ['framework-free', 'plain-md'],
        ['React', 'react-md'],
    ]) {
        test(`both halves of the focus ring reach .kp-button in every theme, ${channel} [AR30]`, { tag: ['@sweep'] }, async ({ page }) => {
            await tabTo(page, id);
            /** @type {string[]} */
            const broken = [];
            for (const theme of THEMES) {
                await wearTheme(page, theme);
                // Read until the ring is whole [fix-1]: the theme changed a
                // moment ago and the ring arrives through a transition.
                const { found, outer, inner, changed } = await wholeRing(page, id);
                expect(found.focused, `${theme}: the keyboard lost the button`).toBe(true);

                // The outer half is an outline in --focus-ring-contrast,
                // the inner one a box-shadow layer in --focus-ring with a
                // real spread: `0px 0px 0px 0px` is a layer that paints
                // nothing, and that is exactly what the layer collision left.
                if (!outer || !inner || !changed) {
                    const why = !changed ? 'focus changes nothing' : 'half a ring';
                    broken.push(`${theme}: ${why} — outline ${found.outlineStyle} ${found.outlineWidth}px, shadow ${found.boxShadow}`);
                }
            }
            expect(broken, `half a ring in:\n${broken.join('\n')}`).toEqual([]);
        });
    }

    // ── (c) The size scale ────────────────────────────────────────────
    //
    // Drill [KT3]: `--kp-button-height-sm`'s default in css/components.css
    // replaced by 1rem — "formal sm: 25.6px rendered, 16.0px declared", in
    // both browsers and both channels. The declared floor is measured
    // beside the rendered one for that reason: the label kept the box above
    // 24px while the rule under it had fallen through.
    for (const [channel, prefix] of [
        ['framework-free', 'plain'],
        ['React', 'react'],
    ]) {
        test(`no size renders under the 24px pointer target in any theme, ${channel} [TH111]`, { tag: ['@sweep'] }, async ({ page }) => {
            /** @type {string[]} */
            const tooSmall = [];
            for (const theme of THEMES) {
                await wearTheme(page, theme);
                for (const size of ['sm', 'md', 'lg']) {
                    const m = await metrics(page, `${prefix}-${size}`);
                    if (m.height < TARGET_FLOOR || m.minHeight < TARGET_FLOOR) {
                        tooSmall.push(`${theme} ${size}: ${m.height.toFixed(1)}px rendered, ${m.minHeight.toFixed(1)}px declared`);
                    }
                }
            }
            expect(tooSmall, `under ${TARGET_FLOOR}px in:\n${tooSmall.join('\n')}`).toEqual([]);
        });
    }

    // Each size reads the typography scale R0-TYPO declared, rather than a
    // literal of its own. Drill [KT3]: `--kp-text-sm` in the
    // `.kp-button--sm` rule replaced by the literal 0.8125rem — the small
    // button stops following the token and stays at 13px.
    test('the sizes follow the typography scale [TH111]', async ({ page }) => {
        const before = await Promise.all(['plain-sm', 'plain-md', 'plain-lg'].map((id) => metrics(page, id)));
        // Retuning the scale on the root is what a theme does; the buttons
        // that read it must move with it.
        await page.evaluate(() => {
            document.documentElement.style.setProperty('--kp-text-sm', '2rem');
            document.documentElement.style.setProperty('--kp-text-md', '2rem');
        });
        const after = await Promise.all(['plain-sm', 'plain-md', 'plain-lg'].map((id) => metrics(page, id)));
        expect(after[0].fontSize, 'the small button follows --kp-text-sm').toBeGreaterThan(before[0].fontSize);
        expect(after[2].fontSize, 'the large button follows --kp-text-md').toBeGreaterThan(before[2].fontSize);
    });

    // KT6: the size is a state the component sets on the consumer's behalf,
    // so it has a named way out. `size` defaults to 'md' and every step is
    // a --kp-* knob over the scale. Drill [KT3]: the --kp-button-height-lg
    // knob removed from css/components.css, leaving the derived value as a
    // fixed one — the large button stays at 44px in both browsers.
    test('the size scale is configurable [KT6, TH111]', async ({ page }) => {
        const before = await metrics(page, 'plain-lg');
        await page.evaluate(() => document.documentElement.style.setProperty('--kp-button-height-lg', '6rem'));
        const after = await metrics(page, 'plain-lg');
        expect(after.height).toBeGreaterThan(before.height);
        expect(after.minHeight).toBeCloseTo(96, 0);
    });

    // scope-83, retro-accelerator "Alleen het teken": a label beside an icon
    // shows retro's mark too. CSS cannot tell a text node from the icon
    // beside it, so the text is its own element, `.kp-button__text`: written
    // in the markup by a framework-free consumer, and by the React Button
    // itself around the text it is given beside an element. Before: the React
    // button rendered " Retry" as a bare text node and drew no mark.
    for (const [channel, id] of [
        ['framework-free', 'plain-icon'],
        ['React', 'react-icon'],
    ]) {
        test(`retro underlines the first letter of a label beside an icon, and not the icon, ${channel} [scope-83]`, async ({ page }) => {
            await page.waitForSelector(`[data-test="${id}"]`);
            await wearTheme(page, 'retro');
            const button = page.locator(`[data-test="${id}"]`);
            await button.hover();
            const read = await button.evaluate((el) => {
                const text = el.querySelector('.kp-button__text');
                const letter = text ? getComputedStyle(text, '::first-letter') : null;
                return {
                    text: text?.textContent,
                    drawn:
                        letter !== null &&
                        Number.parseFloat(letter.borderBottomWidth) >= 1 &&
                        letter.borderBottomColor === getComputedStyle(text).color,
                    shortcut: el.getAttribute('aria-keyshortcuts'),
                };
            });
            await page.mouse.move(0, 0);
            expect(read).toEqual({ text: 'Retry', drawn: true, shortcut: null });
            // No shortcut and no other name: the icon stays hidden, the name is the word.
            await expect(button).toHaveAccessibleName('Retry');
        });
    }
});
