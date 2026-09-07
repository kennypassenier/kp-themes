// The button: the two-part focus ring, the register, and the size scale
// [AR30, TH110, TH111].
//
// Three separate faults, three separate measurements:
//
//   (a) the ring    — `.kp-button` set its own `box-shadow` in
//                     @layer kp.components and the later layer replaced
//                     the inner half of the ring `:focus-visible` paints
//                     in @layer kp.base. Half a ring in all 24 themes.
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
import { bothHalves, indicator, paintedFocusDelta, tabTo, wearTheme } from './ring.mjs';

const FIXTURE = '/tests/fixtures/button.html';

/** @type {string[]} */
const THEMES = JSON.parse(readFileSync(new URL('../themes/order.json', import.meta.url), 'utf8'));

/** The 24px WCAG 2.5.8 asks of a pointer target — the floor css/_density.css already holds. */
const TARGET_FLOOR = 24;

/** @param {import('@playwright/test').Page} page @param {string} testId */
const shape = (page, testId) =>
    page.evaluate((id) => {
        const s = getComputedStyle(/** @type {Element} */ (document.querySelector(`[data-test="${id}"]`)));
        return { borderRadius: s.borderTopLeftRadius, backgroundImage: s.backgroundImage, clipPath: s.clipPath };
    }, testId);

/** @param {import('@playwright/test').Page} page @param {string} testId */
const metrics = (page, testId) =>
    page.evaluate((id) => {
        const el = /** @type {HTMLElement} */ (document.querySelector(`[data-test="${id}"]`));
        const s = getComputedStyle(el);
        return {
            height: el.getBoundingClientRect().height,
            minHeight: Number.parseFloat(s.minHeight),
            fontSize: Number.parseFloat(s.fontSize),
        };
    }, testId);

test.describe('the button', () => {
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
    // 24 themes are named. That is what the released package paints, and it
    // is the state this test was watched failing in before the rule was
    // written (rule 8).
    for (const [channel, id] of [
        ['framework-free', 'plain-md'],
        ['React', 'react-md'],
    ]) {
        test(`both halves of the focus ring reach .kp-button in all 24 themes, ${channel} [AR30]`, async ({ page }) => {
            await tabTo(page, id);
            /** @type {string[]} */
            const broken = [];
            for (const theme of THEMES) {
                await wearTheme(page, theme);
                const found = await indicator(page, id);
                expect(found.focused, `${theme}: the keyboard lost the button`).toBe(true);

                // The outer half is an outline in --focus-ring-contrast,
                // the inner one a box-shadow layer in --focus-ring with a
                // real spread: `0px 0px 0px 0px` is a layer that paints
                // nothing, and that is exactly what the layer collision left.
                const { outer, inner, changed } = bothHalves(found);
                if (!outer || !inner || !changed) {
                    const why = !changed ? 'focus changes nothing' : 'half a ring';
                    broken.push(`${theme}: ${why} — outline ${found.outlineStyle} ${found.outlineWidth}px, shadow ${found.boxShadow}`);
                }
            }
            expect(broken, `half a ring in:\n${broken.join('\n')}`).toEqual([]);
        });
    }

    // ── (b) The register ──────────────────────────────────────────────
    //
    // Drill [KT3]: `.kp-button` removed from the CP-C1 radius selector and
    // the CP-F2 gradient selector in css/cyberpunk-register.css — the
    // corner reads 4px where 0px is expected, in both channels and both
    // browsers. That is the state of the released package (rule 8).
    for (const [channel, id] of [
        ['framework-free', 'plain-md'],
        ['React', 'react-md'],
    ]) {
        test(`the cyberpunk register reaches .kp-button, ${channel} [TH110, AR30]`, async ({ page }) => {
            await wearTheme(page, 'formal');
            const plain = await shape(page, id);
            await wearTheme(page, 'cyberpunk');
            const punk = await shape(page, id);

            expect(punk.borderRadius, 'the register squares the corner').not.toBe(plain.borderRadius);
            expect(punk.borderRadius).toBe('0px');
            expect(punk.backgroundImage, 'the charge gradient').toContain('gradient');
            expect(plain.backgroundImage).toBe('none');
        });
    }

    // The half of AR30 that the drafted TH110 would have destroyed: the
    // register's clip-path clips the indicator away with the corner.
    // Drill [KT3]: `clip-path` added to the register's `.kp-button` rule —
    // "cyberpunk: the focus indicator painted 0 pixels" in both browsers,
    // with formal untouched. AR30 measured the same collapse as 784 -> 0.
    // Amended at MR-NOTCH, 2026-09-07: cyberpunk's ring moved inside the
    // button so the bevel could come back, so that is where it is counted.
    // Counting outside would now read zero on a ring that is plainly
    // there — and counting inside on formal would read the button's own
    // fill, so each theme is asked the question it actually answers.
    // And it asks for the DIFFERENCE focus makes, not a bare count. The
    // first version of this assertion counted inside the box and passed
    // with its own rule deleted: 171 of cyberpunk's gradient pixels are
    // already ring-coloured, and `> 0` was satisfied by those alone.
    // Drill [KT3], on the assertion as it now stands: the `:focus-visible`
    // rule removed from the register — 1591 -> 171 focused, so a delta of
    // 1420 -> 0, in both browsers.
    for (const [theme, where] of [
        ['formal', 'outside'],
        ['cyberpunk', 'inside'],
    ]) {
        test(`the focus indicator still paints pixels on .kp-button under ${theme} [TH110, AR30]`, async ({ page }) => {
            await wearTheme(page, theme);
            await tabTo(page, 'plain-md');
            const { focused, idle, delta } = await paintedFocusDelta(page, 'plain-md', { where });
            expect(delta, `${theme}: focus added ${delta} ring pixels (focused ${focused}, at rest ${idle})`).toBeGreaterThan(100);
        });
    }

    // ── (c) The size scale ────────────────────────────────────────────
    //
    // Drill [KT3]: the `.kp-button--sm` and `.kp-button--lg` blocks removed
    // from css/components.css — "formal: 36.0 / 36.0 / 36.0", all 24 themes
    // named, in both channels and both browsers.
    for (const [channel, prefix] of [
        ['framework-free', 'plain'],
        ['React', 'react'],
    ]) {
        test(`the three sizes differ in height in all 24 themes, ${channel} [TH111]`, async ({ page }) => {
            /** @type {string[]} */
            const flat = [];
            for (const theme of THEMES) {
                await wearTheme(page, theme);
                const [sm, md, lg] = await Promise.all([metrics(page, `${prefix}-sm`), metrics(page, `${prefix}-md`), metrics(page, `${prefix}-lg`)]);
                if (!(sm.height < md.height && md.height < lg.height)) {
                    flat.push(`${theme}: ${sm.height.toFixed(1)} / ${md.height.toFixed(1)} / ${lg.height.toFixed(1)}`);
                }
            }
            expect(flat, `the sizes do not separate in:\n${flat.join('\n')}`).toEqual([]);
        });
    }

    // Drill [KT3]: `--kp-button-height-sm`'s default in css/components.css
    // replaced by 1rem — "formal sm: 25.6px rendered, 16.0px declared", in
    // both browsers and both channels. The declared floor is measured
    // beside the rendered one for that reason: the label kept the box above
    // 24px while the rule under it had fallen through.
    for (const [channel, prefix] of [
        ['framework-free', 'plain'],
        ['React', 'react'],
    ]) {
        test(`no size renders under the 24px pointer target in any theme, ${channel} [TH111]`, async ({ page }) => {
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
});
