// The DataTable, driven in both channels [TH37].
//
// The features are easy to see and easy to test. What this suite is
// actually for is the half nearly every implementation skips: the sort
// state has to reach `aria-sort`, and the row count after a filter has to
// be announced. A sighted user watches the rows rearrange; without those
// two, everyone else is told nothing at all.

import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';
import { DEFAULT_STRINGS as S } from '../js/strings.js';

const URL = '/tests/fixtures/components.html';

const CHANNELS = [
    { name: 'framework-free', table: '[data-test="plain-datatable"]' },
    { name: 'React', table: '[data-test="react-datatable"] .kp-datatable' },
];

for (const channel of CHANNELS) {
    test.describe(`datatable — ${channel.name}`, () => {
        test('a number column sorts as numbers, not as text [TH37]', async ({ page }) => {
            await page.goto(URL);
            const table = page.locator(channel.table);
            await table.locator('th[data-kp-sort="number"]').click();
            const cells = table.locator('tbody tr:visible td:last-child');
            // Sorted as text, "100" comes before "20" and "1.284,50"
            // before "7". That is the most common data-table bug there is.
            await expect(cells.first()).toHaveText('7');
        });

        test('the sort state reaches aria-sort, and only on the sorted column [TH37]', async ({ page }) => {
            await page.goto(URL);
            const table = page.locator(channel.table);
            const name = table.locator('th[data-kp-sort="text"]');
            const amount = table.locator('th[data-kp-sort="number"]');
            await name.click();
            await expect(name).toHaveAttribute('aria-sort', 'ascending');
            await name.click();
            await expect(name).toHaveAttribute('aria-sort', 'descending');
            // Sorting another column must clear the first: a stale
            // "descending" on a column that is no longer the key is worse
            // than saying nothing.
            await amount.click();
            await expect(amount).toHaveAttribute('aria-sort', 'ascending');
            await expect(name).toHaveAttribute('aria-sort', 'none');
        });

        test('filtering announces how many rows are left [TH37]', async ({ page }) => {
            await page.goto(URL);
            const table = page.locator(channel.table);
            const status = table.locator('[data-kp-datatable-status]');
            // "Showing 1–3 of 4" since gap-13: the rows on the page, and how many a search left.
            await expect(status).toHaveText(S.tableShowing(1, 3, 4, 4));
            await table.locator('[data-kp-datatable-search]').fill('Acme');
            await expect(status).toHaveText(S.tableShowing(1, 1, 1, 4));
        });

        test('an empty result says so instead of showing nothing [TH37, TH50]', async ({ page }) => {
            await page.goto(URL);
            const table = page.locator(channel.table);
            await table.locator('[data-kp-datatable-search]').fill('zzzz');
            await expect(table.locator('[data-kp-datatable-empty]')).toBeVisible();
            await expect(table.locator('tbody tr:visible')).toHaveCount(0);
        });

        test('pagination shows a page at a time [TH37]', async ({ page }) => {
            await page.goto(URL);
            const table = page.locator(channel.table);
            await expect(table.locator('tbody tr:visible')).toHaveCount(3);
            await expect(table.locator('.kp-datatable__page')).toHaveText('1 / 2');
            await table.getByRole('button', { name: S.next }).click();
            await expect(table.locator('tbody tr:visible')).toHaveCount(1);
            await expect(table.locator('.kp-datatable__page')).toHaveText('2 / 2');
        });

        test('the header checkbox is indeterminate for a partial selection [TH37]', async ({ page }) => {
            await page.goto(URL);
            const table = page.locator(channel.table);
            await table.locator('tbody tr:visible [data-kp-select-row]').first().check();
            const all = table.locator('[data-kp-select-all]');
            // A header box reading "checked" while one of three rows is
            // selected is a lie; indeterminate is the honest third state.
            await expect(all).toHaveJSProperty('indeterminate', true);
            await expect(all).not.toBeChecked();
        });

        test('the header checkbox takes every visible row [TH37]', async ({ page }) => {
            await page.goto(URL);
            const table = page.locator(channel.table);
            await table.locator('[data-kp-select-all]').check();
            const boxes = table.locator('tbody tr:visible [data-kp-select-row]');
            await expect(boxes).toHaveCount(3);
            for (let i = 0; i < 3; i += 1) await expect(boxes.nth(i)).toBeChecked();
        });

        test('at 320 px a row becomes a card, carrying its column names [TH37, DI11]', async ({ page }) => {
            await page.setViewportSize({ width: 320, height: 800 });
            await page.goto(URL);
            const table = page.locator(channel.table);

            // The alternative every table reaches for is a horizontal
            // scrollbar, and SC 1.4.10 is about not making a reader drag a
            // page sideways. So the row stacks instead.
            //
            // Drilled per KT3: the `.kp-datatable[data-kp-cards] .kp-table
            // td { display: flex }` rule was deleted from css/components.css
            // and both channels went red here; restored, both pass.
            const cell = table.locator('tbody tr:visible td').nth(1);
            await expect(cell).toHaveCSS('display', 'flex');

            // And the column name travels with the cell, which is what the
            // stylesheet's ::before shows: a value with no question
            // attached is not information.
            //
            // The attribute is asserted rather than the rendered ::before,
            // because getComputedStyle resolves `content` in Chromium and
            // returns the literal `attr(data-label)` in Firefox. That is a
            // difference between the browsers, not between the channels.
            await expect(cell).toHaveAttribute('data-label', 'Naam');

            // The header row is hidden visually, not removed, so it still
            // names the columns for anyone reading the table structure.
            await expect(table.locator('thead')).not.toBeInViewport();
            await expect(table.locator('thead')).toBeAttached();
        });
    });
}

