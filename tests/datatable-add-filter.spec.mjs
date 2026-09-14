// The data table's add-filter mode, in both channels.
//
// Kenny's form of 2026-09-14, item filter-design, "Allebei, per tabel": the
// "+ Add filter" design of research/datatable/demo.html#filter-add, built
// into .kp-datatable beside the filter panel, chosen per table with
// `data-kp-filter-mode="add"` or `filterMode="add"`. A menu of filterable
// columns, an editor per kind, one pill per filter that reopens its editor,
// a mark on a filtered column, Clear all from two pills, and the same filter
// state the panel keeps. tests/fixtures/datatable-more.html holds one such
// table per channel, with the same data-test names [AR7].
//
// Every test below was run against the code before the change (7780e64) and
// went red: that code had no add-filter mode, so the table drew the filter
// panel and its toggle, and there was no "+ Add filter" button to press.

import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';
import { DEFAULT_STRINGS as S } from '../js/strings.js';
import { INCIDENTS } from './fixtures/datatable-data.mjs';

const URL = '/tests/fixtures/datatable-more.html';
const THEME_NAMES = JSON.parse(readFileSync(new globalThis.URL('../themes/order.json', import.meta.url), 'utf8'));
const CHANNELS = [
    { name: 'framework-free', key: 'plain', status: '2', hours: '3', opened: '4' },
    { name: 'React', key: 'react', status: 'status', hours: 'hours', opened: 'opened' },
];

/** @param {import('@playwright/test').Page} page @param {string} key */
const open = async (page, key) => {
    await page.goto(URL);
    const table = page.locator(`.kp-datatable[data-test="${key}-addfilter"]`);
    await expect(table.locator('tbody tr').first()).toBeVisible();
    await table.scrollIntoViewIfNeeded();
    return table;
};
/** @param {import('@playwright/test').Page} page @param {string} key @param {string} what */
const fixture = (page, key, what) => page.evaluate(([k, w]) => /** @type {any} */ (window).kpFixture[k][w](), [key, what]);
/** @param {import('@playwright/test').Locator} table */
const statusColumn = (table) => table.locator('tbody tr:visible td:nth-child(3)').allInnerTexts();
/** @param {import('@playwright/test').Locator} table */
const addButton = (table) => table.locator('[data-kp-datatable-add-filter]');
/** @param {import('@playwright/test').Locator} table */
const menu = (table) => table.locator('[data-kp-datatable-add-menu]');
/** @param {import('@playwright/test').Locator} table */
const editor = (table) => table.locator('[data-kp-datatable-filter-editor]');
/** @param {import('@playwright/test').Locator} table */
const pills = (table) => table.locator('[data-kp-datatable-pills] .kp-tag');
/** @param {import('@playwright/test').Locator} table @param {string} column */
const choose = async (table, column) => {
    await addButton(table).click();
    await expect(menu(table)).toBeVisible();
    await menu(table).locator('.kp-menu__item', { hasText: column }).click();
    await expect(editor(table)).toBeVisible();
};
/** Whether what the eye sees at an element's centre is that element. @param {import('@playwright/test').Locator} locator */
const reachable = (locator) =>
    locator.evaluate((el) => {
        const r = el.getBoundingClientRect();
        const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
        return r.width > 0 && r.height > 0 && hit !== null && (hit === el || el.contains(hit));
    });
/**
 * Reachable once it has settled [KT16]: a register may animate a menu in or a
 * button's box on a theme change, and a read in the middle of it misses.
 * @param {import('@playwright/test').Locator} locator
 */
const settles = async (locator) => {
    try {
        await expect.poll(() => reachable(locator), { timeout: 3000 }).toBe(true);
        return true;
    } catch {
        return false;
    }
};

const HOURS_10_20 = INCIDENTS.filter((row) => row.hours >= 10 && row.hours <= 20).length;
const OPENED_10_20 = INCIDENTS.filter((row) => row.opened >= '2026-08-10' && row.opened <= '2026-08-20').length;

