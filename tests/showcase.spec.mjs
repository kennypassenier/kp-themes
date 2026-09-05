// The showcase opens, and opens correctly [L9, AR14, TH88].
//
// L9's exit criterion ends with "and produces a showcase that opens" —
// not "the file exists". A generated page that throws on load is exactly
// the kind of thing a file-existence check reports as success.
//
// Since round three the page is two halves with a picker each [TH88]:
// Kenny's brief was "links en rechts, elk een picker, samen scrollen".

import { test, expect } from '@playwright/test';
import { THEMES } from '../js/theme-registry.js';
import { SPECIMENS } from '../showcase/specimens.mjs';

const SHOWN = SPECIMENS.filter((s) => !s.fixturesOnly).length;

test('the showcase renders every specimen on both halves, with nothing failing on load [TH88]', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));

    await page.goto('/showcase/index.html');
    await page.waitForSelector('.kp-icon-button');

    for (const side of ['left', 'right']) {
        await expect(page.locator(`#pane-${side} .sc-specimen`)).toHaveCount(SHOWN);
        // A picker per half, with every theme in it.
        expect(await page.locator(`[data-sc-picker="${side}"] [data-kp-theme]`).count()).toBe(THEMES.length);
    }
    // The halves start on two different themes, or there is nothing to compare.
    const left = await page.getAttribute('#pane-left', 'data-theme');
    const right = await page.getAttribute('#pane-right', 'data-theme');
    expect(left).not.toBe(right);
    // The package's own picker is not on this page: it would set the
    // document theme, and here each half has its own.
    expect(await page.locator('[data-kp-theme-picker]').count()).toBe(0);

    expect(errors, 'the showcase logged errors while loading').toEqual([]);
});

for (const side of ['left', 'right']) {
    const other = side === 'left' ? 'right' : 'left';
    test(`the ${side} picker changes the ${side} half and nothing else [TH88]`, async ({ page }) => {
        await page.goto('/showcase/index.html');
        await page.waitForSelector('.kp-icon-button');
        // Past the header, so the sticky side bars are engaged and the menu
        // opens fully inside the viewport — the way a person meets it when
        // switching a theme mid-page. Opened above the fold, a menu taller
        // than the room below the bar makes the page scroll under it, and
        // the anchor jumps as the bar sticks.
        await page.evaluate(() => window.scrollTo(0, 400));
        const before = await page.getAttribute(`#pane-${other}`, 'data-theme');
        const documentTheme = await page.getAttribute('html', 'data-theme');

        await page.click(`#pane-${side} .kp-icon-button`);
        await expect(page.locator(`#sc-menu-${side}`)).toBeVisible();
        await page.click(`#sc-menu-${side} [data-kp-theme="terminal"]`);

        await expect(page.locator(`#pane-${side}`)).toHaveAttribute('data-theme', 'terminal');
        await expect(page.locator(`#pane-${other}`)).toHaveAttribute('data-theme', before);
        // The menu closes itself, the name above the half says what it
        // wears, and the option is marked as selected.
        await expect(page.locator(`#sc-menu-${side}`)).toBeHidden();
        await expect(page.locator(`[data-sc-name="${side}"]`)).toHaveText('Terminal');
        await expect(page.locator(`#sc-menu-${side} [data-kp-theme="terminal"]`)).toHaveAttribute('data-selected', 'true');
        // The document did not change theme: the page chrome is nobody's half.
        expect(await page.getAttribute('html', 'data-theme')).toBe(documentTheme);
        // And the half really wears it: its ground is terminal's, not the other half's.
        const grounds = await page.evaluate(
            ([a, b]) => [
                getComputedStyle(document.querySelector(`#pane-${a} .sc-cell`)).backgroundColor,
                getComputedStyle(document.querySelector(`#pane-${b} .sc-cell`)).backgroundColor,
            ],
            [side, other],
        );
        expect(grounds[0]).not.toBe(grounds[1]);
    });
}

test('the two halves scroll as one and stay aligned specimen by specimen [TH88]', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/showcase/index.html');
    await page.waitForSelector('.kp-icon-button');
    // Two faces with different metrics, so the halves WOULD drift if each
    // were its own column: formal's sans on the left, terminal's mono on
    // the right.
    await page.evaluate(() => window.scrollTo(0, 400));
    await page.click('#pane-right .kp-icon-button');
    await page.click('#sc-menu-right [data-kp-theme="terminal"]');

    const tops = async (id) =>
        page.evaluate(
            (spec) => [
                document.querySelector(`#left-${spec}`).getBoundingClientRect().top,
                document.querySelector(`#right-${spec}`).getBoundingClientRect().top,
            ],
            id,
        );

    const before = await tops('card');
    // Drill [KT3]: with the inline `grid-row` placement removed from the
    // generator, the halves become two independent columns and these two
    // tops differ by the height difference of everything above them
    // (measured at the drill: 8198 px, because every cell then auto-places). Within a pixel, because Chromium
    // reports the scrolled position with sub-pixel rounding.
    expect(Math.abs(before[0] - before[1])).toBeLessThanOrEqual(1);

    // Scroll on, as far as the page allows, and read back rather than assume.
    const moved = await page.evaluate(() => {
        const from = window.scrollY;
        window.scrollTo(0, from + 600);
        return window.scrollY - from;
    });
    expect(moved).toBeGreaterThan(0);
    const after = await tops('card');
    expect(Math.abs(after[0] - after[1])).toBeLessThanOrEqual(1);
    expect(Math.abs(before[0] - after[0] - moved)).toBeLessThanOrEqual(1);
});

test('the picker remembers each half across a reload [TH88]', async ({ page }) => {
    await page.goto('/showcase/index.html');
    await page.waitForSelector('.kp-icon-button');
    await page.evaluate(() => window.scrollTo(0, 400));
    await page.click('#pane-left .kp-icon-button');
    await page.click('#sc-menu-left [data-kp-theme="sepia"]');
    await page.reload();
    await page.waitForSelector('.kp-icon-button');
    await expect(page.locator('#pane-left')).toHaveAttribute('data-theme', 'sepia');
});

test('the showcase and every fixture load the faces their tokens name [R0]', async ({ page }) => {
    // Nothing in the package loads a webfont (S19); the showcase does, from
    // the same token values, so Kenny judges a theme in its own letter.
    // Drill [KT3]: with fontLinks() returning '' in the generator, no page
    // carries the link and the first expectation reads 0.
    await page.goto('/showcase/index.html');
    const href = await page.getAttribute('link[data-sc-fonts]', 'href');
    expect(href).toContain('fonts.googleapis.com/css2?');
    for (const theme of THEMES) {
        await page.goto(`/showcase/themes/${theme.name}.html`);
        const own = await page.getAttribute('link[data-sc-fonts]', 'href');
        const body = await page.evaluate(() => getComputedStyle(document.body).fontFamily);
        const first = /^'([^']+)'/.exec(body)?.[1] ?? /^"([^"]+)"/.exec(body)?.[1];
        expect(own, `${theme.name} names no face`).toContain(encodeURIComponent(first ?? '').replace(/%20/g, '+'));
    }
});