// ── gap-11, the data table footer [Kenny, 2026-09-13, seen in nostromo] ───

const THEME_NAMES = JSON.parse(readFileSync(new globalThis.URL('../themes/order.json', import.meta.url), 'utf8'));

test('the status and pager bar keeps its distance from the table and from the frame, in every theme [gap-11]', async ({ page }) => {
    // gap-11: the footer bar had no padding, so in a theme that frames the data table the row count sat on the frame's left edge and the pager on its bottom edge.
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/catalogue/table.html');
    const table = page.locator('.kp-datatable[data-kp-datatable]').first();
    await expect(table.locator('[data-kp-datatable-status]')).not.toBeEmpty();
    const tight = [];
    for (const theme of THEME_NAMES) {
        await page.evaluate((name) => document.documentElement.setAttribute('data-theme', name), theme);
        const m = await table.evaluate((el) => {
            const s = getComputedStyle(el);
            const box = el.getBoundingClientRect();
            const inner = {
                left: box.left + parseFloat(s.borderLeftWidth),
                right: box.right - parseFloat(s.borderRightWidth),
                bottom: box.bottom - parseFloat(s.borderBottomWidth),
            };
            const wrap = /** @type {Element} */ (el.querySelector(':scope > .kp-table-wrap')).getBoundingClientRect();
            const status = /** @type {Element} */ (el.querySelector('[data-kp-datatable-status]')).getBoundingClientRect();
            const pager = /** @type {Element} */ (el.querySelector('[data-kp-datatable-pager]')).getBoundingClientRect();
            return {
                aboveBar: Math.round(Math.min(status.top, pager.top) - wrap.bottom),
                beforeStatus: Math.round(status.left - inner.left),
                afterPager: Math.round(inner.right - pager.right),
                underBar: Math.round(inner.bottom - Math.max(status.bottom, pager.bottom)),
            };
        });
        const short = Object.entries(m).filter(([, px]) => px < 6);
        if (short.length > 0) tight.push(`${theme}: ${short.map(([side, px]) => `${side} ${px}px`).join(', ')}`);
    }
    expect(tight).toEqual([]);
});

// ── gap-13 and the approved features [Kenny, 2026-09-13] ──────────────────
//
// tests/fixtures/datatable.html: 30 incidents in both channels, the same
// data-test names, one suite. Every test below was run against the code as
// it stood before the change and went red; the line under each name says
// what it measured there.

const FEATURES = '/tests/fixtures/datatable.html';
const FEATURE_CHANNELS = [
    { name: 'framework-free', key: 'plain', table: '[data-test="plain-datatable"]', sticky: '[data-test="plain-sticky"]' },
    { name: 'React', key: 'react', table: '[data-test="react-datatable"] .kp-datatable', sticky: '.kp-datatable[data-test="react-sticky"]' },
];

/** @param {import('@playwright/test').Locator} table */
const visibleKeys = (table) =>
    table.locator('tbody tr:visible').evaluateAll((rows) => rows.map((row) => /** @type {HTMLElement} */ (row).dataset.kpRowKey));
/** @param {import('@playwright/test').Locator} table @param {string} label */
const columnTexts = (table, label) => table.locator(`tbody tr:visible td[data-label="${label}"]`).allInnerTexts();

/** @param {import('@playwright/test').Page} page @param {import('@playwright/test').Locator} table */
const ready = async (page, table) => {
    await page.goto(FEATURES);
    await expect(table.locator('[data-kp-datatable-status]')).not.toBeEmpty();
    await expect(table.locator('tbody tr:visible').first()).toBeVisible();
};