for (const channel of CHANNELS) {
    const { key } = channel;

    test.describe(`datatable add-filter mode — ${channel.name}`, { tag: ['@component:datatable'] }, () => {
        test('"+ Add filter" opens a menu of the filterable columns, and no panel is drawn', async ({ page }) => {
            // Before: no [data-kp-datatable-add-filter] existed; the table drew the "Filters" toggle and panel instead.
            const table = await open(page, key);
            await expect(table.locator('[data-kp-datatable-filters]')).toHaveCount(0);
            await expect(table.locator('[data-kp-datatable-filter-toggle]')).toHaveCount(0);
            await expect(addButton(table)).toHaveText(S.tableAddFilter(0));
            await expect(addButton(table)).toHaveAttribute('aria-expanded', 'false');
            await expect(menu(table)).toBeHidden();
            await addButton(table).click();
            await expect(menu(table)).toBeVisible();
            await expect(addButton(table)).toHaveAttribute('aria-expanded', 'true');
            const items = menu(table).locator('.kp-menu__item');
            await expect(items).toHaveText(['Site', 'Status', 'Hours', 'Opened']);
            await expect(items.first()).toBeFocused();
            await expect(items.nth(1)).toHaveAttribute('aria-label', S.tableAddFilterItem('Status'));
            for (let i = 0; i < 4; i++) expect(await settles(items.nth(i)), `menu item ${i} is under its own centre`).toBe(true);
        });

        test('choosing a choice column opens its editor; Apply adds one pill that filters the rows, in the same shape the panel keeps', async ({
            page,
        }) => {
            // Before: no add-filter button, so no editor, no pill and no filter.
            const table = await open(page, key);
            await choose(table, 'Status');
            const boxes = editor(table).locator('input.kp-field__check');
            await expect(boxes).toHaveCount(3);
            await expect(editor(table).locator('.kp-field__option')).toHaveText(['Open', 'Watching', 'Closed']);
            await expect(editor(table)).toHaveAttribute('aria-label', S.tableFilterEditor('Status'));
            await expect(boxes.first()).toBeFocused();
            await boxes.nth(0).check();
            await boxes.nth(1).check();
            await editor(table).getByRole('button', { name: S.tableFilterApply }).click();
            await expect(editor(table)).toBeHidden();
            await expect(pills(table)).toHaveCount(1);
            const pill = table.locator('[data-kp-filter-pill]');
            await expect(pill).toHaveText(S.tableFilterChoicePill('Status', ['Open', 'Watching']));
            await expect(pill).toBeFocused();
            await expect(addButton(table)).toHaveText(S.tableAddFilter(1));
            const shown = await statusColumn(table);
            expect(shown.length).toBe(20);
            expect(new Set(shown)).toEqual(new Set(['Open', 'Watching']));
            // The state an app reads is the panel's shape: a column's ticked values.
            const expected = { [channel.status]: ['Open', 'Watching'] };
            expect(await fixture(page, key, 'filters')).toEqual(expected);
            await expect.poll(() => fixture(page, key, 'viewFilters')).toEqual(expected);
        });

        test('a number range is validated, then shown as one pill; the pill reopens its editor with the values', async ({ page }) => {
            // Before: no add-filter button, so no range editor and no validation.
            const table = await open(page, key);
            await choose(table, 'Hours');
            const from = editor(table).locator('[data-kp-filter-bound="from"]');
            const to = editor(table).locator('[data-kp-filter-bound="to"]');
            await expect(editor(table).locator('label.kp-field__label')).toHaveText([
                S.tableFilterBound('range', 'from', 'Hours'),
                S.tableFilterBound('range', 'to', 'Hours'),
            ]);
            await from.fill('ten');
            await from.press('Enter');
            const error = editor(table).locator('[data-kp-filter-error]');
            await expect(error).toHaveText(S.tableFilterNotNumber(S.tableFilterFrom('Hours'), 'ten'));
            await expect(from).toHaveAttribute('aria-invalid', 'true');
            await expect(pills(table)).toHaveCount(0);
            await from.fill('20');
            await to.fill('10');
            await to.press('Enter');
            await expect(error).toHaveText(S.tableFilterBackwards('20', '10'));
            await from.fill('10');
            await to.fill('20');
            await to.press('Enter');
            await expect(editor(table)).toBeHidden();
            const pill = table.locator('[data-kp-filter-pill]');
            await expect(pill).toHaveText(S.tableFilterSpanPill('Hours', '10', '20', 'range'));
            await expect(table.locator('tbody tr:visible')).toHaveCount(HOURS_10_20);
            expect(await fixture(page, key, 'filters')).toEqual({ [channel.hours]: { from: '10', to: '20' } });

            await pill.click();
            await expect(editor(table)).toBeVisible();
            await expect(pill).toHaveAttribute('aria-expanded', 'true');
            await expect(editor(table).locator('[data-kp-filter-bound="from"]')).toHaveValue('10');
            await expect(editor(table).locator('[data-kp-filter-bound="to"]')).toHaveValue('20');
            // Emptied and applied, the filter goes.
            await editor(table).locator('[data-kp-filter-bound="from"]').fill('');
            await editor(table).locator('[data-kp-filter-bound="to"]').fill('');
            await editor(table).getByRole('button', { name: S.tableFilterApply }).click();
            await expect(pills(table)).toHaveCount(0);
            await expect(table.locator('tbody tr:visible')).toHaveCount(INCIDENTS.length);
        });

        test('a filtered column is marked in the menu and opens its own pill instead of adding a second', async ({ page }) => {
            // Before: no add-filter menu, so nothing to mark.
            const table = await open(page, key);
            await choose(table, 'Status');
            await editor(table).locator('input.kp-field__check').first().check();
            await editor(table).getByRole('button', { name: S.tableFilterApply }).click();
            await addButton(table).click();
            const status = menu(table).locator('.kp-menu__item', { hasText: 'Status' });
            await expect(status).toHaveAttribute('data-kp-filter-marked', '');
            await expect(status.locator('.kp-badge')).toHaveText(S.tableFilterMarked);
            await expect(status).toHaveAttribute('aria-label', S.tableAddFilterItemActive('Status'));
            await expect(menu(table).locator('.kp-menu__item', { hasText: 'Site' }).locator('.kp-badge')).toHaveCount(0);
            await status.click();
            await expect(editor(table)).toBeVisible();
            await expect(editor(table).locator('input.kp-field__check').first()).toBeChecked();
            await editor(table).locator('input.kp-field__check').nth(1).check();
            await editor(table).getByRole('button', { name: S.tableFilterApply }).click();
            await expect(pills(table)).toHaveCount(1);
            await expect(table.locator('[data-kp-filter-pill]')).toHaveText(S.tableFilterChoicePill('Status', ['Open', 'Watching']));
        });

        test('dates come from two package date pickers, whose calendar opens above everything; remove drops a pill; Clear all shows from two', async ({
            page,
        }) => {
            // Before: no add-filter button, so no date editor, no pills to remove and no Clear all.
            const table = await open(page, key);
            const format = (/** @type {string} */ iso) =>
                page.evaluate(async (d) => (await import('/js/locale.js')).formatDate(new Date(`${d}T00:00:00`), 'en'), iso);
            await choose(table, 'Opened');
            await expect(editor(table).locator('.kp-datepicker')).toHaveCount(2);
            const from = editor(table).locator('[data-kp-filter-bound="from"]');
            const to = editor(table).locator('[data-kp-filter-bound="to"]');
            await from.fill('not a date');
            await from.press('Enter');
            await expect(editor(table).locator('[data-kp-filter-error]')).toHaveText(S.tableFilterNotDate(S.tableFilterFrom('Opened'), 'not a date'));
            await from.fill(await format('2026-08-10'));
            await to.fill(await format('2026-08-20'));
            // The calendar is in the top layer and every day of it can be reached.
            await editor(table).locator('[data-kp-date-open]').first().click();
            const panel = editor(table).locator('[data-kp-date-panel]').first();
            await expect(panel).toBeVisible();
            expect(await panel.evaluate((el) => el.matches(':popover-open'))).toBe(true);
            expect(await settles(panel.locator('[data-kp-day="2026-08-15"]'))).toBe(true);
            await page.keyboard.press('Escape');
            await expect(panel).toBeHidden();
            await expect(editor(table), 'Escape in the calendar closes the calendar, not the editor').toBeVisible();
            await editor(table).getByRole('button', { name: S.tableFilterApply }).click();
            const datePill = table.locator(`[data-kp-filter-pill="${channel.opened}"]`);
            await expect(datePill).toHaveText(S.tableFilterSpanPill('Opened', '2026-08-10', '2026-08-20', 'date'));
            await expect(table.locator('tbody tr:visible')).toHaveCount(OPENED_10_20);
            expect(await fixture(page, key, 'filters')).toEqual({ [channel.opened]: { from: '2026-08-10', to: '2026-08-20' } });

            const clear = table.locator('[data-kp-datatable-pills] .kp-datatable__clear-filters');
            await expect(clear).toBeHidden();
            await choose(table, 'Status');
            await editor(table).locator('input.kp-field__check').first().check();
            await editor(table).getByRole('button', { name: S.tableFilterApply }).click();
            await expect(pills(table)).toHaveCount(2);
            await expect(clear).toBeVisible();
            await expect(clear).toHaveText(S.tableFilterClearAll);

            await table.getByRole('button', { name: S.tableRemoveFilter(S.tableFilterChoicePill('Status', ['Open'])) }).click();
            await expect(pills(table)).toHaveCount(1);
            await expect(clear).toBeHidden();
            await expect(table.locator('.kp-tag__remove')).toBeFocused();

            await choose(table, 'Site');
            await editor(table).locator('input.kp-field__check').first().check();
            await editor(table).getByRole('button', { name: S.tableFilterApply }).click();
            await expect(clear).toBeVisible();
            await clear.click();
            await expect(pills(table)).toHaveCount(0);
            await expect(table.locator('[data-kp-datatable-pills]')).toBeHidden();
            await expect(table.locator('tbody tr:visible')).toHaveCount(INCIDENTS.length);
            await expect(addButton(table)).toBeFocused();
            expect(await fixture(page, key, 'filters')).toEqual({});
        });

        test('the whole flow works from the keyboard: the menu moves with the arrows, Escape leaves the editor and the menu', async ({ page }) => {
            // Before: no add-filter button to reach.
            const table = await open(page, key);
            await addButton(table).focus();
            await page.keyboard.press('Enter');
            const items = menu(table).locator('.kp-menu__item');
            await expect(items.first()).toBeFocused();
            await page.keyboard.press('ArrowDown');
            await expect(items.nth(1)).toBeFocused();
            await page.keyboard.press('End');
            await expect(items.nth(3)).toBeFocused();
            await page.keyboard.press('ArrowDown');
            await expect(items.first(), 'the arrows wrap').toBeFocused();
            await page.keyboard.press('Escape');
            await expect(menu(table)).toBeHidden();
            await expect(addButton(table)).toHaveAttribute('aria-expanded', 'false');

            await addButton(table).focus();
            await page.keyboard.press('Enter');
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('Enter');
            await expect(editor(table)).toBeVisible();
            const boxes = editor(table).locator('input.kp-field__check');
            await expect(boxes.first()).toBeFocused();
            await page.keyboard.press('Escape');
            await expect(editor(table), 'Escape closes the editor').toBeHidden();
            await expect(pills(table)).toHaveCount(0);
            await expect(addButton(table), 'and hands the focus back to the button').toBeFocused();

            await page.keyboard.press('Enter');
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('Enter');
            await page.keyboard.press('Space');
            await expect(boxes.first()).toBeChecked();
            // Tab through the other boxes to Apply.
            for (let i = 0; i < 3; i++) await page.keyboard.press('Tab');
            await expect(editor(table).getByRole('button', { name: S.tableFilterApply })).toBeFocused();
            await page.keyboard.press('Enter');
            const pill = table.locator('[data-kp-filter-pill]');
            await expect(pill).toHaveText(S.tableFilterChoicePill('Status', ['Open']));
            await expect(pill).toBeFocused();
            await page.keyboard.press('Enter');
            await expect(editor(table)).toBeVisible();
            await page.keyboard.press('Escape');
            await expect(pill, 'Escape from a reopened pill returns to that pill').toBeFocused();
        });

        test(
            'every theme draws the menu, the editor and its calendar where they can be reached, inside the table',
            { tag: ['@sweep'] },
            async ({ page }) => {
                // Before: no add-filter mode to draw. Measured per theme, 2026-09-14.
                const table = await open(page, key);
                /** @type {string[]} */
                const faults = [];
                for (const theme of THEME_NAMES) {
                    await page.evaluate((name) => document.documentElement.setAttribute('data-theme', name), theme);
                    // The theme changes the page's height; the button goes to the top of the window, so the menu and the editor below it are in it.
                    await addButton(table).evaluate((el) => el.scrollIntoView({ block: 'start' }));
                    await addButton(table).click();
                    await expect(menu(table)).toBeVisible();
                    const items = menu(table).locator('.kp-menu__item');
                    for (let i = 0; i < 4; i++) if (!(await settles(items.nth(i)))) faults.push(`${theme}: menu item ${i} cannot be reached`);
                    const menuBox = await menu(table).evaluate((el) => {
                        const r = el.getBoundingClientRect();
                        return { width: r.width, scrollWidth: el.scrollWidth, clientWidth: el.clientWidth };
                    });
                    if (menuBox.scrollWidth > menuBox.clientWidth + 1)
                        faults.push(`${theme}: the menu scrolls sideways (${menuBox.scrollWidth} > ${menuBox.clientWidth})`);
                    await items.nth(3).click();
                    await expect(editor(table)).toBeVisible();
                    const controls = editor(table).locator('[data-kp-filter-bound], [data-kp-date-open], button[type="submit"]');
                    for (let i = 0; i < (await controls.count()); i++)
                        if (!(await settles(controls.nth(i)))) faults.push(`${theme}: editor control ${i} cannot be reached`);
                    const fit = await table.evaluate((el) => {
                        const form = /** @type {HTMLElement} */ (el.querySelector('[data-kp-datatable-filter-editor]'));
                        const wrap = el.getBoundingClientRect();
                        const r = form.getBoundingClientRect();
                        const out = [...form.querySelectorAll('[data-kp-filter-bound], [data-kp-date-open], button')].filter(
                            (node) => node.getBoundingClientRect().right > r.right + 0.5,
                        ).length;
                        return { inside: r.left >= wrap.left - 0.5 && r.right <= wrap.right + 0.5, out };
                    });
                    if (!fit.inside) faults.push(`${theme}: the editor leaves the table`);
                    if (fit.out > 0) faults.push(`${theme}: ${fit.out} editor controls stick out of the editor`);
                    await editor(table).locator('[data-kp-date-open]').first().click();
                    const panel = editor(table).locator('[data-kp-date-panel]').first();
                    await expect(panel).toBeVisible();
                    const allDays = async () =>
                        panel.evaluate((el) => {
                            const all = [...el.querySelectorAll('[data-kp-day]')];
                            return (
                                all.filter((day) => {
                                    const b = day.getBoundingClientRect();
                                    const hit = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2);
                                    return hit === day || day.contains(hit);
                                }).length / Math.max(1, all.length)
                            );
                        });
                    try {
                        await expect.poll(allDays, { timeout: 3000 }).toBe(1);
                    } catch {
                        faults.push(`${theme}: ${Math.round((await allDays()) * 100)}% of the calendar's days can be reached`);
                    }
                    await page.keyboard.press('Escape');
                    await editor(table).getByRole('button', { name: S.tableFilterCancel }).click();
                    await expect(editor(table)).toBeHidden();
                }
                expect(faults).toEqual([]);
            },
        );
    });
}
