// A key-figure strip never leaves one tile alone [scope-143]: spec D7's
// browser rows (research/dashboard-ports-2/README.md, section 3), on the
// catalogue's block catalogue/data.html#kpi-columns. The spec's table itself
// is gates/kpi-columns.test.mjs.
//
// Kenny's pick (2026-10-05): a tile that must stay alone on the last row
// spans the whole row; the centred option is gone.
import { expect, test } from '@playwright/test';
import { ALL_THEMES } from './helpers/sweep-themes.mjs';

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

test(
    'in 19 themes, at full width, at 700 px and in a 334 px pane: one height in every state and set, every label one line and uncut, the frame at 3:1, the change on its pair [fix-101]',
    { tag: ['@component:data'] },
    async ({ page }) => {
        // fix-101: the plain strip's height moved with its state and its
        // figures (79.4 to 121.2 px in one strip); the long label was cut
        // (223 px in a 220 px box) or wrapped (the narrow tile's rule); the
        // tile's frame read 1.21 to 2.72:1 on the page in 20 themes; the
        // change sat on half a status pair (fix-70).
        await page.setViewportSize({ width: 1280, height: 900 });
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.goto(PAGE);
        await page.waitForSelector('html[data-kp-auto-ready]', { state: 'attached' });
        await page.evaluate(() => {
            /** @type {HTMLElement} */ (document.querySelector('#kpi-columns .cat-resize')).style.inlineSize = '334px';
        });
        const misses = [];
        for (const theme of ALL_THEMES) {
            await page.evaluate((t) => {
                document.documentElement.dataset.theme = t;
            }, theme);
            await page.evaluate(() => document.fonts.ready);
            for (const strip of ['full', '700', 'phone']) {
                const got = await page.evaluate(async (strip) => {
                    /** @type {HTMLElement} */ (document.querySelector('[data-cat-kpis-stage]')).style.setProperty(
                        'max-inline-size',
                        strip === '700' ? '700px' : 'none',
                    );
                    const s = /** @type {HTMLElement} */ (
                        document.querySelector(strip === 'phone' ? '#kpi-columns .cat-resize .kp-kpis' : '[data-cat-kpis-strip]')
                    );
                    const keep = [...s.children];
                    /** label, figure, unit, words, change, direction, tone @type {Record<string, string[]>} */
                    const F = {
                        far: ['Pressure, far end of the ring', '2.41', 'bar', 'Pleinstraat', '0.03 bar', 'up', 'good'],
                        flow: ['Flow', '412', 'm³/h', 'this hour', '12 m³/h', 'down', 'bad'],
                        pressure: ['Pressure', '3.12', 'bar', 'this hour', '0.04 bar', 'up', 'good'],
                        north: ['Reservoir North', '71', '%', 'target 80 %'],
                        south: ['Reservoir South', '64', '%', 'target 80 %', '2%', 'down', 'bad'],
                        incidents: ['Open incidents', '2', '', 'one needs a visit'],
                        late: ['Readings late', '1', '', 'pump house 7'],
                        energy: ['Energy today', '1,834', 'kWh', 'night tariff 22:00'],
                        visits: ['Visits planned', '3', '', 'this week'],
                    };
                    /** the catalogue's own five, the long label, eight figures */
                    const SETS = {
                        own: null,
                        long: ['far', 'flow', 'north', 'south', 'incidents'],
                        many: ['pressure', 'flow', 'north', 'south', 'incidents', 'late', 'energy', 'visits'],
                    };
                    /** @param {string} key @param {string} state */
                    const tile = (key, state) => {
                        const [label, v, unit, words, change, direction, tone] = F[key];
                        const el = document.createElement('div');
                        el.className = 'kp-kpi';
                        const l = Object.assign(document.createElement('span'), { className: 'kp-kpi__label', textContent: label });
                        const value = Object.assign(document.createElement('span'), { className: 'kp-kpi__value' });
                        const w = Object.assign(document.createElement('span'), { className: 'kp-kpi__trend' });
                        if (state === 'loading') {
                            const a = document.createElement('span');
                            a.className = 'kp-skeleton';
                            a.style.cssText = 'inline-size: 3ch; --kp-skeleton-height: 1.75rem';
                            const b = document.createElement('span');
                            b.className = 'kp-skeleton';
                            b.style.inlineSize = '80%';
                            value.append(a);
                            w.append(b);
                        } else if (state === 'empty') {
                            value.textContent = '—';
                            w.textContent = 'no reading yet';
                        } else {
                            value.textContent = v;
                            if (unit) value.append(Object.assign(document.createElement('small'), { textContent: unit }));
                            if (change) {
                                const d = Object.assign(document.createElement('span'), { className: 'kp-kpi__delta', textContent: change });
                                d.dataset.kpDirection = direction;
                                d.dataset.kpTone = tone;
                                w.append(d, ` ${words}`);
                            } else w.textContent = words;
                        }
                        el.append(l, value, w);
                        return el;
                    };
                    const cv = document.createElement('canvas');
                    cv.width = cv.height = 1;
                    const cx = /** @type {CanvasRenderingContext2D} */ (cv.getContext('2d', { willReadFrequently: true }));
                    /** @param {string} c */
                    const rgba = (c) => {
                        cx.clearRect(0, 0, 1, 1);
                        cx.fillStyle = c;
                        cx.fillRect(0, 0, 1, 1);
                        const d = cx.getImageData(0, 0, 1, 1).data;
                        return [d[0], d[1], d[2], d[3] / 255];
                    };
                    /** @param {number[]} top @param {number[]} under */
                    const over = (top, under) => [0, 1, 2].map((i) => top[i] * top[3] + under[i] * (1 - top[3]));
                    /** @param {Element} el */
                    const plate = (el) => {
                        const layers = [];
                        for (let n = /** @type {Element | null} */ (el); n; n = n.parentElement) {
                            const c = rgba(getComputedStyle(n).backgroundColor);
                            if (c[3] > 0) layers.push(c);
                            if (c[3] >= 1) break;
                        }
                        return layers.reverse().reduce((acc, l) => over(l, acc), [255, 255, 255]);
                    };
                    /** @param {number[]} c */
                    const lum = (c) => {
                        const [r, g, b] = c.map((v) => (v / 255 <= 0.04045 ? v / 255 / 12.92 : ((v / 255 + 0.055) / 1.055) ** 2.4));
                        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
                    };
                    /** @param {string} ink @param {number[]} under */
                    const ratio = (ink, under) => {
                        const a = lum(over(rgba(ink), under));
                        const b = lum(under);
                        return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
                    };
                    const frame = () => new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)));
                    const out = [];
                    for (const [set, keys] of Object.entries(SETS))
                        for (const state of ['ready', 'loading', 'empty']) {
                            if (keys) s.replaceChildren(...keys.map((k) => tile(k, state)));
                            else if (state === 'ready') s.replaceChildren(...keep.map((t) => t.cloneNode(true)));
                            else continue;
                            await frame();
                            const tiles = /** @type {HTMLElement[]} */ ([...s.children]);
                            out.push({
                                at: `${set}/${state}`,
                                over: s.scrollWidth > s.clientWidth + 0.5,
                                heights: tiles.map((t) => Math.round(t.getBoundingClientRect().height * 10) / 10),
                                labels: tiles.map((t) => {
                                    const l = /** @type {HTMLElement} */ (t.querySelector('.kp-kpi__label'));
                                    const r = document.createRange();
                                    r.selectNodeContents(l);
                                    return {
                                        lines: new Set([...r.getClientRects()].filter((b) => b.width > 0).map((b) => Math.round(b.top))).size,
                                        cut: l.scrollWidth > l.clientWidth + 0.5 || t.scrollWidth > t.clientWidth + 0.5,
                                    };
                                }),
                                frame: Math.min(
                                    ...tiles.map((t) => {
                                        const ink = getComputedStyle(t).borderTopColor;
                                        return Math.min(ratio(ink, plate(s)), ratio(ink, plate(t)));
                                    }),
                                ),
                                changes: [...s.querySelectorAll('.kp-kpi__delta')].map((d) => ({
                                    tone: d.getAttribute('data-kp-tone'),
                                    ratio: ratio(getComputedStyle(d).color, plate(d)),
                                })),
                            });
                        }
                    s.replaceChildren(...keep);
                    return out;
                }, strip);
                const all = got.flatMap((g) => g.heights);
                if (Math.max(...all) - Math.min(...all) > 0.5)
                    misses.push(`${theme} ${strip}: tiles of ${Math.min(...all)} to ${Math.max(...all)} px across states and sets`);
                for (const g of got) {
                    const at = `${theme} ${strip} ${g.at}`;
                    if (g.over) misses.push(`${at}: the strip overflows`);
                    g.labels.forEach((l, i) => {
                        if (l.lines !== 1) misses.push(`${at}: label ${i + 1} on ${l.lines} lines`);
                        if (l.cut) misses.push(`${at}: label ${i + 1} or its tile cut`);
                    });
                    if (g.frame < 3) misses.push(`${at}: the frame ${g.frame.toFixed(2)}:1`);
                    for (const c of g.changes) if (c.ratio < 4.5) misses.push(`${at}: the ${c.tone} change ${c.ratio.toFixed(2)}:1`);
                }
            }
        }
        expect(misses).toEqual([]);
    },
);
