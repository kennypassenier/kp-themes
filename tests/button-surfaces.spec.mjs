// The two surfaces a theme may paint on [scope-16, scope-17, Kenny
// 2026-09-12]. Both approved concept demos of round seven put an oxide
// film along the control's edge and a small reading above it — one
// surface more than a button's two pseudo-elements can carry, since the
// spectral instrument already spends both on its brackets.
//
// What this holds is the part a register cannot: that adding them costs
// the other twenty-four themes nothing. Out of flow, invisible, and the
// control the same size it was.
//
// Drilled 2026-09-12 in firefox: `position: absolute` removed from the
// two-selector rule in css/components.css and the bundle regenerated ->
// red on the control keeping its size; `opacity: 0` removed from the
// readout -> red on it being invisible until a theme asks.
import { expect, test } from '@playwright/test';
import { measured } from './paint.mjs';

const CHANNELS = [
    ['framework-free', '/examples/concept-light.html'],
    ['React', '/tests/fixtures/examples.html?example=concept&copy=light'],
];

for (const [channel, url] of CHANNELS) {
    test(`the two surfaces cost the control nothing, ${channel} [scope-16]`, async ({ page }) => {
        await page.goto(url);
        const button = page.locator('.kp-button').first();
        await button.scrollIntoViewIfNeeded();

        const edge = button.locator('.kp-button__edge');
        expect(await edge.count(), 'every button carries the edge').toBe(1);

        // Out of flow: the label is the only thing setting the box.
        const box = await button.evaluate((el) => {
            const r = el.getBoundingClientRect();
            const label = /** @type {HTMLElement} */ (el.querySelector('.kp-button__label'));
            const l = label.getBoundingClientRect();
            // The PADDING box, which is what `inset: 0` resolves against.
            // Measured against the border box on the first run and it was
            // 2px out — the button's own 1px boundary on each side, which
            // the edge correctly does not cover.
            return {
                w: Number(r.width.toFixed(2)),
                h: Number(r.height.toFixed(2)),
                pw: el.clientWidth,
                ph: el.clientHeight,
                lw: Number(l.width.toFixed(2)),
            };
        });
        const painted = await edge.evaluate((el) => {
            const s = getComputedStyle(el);
            const r = el.getBoundingClientRect();
            return { position: s.position, events: s.pointerEvents, w: Number(r.width.toFixed(2)), h: Number(r.height.toFixed(2)) };
        });
        expect(painted.position, 'out of flow, so it cannot move the control').toBe('absolute');
        expect(painted.events, 'and it never takes a click').toBe('none');
        expect(painted.w, 'the edge covers the control it belongs to, inside its boundary').toBeCloseTo(box.pw, 0);
        expect(painted.h).toBeCloseTo(box.ph, 0);
        expect(box.pw, 'and that is inside the border box, not over it').toBeLessThan(box.w);
        expect(box.lw, 'the label still has the width it always had').toBeGreaterThan(0);
        expect(box.w, 'and the control is wider than its label, not the other way round').toBeGreaterThan(box.lw);
    });

    test(`a theme that paints neither sees nothing, ${channel} [scope-16]`, async ({ page }) => {
        await page.goto(url);
        const button = page.locator('.kp-button').first();
        await button.scrollIntoViewIfNeeded();
        // Light styles neither surface. The edge must therefore paint
        // nothing at all — no ground, no border, no shadow.
        await measured(
            button.locator('.kp-button__edge'),
            (el) => {
                const s = getComputedStyle(el);
                return [s.backgroundImage, s.backgroundColor, s.borderTopWidth, s.boxShadow].join(' | ');
            },
            undefined,
            'the edge is inert in a theme that does not style it',
        ).toBe('none | rgba(0, 0, 0, 0) | 0px | none');
    });
}
