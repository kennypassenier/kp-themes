// The catalogue's add-filter block [Kenny, 2026-09-14, filter-design, "Allebei, per tabel"].
//
// catalogue/table.html#datatable-add-filter shows the add-filter mode on a
// live table for Kenny to judge. This holds that the block is there, is the
// package's own table rather than a picture of one, and starts from the pill
// its look text promises. Red on 7780e64: the block did not exist.

import { expect, test } from '@playwright/test';
import { DEFAULT_STRINGS as S } from '../js/strings.js';
import { useEmptyRegister } from './helpers/empty-register.mjs';
import { waitForJudging } from './helpers/catalogue.mjs';
import { THEMES } from '../js/theme-registry.js';

test(
    'the table page shows the add-filter mode on a live table, starting with the Status pill',
    { tag: ['@component:catalogue', '@component:datatable'] },
    async ({ page }) => {
        await useEmptyRegister(page.context());
        await page.goto('/catalogue/table.html');
        await waitForJudging(page);
        const block = page.locator('#datatable-add-filter.cat-block');
        await expect(block.locator('h2')).toHaveText('Data table: adding a filter, one at a time');
        await expect(block.locator('.cat-look')).toContainText('Look at:');
        const table = block.locator('.kp-datatable[data-kp-filter-mode="add"]');
        await expect(table).toHaveAttribute('data-kp-datatable-attached', '');
        const pill = table.locator('[data-kp-filter-pill]');
        await expect(pill).toHaveText(S.tableFilterChoicePill('Status', ['Open', 'Watching']));
        await expect(table.locator('[data-kp-datatable-add-filter]')).toHaveText(S.tableAddFilter(1));
        await table.locator('[data-kp-datatable-add-filter]').click();
        const menu = table.locator('[data-kp-datatable-add-menu]');
        await expect(menu).toBeVisible();
        await expect(menu.locator('.kp-menu__item')).toHaveText(['Site', `Status ${S.tableFilterMarked}`, 'Hours open', 'Opened']);
        await menu.locator('.kp-menu__item', { hasText: 'Hours open' }).click();
        await table.locator('[data-kp-filter-bound="from"]').fill('10');
        await table.locator('[data-kp-filter-bound="to"]').fill('30');
        await table.locator('[data-kp-filter-bound="to"]').press('Enter');
        await expect(table.locator('[data-kp-filter-pill]')).toHaveCount(2);
        await expect(table.locator('.kp-datatable__clear-filters')).toBeVisible();
    },
);

test(
    "the editor's Cancel keeps its hover brackets off its label, in every theme that draws them [scope-80]",
    { tag: ['@component:datatable', '@component:button', '@sweep'] },
    async ({ page }) => {
        // Kenny's note on #datatable-add-filter, dark: choose Hours open, point
        // at Cancel, and the [ ] sit on the letters — the small ghost button is
        // narrower than its brackets need. The brackets are absolutely placed
        // pseudo-elements, so their ink is computed from the resolved offsets
        // and the font's own glyph metrics, against the label's text box.
        test.setTimeout(120_000);
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.setViewportSize({ width: 1280, height: 900 });
        await useEmptyRegister(page.context());
        await page.goto('/catalogue/table.html');
        await waitForJudging(page);
        // Every register on the page at once, so the loop below only flips the attribute.
        await page.evaluate(
            (names) =>
                Promise.all(
                    names.map(
                        (name) =>
                            new Promise((done) => {
                                const link = document.createElement('link');
                                link.rel = 'stylesheet';
                                link.href = `/css/${name}-register.css`;
                                link.onload = done;
                                link.onerror = done;
                                document.head.append(link);
                            }),
                    ),
                ),
            THEMES.map((theme) => theme.name),
        );
        const table = page.locator('#datatable-add-filter .kp-datatable');
        await table.locator('[data-kp-datatable-add-filter]').click();
        await table.locator('[data-kp-datatable-add-menu] .kp-menu__item', { hasText: 'Hours open' }).click();
        const cancel = table.locator('[data-kp-filter-cancel]');
        /** @type {string[]} */
        const overlaps = [];
        let drawn = 0;
        for (const theme of THEMES) {
            await page.evaluate((name) => document.documentElement.setAttribute('data-theme', name), theme.name);
            await page.mouse.move(0, 0);
            await cancel.hover();
            const found = await cancel.evaluate(async (el) => {
                await document.fonts.ready;
                const box = el.getBoundingClientRect();
                const range = document.createRange();
                range.selectNodeContents(el);
                const rects = [...range.getClientRects()].filter((r) => r.width > 0);
                const text = { left: Math.min(...rects.map((r) => r.left)), right: Math.max(...rects.map((r) => r.right)) };
                const style = getComputedStyle(el);
                const context = /** @type {CanvasRenderingContext2D} */ (document.createElement('canvas').getContext('2d'));
                /** @type {{ side: string, into: number }[]} */
                const out = [];
                for (const part of ['::before', '::after']) {
                    const s = getComputedStyle(el, part);
                    const glyph = s.content.replace(/^"(.*)"$/, '$1').trim();
                    if (!/^[[\]]$/.test(glyph) || s.position !== 'absolute' || s.display === 'none' || Number(s.opacity) < 0.5) continue;
                    context.font = `${s.fontStyle} ${s.fontWeight} ${s.fontSize} ${s.fontFamily}`;
                    const ink = context.measureText(glyph);
                    const start = box.left + parseFloat(style.borderLeftWidth) + parseFloat(s.left);
                    // Centred in its box by the grid; the box is the glyph's own advance when nothing sizes it.
                    const origin = start + (parseFloat(s.width) - ink.width) / 2;
                    const inkLeft = origin - ink.actualBoundingBoxLeft;
                    const inkRight = origin + ink.actualBoundingBoxRight;
                    out.push(part === '::before' ? { side: '[', into: inkRight - text.left } : { side: ']', into: text.right - inkLeft });
                }
                return out;
            });
            drawn += found.length;
            for (const { side, into } of found) if (into > 0) overlaps.push(`${theme.name} ${side} ${into.toFixed(1)}px into the label`);
        }
        expect(drawn, 'at least one theme draws brackets on Cancel, or this test reads nothing').toBeGreaterThan(0);
        expect(overlaps).toEqual([]);
    },
);
