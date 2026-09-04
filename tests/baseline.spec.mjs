// The browser baseline, proven rather than believed [Phase 7, AR15].
//
// AR15 pins the baseline at modern Chrome and Firefox, and this package
// leans on that hard: <dialog> for focus containment, popover for light
// dismiss, anchor positioning to place a menu, and relative colour syntax
// so a texture can read its own theme's token instead of copying it.
//
// Until the Phase 7 audit the whole suite ran in Chromium only, which
// makes "green" evidence about Chromium (standing rule 35). It now runs
// in both, and this file asserts the four features by name — so the day
// one of them is missing, the failure says which, rather than surfacing
// as a menu that quietly appears in the wrong place.

import { test, expect } from '@playwright/test';

test('the four platform features this package leans on are present', async ({ page }) => {
    await page.goto('/tests/fixtures/picker.html');
    const support = await page.evaluate(() => ({
        dialog: typeof HTMLDialogElement !== 'undefined',
        popover: Object.prototype.hasOwnProperty.call(HTMLElement.prototype, 'popover'),
        anchorName: CSS.supports('anchor-name', '--a'),
        positionArea: CSS.supports('position-area', 'block-end'),
        relativeColour: CSS.supports('color', 'hsl(from red h s l / 0.5)'),
    }));
    expect(support).toEqual({ dialog: true, popover: true, anchorName: true, positionArea: true, relativeColour: true });
});

test('an anchored menu lands under its trigger, not at the top of the page', async ({ page }) => {
    // Feature detection says the property parses. This says the layout
    // actually happened: without anchor positioning the popover falls back
    // to the top-left of its containing block, which parses just as well.
    await page.setContent(`<style>
            #t { anchor-name: --a; margin-left: 120px; }
            #m { position: absolute; position-area: block-end span-inline-end; position-anchor: --a; margin: 0; }
        </style>
        <div style="height:200px"></div>
        <button id="t" popovertarget="m">trigger</button>
        <div popover="auto" id="m">menu</div>`);
    await page.click('#t');
    const gap = await page.evaluate(() => {
        const t = /** @type {HTMLElement} */ (document.getElementById('t')).getBoundingClientRect();
        const m = /** @type {HTMLElement} */ (document.getElementById('m')).getBoundingClientRect();
        return { below: Math.round(m.top - t.bottom), beside: Math.round(m.left - t.left) };
    });
    expect(Math.abs(gap.below), 'the menu should sit directly under the trigger').toBeLessThanOrEqual(4);
    expect(Math.abs(gap.beside), 'the menu should line up with the trigger').toBeLessThanOrEqual(4);
});
