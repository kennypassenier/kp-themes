// A key-figure strip never leaves one tile alone [scope-143]: spec D7's
// browser rows (research/dashboard-ports-2/README.md, section 3), on the
// catalogue's block catalogue/data.html#kpi-columns. The spec's table itself
// is gates/kpi-columns.test.mjs.
//
// Kenny's pick (2026-10-05): a tile that must stay alone on the last row
// spans the whole row; the centred option is gone.
import { expect, test } from '@playwright/test';

const PAGE = '/catalogue/data.html#kpi-columns';

/** Tiles and strip width, as the block's buttons set them. @type {[number, string][]} */
const ROWS = [
    [5, 'full'],
    [4, '600'],
    [5, '700'],
    [7, '700'],
    [8, '700'],
    [5, '358'],
    [6, '358'],
    [1, '358'],
    [2, '358'],
];

/** @param {import('@playwright/test').Locator} strip */
const measure = (strip) =>
    strip.evaluate(async (el) => {
        const { kpiColumns } = await import('/js/kpi.js');
        const style = getComputedStyle(el);
        const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
        const tiles = [...el.children].map((tile) => tile.getBoundingClientRect());
        /** @type {Map<number, DOMRect[]>} */
        const rows = new Map();
        for (const box of tiles) {
            const key = Math.round(box.top);
            rows.set(key, [...(rows.get(key) ?? []), box]);
        }
        return {
            inner: el.clientWidth,
            columns: Number(el.style.getPropertyValue('--kp-kpis-columns')),
            spanLast: el.hasAttribute('data-kp-kpis-span-last'),
            expected: kpiColumns(tiles.length, el.clientWidth, {
                allowed: el.getAttribute('data-kp-kpis-columns') ?? '',
                minTilePx: 9 * rem,
                gapPx: parseFloat(style.columnGap),
            }),
            rows: [...rows.values()].map((row) => ({ widths: row.map((b) => b.width), heights: row.map((b) => b.height) })),
        };
    });

/**
 * Set a row with the block's buttons, wait for the strip to follow, and
 * hold it to the rules: the count kpiColumns() gives, no tile alone on a
 * row except a last one spanning the strip, every row's tiles one height.
 * @param {import('@playwright/test').Page} page @param {number} n @param {string} width
 */
const holds = async (page, n, width) => {
    const block = page.locator('#kpi-columns');
    const strip = block.locator('[data-cat-kpis-strip]');
    await block.locator(`[data-cat-kpis-count] [data-value="${n}"]`).click();
    await block.locator(`[data-cat-kpis-width] [data-value="${width}"]`).click();
    await expect(block.locator('[data-cat-kpis-log]')).toContainText(`${n} ${n === 1 ? 'tile' : 'tiles'} in`);
    await expect
        .poll(async () => {
            const m = await measure(strip);
            return m.columns === m.expected.columns && m.spanLast === m.expected.spanLast;
        })
        .toBe(true);
    const m = await measure(strip);
    const what = `${n}/${width}`;
    m.rows.forEach((row, i) => {
        if (m.rows.length > 1 && row.widths.length === 1) {
            expect(i === m.rows.length - 1 && m.spanLast, `${what}: row ${i + 1} holds one tile`).toBe(true);
            expect(row.widths[0], `${what}: the lone tile spans the row`).toBeCloseTo(m.inner, 0);
        }
        expect(Math.max(...row.heights) - Math.min(...row.heights), `${what}: row ${i + 1}'s heights`).toBeLessThanOrEqual(0.5);
    });
    return m;
};

test('at 1280 px, every D7 row as the spec says, and the phone pane (D7) [scope-143]', { tag: ['@component:data'] }, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(PAGE);
    await page.waitForSelector('html[data-kp-auto-ready]', { state: 'attached' });
    /** @type {Record<string, [number, boolean]>} the count and span the spec names for the rows at a fixed width */
    const SPEC = {
        '4/600': [2, false],
        '5/700': [3, false],
        '7/700': [3, true],
        '8/700': [3, false],
        '5/358': [2, true],
        '6/358': [2, false],
        '1/358': [1, false],
        '2/358': [2, false],
    };
    for (const [n, width] of ROWS) {
        const m = await holds(page, n, width);
        const spec = SPEC[`${n}/${width}`];
        if (spec) expect([m.columns, m.spanLast], `${n}/${width}: as the spec says`).toEqual(spec);
    }
    const phone = await measure(page.locator('#kpi-columns .cat-resize .kp-kpis'));
    expect([phone.columns, phone.spanLast], 'five tiles at phone width: two a row, the fifth across').toEqual([2, true]);
});

test('at 390 px, every D7 row keeps the rules, with no sideways scroll (D7) [scope-143]', { tag: ['@component:data'] }, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(PAGE);
    await page.waitForSelector('html[data-kp-auto-ready]', { state: 'attached' });
    for (const [n, width] of ROWS) await holds(page, n, width);
    const sideways = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(sideways).toBeLessThanOrEqual(0);
});