for (const channel of FEATURE_CHANNELS) {
    test.describe(`datatable features — ${channel.name}`, () => {
        test('select-all ticks the rows on this page and no others, and its name says so [gap-13]', async ({ page }) => {
            // Before: the framework-free header box ticked all 30 filtered rows, page two included, and had no name of its own.
            const table = page.locator(channel.table);
            await ready(page, table);
            const all = table.locator('[data-kp-select-all]');
            await expect(all).toHaveAccessibleName(S.tableSelectAll);
            expect(S.tableSelectAll).toContain('page');
            await all.check();
            const onPage = await table.locator('tbody tr:visible').count();
            await expect(table.locator('tbody tr:visible [data-kp-select-row]:checked')).toHaveCount(onPage);
            await table.getByRole('button', { name: S.next }).click();
            await expect(table.locator('tbody tr:visible [data-kp-select-row]').first()).not.toBeChecked();
            await expect(table.locator('tbody tr:visible [data-kp-select-row]:checked')).toHaveCount(0);
        });

        test('the header checkbox follows a search that hides the ticked row [gap-13]', async ({ page }) => {
            // Before: the framework-free header box stayed indeterminate over six unticked rows.
            const table = page.locator(channel.table);
            await ready(page, table);
            await table.locator('tbody tr[data-kp-row-key="INC-4400"] [data-kp-select-row]').check();
            const all = table.locator('[data-kp-select-all]');
            await expect(all).toHaveJSProperty('indeterminate', true);
            await table.locator('[data-kp-datatable-search]').fill('Cold store');
            await expect(table.locator('tbody tr:visible')).toHaveCount(6);
            await expect(all).toHaveJSProperty('indeterminate', false);
            await expect(all).not.toBeChecked();
        });

        test('a column with a declared order sorts by that order, not by the alphabet [gap-13]', async ({ page }) => {
            // Before: Severity sorted Critical, High, Low, Medium.
            const table = page.locator(channel.table);
            await ready(page, table);
            const header = table.locator('th', { hasText: 'Severity' });
            await header.click();
            await expect(header).toHaveAttribute('aria-sort', 'ascending');
            await expect
                .poll(async () => (await columnTexts(table, 'Severity')).slice(0, 9))
                .toEqual(['Low', 'Low', 'Low', 'Low', 'Low', 'Low', 'Low', 'Low', 'Medium']);
            await header.click();
            await expect.poll(async () => (await columnTexts(table, 'Severity'))[0]).toBe('Critical');
        });

        test('compact density shrinks the search box as well as the rows, in every theme [gap-13]', async ({ page }) => {
            // Before: the search box kept its height in every theme (formal 38 px either way).
            const table = page.locator(channel.table);
            await ready(page, table);
            const stuck = [];
            for (const theme of THEME_NAMES) {
                await page.evaluate((name) => document.documentElement.setAttribute('data-theme', name), theme);
                const heights = await table.evaluate((el) => {
                    const search = /** @type {HTMLElement} */ (el.querySelector('[data-kp-datatable-search]'));
                    el.removeAttribute('data-density');
                    const comfortable = search.getBoundingClientRect().height;
                    el.setAttribute('data-density', 'compact');
                    const compact = search.getBoundingClientRect().height;
                    el.removeAttribute('data-density');
                    return { comfortable, compact };
                });
                if (!(heights.compact < heights.comfortable - 2)) stuck.push(`${theme}: ${heights.comfortable} -> ${heights.compact}`);
            }
            expect(stuck).toEqual([]);
        });

        test('the density choice sets the density on the table [A]', async ({ page }) => {
            // Before: no density choice existed.
            const table = page.locator(channel.table);
            await ready(page, table);
            const row = table.locator('tbody tr:visible').first();
            const before = (await row.boundingBox())?.height ?? 0;
            await table.locator('[data-kp-datatable-density]').selectOption({ label: S.tableDensityCompact });
            await expect(table).toHaveAttribute('data-density', 'compact');
            await expect.poll(async () => (await row.boundingBox())?.height ?? 0).toBeLessThan(before - 2);
            await table.locator('[data-kp-datatable-density]').selectOption({ label: S.tableDensityComfortable });
            await expect(table).not.toHaveAttribute('data-density', 'compact');
        });

        test('badges in a squeezed table keep their word whole, in every theme [gap-13]', async ({ page }) => {
            // Before: the status badges broke inside the word in the squeezed table.
            const table = page.locator(channel.sticky);
            await ready(page, page.locator(channel.table));
            const broken = [];
            for (const theme of THEME_NAMES) {
                await page.evaluate((name) => document.documentElement.setAttribute('data-theme', name), theme);
                const lines = await table.evaluate((el) =>
                    [...el.querySelectorAll('tbody .kp-badge')].slice(0, 3).map((badge) => {
                        const range = document.createRange();
                        range.selectNodeContents(badge);
                        return new Set([...range.getClientRects()].map((r) => Math.round(r.top))).size;
                    }),
                );
                if (lines.some((n) => n > 1)) broken.push(`${theme}: ${lines.join(',')} lines`);
            }
            expect(broken).toEqual([]);
        });

        test('search can be limited to one column with the In choice [A]', async ({ page }) => {
            // Before: no In choice; "gate" matched notes as well as sites.
            const table = page.locator(channel.table);
            await ready(page, table);
            const scope = table.locator('[data-kp-datatable-scope]');
            await expect(scope).toHaveAccessibleName(S.tableSearchScope);
            await table.locator('[data-kp-datatable-search]').fill('gate');
            await expect(table.locator('tbody tr:visible')).toHaveCount(12);
            await scope.selectOption({ label: 'Site' });
            await expect(table.locator('tbody tr:visible')).toHaveCount(6);
            expect(new Set(await columnTexts(table, 'Site'))).toEqual(new Set(['Main gate']));
            await scope.selectOption({ label: S.tableSearchAllColumns });
            await expect(table.locator('tbody tr:visible')).toHaveCount(12);
        });

        test('a choice filter narrows the rows and leaves a pill that removes it [A]', async ({ page }) => {
            // Before: no filters.
            const table = page.locator(channel.table);
            await ready(page, table);
            const toggle = table.locator('[data-kp-datatable-filter-toggle]');
            await expect(toggle).toHaveAttribute('aria-expanded', 'false');
            await toggle.click();
            await expect(toggle).toHaveAttribute('aria-expanded', 'true');
            const closed = table.getByRole('group', { name: 'Status' }).getByLabel('Closed', { exact: true });
            await closed.check();
            await expect(table.locator('tbody tr:visible')).toHaveCount(10);
            expect(new Set(await columnTexts(table, 'Status'))).toEqual(new Set(['Closed']));
            await expect(toggle).toHaveText(S.tableFilters(1));
            const label = S.tableFilterValue('Status', 'Closed');
            const pill = table.locator('[data-kp-datatable-pills] .kp-tag');
            await expect(pill).toHaveCount(1);
            await expect(pill).toContainText(label);
            await pill.getByRole('button', { name: S.tableRemoveFilter(label) }).click();
            await expect(table.locator('tbody tr:visible')).toHaveCount(25);
            await expect(closed).not.toBeChecked();
            await expect(table.locator('[data-kp-datatable-pills]')).toBeHidden();
        });

        test('a range filter and a date filter narrow the rows [A]', async ({ page }) => {
            // Before: no filters.
            const table = page.locator(channel.table);
            await ready(page, table);
            await table.locator('[data-kp-datatable-filter-toggle]').click();
            await table.getByLabel(S.tableFilterFrom('Hours')).fill('10');
            await table.getByLabel(S.tableFilterTo('Hours')).fill('20');
            await expect(table.locator('tbody tr:visible')).toHaveCount(6);
            expect((await columnTexts(table, 'Hours')).map(Number).every((h) => h >= 10 && h <= 20)).toBe(true);
            await expect(table.locator('[data-kp-datatable-pills] .kp-tag')).toContainText(S.tableFilterRange('Hours', '10', '20'));
            await table.locator('[data-kp-datatable-pills]').getByRole('button', { name: S.tableClearFilters }).click();
            await expect(table.locator('tbody tr:visible')).toHaveCount(25);
            await table.getByLabel(S.tableFilterFrom('Opened')).fill('2026-08-10');
            await table.getByLabel(S.tableFilterTo('Opened')).fill('2026-08-12');
            await expect(table.locator('tbody tr:visible')).toHaveCount(3);
            expect(await columnTexts(table, 'Opened')).toEqual(['2026-08-10', '2026-08-11', '2026-08-12']);
        });

        test('pages hold 25 rows by default, the size is a choice of 10, 25, 50 or 100, and the status says which rows show [A]', async ({
            page,
        }) => {
            // Before: 10 rows a page, no size choice framework-free, and "30 rows" as the status.
            const table = page.locator(channel.table);
            await ready(page, table);
            const status = table.locator('[data-kp-datatable-status]');
            await expect(table.locator('tbody tr:visible')).toHaveCount(25);
            await expect(status).toHaveText(S.tableShowing(1, 25, 30, 30));
            const size = table.locator('[data-kp-datatable-page-size]');
            await expect(size).toHaveAccessibleName(S.tableRowsPerPage);
            expect(await size.locator('option').allInnerTexts()).toEqual(['10', '25', '50', '100']);
            await size.selectOption('10');
            await expect(table.locator('tbody tr:visible')).toHaveCount(10);
            await expect(status).toHaveText(S.tableShowing(1, 10, 30, 30));
            await table.getByRole('button', { name: S.next }).click();
            await expect(status).toHaveText(S.tableShowing(11, 20, 30, 30));
            await table.locator('[data-kp-datatable-search]').fill('Cold store');
            await expect(status).toHaveText(S.tableShowing(1, 6, 6, 30));
        });

        test('a selection shows the action bar with its count, and clearing it hides the bar [A]', async ({ page }) => {
            // Before: no action bar.
            const table = page.locator(channel.table);
            await ready(page, table);
            const bar = table.locator('[data-kp-datatable-actions]');
            await expect(bar).toBeHidden();
            const boxes = table.locator('tbody tr:visible [data-kp-select-row]');
            await boxes.nth(0).check();
            await boxes.nth(1).check();
            await expect(bar).toBeVisible();
            await expect(bar.locator('[data-kp-datatable-selected-count]')).toHaveText(S.tableSelected(2));
            await bar.locator('[data-kp-datatable-clear-selection]').click();
            await expect(bar).toBeHidden();
            await expect(table.locator('tbody [data-kp-select-row]:checked')).toHaveCount(0);
        });

        test('with a max height the header stays at the top of the scrolling box, on an opaque ground in every theme [A]', async ({ page }) => {
            // Before: the box did not scroll; the header went away with the rows.
            const table = page.locator(channel.sticky);
            await ready(page, page.locator(channel.table));
            const see = [];
            for (const theme of THEME_NAMES) {
                await page.evaluate((name) => document.documentElement.setAttribute('data-theme', name), theme);
                const m = await table.evaluate(async (el) => {
                    const wrap = /** @type {HTMLElement} */ (el.querySelector('.kp-table-wrap'));
                    wrap.scrollTop = 0;
                    wrap.scrollTop = 150;
                    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
                    const th = /** @type {HTMLElement} */ (el.querySelector('thead th'));
                    const ground = getComputedStyle(th).backgroundColor;
                    const parts = ground.match(/[\d.]+/g) ?? [];
                    const alpha = ground === 'transparent' ? 0 : parts.length === 4 ? Number(parts[3]) : 1;
                    return {
                        scrolls: wrap.scrollTop > 0,
                        offset: Math.round(th.getBoundingClientRect().top - wrap.getBoundingClientRect().top),
                        alpha,
                    };
                });
                if (!m.scrolls || m.offset < 0 || m.offset > 4 || m.alpha < 1) see.push(`${theme}: ${JSON.stringify(m)}`);
            }
            expect(see).toEqual([]);
        });

        test('loading, failed and no match each show their state and each has a way out [A]', async ({ page }) => {
            // Before: no loading or failed state framework-free, and no way out of no match.
            const table = page.locator(channel.table);
            await ready(page, table);
            /** @param {string} next */
            const set = (next) => page.evaluate(([key, value]) => /** @type {any} */ (window).kpFixture[key].state(value), [channel.key, next]);

            await set('loading');
            await expect(table.locator('[data-kp-datatable-loading]')).toBeVisible();
            await expect(table).toHaveAttribute('aria-busy', 'true');
            await expect(table.locator('[data-kp-datatable-empty]')).toBeHidden();
            await set('ready');
            await expect(table.locator('[data-kp-datatable-loading]')).toBeHidden();
            await expect(table.locator('tbody tr:visible')).toHaveCount(25);

            await set('failed');
            const failed = table.locator('[data-kp-datatable-failed]');
            await expect(failed).toBeVisible();
            await table.evaluate((el) => el.addEventListener('kp-datatable-retry', () => /** @type {any} */ (window.kpRetried = true)));
            await failed.locator('[data-kp-datatable-retry]').click();
            await expect.poll(() => page.evaluate(() => /** @type {any} */ (window).kpRetried === true)).toBe(true);
            await set('ready');
            await expect(failed).toBeHidden();

            await table.locator('[data-kp-datatable-search]').fill('zzzz');
            const empty = table.locator('[data-kp-datatable-empty]');
            await expect(empty).toBeVisible();
            await empty.locator('[data-kp-datatable-clear]').click();
            await expect(table.locator('[data-kp-datatable-search]')).toHaveValue('');
            await expect(table.locator('tbody tr:visible')).toHaveCount(25);
            await expect(empty).toBeHidden();
        });

        test('in the card layout a sort control stands in for the hidden headers [gap-13]', async ({ page }) => {
            // Before: the headers were visually hidden and nothing else could sort.
            const table = page.locator(channel.table);
            await ready(page, table);
            const control = table.locator('[data-kp-datatable-card-sort]');
            await expect(control).toBeHidden();
            await page.setViewportSize({ width: 400, height: 900 });
            await expect(control).toBeVisible();
            await control.locator('[data-kp-datatable-sort-by]').selectOption({ label: 'Severity' });
            await expect(table.locator('th', { hasText: 'Severity' })).toHaveAttribute('aria-sort', 'ascending');
            await expect.poll(async () => (await columnTexts(table, 'Severity'))[0]).toBe('Low');
            const direction = control.locator('[data-kp-datatable-sort-direction]');
            await expect(direction).toHaveText(S.tableSortAscending);
            await direction.click();
            await expect(direction).toHaveText(S.tableSortDescending);
            await expect.poll(async () => (await columnTexts(table, 'Severity'))[0]).toBe('Critical');
        });

        test('the table hands over the rows it shows, through a method and an event [A]', async ({ page }) => {
            // Before: no rows() on the handle, and the view event carried counts only.
            const table = page.locator(channel.table);
            await ready(page, table);
            await table.evaluate((el) => {
                const w = /** @type {any} */ (window);
                w.kpViews = [];
                el.addEventListener('kp-datatable-view', (e) => w.kpViews.push(/** @type {CustomEvent} */ (e).detail.keys));
            });
            await table.locator('[data-kp-datatable-search]').fill('Cold store');
            await expect(table.locator('tbody tr:visible')).toHaveCount(6);
            const shown = await visibleKeys(table);
            await expect.poll(() => page.evaluate(() => /** @type {any} */ (window).kpViews.at(-1))).toEqual(shown);
            expect(await page.evaluate((key) => /** @type {any} */ (window).kpFixture[key].rowKeys(), channel.key)).toEqual(shown);
            expect(await page.evaluate((key) => /** @type {any} */ (window).kpFixture[key].pageKeys(), channel.key)).toEqual(shown);
        });

        test("the row and header checkboxes wear the theme's own checkbox, in every theme [gap-13, Kenny's note]", async ({ page }) => {
            // Before: the table's boxes were bare browser checkboxes, unlike .kp-field__check in every theme.
            const table = page.locator(channel.table);
            await ready(page, table);
            await table.locator('tbody tr[data-kp-row-key="INC-4401"] [data-kp-select-row]').check();
            const differ = [];
            for (const theme of THEME_NAMES) {
                await page.evaluate((name) => document.documentElement.setAttribute('data-theme', name), theme);
                const found = await table.evaluate((el) => {
                    const PROPS = [
                        'appearance',
                        'width',
                        'height',
                        'accent-color',
                        'border-top-left-radius',
                        'background-color',
                        'background-image',
                        'box-shadow',
                        'transform',
                    ];
                    const DRAWN = ['border-top-width', 'border-top-style'];
                    const BEFORE = ['content', 'width', 'height', 'color', 'background-color', 'clip-path'];
                    /** @param {Element} box */
                    const paint = (box) => {
                        const s = getComputedStyle(box);
                        const b = getComputedStyle(box, '::before');
                        /** @type {Record<string, string>} */
                        const out = Object.fromEntries(PROPS.map((p) => [p, s.getPropertyValue(p)]));
                        if (s.getPropertyValue('appearance') === 'none') {
                            for (const p of DRAWN) out[p] = s.getPropertyValue(p);
                            // A border's colour is paint only where the border is drawn.
                            if (s.getPropertyValue('border-top-style') !== 'none') out['border-top-color'] = s.getPropertyValue('border-top-color');
                            out['::before content'] = b.getPropertyValue('content');
                            // The mark's paint only where there is a mark.
                            if (!['none', 'normal'].includes(b.getPropertyValue('content')))
                                for (const p of BEFORE) out[`::before ${p}`] = b.getPropertyValue(p);
                        }
                        return out;
                    };
                    const off = paint(/** @type {Element} */ (document.getElementById('ref-off')));
                    const on = paint(/** @type {Element} */ (document.getElementById('ref-on')));
                    /** @type {[string, Element | null, Record<string, string>][]} */
                    const pairs = [
                        ['header', el.querySelector('[data-kp-select-all]'), off],
                        ['row', el.querySelector('tbody tr[data-kp-row-key="INC-4400"] [data-kp-select-row]'), off],
                        ['ticked row', el.querySelector('tbody tr[data-kp-row-key="INC-4401"] [data-kp-select-row]'), on],
                    ];
                    const out = [];
                    for (const [name, box, want] of pairs) {
                        const got = paint(/** @type {Element} */ (box));
                        for (const [p, v] of Object.entries(want)) if (got[p] !== v) out.push(`${name} ${p}: ${got[p]} vs ${v}`);
                    }
                    return out;
                });
                if (found.length > 0) differ.push(`${theme}: ${found.join('; ')}`);
            }
            expect(differ).toEqual([]);
        });
    });
}

