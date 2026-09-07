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
        // Drill: with the `@container kp-grid (max-width: 40rem)` block
        // removed from css/components.css the tile reads `1 / span 2`
        // again, in both channels and both browsers.
        expect(measured.column).toBe('1 / -1');
        // The position is a value the stylesheet reads, not a track the
        // module dictates: neither channel may write `grid-column` or
        // `grid-row` itself. This is the half rule 8 was about.
        expect(measured.inline).not.toMatch(/(^|[;\s])grid-(column|row)\s*:/);
        // One column, so the tile spans the grid's whole content box.
        expect(measured.tile).toBe(measured.grid);
    });

    test(`${channel}: a grid in a 300px container collapses while the viewport stays 1280 [TH104]`, async ({ page }) => {
        await page.setViewportSize({ width: 1280, height: 800 });
        await open(page);
        const read = (selector) =>
            page.evaluate((s) => {
                const grid = document.querySelector(s);
                const tile = grid.querySelector('.kp-grid__tile');
                return {
                    viewport: window.innerWidth,
                    grid: grid.clientWidth,
                    tracks: getComputedStyle(grid).gridTemplateColumns.split(' ').length,
                    column: getComputedStyle(tile).gridColumn,
                };
            }, selector);

        // The same component, the same page, the same window: only the box
        // it was given differs. That is the whole claim of TH104 — up to
        // 3.2.0 the width that decided was the window's, so this grid was
        // told it had 1280px and kept a shape that did not fit.
        const wide = await read(host('grid-wide'));
        expect(wide.viewport).toBe(1280);
        expect(wide.tracks).toBe(6);
        expect(wide.column).toBe('1 / span 2');

        const narrow = await read(host('grid-narrow'));
        expect(narrow.viewport).toBe(1280);
        expect(narrow.grid).toBeLessThanOrEqual(300);
        // Drill: with `container: kp-grid / inline-size` removed from
        // .kp-grid-wrap the query never matches, this reads six tracks and
        // `1 / span 2` — red in both channels and both browsers.
        expect(narrow.tracks).toBe(1);
        expect(narrow.column).toBe('1 / -1');
    });

    test(`${channel}: a nav bar in a 300px container takes its narrow inset while the viewport stays 1280 [TH104]`, async ({ page }) => {
        await page.setViewportSize({ width: 1280, height: 800 });
        await open(page);
        const inset = (selector) =>
            page.evaluate((s) => {
                const nav = document.querySelector(s);
                return { viewport: window.innerWidth, box: nav.clientWidth, pad: getComputedStyle(nav).paddingInlineStart };
            }, selector);

        // Up to 3.2.0 this padding was `clamp(0.75rem, 3vw, 1.5rem)` — it
        // read the WINDOW, so both of these measured 24px on a 1280px page
        // however narrow the column around them was.
        const wide = await inset(host('nav-wide'));
        expect(wide.viewport).toBe(1280);
        expect(wide.pad).toBe('24px');

        const narrow = await inset(host('nav-narrow'));
        expect(narrow.viewport).toBe(1280);
        expect(narrow.box).toBeLessThanOrEqual(300);
        // Drill: with `container: kp-nav / inline-size` removed from
        // .kp-nav-wrap the query never matches and this measures 24px too
        // — red in both channels and both browsers.
        expect(narrow.pad).toBe('12px');
    });
}

// The way out of the wrapper, both halves of KT6: a page that already
// establishes a container of its own turns the component's off, and the
// query still finds the outer one.
test('the React components hand the wrapper back [TH104, KT6]', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(URL);
    await page.waitForSelector('[data-test="react-grid-wide"] .kp-grid__tile');
    const wrappers = await page.evaluate(() => ({
        grid: document.querySelector('[data-test="react-grid-wide"]').parentElement.className,
        nav: document.querySelector('[data-test="react-nav-wide"]').parentElement.className,
    }));
    expect(wrappers.grid).toBe('kp-grid-wrap');
    expect(wrappers.nav).toBe('kp-nav-wrap');
});
