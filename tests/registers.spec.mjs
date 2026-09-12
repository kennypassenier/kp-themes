// A register decorates around the boundary, never instead of it [TH87].
//
// The retro register draws a two-tone bevel inside every control. The
// gates measure the token source and cannot see a stylesheet that
// repaints a border; this test reads the painted border and the painted
// ground of a control on the retro fixture and holds them at 3:1 (DI1),
// with the register loaded.

import { readdirSync } from 'node:fs';
import { test, expect } from '@playwright/test';
import { measured } from './paint.mjs';
import { contrast } from '../gates/colour.mjs';

/** @param {string} rgb */
const parse = (rgb) => {
    // A relative colour (`hsl(from …)`) computes to `color(srgb r g b [/ a])`.
    const srgb = /color\(srgb ([\d.]+) ([\d.]+) ([\d.]+)(?: \/ ([\d.]+))?/.exec(rgb);
    const m = srgb
        ? [srgb[0], ...srgb.slice(1, 4).map((v) => String(Math.round(Number(v) * 255))), srgb[4]]
        : /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?/.exec(rgb);
    if (!m) throw new Error(`not a colour: ${rgb}`);
    // A transparent border is no boundary at all; the first drill of this
    // test read rgba(0, 0, 0, 0) as black and passed, which is the
    // opposite of what it measures.
    if (m[4] !== undefined && Number(m[4]) < 1) throw new Error(`a see-through boundary: ${rgb}`);
    return [Number(m[1]), Number(m[2]), Number(m[3])];
};

for (const control of ['.kp-button', '.kp-field__input']) {
    test(`the retro register keeps DI1 on ${control} [TH87]`, async ({ page }) => {
        await page.goto('/showcase/themes/retro.html');
        await page.waitForSelector(control);
        const painted = await page.evaluate((selector) => {
            const el = document.querySelector(selector);
            const style = getComputedStyle(el);
            const ground = getComputedStyle(el.parentElement);
            return {
                border: style.borderTopColor,
                shadows: style.boxShadow,
                ground: ground.backgroundColor === 'rgba(0, 0, 0, 0)' ? getComputedStyle(document.body).backgroundColor : ground.backgroundColor,
            };
        }, control);
        // The register is on: a bevel is painted.
        expect(painted.shadows).toContain('inset');
        // And the boundary is still the gated one. Drill [KT3]: with
        // `border-color: transparent` added to the register's control
        // rule, the border reads rgba(0, 0, 0, 0) and parse() throws —
        // the first version of parse() read that as black and stayed
        // green, so the drill earned its keep on the test itself.
        const ratio = contrast(parse(painted.border), parse(painted.ground));
        expect(ratio, `${control} border ${painted.border} on ${painted.ground}`).toBeGreaterThanOrEqual(3);
    });
}

// fix-12 — pressing a button changes what it paints, in every theme.
//
// `@layer kp.base, kp.components, kp.register, …` means a layer beats a
// state: a register's `.kp-button:hover { background: … }` outranks the
// components layer's `.kp-button:active`, and the button then stops
// reacting to being held down — while the pointer is on it, which is the
// only time anyone presses it. Kenny found it on shade-dark, 2026-09-11:
// "als ik gewoon blijf klikken op de knop zelf, dan gebeurt er precies
// niks... bij shade light werkt het wel precies".
//
// `gates/check-pressed-state.mjs` holds the shape. This reads the paint,
// which is the half a source gate cannot see [KT13].
//
// Drilled 2026-09-12 in firefox: the restored
// `[data-theme='terminal'] .kp-button--primary:active` rule removed →
// red on terminal. Restored green.
const THEMES = readdirSync(new URL('../showcase/themes/', import.meta.url))
    .filter((n) => n.endsWith('.html'))
    .map((n) => n.slice(0, -'.html'.length));

// Phase 7 widened this from one selector to the three the gate names.
// gates/check-pressed-state.mjs guards `.kp-button`, `.kp-button--primary`
// and `.kp-button--destructive`; this read only the primary — while the
// fault Kenny reported was the plain one: "als ik gewoon blijf klikken op
// de knop zelf, dan gebeurt er precies niks". The gate is presence-only
// (an `:active` rule that paints nothing satisfies it), so the paint half
// was the only thing that could see a button that does not react, and it
// was not looking at the button he meant.
const PRESSED = ['.kp-button--primary', '.kp-button', '.kp-button--destructive'];

for (const theme of THEMES) {
    for (const selector of PRESSED) {
        test(`${selector} reacts to being pressed under ${theme} [fix-12]`, async ({ page }) => {
            await page.goto(`/showcase/themes/${theme}.html`);
            // The plain selector matches the variants too, so take one that
            // carries no variant class — that is the control Kenny pressed.
            const button =
                selector === '.kp-button' ? page.locator('.kp-button:not([class*="kp-button--"])').first() : page.locator(selector).first();
            if ((await button.count()) === 0) test.skip(true, `${theme}'s showcase page carries no ${selector}`);
            await button.scrollIntoViewIfNeeded();
            // Everything a press is allowed to change, in one vector. Reading
            // only `background-color` called retro red on 2026-09-12: that theme
            // presses by inverting its bevel and shifting its padding, which is
            // a reaction the narrower question could not see.
            const paint = () =>
                button.evaluate((el) => {
                    const s = getComputedStyle(el);
                    // `transform` and `translate` are different properties
                    // and a theme may press with either; a press may also
                    // land on a pseudo-element or on the label rather than
                    // on the control (nostromo lights a lamp, grotesk
                    // thickens the baseline). Reading only `translate` on
                    // the element called five themes red in Phase 7 that
                    // press perfectly well — the absence of a value read as
                    // the value, a fourth time in this round.
                    const before = getComputedStyle(el, '::before');
                    const label = el.querySelector('.kp-button__label');
                    return [
                        s.backgroundColor,
                        s.boxShadow,
                        s.translate,
                        s.transform,
                        s.paddingBlockStart,
                        s.paddingInlineStart,
                        s.borderColor,
                        s.color,
                        `${before.opacity} ${before.backgroundColor} ${before.transform}`,
                        label === null ? '' : getComputedStyle(label).getPropertyValue('--kp-baseline-weight'),
                    ].join(' | ');
                });
            await button.hover();
            // Let the hover settle before taking the baseline: read too early and
            // the baseline is the RESTING paint, which the press then differs
            // from for the wrong reason [fix-1].
            await page.waitForTimeout(260);
            const hovered = await paint();
            await page.mouse.down();
            try {
                await measured(
                    button,
                    (el) => {
                        const s = getComputedStyle(el);
                        const before = getComputedStyle(el, '::before');
                        const label = el.querySelector('.kp-button__label');
                        return [
                            s.backgroundColor,
                            s.boxShadow,
                            s.translate,
                            s.transform,
                            s.paddingBlockStart,
                            s.paddingInlineStart,
                            s.borderColor,
                            s.color,
                            `${before.opacity} ${before.backgroundColor} ${before.transform}`,
                            label === null ? '' : getComputedStyle(label).getPropertyValue('--kp-baseline-weight'),
                        ].join(' | ');
                    },
                    undefined,
                    `${theme}: held down, the button paints exactly as it did hovered`,
                ).not.toBe(hovered);
            } finally {
                await page.mouse.up();
            }
        });
    }
}

// gap-1 — the destructive alert's ink sits on the plate it was drawn for.
//
// The components layer defines a coloured variant as a pair: the plate and
// the ink meant for it. A register painting `.kp-alert` — the base class,
// every variant included — replaces the plate from a later layer and leaves
// the ink pointing at nothing. Kenny saw it in chassis-rs on 2026-09-10:
// "wit op wit". Measured in firefox on 2026-09-12, before the repair,
// seventeen of the twenty-two themes were unreadable and grotesk was
// exactly 1.00.
//
// `gates/check-variant-ground.mjs` holds the shape. This reads the paint,
// which is the half a source gate cannot see [KT13].
//
// Drilled 2026-09-12 in firefox: the `:not([class*='kp-alert--'])` removed
// from css/grotesk-register.css and the bundle regenerated → red on
// grotesk alone, at 1.00. Restored green.
for (const theme of THEMES) {
    test(`the destructive alert can be read under ${theme} [gap-1]`, async ({ page }) => {
        await page.goto(`/showcase/themes/${theme}.html`);
        const alert = page.locator('.kp-alert--destructive').first();
        await alert.scrollIntoViewIfNeeded();
        const painted = await alert.evaluate((el) => {
            const s = getComputedStyle(el);
            // The ground the words actually stand on, not the one the
            // element declares: a transparent alert shows what is behind it.
            let node = /** @type {HTMLElement} */ (el);
            let bg = s.backgroundColor;
            while (bg === 'rgba(0, 0, 0, 0)' && node.parentElement) {
                node = node.parentElement;
                bg = getComputedStyle(node).backgroundColor;
            }
            return { fg: s.color, bg };
        });
        expect(contrast(parse(painted.fg), parse(painted.bg)), `${painted.fg} on ${painted.bg}`).toBeGreaterThanOrEqual(4.5);
    });
}

// CP1 — the arrival answers a click anywhere, not only on Skip.
//
// Four themes build one: phantom (`card`), retro, terminal and synthwave
// (`boot`). The overlay is `position: fixed; inset: 0`, so until 6.0.0 it
// ate every click for up to 1100ms and only the Skip button ended it — a
// click elsewhere did nothing and gave no sign it had been lost.
// JobTracker reported that as "the theme picker does not work on phantom";
// the picker was fine. Kenny, 2026-09-09: remember it for the next
// version. This is that version.
//
// Drilled 2026-09-12 in firefox: the overlay's own listener removed from
// js/effects.js → red on all four, because the click lands and the
// overlay stays. Restored green.
for (const theme of ['phantom', 'retro', 'terminal', 'synthwave']) {
    test(`the arrival lets go of a click anywhere under ${theme} [CP1]`, async ({ page }) => {
        await page.emulateMedia({ reducedMotion: 'no-preference' });
        // The showcase page, which exists for every theme — synthwave has no
        // concept page, and pointing at one that 404s made this test measure
        // an empty document and call it a pass for three of four.
        await page.goto(`/showcase/themes/${theme}.html`);
        const overlay = page.locator('.kp-boot');
        await expect(overlay).toHaveCount(1);

        // What is measured is that the CLICK arrives, not that the overlay
        // eventually goes: every arrival ends on its own inside a second, so
        // waiting for it to vanish passed with the listener removed. `end()`
        // marks the overlay on the spot, and that mark is the click landing.
        const marked = await overlay.evaluate((el) => {
            const wasOff = el.classList.contains('is-off');
            // Anywhere that is not Skip: the overlay's own top-left corner.
            el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            return { wasOff, isOff: el.classList.contains('is-off') };
        });
        expect(marked.wasOff, 'the arrival is still running when the click lands').toBe(false);
        expect(marked.isOff, 'and a click that is not on Skip ends it').toBe(true);
    });
}

// gap-3 — synthwave's header stripe runs once across the row.
//
// Kenny, 2026-09-10: the gradients are beautiful, but in a table each
// `<th>` carried its own, and where two met the end of one butted against
// the start of the next. A `border-image` is painted per element by
// definition, so the seam was the mechanism working exactly as written.
//
// The showcase page, not the concept page: the concept demo carries no
// table, so this test skipped silently there — which is a pass that
// measures nothing.
//
// Drilled 2026-09-12 in firefox: the `thead tr` rule removed → red on the
// row carrying the stripe. Restored green.
test('the synthwave table header is one stripe, not one per cell [gap-3]', async ({ page }) => {
    await page.goto('/showcase/themes/synthwave.html');
    const table = page.locator('.kp-table').first();
    await table.scrollIntoViewIfNeeded();

    const cells = table.locator('th');
    const count = await cells.count();
    expect(count, 'a header with several cells is the case this is about').toBeGreaterThan(1);
    for (let i = 0; i < count; i++) {
        expect(await cells.nth(i).evaluate((el) => getComputedStyle(el).borderImageSource), `cell ${i} still paints its own ramp`).toBe('none');
    }

    const painted = await table
        .locator('thead tr')
        .first()
        .evaluate((el) => {
            const s = getComputedStyle(el);
            return { image: s.backgroundImage, size: s.backgroundSize, width: el.getBoundingClientRect().width };
        });
    expect(painted.image, 'the row carries the stripe').toMatch(/linear-gradient/);
    expect(painted.size, 'two pixels tall, the full width of the row').toBe('100% 2px');
    const oneCell = await cells.first().evaluate((el) => el.getBoundingClientRect().width);
    expect(painted.width, 'and the row is wider than any one cell, which is the whole point').toBeGreaterThan(oneCell);
});

// gap-2 — the theme picker sits in the same place in every theme.
//
// Kenny, 2026-09-10: it moves along the top bar from theme to theme.
// Measured 2026-09-12 in firefox at 1280px: 98px of vertical drift, from
// 359 under titanium to 457 under terminal — nearly three times the
// height of the control itself. A control reached by muscle memory should
// not depend on which theme is showing.
//
// The cause was never the picker. The showcase's own header wraps in
// whatever face and scale the document's theme sets, and everything below
// it moved with it. Its prose is the page speaking rather than a specimen,
// so it now carries the page's own measure and scale; the colours and the
// title keep the theme, which is what makes switching visible.
//
// Drilled 2026-09-12: `block-size: 4rem` removed from `.sc-header h1` →
// the spread goes back to 18px and this test is red.
test('the theme picker rests in the same place in every theme [gap-2]', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    /** @type {Array<[string, number, number]>} */
    const seen = [];
    for (const theme of THEMES) {
        await page.addInitScript((name) => {
            try {
                localStorage.setItem('theme', name);
            } catch {
                // no storage: the page keeps its served theme, and the
                // assertion below reports it as an outlier rather than
                // passing quietly
            }
        }, theme);
        await page.goto('/showcase/index.html');
        await page.waitForFunction((name) => document.documentElement.getAttribute('data-theme') === name, theme);
        const box = await page.locator('.kp-theme-menu').first().boundingBox();
        expect(box, `${theme}: the picker is on the page`).not.toBeNull();
        seen.push([theme, Math.round(box.y), Math.round(box.x)]);
    }
    // One theme is inset on purpose, and it is not drift.
    //
    // terminal draws a CRT bezel — a frame up to 18px wide, fixed against
    // the viewport — and since 2026-09-13 the theme reserves that space so
    // nothing sits behind it. Kenny's words at the release gate: "links
    // moeten compleet en klikbaar zijn". Before that, the site's first
    // navigation link started at 8px and lost 9.8 of them behind the frame,
    // and the approved demo hid its own skip link the same way.
    //
    // So terminal's picker really does rest further in than the others, by
    // exactly the frame it draws. That is a theme having a frame, not a
    // control wandering. It is named here with its measurement rather than
    // widened away, so the day terminal stops framing the page this line
    // fails and someone reads it.
    const FRAMED = { terminal: 18 };
    const INSET_REASON = 'terminal reserves the width of its own CRT bezel, measured 18px at 1600px and 18px at this width';

    const straight = seen.filter(([name]) => !(name in FRAMED));
    const ys = straight.map(([, y]) => y);
    const xs = straight.map(([, , x]) => x);
    const drift = Math.max(...ys) - Math.min(...ys);
    // Five pixels: retro's own type metrics put it four out, and a control
    // four pixels from where it was is a control you still hit.
    expect(drift, `vertical drift across ${straight.length} themes: ${JSON.stringify(straight)}`).toBeLessThanOrEqual(5);
    expect(Math.max(...xs) - Math.min(...xs), 'and sideways').toBeLessThanOrEqual(5);

    // And the framed one is inset by what it frames, no more and no less.
    const floor = Math.min(...ys);
    for (const [name, inset] of Object.entries(FRAMED)) {
        const row = seen.find(([theme]) => theme === name);
        expect(row, `${name} is in the sweep`).toBeTruthy();
        expect(row[1] - floor, `${name}: ${INSET_REASON}, so it should sit ${inset}px lower than the unframed themes`).toBeGreaterThanOrEqual(
            inset - 3,
        );
        expect(row[1] - floor, `${name} is inset by more than the frame it draws — something else moved it`).toBeLessThanOrEqual(inset + 3);
    }
});