test.describe('datatable features — React sort header', () => {
    test("the sort button keeps the arrow on the header's line, the header's case and spacing, and the cell knob [gap-13]", async ({ page }) => {
        // Before: the sortable header stood two lines tall in nostromo, the button dropped the uppercase, and --kp-table-cell-inline did not reach it.
        const table = page.locator('[data-test="react-datatable"] .kp-datatable');
        await ready(page, table);
        await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'nostromo'));
        const sortable = table.locator('th', { hasText: 'Reference' });
        const button = sortable.locator('.kp-datatable__sort');
        await expect(button).toBeVisible();
        // Against the framework-free header of the same column on the same
        // page, which has no button and draws the same arrow after its text:
        // an arrow pushed to a line of its own makes the React header taller
        // by that line.
        const plainSortable = page.locator('[data-test="plain-datatable"] th', { hasText: 'Reference' });
        await expect
            .poll(async () => Math.round(((await sortable.boundingBox())?.height ?? 0) - ((await plainSortable.boundingBox())?.height ?? 0)))
            .toBe(0);
        await expect(button).toHaveCSS('text-transform', 'uppercase');
        const spacing = await sortable.evaluate((th) => getComputedStyle(th).letterSpacing);
        await expect(button).toHaveCSS('letter-spacing', spacing);

        await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'formal'));
        await table.evaluate((el) => /** @type {HTMLElement} */ (el).style.setProperty('--kp-table-cell-inline', '2rem'));
        await expect
            .poll(() =>
                sortable.evaluate((th) => {
                    const range = document.createRange();
                    range.selectNodeContents(/** @type {Element} */ (th.querySelector('.kp-datatable__sort')));
                    return Math.round(range.getBoundingClientRect().left - th.getBoundingClientRect().left);
                }),
            )
            .toBe(32);
    });
});

