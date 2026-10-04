// A key figure with its 24-hour trend [scope-143]: spec E7 items 1 to 8
// (research/dashboard-ports-2/README.md, section 4), on the catalogue's
// block catalogue/data.html#kpi-trend, with the page's clock held at
// 04/10/2026 14:40 in Brussels so every reading is the README's. The axis
// words alone are gates/trend-axis.test.mjs.
//
// Kenny's picks (2026-10-05): "avg 15 min" goes in the label, in its
// capitals (.kp-kpi__label-note); the reading is a chip over the line (the
// axis readout option is gone), with the README's fallback for a chip too
// wide for the trend.
import { expect, test } from '@playwright/test';

const PAGE = '/catalogue/data.html#kpi-trend';
/** 04/10/2026 14:40 in Brussels. */
const NOW = Date.parse('2026-10-04T12:40:00Z');
const NBSP = '\u00a0';

/** @param {string} strip @param {number} n */
const tile = (strip, n) => `[data-cat-trend-strip="${strip}"] > .kp-kpi:nth-child(${n})`;

/** @param {import('@playwright/test').Page} page */
const ready = async (page) => {
    await page.clock.setFixedTime(NOW);
    await page.goto(PAGE);
    await page.waitForSelector('html[data-kp-auto-ready]', { state: 'attached' });
    // The sample's readings arrive from demos.js once js/chart.js is in.
    await expect(page.locator(`${tile('main', 1)} .kp-kpi__chart-from`)).not.toHaveText(NBSP);
};

/** @param {import('@playwright/test').Page} page @param {string} sel */
const axis = (page, sel) => page.locator(`${sel} .kp-kpi__chart-axis > span:not([hidden])`).allTextContents();

/** Point at the middle of a tile's trend and read what it shows. @param {import('@playwright/test').Page} page @param {string} sel */
const readMiddle = async (page, sel) => {
    const plot = page.locator(`${sel} .kp-kpi__chart-plot`);
    await plot.scrollIntoViewIfNeeded();
    const box = /** @type {{ x: number, y: number, width: number, height: number }} */ (await plot.boundingBox());
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    return page.locator(sel).evaluate((t) => {
        const chip = /** @type {HTMLElement} */ (t.querySelector('.kp-kpi__chart-chip'));
        const shown = chip.hidden ? /** @type {HTMLElement} */ (t.querySelector('.kp-kpi__chart-read')) : chip;
        const tb = t.getBoundingClientRect();
        const sb = shown.getBoundingClientRect();
        return {
            moment: shown.querySelector('.kp-kpi__chart-at')?.textContent ?? '',
            value: shown.querySelector('.kp-kpi__chart-value')?.textContent ?? '',
            inside: sb.left >= tb.left - 0.5 && sb.right <= tb.right + 0.5 && sb.top >= tb.top - 0.5 && sb.bottom <= tb.bottom + 0.5,
            cut: shown.scrollWidth > shown.clientWidth + 0.5,
            height: tb.height,
        };
    });
};

test(
    'the axis, the pointer, a live update, the keys and the link, end to end (E7.1–E7.3, E7.5, E7.6) [scope-143]',
    { tag: ['@component:data'] },
    async ({ page }) => {
        await ready(page);
        // E7.1, and a stale end: Flow stopped forty minutes ago, at 14:00.
        expect(await axis(page, tile('main', 1))).toEqual(['14:40 yesterday', 'now']);
        expect(await axis(page, tile('main', 2))).toEqual(['14:40 yesterday', '14:00']);
        // E7.2: Reservoir South began at 07:00.
        expect((await axis(page, tile('states', 4)))[0]).toBe('07:00 today');

        // E7.3: the middle of 145 points is point 72, 04/10/2026 02:40, read in a chip inside the tile.
        const at = await readMiddle(page, tile('main', 1));
        expect(at).toMatchObject({ moment: '04/10/2026 02:40', inside: true });
        expect(at.value).toMatch(/^\d\.\d\d bar$/);
        // R-LIVE: ten minutes later, the pointer where it was, the reading stays at its moment.
        await page.locator('[data-cat-trend-live]').evaluate((button) => /** @type {HTMLElement} */ (button).click());
        await expect(page.locator(`${tile('main', 1)} .kp-kpi__chart-chip .kp-kpi__chart-at`)).toHaveText('04/10/2026 02:40');
        await page.mouse.move(0, 0);

        // E7.5: Tab rings the whole tile, Tab again reaches the trend; End, ←, Shift+←, Esc.
        await page.locator('[data-cat-trend-loading]').focus();
        await page.keyboard.press('Tab');
        const ring = await page.evaluate(() => {
            const a = /** @type {HTMLElement} */ (document.activeElement);
            return {
                link: a.classList.contains('kp-kpi__link'),
                outline: getComputedStyle(/** @type {Element} */ (a.closest('.kp-kpi'))).outlineStyle,
            };
        });
        expect(ring).toEqual({ link: true, outline: 'solid' });
        await page.keyboard.press('Tab');
        await expect(page.locator(`${tile('main', 1)} .kp-kpi__chart-plot`)).toBeFocused();
        const live = page.locator(`${tile('main', 1)} [aria-live]`);
        await page.keyboard.press('End');
        await expect(live).toContainText('04/10/2026 14:50'); // ten minutes later than the page's 14:40
        await page.keyboard.press('ArrowLeft');
        await expect(live).toContainText('04/10/2026 14:40');
        await page.keyboard.press('Shift+ArrowLeft');
        await expect(live).toContainText('04/10/2026 13:00');
        await page.keyboard.press('Escape');
        await expect(page.locator(`${tile('main', 1)} .kp-kpi__chart-cross`)).toBeHidden();
        await expect(page.locator(`${tile('main', 1)} .kp-kpi__chart-chip`)).toBeHidden();

        // E7.6: a click on the trend follows the tile's link; a touch drag only reads it.
        const log = page.locator('[data-cat-trend-log]');
        await page.locator(`${tile('main', 1)} .kp-kpi__chart-plot`).click();
        await expect(log).toHaveText('Opened: Open Pressure on Charts.');
        await log.evaluate((line) => (line.textContent = 'reset'));
        await page.locator(`${tile('main', 2)} .kp-kpi__chart-plot`).evaluate((el) => {
            const b = el.getBoundingClientRect();
            const y = b.top + b.height / 2;
            /** @param {string} type @param {number} x */
            const touch = (type, x) =>
                new PointerEvent(type, { bubbles: true, pointerType: 'touch', pointerId: 7, isPrimary: true, clientX: x, clientY: y });
            el.dispatchEvent(touch('pointerdown', b.left + 20));
            el.dispatchEvent(touch('pointermove', b.left + 40));
            el.dispatchEvent(touch('pointermove', b.left + 70));
            el.dispatchEvent(touch('pointerup', b.left + 70));
            el.dispatchEvent(new MouseEvent('click', { bubbles: true, button: 0, clientX: b.left + 70, clientY: y }));
        });
        await expect(log).toHaveText('reset');
    },
);

