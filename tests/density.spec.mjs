// The compact density mode [TH105].
//
// The fixture holds the same form and the same table twice; the only
// difference between the two blocks is `data-density="compact"`. So
// anything that measures differently came from the package, not from the
// page.
//
// Drilled per KT3: the removed rule is named above each test.

import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';

const FIXTURE = '/tests/fixtures/density.html';

/** @type {string[]} */
const THEMES = JSON.parse(readFileSync(new URL('../themes/order.json', import.meta.url), 'utf8'));

const heightOf = (page, name) => page.evaluate((n) => document.querySelector(`[data-test="${n}"]`).getBoundingClientRect().height, name);

test.describe('the compact density mode', () => {
    test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: 1280, height: 900 });
        await page.goto(FIXTURE);
    });

    // The table is the isolated measure of the spacing scale: it holds no
    // control, so its height moves only when --kp-space-* moves. Drill:
    // remove the --kp-space-* declarations from the compact block in
    // css/_density.css and the two tables measure the same. The first
    // version measured the whole block and stayed green under that drill,
    // because the control height alone still made the block shorter [KT3].
    test('the same table is shorter in every theme [TH105]', async ({ page }) => {
        /** @type {string[]} */
        const notShorter = [];
        for (const theme of THEMES) {
            await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);
            const roomy = await heightOf(page, 'roomy-table');
            const compact = await heightOf(page, 'compact-table');
            if (compact >= roomy) notShorter.push(`${theme} (${roomy.toFixed(0)} -> ${compact.toFixed(0)})`);
        }
        expect(notShorter, `compact is not shorter in: ${notShorter.join(', ')}`).toEqual([]);
    });

    // The form's own gap, not its height: the button inside it takes the
    // control floor down too, so a height comparison stayed green with
    // the --kp-space-* declarations removed and measured nothing [KT3].
    // The gap is the scale reaching .kp-form and .kp-field directly.
    // Drill: remove those declarations and both gaps stop moving.
    test('the form and field gaps come down with the scale [TH105]', async ({ page }) => {
        const gaps = (name) =>
            page.evaluate((n) => {
                const root = document.querySelector(`[data-test="${n}"]`);
                return {
                    form: Number.parseFloat(getComputedStyle(root).rowGap),
                    field: Number.parseFloat(getComputedStyle(root.querySelector('.kp-field')).rowGap),
                };
            }, name);
        const roomy = await gaps('roomy-form');
        const compact = await gaps('compact-form');
        expect(compact.form).toBeLessThan(roomy.form);
        expect(compact.field).toBeLessThan(roomy.field);
    });

    // Drill: set --kp-control-height in the compact block to 1rem and the
    // declared floor reads 16px.
    test('the compact control floor stays above the 24px pointer target [TH105]', async ({ page }) => {
        /** @type {string[]} */
        const tooSmall = [];
        for (const theme of THEMES) {
            await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);
            const declared = await page.evaluate(() =>
                Number.parseFloat(getComputedStyle(document.querySelector('[data-test="compact-button"]')).minHeight),
            );
            if (declared < 24) tooSmall.push(`${theme} (${declared.toFixed(1)}px)`);
        }
        expect(tooSmall, `the declared floor is under 24px in: ${tooSmall.join(', ')}`).toEqual([]);
    });

    // The rendered target, which is what WCAG 2.5.8 is actually about.
    // No drill in css/_density.css turns this red, and that is the
    // finding rather than a weakness: the compact block touches the
    // spacing scale and the control floor, and neither carries the
    // rendered height -- the button's own padding and line height do, and
    // compact leaves both alone. Measured at 33.2px against a 28px floor
    // and a 24px requirement [KT3].
    test('the rendered pointer target stays above 24px in every theme [TH105]', async ({ page }) => {
        /** @type {string[]} */
        const tooSmall = [];
        for (const theme of THEMES) {
            await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);
            const h = await heightOf(page, 'compact-button');
            if (h < 24) tooSmall.push(`${theme} (${h.toFixed(1)}px)`);
        }
        expect(tooSmall, `under the 24px floor in: ${tooSmall.join(', ')}`).toEqual([]);
    });

    // Drill: remove --kp-control-height from the compact block and the
    // control keeps its roomy height, so this reads no difference.
    test('the control height comes down but not below the floor [TH105]', async ({ page }) => {
        const roomy = await page.evaluate(() => document.querySelector('[data-test="roomy-button"]').getBoundingClientRect().height);
        const compact = await page.evaluate(() => document.querySelector('[data-test="compact-button"]').getBoundingClientRect().height);
        expect(compact).toBeLessThan(roomy);
        expect(compact).toBeGreaterThanOrEqual(24);
    });

    // Drill: remove the whole [data-density='compact'] block and the
    // knob resolves to nothing, so the override does nothing either.
    test('a consumer can retune the density through its knobs [TH105]', async ({ page }) => {
        const before = await heightOf(page, 'compact');
        await page.evaluate(() => {
            document.documentElement.style.setProperty('--kp-compact-md', '1.5rem');
            document.documentElement.style.setProperty('--kp-compact-sm', '1.5rem');
        });
        const after = await heightOf(page, 'compact');
        expect(after).toBeGreaterThan(before);
    });
});