// ── Kenny's review notes of 2026-09-13: the date filter, the pager, the bars ─
//
// Measured in Firefox before the change, each test below went red on the
// code as it stood; the line under each name records what it read there.

/** What a button paints, as the theme computes it: the reading two buttons that should look alike must agree on. */
const buttonPaint = (/** @type {Element} */ el) => {
    const s = getComputedStyle(el);
    return [
        s.color,
        s.backgroundColor,
        s.backgroundImage,
        s.backgroundPosition,
        s.borderTopColor,
        s.borderTopWidth,
        s.borderTopStyle,
        s.boxShadow,
        s.clipPath,
    ].join(' | ');
};

/** Put a theme on and wait out what the switch set moving, so a colour is read where it lands. @param {import('@playwright/test').Page} page @param {string} theme */
const wearSettled = async (page, theme) => {
    await page.evaluate((name) => document.documentElement.setAttribute('data-theme', name), theme);
    await page.evaluate(() =>
        Promise.all(
            document
                .getAnimations()
                .filter((a) => a.effect?.getTiming().iterations !== Infinity)
                .map((a) => a.finished.catch(() => {})),
        ),
    );
};

for (const channel of FEATURE_CHANNELS) {
    test.describe(`datatable review notes — ${channel.name}`, () => {
        test("the date filter's calendar button is the date picker's own: its classes, its glyph, its name [Kenny's note 1]", async ({ page }) => {
            // Before: class "kp-button kp-button--ghost", the text "Calendar", no title — the standalone picker has "kp-button", ▦ and a title.
            await page.goto('/catalogue/datepicker.html');
            /** @param {Element} opener */
            const markup = (opener) => ({
                className: opener.className,
                glyph: opener.querySelector('[aria-hidden="true"]')?.textContent?.trim() ?? null,
                text: opener.textContent?.trim(),
                name: opener.getAttribute('aria-label'),
                title: opener.getAttribute('title'),
            });
            const standalone = await page.locator('#closed [data-kp-date-open]').first().evaluate(markup);
            const table = page.locator(channel.table);
            await ready(page, table);
            await table.locator('[data-kp-datatable-filter-toggle]').click();
            const openers = table.getByRole('group', { name: 'Opened' }).locator('[data-kp-date-open]');
            await expect(openers).toHaveCount(2);
            for (const opener of await openers.all()) expect(await opener.evaluate(markup)).toEqual(standalone);
        });

        test("the date filter's field shows the whole date, beside its calendar button, in every theme [Kenny's note 1]", async ({ page }) => {
            // Before: see the report for the per-theme reading; formal had 73px of room for the 95px hint in the catalogue.
            const table = page.locator(channel.table);
            await ready(page, table);
            await table.locator('[data-kp-datatable-filter-toggle]').click();
            const input = table.getByLabel(S.tableFilterFrom('Opened'), { exact: true });
            await expect(input).toBeVisible();
            const short = [];
            for (const theme of THEME_NAMES) {
                await wearSettled(page, theme);
                const m = await input.evaluate((el) => {
                    const field = /** @type {HTMLInputElement} */ (el);
                    const s = getComputedStyle(field);
                    const context = /** @type {CanvasRenderingContext2D} */ (document.createElement('canvas').getContext('2d'));
                    context.font = `${s.fontStyle} ${s.fontWeight} ${s.fontSize} ${s.fontFamily}`;
                    if (s.letterSpacing !== 'normal') context.letterSpacing = s.letterSpacing;
                    // The widest thing the field has to hold: the hint, or a whole date in the same pattern.
                    const need = Math.ceil(Math.max(context.measureText(field.placeholder).width, context.measureText('28/12/2026').width));
                    const room = Math.floor(field.clientWidth - parseFloat(s.paddingLeft) - parseFloat(s.paddingRight));
                    const opener = /** @type {Element} */ (field.closest('.kp-datepicker')?.querySelector('[data-kp-date-open]'));
                    const a = field.getBoundingClientRect();
                    const b = opener.getBoundingClientRect();
                    // Beside it: the button starts where the field ends and shares its line (their heights are the control-height question, not this one).
                    const sameLine = b.left >= a.right - 1 && b.top < a.bottom && b.bottom > a.top;
                    return { need, room, sameLine, field: Math.round(a.width), button: Math.round(b.width) };
                });
                if (m.room < m.need || !m.sameLine)
                    short.push(
                        `${theme}: ${m.room}px for ${m.need}px (field ${m.field}, button ${m.button})${m.sameLine ? '' : ', button on another line'}`,
                    );
            }
            expect(short).toEqual([]);
        });

        test("the pager's buttons are the theme's own button at rest, and Previous differs only where a theme points it backwards [Kenny's note 3]", async ({
            page,
        }) => {
            // Before: kp-button--ghost on both, so Next differed from the theme's button in all 22 themes (text only, no edge, in eleven).
            const table = page.locator(channel.table);
            await page.emulateMedia({ reducedMotion: 'reduce' });
            await ready(page, table);
            await table.locator('[data-kp-datatable-page-size]').selectOption('10');
            const pager = table.locator('[data-kp-datatable-pager]');
            await pager.getByRole('button', { name: S.next }).click();
            const previous = pager.getByRole('button', { name: S.previous });
            const next = pager.getByRole('button', { name: S.next });
            await expect(previous).toBeEnabled();
            await page.mouse.move(0, 0);
            await page.evaluate(() => /** @type {HTMLElement | null} */ (document.activeElement)?.blur());
            await page.evaluate(() => {
                const row = document.createElement('div');
                for (const [ref, className] of [
                    ['bare', 'kp-button'],
                    ['mirror', 'kp-button kp-button--mirror'],
                ]) {
                    const button = document.createElement('button');
                    button.type = 'button';
                    button.className = className;
                    button.dataset.ref = ref;
                    button.textContent = 'Reference';
                    row.append(button);
                }
                document.body.append(row);
            });
            const differ = [];
            for (const theme of THEME_NAMES) {
                await wearSettled(page, theme);
                const bare = await page.locator('[data-ref="bare"]').evaluate(buttonPaint);
                const got = await next.evaluate(buttonPaint);
                if (got !== bare) differ.push(`${theme} Next: ${got}`);
                // Cyberpunk cuts its notch on the other side of a button that points back; every other theme draws the bare button.
                if (theme === 'cyberpunk') {
                    const clip = await previous.evaluate((el) => getComputedStyle(el).clipPath);
                    const mirrored = await page.locator('[data-ref="mirror"]').evaluate((el) => getComputedStyle(el).clipPath);
                    if (clip !== mirrored) differ.push(`${theme} Previous clip: ${clip}, want ${mirrored}`);
                } else {
                    const back = await previous.evaluate(buttonPaint);
                    if (back !== bare) differ.push(`${theme} Previous: ${back}`);
                }
            }
            expect(differ).toEqual([]);
        });

        test('a calendar opened inside a card or an alert that clips its corners is whole and takes its clicks, in every theme [coordinator finding]', async ({
            page,
        }) => {
            // Before: 31 of 31 days out of reach in dark, cyberpunk, phantom and titanium (the container clip-path cut the panel away), 23 in terminal.
            const table = page.locator(channel.table);
            await page.emulateMedia({ reducedMotion: 'reduce' });
            await ready(page, table);
            await table.locator('[data-kp-datatable-filter-toggle]').click();
            const opened = table.getByRole('group', { name: 'Opened' });
            const picker = opened.locator('.kp-datepicker').nth(1);
            await table.getByLabel(S.tableFilterTo('Opened'), { exact: true }).fill('2026-08-01');
            const lost = [];
            for (const container of ['kp-card', 'kp-alert']) {
                // The filter's own fieldset wears the container: its box ends under the field, so the calendar hangs outside it.
                await opened.evaluate((el, name) => {
                    el.classList.remove('kp-card', 'kp-alert');
                    el.classList.add(name);
                }, container);
                for (const theme of THEME_NAMES) {
                    await wearSettled(page, theme);
                    await picker.locator('[data-kp-date-open]').click();
                    const panel = picker.locator('.kp-datepicker__panel');
                    await expect(panel).toBeVisible();
                    const missed = await panel.evaluate((el) => {
                        const days = [...el.querySelectorAll('[data-kp-day]')];
                        return days.filter((day) => {
                            const box = day.getBoundingClientRect();
                            const hit = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
                            return hit !== day && !day.contains(hit);
                        }).length;
                    });
                    if (missed > 0) lost.push(`${theme} in .${container}: ${missed} days out of reach`);
                    // The trigger toggles it shut in both channels (the React picker's Escape lives on the days, not on the trigger).
                    await picker.locator('[data-kp-date-open]').click();
                    await expect(panel).toBeHidden();
                }
            }
            expect(lost).toEqual([]);
        });

        test("both bars are inset by default, and the inset is two knobs [Kenny's note 4]", async ({ page }) => {
            // Before: one shorthand knob; setting --kp-datatable-bar-padding-inline and -block left 12px and 8px in place.
            const table = page.locator(channel.table);
            await ready(page, table);
            const bars = table.locator(':scope > .kp-datatable__bar');
            await expect(bars).toHaveCount(2);
            for (const bar of await bars.all()) {
                await expect(bar).toHaveCSS('padding-inline-start', '12px');
                await expect(bar).toHaveCSS('padding-block-end', '8px');
            }
            await table.evaluate((el) => {
                /** @type {HTMLElement} */ (el).style.setProperty('--kp-datatable-bar-padding-inline', '1.5rem');
                /** @type {HTMLElement} */ (el).style.setProperty('--kp-datatable-bar-padding-block', '0.25rem');
            });
            for (const bar of await bars.all()) {
                await expect(bar).toHaveCSS('padding-inline-start', '24px');
                await expect(bar).toHaveCSS('padding-inline-end', '24px');
                await expect(bar).toHaveCSS('padding-block-start', '4px');
                await expect(bar).toHaveCSS('padding-block-end', '4px');
            }
        });
    });
}
