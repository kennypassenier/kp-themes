// The order of the layers, read off the paint [scope-103, KT13, AR17].
//
// `css/themes.css` declares the order once:
//
//     @layer kp.base, kp.components, kp.register, kp.layout, kp.utilities;
//
// and everything about which class wins follows from that one line. Three
// claims live in it, and until now none of them was measured as a claim:
//
//   1. a utility beats the layout layer — the utilities are last, which is
//      what lets `.kp-gap-lg` change a `.kp-stack` without `!important`;
//   2. the layout layer beats the component layer EVEN AT LOWER
//      SPECIFICITY — `css/layout.css` says so in its own words about
//      `.kp-text-end`: "a table cell sets its own alignment at higher
//      specificity, so before the cascade layers these two did nothing
//      inside a table";
//   3. the base layer's `[hidden] { display: none !important }` beats both,
//      because `!important` reverses the layer order. That rule is KT13's
//      remedy, and tests/hidden.spec.mjs measures it against layout and
//      component classes — never against a utility, the package's highest
//      layer and the one the correction's own fallback (§8) names as where
//      hiding would move to.
//
// A reordered layer statement, a stylesheet that forgets its `@layer`
// wrapper, or a rule moved from one file to another changes all of this
// silently: nothing errors, the page simply draws the other value. So this
// reads the paint, never the stylesheet.
//
// Drilled 2026-09-16 in firefox — see the note above each block.

import { expect, test } from '@playwright/test';

/** Loads themes, components, layout and utilities, and styles nothing itself. */
const PAGE = '/tests/fixtures/utilities.html';

/**
 * Build a probe in the page and report what the browser computes on it.
 *
 * @param {import('@playwright/test').Page} page
 * @param {{ html: string, read: string[], at?: string }} probe
 *   `html` is appended to `at` (the body by default) and the first
 *   `[data-probe]` inside it is measured.
 * @returns {Promise<Record<string, string>>}
 */
const paintOf = (page, probe) =>
    page.evaluate(({ html, read, at }) => {
        const host = at === undefined ? document.body : /** @type {HTMLElement} */ (document.querySelector(at));
        const holder = document.createElement('div');
        holder.innerHTML = html;
        host.append(holder);
        const element = /** @type {HTMLElement} */ (holder.querySelector('[data-probe]'));
        const style = getComputedStyle(element);
        /** @type {Record<string, string>} */
        const out = {};
        for (const property of read) out[property] = style.getPropertyValue(property);
        out['#height'] = String(element.getBoundingClientRect().height);
        holder.remove();
        return out;
    }, probe);

test.describe('the cascade order', { tag: ['@component:utilities', '@component:layout'] }, () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(PAGE);
        await expect(page.locator('[data-test="spacing"]')).toBeVisible();
    });

    // Drill: `@layer kp.base, kp.components, kp.register, kp.layout,
    // kp.utilities;` in css/themes.css reordered to put kp.layout last →
    // red, gap 16px against the layout layer's own --kp-space-md and
    // flex-direction "column" where the utility says row. Restored green.
    test('a utility beats the layout layer [AR17]', async ({ page }) => {
        const tokens = await page.evaluate(() => {
            const root = getComputedStyle(document.documentElement);
            return { md: root.getPropertyValue('--kp-space-md').trim(), lg: root.getPropertyValue('--kp-space-lg').trim() };
        });
        expect(tokens.md, 'the two spacing steps must differ, or this measures nothing').not.toBe(tokens.lg);

        // .kp-stack is `display: flex; flex-direction: column; gap: md`.
        const plain = await paintOf(page, { html: '<div class="kp-stack" data-probe><p>a</p><p>b</p></div>', read: ['gap', 'flex-direction'] });
        const witha = await paintOf(page, {
            html: '<div class="kp-stack kp-gap-lg kp-flex-row" data-probe><p>a</p><p>b</p></div>',
            read: ['gap', 'flex-direction'],
        });
        expect(plain['flex-direction'], 'the layout class alone stacks in a column').toBe('column');
        expect(witha['flex-direction'], 'the utility must turn the stack into a row').toBe('row');
        expect(witha.gap, 'the utility must set the gap, not the layout class').not.toBe(plain.gap);

        // .kp-row is `flex-wrap: wrap`; the utility says otherwise.
        const row = await paintOf(page, { html: '<div class="kp-row kp-flex-nowrap" data-probe><p>a</p></div>', read: ['flex-wrap'] });
        expect(row['flex-wrap'], 'the utility must beat .kp-row’s wrap').toBe('nowrap');
    });

    // Drill: kp.layout moved before kp.components in the layer statement in
    // css/themes.css → red, every cell reading "start", which is the exact
    // state css/layout.css's comment describes as the reason the layer
    // exists. Restored green.
    test('the layout layer beats the component layer at lower specificity', async ({ page }) => {
        // `.kp-table th, .kp-table td` is (0,1,1) and sets `text-align:
        // start`; `.kp-text-end` is (0,1,0). Specificity says the cell wins;
        // the layer order says the layout layer does, and the layer order is
        // the one that must hold.
        const cells = await page.evaluate(() => {
            const table = document.createElement('table');
            table.className = 'kp-table';
            table.innerHTML =
                '<tbody><tr>' +
                '<td class="kp-text-end" data-cell="end">1</td>' +
                '<td class="kp-text-center" data-cell="center">2</td>' +
                '<td data-cell="plain">3</td>' +
                '</tr></tbody>';
            document.body.append(table);
            const read = (/** @type {string} */ name) =>
                getComputedStyle(/** @type {HTMLElement} */ (table.querySelector(`[data-cell="${name}"]`))).textAlign;
            const out = { end: read('end'), center: read('center'), plain: read('plain') };
            table.remove();
            return out;
        });
        // A cell with neither class proves the component rule is there at
        // all; without it the other two could be the browser's default.
        expect(cells.plain, 'the component layer aligns a cell to the start').toBe('start');
        expect(cells.end, '.kp-text-end must beat the cell’s own alignment').toBe('end');
        expect(cells.center, '.kp-text-center must beat the cell’s own alignment').toBe('center');
    });

    // Drill: `[hidden] { display: none !important }` removed from
    // css/_rules.css and css/themes.css regenerated → red, the probe
    // painting at display "flex" with a height above zero. Restored green.
    test('the base layer’s [hidden] beats the utilities, the package’s highest layer [KT13]', async ({ page }) => {
        const painted = await page.evaluate(() => {
            /** Each is `hidden` and wears a class from the layer named. */
            const probes = [
                ['kp.utilities', 'kp-d-flex'],
                ['kp.utilities', 'kp-d-grid'],
                ['kp.utilities', 'kp-d-inline-block'],
                ['kp.layout + kp.utilities', 'kp-stack kp-d-flex kp-gap-lg'],
            ];
            const out = [];
            for (const [layer, className] of probes) {
                const el = document.createElement('div');
                el.className = className;
                el.hidden = true;
                el.textContent = 'probe';
                document.body.append(el);
                const style = getComputedStyle(el);
                const box = el.getBoundingClientRect();
                if (style.display !== 'none' || box.height > 0) out.push(`${layer} .${className}: display ${style.display}, height ${box.height}`);
                el.remove();
            }
            return out;
        });
        expect(painted, 'a hidden element painted').toEqual([]);
    });
});
