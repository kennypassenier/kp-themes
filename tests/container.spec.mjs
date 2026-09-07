// The grid, the nav bar and the space they are given [TH104, AR31].
//
// One suite over both channels (standing rule 7g): every case runs twice
// against the same fixture page, once over the framework-free markup that
// js/auto.js upgrades and once over the React components, and the
// assertions are identical.
//
// Every case that asserts the PACKAGE applies something carries, in a
// comment, the exact declaration removed to drive it red [KT3].

import { test, expect } from '@playwright/test';

const URL = '/tests/fixtures/container.html';

const CHANNELS = ['plain', 'react'];

/** Both mounts are on the page, and the framework-free grid is attached. */
async function open(page) {
    await page.goto(URL);
    await page.waitForSelector('[data-test="react-grid-wide"] .kp-grid__tile');
    await page.waitForFunction(() => document.querySelector('[data-test="plain-grid-wide"]')?.dataset.kpGridAttached !== undefined);
}

for (const channel of CHANNELS) {
    const host = (name) => `[data-test="${channel}-${name}"]`;

    // Standing rule 8: this is a repair of something already broken, so it
    // failed on the released code first. Measured there at 320px, with the
    // grid attached — which is the only way the grid is ever used — the
    // tile read `1 / span 2` and the collapse-to-one-column rule never
    // won, because js/gridlayout.js wrote `grid-column` as an INLINE
    // style and components/canvas.jsx wrote the same through a `style`
    // prop. An inline style beats any rule in any layer.
    test(`${channel}: an attached grid collapses to one column at 320px [AR31, TH56]`, async ({ page }) => {
        await page.setViewportSize({ width: 320, height: 800 });
        await open(page);
        const measured = await page.evaluate((selector) => {
            const grid = document.querySelector(selector);
            const tile = grid.querySelector('.kp-grid__tile');
            return {
                viewport: window.innerWidth,
                column: getComputedStyle(tile).gridColumn,
                inline: tile.getAttribute('style') ?? '',
                tile: tile.offsetWidth,
                grid: grid.clientWidth,
            };
        }, host('grid-wide'));
        expect(measured.viewport).toBe(320);
        // Drill: with the `@media (max-width: 40rem)` block removed from
        // css/components.css the tile reads `1 / span 2` again, in both
        // channels and both browsers.
        expect(measured.column).toBe('1 / -1');
        // The position is a value the stylesheet reads, not a track the
        // module dictates: neither channel may write `grid-column` or
        // `grid-row` itself. This is the half rule 8 was about.
        expect(measured.inline).not.toMatch(/(^|[;\s])grid-(column|row)\s*:/);
        // One column, so the tile spans the grid's whole content box.
        expect(measured.tile).toBe(measured.grid);
    });
}
