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
import { waitForJudging } from './helpers/catalogue.mjs';
import { useEmptyRegister } from './helpers/empty-register.mjs';

const URL = '/tests/fixtures/components.html';

const CHANNELS = [
    { name: 'framework-free', table: '[data-test="plain-datatable"]' },
    { name: 'React', table: '[data-test="react-datatable"] .kp-datatable' },
];

for (const channel of CHANNELS) {
    test.describe(`datatable — ${channel.name}`, { tag: ['@component:datatable'] }, () => {
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

const THEME_NAMES = JSON.parse(readFileSync(new globalThis.URL('../themes/order.json', import.meta.url), 'utf8'));

// ── gap-13 and the approved features [Kenny, 2026-09-13] ──────────────────
//
// tests/fixtures/datatable.html: 30 incidents in both channels, the same
// data-test names, one suite. Every test below was run against the code as
// it stood before the change and went red; the line under each name says
// what it measured there.

const FEATURES = '/tests/fixtures/datatable.html';
const FEATURE_CHANNELS = [
    { name: 'framework-free', key: 'plain', table: '[data-test="plain-datatable"]' },
    { name: 'React', key: 'react', table: '[data-test="react-datatable"] .kp-datatable' },
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
    test.describe(`datatable features — ${channel.name}`, { tag: ['@component:datatable'] }, () => {
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

        test("the filter panel's choices follow the rows: gone with them, back when they are written, a ticked value kept", async ({ page }) => {
            // Before: framework-free, the Status list still held Closed, Open and Watching with no row on the table; the panel read its values once, at attach (research/datatable/demo.html writes its rows after the attach, and its list stayed empty).
            const table = page.locator(channel.table);
            await ready(page, table);
            /** @param {string} next */
            const set = (next) => page.evaluate(([key, value]) => /** @type {any} */ (window).kpFixture[key].state(value), [channel.key, next]);
            const status = table.getByRole('group', { name: 'Status' });
            const listed = () =>
                status.locator('input[type="checkbox"]').evaluateAll((boxes) => boxes.map((b) => /** @type {HTMLInputElement} */ (b).value));
            await table.locator('[data-kp-datatable-filter-toggle]').click();
            await status.getByLabel('Closed', { exact: true }).check();
            await expect(table.locator('tbody tr:visible')).toHaveCount(10);

            await set('loading');
            await expect.poll(listed, 'no row holds a status; only the ticked one stays, to be unticked').toEqual(['Closed']);
            await expect(status.getByLabel('Closed', { exact: true })).toBeChecked();

            await set('ready');
            await expect.poll(listed, 'the rows are back, and so are their values').toEqual(['Closed', 'Open', 'Watching']);
            await expect(status.getByLabel('Closed', { exact: true })).toBeChecked();
            await expect(table.locator('tbody tr:visible')).toHaveCount(10);
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
    });
}

test.describe('datatable features — React sort header', { tag: ['@component:datatable'] }, () => {
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

// ── Kenny's review notes of 2026-09-13: the date filter and the bars ───────
//
// Measured in Firefox before the change, each test below went red on the
// code as it stood; the line under each name records what it read there.

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
    test.describe(`datatable review notes — ${channel.name}`, { tag: ['@component:datatable', '@component:datepicker'] }, () => {
        test(
            "the date filter's calendar button is the date picker's own: its classes, its glyph, its name [Kenny's note 1]",
            { tag: ['@component:catalogue'] },
            async ({ page }) => {
                // Before: class "kp-button kp-button--ghost", the text "Calendar", no title — the standalone picker has "kp-button", ▦ and a title.
                await useEmptyRegister(page.context());
                await page.goto('/catalogue/datepicker.html');
                await waitForJudging(page);
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
            },
        );

        test(
            'a calendar opened inside a card or an alert that clips its corners is whole and takes its clicks, in every theme [coordinator finding]',
            { tag: ['@sweep'] },
            async ({ page }) => {
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
            },
        );

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

// ── fix-32: the sticky header's ground reaches above it ───────────────────
//
// Kenny, in FireDragon, saw slivers of row text just above the header that
// stays while wheel-scrolling. The measure: each header cell's ground
// reaches 2px above the cell, an unblurred shadow in the colour the cell
// paints, clipped by the scroll box. A register that paints its own header
// ground or shadow must keep the reach, in that colour.

/** Split a computed box-shadow into its shadows. @param {string} value */
const shadowsOf = (value) => {
    if (!value || value === 'none') return [];
    const parts = [];
    let depth = 0;
    let from = 0;
    for (let i = 0; i < value.length; i++) {
        if (value[i] === '(') depth++;
        else if (value[i] === ')') depth--;
        else if (value[i] === ',' && depth === 0) {
            parts.push(value.slice(from, i).trim());
            from = i + 1;
        }
    }
    parts.push(value.slice(from).trim());
    return parts.map((part) => {
        const colour = part.match(/(?:rgba?|color|oklch|oklab)\([^)]*\)|transparent/)?.[0] ?? '';
        const [x = 0, y = 0, blur = 0, spread = 0] = part
            .replace(colour, '')
            .replace(/\binset\b/, '')
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .map((n) => parseFloat(n));
        return { inset: /\binset\b/.test(part), colour, x, y, blur, spread };
    });
};

test.describe('datatable sticky header reach [fix-32, scope-90]', { tag: ['@component:datatable'] }, () => {
    /** @type {[string, string][]} */
    const TABLES = [
        ['/tests/fixtures/datatable.html', '.kp-datatable[data-test="plain-sticky"]'],
        ['/tests/fixtures/datatable.html', '.kp-datatable[data-test="react-sticky"]'],
        ['/tests/fixtures/datatable-more.html', '.kp-datatable[data-test="plain-fixed"]'],
        ['/tests/fixtures/datatable-more.html', '.kp-datatable[data-test="react-fixed"]'],
    ];

    /**
     * Scroll the table's box to `top` and wait until the module has heard it:
     * the scroll event, then two frames for its one decision per frame.
     * @param {import('@playwright/test').Locator} table @param {number} top
     */
    const scrollBoxTo = (table, top) =>
        table.evaluate(
            (el, to) =>
                new Promise((done) => {
                    const box = /** @type {HTMLElement} */ (el.querySelector(':scope > .kp-table-wrap'));
                    const frames = () => requestAnimationFrame(() => requestAnimationFrame(() => done(box.scrollTop)));
                    if (box.scrollTop === to) frames();
                    else {
                        box.addEventListener('scroll', frames, { once: true });
                        box.scrollTop = to;
                    }
                }),
            top,
        );

    /** Every header cell's shadow, ground, position and box, and the caption's box. @param {import('@playwright/test').Locator} table */
    const readHead = (table) =>
        table.evaluate((el) => {
            const box = (/** @type {Element} */ node) => {
                const r = node.getBoundingClientRect();
                return { top: r.top, right: r.right, bottom: r.bottom, left: r.left };
            };
            const caption = el.querySelector('caption');
            const captionShown = caption !== null && getComputedStyle(caption).visibility !== 'hidden' && caption.getBoundingClientRect().height > 0;
            return {
                scrolled: el.hasAttribute('data-kp-scrolled'),
                caption: captionShown && caption !== null ? box(caption) : null,
                cells: [...el.querySelectorAll('thead th')].map((th) => {
                    const s = getComputedStyle(th);
                    return {
                        fixed: th.getAttribute('data-kp-fixed'),
                        shadow: s.boxShadow,
                        ground: s.backgroundColor,
                        position: s.position,
                        rect: box(th),
                    };
                }),
            };
        });

    /** The reach: an unblurred outer shadow in the cell's ground, at least 2px above it. @param {{ shadow: string, ground: string }} cell */
    const reachOf = (cell) =>
        shadowsOf(cell.shadow).find((sh) => !sh.inset && sh.x === 0 && sh.blur === 0 && sh.spread - sh.y >= 2 && sh.colour === cell.ground);

    for (const [url, selector] of TABLES) {
        test(
            `the sticky header's ground reaches 2px above it only while its box is scrolled, in every theme: ${selector} [fix-32, scope-90]`,
            { tag: ['@sweep'] },
            async ({ page }) => {
                // Before (a051db4d): no shadow reaching above a sticky header cell, in any theme.
                // Before (6fd84fe0): the reach was drawn at rest too, over the caption's bottom 2px.
                await page.goto(url);
                const table = page.locator(selector);
                await expect(table.locator('thead th').first()).toBeVisible();
                const faults = [];
                for (const theme of THEME_NAMES) {
                    await wearSettled(page, theme);

                    await scrollBoxTo(table, 0);
                    const rest = await readHead(table);
                    if (rest.scrolled) faults.push(`${theme} at rest: data-kp-scrolled is set`);
                    rest.cells.forEach((cell, i) => {
                        const name = `${theme} at rest, th ${i + 1}${cell.fixed ? ` (fixed ${cell.fixed})` : ''}`;
                        if (cell.position !== 'sticky') faults.push(`${name}: position ${cell.position}`);
                        if (reachOf(cell)) faults.push(`${name}: reach drawn, shadow "${cell.shadow}"`);
                        // No outer shadow of the cell may reach into the caption's box.
                        const caption = rest.caption;
                        if (caption === null) return;
                        for (const sh of shadowsOf(cell.shadow)) {
                            if (sh.inset) continue;
                            const grow = sh.spread + sh.blur;
                            const top = cell.rect.top + sh.y - grow;
                            const bottom = cell.rect.bottom + sh.y + grow;
                            const left = cell.rect.left + sh.x - grow;
                            const right = cell.rect.right + sh.x + grow;
                            const overlap = Math.min(bottom, caption.bottom) - Math.max(top, caption.top);
                            const across = Math.min(right, caption.right) - Math.max(left, caption.left);
                            if (overlap > 0.01 && across > 0.01)
                                faults.push(`${name}: shadow "${cell.shadow}" covers ${overlap.toFixed(2)}px of the caption`);
                        }
                    });

                    const moved = await scrollBoxTo(table, 40);
                    const scrolled = await readHead(table);
                    if (moved <= 0) faults.push(`${theme}: the box did not scroll`);
                    else if (!scrolled.scrolled) faults.push(`${theme} scrolled: data-kp-scrolled is not set`);
                    scrolled.cells.forEach((cell, i) => {
                        const name = `${theme} scrolled, th ${i + 1}${cell.fixed ? ` (fixed ${cell.fixed})` : ''}`;
                        if (!reachOf(cell)) faults.push(`${name}: shadow "${cell.shadow}", ground ${cell.ground}`);
                    });

                    await scrollBoxTo(table, 0);
                    const back = await readHead(table);
                    if (back.scrolled) faults.push(`${theme} back at the top: data-kp-scrolled is still set`);
                    back.cells.forEach((cell, i) => {
                        if (reachOf(cell)) faults.push(`${theme} back at the top, th ${i + 1}: reach still drawn, shadow "${cell.shadow}"`);
                    });
                }
                expect(faults).toEqual([]);
            },
        );
    }
});
