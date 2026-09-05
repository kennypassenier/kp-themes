// A register decorates around the boundary, never instead of it [TH87].
//
// The retro register draws a two-tone bevel inside every control. The
// gates measure the token source and cannot see a stylesheet that
// repaints a border; this test reads the painted border and the painted
// ground of a control on the retro fixture and holds them at 3:1 (DI1),
// with the register loaded.

import { test, expect } from '@playwright/test';
import { contrast } from '../gates/colour.mjs';

/** @param {string} rgb */
const parse = (rgb) => {
    const m = /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?/.exec(rgb);
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
