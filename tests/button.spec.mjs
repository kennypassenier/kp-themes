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

const FIXTURE = '/tests/fixtures/button.html';

/** @type {string[]} */
const THEMES = JSON.parse(readFileSync(new URL('../themes/order.json', import.meta.url), 'utf8'));

/** The 24px WCAG 2.5.8 asks of a pointer target — the floor css/_density.css already holds. */
const TARGET_FLOOR = 24;

/**
 * Reach an element with the keyboard.
 *
 * `element.focus()` does not make `:focus-visible` match in either
 * browser, and `:focus-visible` is the whole selector under test, so the
 * ring has to be reached the way a keyboard user reaches it.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} testId
 */
async function tabTo(page, testId) {
    const selector = `[data-test="${testId}"]`;
    for (let i = 0; i < 40; i++) {
        await page.keyboard.press('Tab');
        if (await page.evaluate((s) => document.activeElement?.matches(s) ?? false, selector)) return;
    }
    throw new Error(`could not reach ${selector} with Tab`);
}

/** @param {import('@playwright/test').Page} page @param {string} theme */
const wearTheme = (page, theme) => page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);

/**
 * Split a computed `box-shadow` into its layers. Commas inside `rgb(…)`
 * are not layer separators, which is why this is not `split(',')`.
 *
 * @param {string} value
 * @returns {string[]}
 */
function shadowLayers(value) {
    if (!value || value === 'none') return [];
    /** @type {string[]} */
    const out = [];
    let depth = 0;
    let start = 0;
    for (let i = 0; i < value.length; i++) {
        if (value[i] === '(') depth++;
        else if (value[i] === ')') depth--;
        else if (value[i] === ',' && depth === 0) {
            out.push(value.slice(start, i).trim());
            start = i + 1;
        }
    }
    out.push(value.slice(start).trim());
    return out.filter(Boolean);
}

/** Every length in one shadow layer, in px. @param {string} layer */
const lengths = (layer) => [...layer.matchAll(/(-?[\d.]+)px/g)].map((m) => Number(m[1]));

/**
 * What a focused element paints as its focus indicator, and the colours
 * the theme declares for the two halves.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} testId
 */
const indicator = (page, testId) =>
    page.evaluate((id) => {
        const el = /** @type {HTMLElement} */ (document.querySelector(`[data-test="${id}"]`));
        const s = getComputedStyle(el);
        // --focus-ring is authored as hsl() and a computed box-shadow is
        // rgb(): comparing the two as strings never matches, so the token
        // is resolved through a probe before it is compared. The first
        // version of this test skipped that and could not have gone green.
        const probe = document.createElement('span');
        probe.style.color = 'var(--focus-ring)';
        document.body.append(probe);
        const ring = getComputedStyle(probe).color;
        probe.remove();
        return {
            focused: el === document.activeElement,
            outlineStyle: s.outlineStyle,
            outlineWidth: Number.parseFloat(s.outlineWidth),
            boxShadow: s.boxShadow,
            ring,
        };
    }, testId);

/**
 * The pixels the focus indicator actually paints AROUND an element.
 *
 * Computed style still reports an outline that a `clip-path` has clipped
 * away, which is how AR30's `green 784 -> 0` was found — so this counts
 * paint. It screenshots the element with a 12px band around it, throws
 * away everything inside the element's own box, and counts what is left
 * in --focus-ring. The PNG is decoded in the page: a canvas is a decoder
 * that is already there, and T16 forbids a new dev dependency.
 *
 * Only --focus-ring, never --focus-ring-contrast: the outer half is the
 * theme's BACKGROUND colour, so counting it counts the page as well.
 * Measured both ways while this was written — with the contrast colour in,
 * a fully clipped button still scored 1957.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} testId
 * @returns {Promise<number>}
 */
async function paintedFocusPixels(page, testId) {
    await tabTo(page, testId);
    // The theme switch above transitions background-color for --fx-duration;
    // a screenshot taken mid-transition measures the transition.
    await page.waitForTimeout(400);
    const box = await page.locator(`[data-test="${testId}"]`).boundingBox();
    if (!box) throw new Error(`${testId} has no box`);
    const pad = 12;
    const clip = {
        x: Math.round(box.x - pad),
        y: Math.round(box.y - pad),
        width: Math.round(box.width + pad * 2),
        height: Math.round(box.height + pad * 2),
    };
    const ring = await page.evaluate(() => {
        const probe = document.createElement('span');
        probe.style.color = 'var(--focus-ring)';
        document.body.append(probe);
        const value = getComputedStyle(probe).color;
        probe.remove();
        return value;
    });
    const shot = await page.screenshot({ clip });
    return page.evaluate(
        async ([data, colour, geometry]) => {
            /** @type {HTMLImageElement} */
            const img = await new Promise((resolve, reject) => {
                const image = new Image();
                image.onload = () => resolve(image);
                image.onerror = reject;
                image.src = `data:image/png;base64,${data}`;
            });
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = /** @type {CanvasRenderingContext2D} */ (canvas.getContext('2d'));
            ctx.drawImage(img, 0, 0);
            const px = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
            const want = (colour.match(/\d+/g) ?? []).slice(0, 3).map(Number);
            // The screenshot is in device pixels; the box is in CSS pixels.
            const scale = canvas.width / geometry.clipWidth;
            let painted = 0;
            for (let y = 0; y < canvas.height; y++) {
                for (let x = 0; x < canvas.width; x++) {
                    const cx = x / scale;
                    const cy = y / scale;
                    const inside =
                        cx >= geometry.pad && cx < geometry.pad + geometry.width && cy >= geometry.pad && cy < geometry.pad + geometry.height;
                    if (inside) continue;
                    const i = (y * canvas.width + x) * 4;
                    // A tolerance of 12, because the ring is antialiased
                    // against the ground at both of its edges.
                    if (Math.abs(px[i] - want[0]) < 12 && Math.abs(px[i + 1] - want[1]) < 12 && Math.abs(px[i + 2] - want[2]) < 12) {
                        painted++;
                    }
                }
            }
            return painted;
        },
        [shot.toString('base64'), ring, { pad, width: box.width, height: box.height, clipWidth: clip.width }],
    );
}

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

                // The outer half: an outline in --focus-ring-contrast.
                const outer = found.outlineStyle !== 'none' && found.outlineWidth >= 2;
                // The inner half: a box-shadow layer in --focus-ring with a
                // real SPREAD. `0px 0px 0px 0px` is a layer that paints
                // nothing, and that is exactly what the layer collision left.
                // The spread rather than any length, because brutalism's
                // offset shadow is 4px 4px in a colour that happens to equal
                // its --focus-ring: an offset is not a ring.
                const inner = shadowLayers(found.boxShadow).some((layer) => {
                    const px = lengths(layer);
                    return layer.includes(found.ring) && px.length >= 4 && px[3] >= 2;
                });
                if (!outer || !inner) {
                    broken.push(`${theme}: outline ${found.outlineStyle} ${found.outlineWidth}px, shadow ${found.boxShadow}`);
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
    for (const theme of ['formal', 'cyberpunk']) {
        test(`the focus indicator still paints pixels on .kp-button under ${theme} [TH110, AR30]`, async ({ page }) => {
            await wearTheme(page, theme);
            const painted = await paintedFocusPixels(page, 'plain-md');
            expect(painted, `${theme}: the focus indicator painted ${painted} pixels`).toBeGreaterThan(0);
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