test(
    'every state keeps the height; a narrow tile reads in full; one reading is no tab stop (E7.4, E7.7, E7.8) [scope-143]',
    { tag: ['@component:data'] },
    async ({ page }) => {
        await ready(page);
        /** Each strip's tile heights. @returns {Promise<number[][]>} */
        const heights = () =>
            page.evaluate(() =>
                ['main', 'states', 'phone'].map((k) =>
                    [...document.querySelectorAll(`[data-cat-trend-strip="${k}"] > .kp-kpi`)].map(
                        (t) => Math.round(t.getBoundingClientRect().height * 10) / 10,
                    ),
                ),
            );
        /** @param {number[][]} strips */
        const even = (strips) => strips.every((row) => Math.max(...row) - Math.min(...row) <= 0.5);

        // E7.8: filled, loading, no trend and one reading side by side, one height; and every tile
        // loading keeps the filled height (the value line and two or three lines of words are kept).
        const filled = await heights();
        expect(even(filled)).toBe(true);
        const loading = page.locator('[data-cat-trend-loading]');
        await loading.click();
        await expect(page.locator('.kp-kpi--trend[aria-busy="true"]')).toHaveCount(10);
        expect(await heights()).toEqual(filled);
        await loading.click();

        // A label is never cut and never broken inside a word; "avg 15 min" stays one unit.
        const labels = await page.evaluate(() =>
            [...document.querySelectorAll('#kpi-trend .kp-kpi--trend > .kp-kpi__label')].map((l) => {
                const lines = (/** @type {Range | Element} */ r) => new Set([...r.getClientRects()].map((b) => Math.round(b.top))).size;
                let broken = 0;
                const walk = document.createTreeWalker(l, NodeFilter.SHOW_TEXT);
                for (let n = walk.nextNode(); n; n = walk.nextNode()) {
                    for (const m of /** @type {Text} */ (n).data.matchAll(/\S+/g)) {
                        const r = document.createRange();
                        r.setStart(n, m.index);
                        r.setEnd(n, m.index + m[0].length);
                        if (lines(r) > 1) broken += 1;
                    }
                }
                const note = l.querySelector('.kp-kpi__label-note');
                return { cut: l.scrollWidth > l.clientWidth + 0.5, broken, note: note ? lines(note) : 1 };
            }),
        );
        expect(labels).toHaveLength(12);
        for (const label of labels) expect(label).toEqual({ cut: false, broken: 0, note: 1 });

        // Each trend in its own series colour (--kp-chart-series on the figure), not all --chart-1.
        const colours = await page
            .locator(`[data-cat-trend-strip="main"] .kp-kpi__spark`)
            .evaluateAll((svgs) => svgs.map((svg) => getComputedStyle(svg).color));
        expect(new Set(colours).size).toBe(4);

        // E7.7: one reading, and no trend: two no-break spaces, no tab stop.
        for (const n of [2, 3]) {
            expect(await axis(page, tile('states', n))).toEqual([NBSP, NBSP]);
            await expect(page.locator(`${tile('states', n)} .kp-kpi__chart-plot`)).not.toHaveAttribute('tabindex');
        }

        // E7.4: a narrow tile reads the whole moment and value inside the tile, at its height; its corner says ↗ alone.
        const narrow = tile('phone', 1);
        const before = await page.locator(narrow).evaluate((t) => t.getBoundingClientRect().height);
        const at = await readMiddle(page, narrow);
        expect(at.moment).toMatch(/^04\/10\/2026 \d\d:\d\d$/);
        expect(at.value).toMatch(/\d bar$/);
        expect(at).toMatchObject({ inside: true, cut: false });
        expect(at.height).toBeCloseTo(before, 1);
        expect(await page.locator(`${narrow} .kp-kpi__link-word`).evaluate((w) => w.getBoundingClientRect().width)).toBeLessThanOrEqual(1);
    },
);
