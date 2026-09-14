// The data table's seven features of 2026-09-13, driven in both channels.
//
// Kenny's form item datatable-build, "Alle zeven, nu": sorting on more than
// one column, choosing which columns show, rows that open, a first column
// that stays, rows from a server, editing a value in its cell and moving
// through cells with the arrow keys — each as the approved mock in
// research/datatable/demo.html shows it. tests/fixtures/datatable-more.html
// holds one table per feature per channel, with the same data-test names.
//
// Every test below was run against the code as it stood before the change
// (f2eb78c) and went red; the line under each name records what it read.

import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';
import { DEFAULT_STRINGS as S } from '../js/strings.js';

const URL = '/tests/fixtures/datatable-more.html';
const THEME_NAMES = JSON.parse(readFileSync(new globalThis.URL('../themes/order.json', import.meta.url), 'utf8'));
const CHANNELS = [
    { name: 'framework-free', key: 'plain' },
    { name: 'React', key: 'react' },
];

/** @param {string} channel @param {string} name */
const tableOf = (channel, name) => `.kp-datatable[data-test="${channel}-${name}"]`;
/** @param {import('@playwright/test').Locator} table @param {string} label */
const columnTexts = (table, label) => table.locator(`tbody tr:visible td[data-label="${label}"]`).allInnerTexts();
/** @param {import('@playwright/test').Page} page @param {string} key @param {string} what */
const fixture = (page, key, what) => page.evaluate(([k, w]) => /** @type {any} */ (window).kpFixture[k][w](), [key, what]);
/** @param {import('@playwright/test').Page} page @param {string} key */
const open = async (page, key) => {
    await page.goto(URL);
    await expect(page.locator(`${tableOf(key, 'grid')} tbody tr`).first()).toBeVisible();
};

for (const channel of CHANNELS) {
    const { key } = channel;

    // ── 1. Sorting on more than one column (#multi-sort) ──────────────────
    test.describe(`datatable multi-sort — ${channel.name}`, { tag: ['@component:datatable'] }, () => {
        test('Shift + click adds a key, numbered in the header, said in words, and readable from the table [feature 1]', async ({ page }) => {
            // Before: Shift + click replaced the sort (Hours alone, aria-sort none on Severity); no order numbers and no summary existed.
            await open(page, key);
            const table = page.locator(tableOf(key, 'multi'));
            const severity = table.locator('thead th', { hasText: 'Severity' });
            const hours = table.locator('thead th', { hasText: 'Hours' });
            await severity.click();
            await expect(severity).toHaveAttribute('aria-sort', 'ascending');
            await expect(table.locator('.kp-datatable__sort-order')).toHaveCount(0);
            await hours.click({ modifiers: ['Shift'] });
            await expect(severity).toHaveAttribute('aria-sort', 'ascending');
            await expect(hours).toHaveAttribute('aria-sort', 'ascending');
            await expect(severity.locator('.kp-datatable__sort-order')).toHaveText('1');
            await expect(hours.locator('.kp-datatable__sort-order')).toHaveText('2');
            const summary = table.locator('[data-kp-datatable-sort-summary]');
            await expect(summary).toHaveText(
                S.tableSortedBy([S.tableSortKey('Severity', 'ascending', 'order'), S.tableSortKey('Hours', 'ascending', 'number')]),
            );
            // Low first, and inside Low the hours from small to large.
            const severities = await columnTexts(table, 'Severity');
            const hoursRead = (await columnTexts(table, 'Hours')).map(Number);
            const lows = severities.filter((s) => s === 'Low').length;
            expect(severities.slice(0, lows).every((s) => s === 'Low')).toBe(true);
            expect(hoursRead.slice(0, lows)).toEqual([...hoursRead.slice(0, lows)].sort((a, b) => a - b));
            await expect
                .poll(() => fixture(page, key, 'sorts'))
                .toEqual([
                    ['Severity', 'ascending'],
                    ['Hours', 'ascending'],
                ]);

            // A second Shift + click turns the key round, a third takes it out.
            await hours.click({ modifiers: ['Shift'] });
            await expect(hours).toHaveAttribute('aria-sort', 'descending');
            await hours.click({ modifiers: ['Shift'] });
            await expect(hours).toHaveAttribute('aria-sort', 'none');
            await expect(table.locator('.kp-datatable__sort-order')).toHaveCount(0);
            await expect(summary).toHaveText(S.tableSortedBy([S.tableSortKey('Severity', 'ascending', 'order')]));

            // A plain click starts again with that column alone.
            await hours.click({ modifiers: ['Shift'] });
            await table.locator('thead th', { hasText: 'Site' }).click();
            await expect(table.locator('thead th[aria-sort="ascending"], thead th[aria-sort="descending"]')).toHaveCount(1);
            await expect.poll(() => fixture(page, key, 'sorts')).toEqual([['Site', 'ascending']]);
        });

        test('Shift + Enter on a focused header adds it as the next key [feature 1]', async ({ page }) => {
            // Before: Shift + Enter replaced the sort — Reference fell to aria-sort "none" framework-free; React had no Shift at all.
            await open(page, key);
            const table = page.locator(tableOf(key, 'multi'));
            await table.locator('thead th', { hasText: 'Reference' }).click();
            const site = table.locator('thead th', { hasText: 'Site' });
            // React's header holds a button; the framework-free header is the control itself.
            await ((await site.locator('button').count()) > 0 ? site.locator('button') : site).focus();
            await page.keyboard.press('Shift+Enter');
            await expect(site).toHaveAttribute('aria-sort', 'ascending');
            await expect(table.locator('thead th', { hasText: 'Reference' })).toHaveAttribute('aria-sort', 'ascending');
        });
    });

    // ── 2. Choosing which columns show (#columns) ─────────────────────────
    test.describe(`datatable column choice — ${channel.name}`, { tag: ['@component:datatable'] }, () => {
        test('the Columns menu hides a column, header and cells together, keeps the key column, and says how many show [feature 2]', async ({
            page,
        }) => {
            // Before: no Columns button; Note showed although declared hidden (5 headers visible).
            await open(page, key);
            const table = page.locator(tableOf(key, 'columns'));
            await expect(table.locator('thead th:visible')).toHaveCount(4);
            const count = table.locator('[data-kp-datatable-columns-count]');
            await expect(count).toHaveText(S.tableColumnsShown(4, 5));
            const button = table.getByRole('button', { name: S.tableColumns });
            await expect(button).toHaveAttribute('aria-expanded', 'false');
            await button.click();
            await expect(button).toHaveAttribute('aria-expanded', 'true');
            const menu = page.getByRole('list', { name: S.tableColumnsLabel }).filter({ visible: true });
            await expect(menu).toBeVisible();
            const locked = menu.getByRole('checkbox', { name: S.tableColumnLocked('Reference') });
            await expect(locked).toBeChecked();
            await expect(locked).toBeDisabled();
            await menu.getByRole('checkbox', { name: 'Site', exact: true }).uncheck();
            await expect(table.locator('thead th', { hasText: 'Site' })).toBeHidden();
            await expect(table.locator('tbody td[data-label="Site"]:visible')).toHaveCount(0);
            await expect(count).toHaveText(S.tableColumnsShown(3, 5));
            await expect.poll(() => fixture(page, key, 'hidden')).toEqual(['Site', 'Note']);
            // The menu sits under its button, not somewhere else on the page.
            const [b, m] = await Promise.all([button.boundingBox(), menu.boundingBox()]);
            expect(Math.abs((m?.x ?? 0) - (b?.x ?? 0))).toBeLessThan(40);
            expect((m?.y ?? 0) - ((b?.y ?? 0) + (b?.height ?? 0))).toBeGreaterThanOrEqual(-1);
            expect((m?.y ?? 0) - ((b?.y ?? 0) + (b?.height ?? 0))).toBeLessThan(24);

            await menu.getByRole('button', { name: S.tableShowAllColumns }).click();
            await expect(table.locator('thead th:visible')).toHaveCount(5);
            await expect(table.locator('tbody td[data-label="Note"]:visible').first()).toBeVisible();
            await expect(count).toHaveText(S.tableColumnsShown(5, 5));
        });

        test(
            'the Columns and "+ Add filter" menus, opened at the bottom of a 720px window, open upwards beside their button, whole in the window, in every theme',
            { tag: ['@sweep'] },
            async ({ page }) => {
                // Before: the Columns menu hung under its button and ran past the bottom of the window in all 22 themes, both channels (top 714-724, bottom 924-1000).
                await page.setViewportSize({ width: 1280, height: 720 });
                await page.emulateMedia({ reducedMotion: 'reduce' });
                await open(page, key);
                // Room to scroll a button to the bottom edge, wherever the fixture ends.
                await page.evaluate(() => {
                    const spacer = document.createElement('div');
                    spacer.style.blockSize = '100vh';
                    document.body.append(spacer);
                });
                /** @type {[string, import('@playwright/test').Locator, import('@playwright/test').Locator][]} */
                const menus = [
                    [
                        'Columns',
                        page.locator(tableOf(key, 'columns')).getByRole('button', { name: S.tableColumns }),
                        page.locator('[data-kp-datatable-columns]:popover-open'),
                    ],
                    [
                        '+ Add filter',
                        page.locator(tableOf(key, 'addfilter')).locator('[data-kp-datatable-add-filter]'),
                        page.locator('[data-kp-datatable-add-menu]:popover-open'),
                    ],
                ];
                const faults = [];
                for (const theme of THEME_NAMES) {
                    await page.evaluate((name) => document.documentElement.setAttribute('data-theme', name), theme);
                    for (const [name, button, menu] of menus) {
                        const before = await button.evaluate((el) => {
                            el.scrollIntoView({ block: 'end' });
                            return Math.round(el.getBoundingClientRect().bottom);
                        });
                        await button.click();
                        await expect(menu).toBeVisible();
                        const m = await menu.evaluate(
                            async (el, toggle) => {
                                await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
                                const box = el.getBoundingClientRect();
                                const at = /** @type {Element} */ (toggle).getBoundingClientRect();
                                return {
                                    top: Math.round(box.top),
                                    bottom: Math.round(box.bottom),
                                    window: innerHeight,
                                    buttonTop: Math.round(at.top),
                                    buttonBottom: Math.round(at.bottom),
                                };
                            },
                            await button.elementHandle(),
                        );
                        const read = `${theme} ${name}: menu ${m.top}-${m.bottom} in a ${m.window}px window, button ${m.buttonTop}-${m.buttonBottom}`;
                        if (m.top < 0 || m.bottom > m.window) faults.push(`${read}, outside the window`);
                        // A menu that opens into the window leaves the page where it was; one that
                        // opened below it pulled the page up to its focused item.
                        else if (Math.abs(m.buttonBottom - before) > 2)
                            faults.push(`${read}, the page moved: button bottom ${before} -> ${m.buttonBottom}`);
                        // Still its button's menu: an edge within 24px of the button's.
                        else if (Math.min(Math.abs(m.bottom - m.buttonTop), Math.abs(m.top - m.buttonBottom)) > 24)
                            faults.push(`${read}, away from its button`);
                        // And it travels with its button when the page scrolls under it.
                        await page.mouse.wheel(0, -120);
                        const moved = await menu.evaluate(
                            async (el, toggle) => {
                                await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
                                const box = el.getBoundingClientRect();
                                const at = /** @type {Element} */ (toggle).getBoundingClientRect();
                                return {
                                    gap: Math.round(Math.min(Math.abs(box.bottom - at.top), Math.abs(box.top - at.bottom))),
                                    buttonTop: Math.round(at.top),
                                };
                            },
                            await button.elementHandle(),
                        );
                        if (moved.buttonTop === m.buttonTop)
                            faults.push(`${theme} ${name}: the page did not scroll, so the menu's travel was not read`);
                        else if (moved.gap > 24) faults.push(`${theme} ${name}: ${moved.gap}px from its button after a scroll`);
                        await page.keyboard.press('Escape');
                        await expect(menu).toHaveCount(0);
                    }
                }
                expect(faults).toEqual([]);
            },
        );
    });

    // ── 3. Rows that open to show more (#expansion) ───────────────────────
    test.describe(`datatable row expansion — ${channel.name}`, { tag: ['@component:datatable'] }, () => {
        test('a button opens a detail row under its row, from the pointer and the keyboard, and the open row travels with a sort [feature 3]', async ({
            page,
        }) => {
            // Before: framework-free counted the detail rows as rows ("Showing 1–10 of 60"); React had no toggle button.
            await open(page, key);
            const table = page.locator(tableOf(key, 'expand'));
            await expect(table.locator('[data-kp-datatable-status]')).toHaveText(S.tableShowing(1, 10, 30, 30));
            const first = table.getByRole('button', { name: S.tableRowDetails('INC-4400') });
            await expect(first).toHaveAttribute('aria-expanded', 'true');
            const detailOf = (/** @type {string} */ ref) => table.locator(`tr[data-kp-row-key="${ref}"] + tr.kp-datatable__detail`);
            await expect(detailOf('INC-4400')).toBeVisible();
            await expect(detailOf('INC-4400')).toContainText('Note:');
            // The detail spans every column, the toggle's own included.
            const span = await detailOf('INC-4400')
                .locator('td')
                .evaluate((td) => /** @type {HTMLTableCellElement} */ (td).colSpan);
            expect(span).toBe(await table.locator('thead th').count());
            await expect(first).toHaveAttribute('aria-controls', /.+/);
            const controls = await first.getAttribute('aria-controls');
            await expect(detailOf('INC-4400')).toHaveAttribute('id', /** @type {string} */ (controls));

            const second = table.getByRole('button', { name: S.tableRowDetails('INC-4401') });
            await expect(second).toHaveAttribute('aria-expanded', 'false');
            await expect(table.locator('tr.kp-datatable__detail:visible')).toHaveCount(1);
            await second.click();
            await expect(second).toHaveAttribute('aria-expanded', 'true');
            await expect(detailOf('INC-4401')).toBeVisible();
            await expect.poll(() => fixture(page, key, 'expanded')).toEqual(['INC-4400', 'INC-4401']);

            await second.focus();
            await page.keyboard.press('Enter');
            await expect(second).toHaveAttribute('aria-expanded', 'false');
            await expect(table.locator('tr[data-kp-row-key="INC-4401"] + tr.kp-datatable__detail:visible')).toHaveCount(0);
            await page.keyboard.press(' ');
            await expect(second).toHaveAttribute('aria-expanded', 'true');

            // Sorted, the open rows keep their detail directly under them.
            await table.locator('thead th', { hasText: 'Hours' }).click();
            await table.locator('thead th', { hasText: 'Hours' }).click();
            await expect(table.locator('thead th', { hasText: 'Hours' })).toHaveAttribute('aria-sort', 'descending');
            const pairs = await table
                .locator('tbody tr.kp-datatable__detail')
                .evaluateAll((details) =>
                    details.map((d) => [/** @type {HTMLElement | null} */ (d.previousElementSibling)?.dataset.kpRowKey ?? null, d.hidden]),
                );
            for (const [ref, hidden] of pairs) if (!hidden) expect(['INC-4400', 'INC-4401']).toContain(ref);
        });
    });

    // ── 5. Rows that come from a server (#async) ──────────────────────────
    test.describe(`datatable server rows — ${channel.name}`, { tag: ['@component:datatable'] }, () => {
        /** @param {import('@playwright/test').Page} page */
        const serverLog = (page) =>
            page.evaluate((k) => /** @type {any} */ (window).kpFixture[k === 'plain' ? 'server' : 'reactServer'].log.map((e) => ({ ...e })), key);
        /** @param {import('@playwright/test').Page} page @param {Record<string, unknown>} change */
        const tune = (page, change) =>
            page.evaluate(
                ([k, c]) => Object.assign(/** @type {any} */ (window).kpFixture[k === 'plain' ? 'server' : 'reactServer'], c),
                [key, change],
            );

        test('the table asks the server for a page, a sort and a search, and shows what it answers [feature 5]', async ({ page }) => {
            // Before: 0 rows in both channels — the framework-free table sent nothing, and React had no load prop.
            await open(page, key);
            const table = page.locator(tableOf(key, 'server'));
            const status = table.locator('[data-kp-datatable-status]');
            await expect(table.locator('tbody tr:visible')).toHaveCount(10);
            await expect(status).toHaveText(S.tableShowing(1, 10, 30, 30));
            await expect(table.locator('.kp-datatable__page')).toHaveText('1 / 3');
            await table.getByRole('button', { name: S.next }).click();
            await expect(status).toHaveText(S.tableShowing(11, 20, 30, 30));
            await expect(table.locator('tbody tr:visible').first()).toHaveAttribute('data-kp-row-key', 'INC-4410');
            await table.locator('thead th', { hasText: 'Hours' }).click();
            await expect(table.locator('thead th', { hasText: 'Hours' })).toHaveAttribute('aria-sort', 'ascending');
            await expect(status).toHaveText(S.tableShowing(1, 10, 30, 30));
            await expect.poll(async () => (await serverLog(page)).at(-1)).toMatchObject({ sort: 'hours', page: 0, outcome: 'answered' });
            const hours = (await columnTexts(table, 'Hours')).map(Number);
            expect(hours).toEqual([...hours].sort((a, b) => a - b));

            // Nine keys, one request: the search waits for the typing to stop.
            const before = (await serverLog(page)).length;
            await table.locator('[data-kp-datatable-search]').pressSequentially('Cold store', { delay: 25 });
            await expect(table.locator('tbody tr:visible')).toHaveCount(6);
            await expect(status).toHaveText(S.tableShowing(1, 6, 6, 6));
            const after = await serverLog(page);
            expect(after.slice(before).map((e) => e.query)).toEqual(['Cold store']);
        });

        test('an answer that arrives after a newer request was sent is thrown away, and the old rows stay dimmed while waiting [feature 5]', async ({
            page,
        }) => {
            // Before: 0 rows in both channels; nothing was ever asked.
            await open(page, key);
            const table = page.locator(tableOf(key, 'server'));
            await expect(table.locator('tbody tr:visible')).toHaveCount(10);
            const hours = table.locator('thead th', { hasText: 'Hours' });
            await tune(page, { delays: [600, 40] });
            await hours.click();
            await expect(table).toHaveAttribute('aria-busy', 'true');
            await expect(table.locator('tbody tr:visible')).toHaveCount(10);
            await hours.click();
            await expect(hours).toHaveAttribute('aria-sort', 'descending');
            await expect(table).not.toHaveAttribute('aria-busy', 'true');
            await expect.poll(async () => (await serverLog(page)).slice(-2).map((e) => e.outcome)).toEqual(['aborted', 'answered']);
            await page.waitForTimeout(150);
            const read = (await columnTexts(table, 'Hours')).map(Number);
            expect(read).toEqual([...read].sort((a, b) => b - a));
        });

        test('a failed answer shows the failed state, and its way out asks again [feature 5, #states]', async ({ page }) => {
            // Before: 0 rows in both channels; no failed slot existed for a table that wrote none.
            await open(page, key);
            const table = page.locator(tableOf(key, 'server'));
            await expect(table.locator('tbody tr:visible')).toHaveCount(10);
            await tune(page, { failNext: true });
            await fixture(page, key, 'reload');
            const failed = table.locator('[data-kp-datatable-failed]');
            await expect(failed).toBeVisible();
            await expect(failed).toHaveAttribute('role', 'alert');
            await failed.getByRole('button', { name: S.tableRetry }).click();
            await expect(failed).toBeHidden();
            await expect(table.locator('tbody tr:visible')).toHaveCount(10);
            await expect.poll(async () => (await serverLog(page)).slice(-2).map((e) => e.outcome)).toEqual(['failed', 'answered']);
        });
    });

    // ── 6. Editing a value in its cell (#inline-edit) ─────────────────────
    test.describe(`datatable inline edit — ${channel.name}`, { tag: ['@component:datatable'] }, () => {
        /** @param {import('@playwright/test').Page} page */
        const edits = (page) => page.evaluate((k) => /** @type {any} */ (window).kpFixture.editLog[k].map((e) => ({ ...e })), key);

        test('a drawn select edits a cell: Enter saves, the app hears it, focus returns, and Undo puts it back [feature 6]', async ({ page }) => {
            // Before: the Status cell was plain text in both channels; the edit button was not found.
            await open(page, key);
            const table = page.locator(tableOf(key, 'edit'));
            const edit = table.getByRole('button', { name: S.tableEdit('Status', 'INC-4400', 'Open') });
            await expect(edit).toBeVisible();
            await edit.click();
            const editor = table.locator('select[data-kp-datatable-editor]');
            await expect(editor).toBeFocused();
            await expect(editor).toHaveAccessibleName(S.tableEditField('Status', 'INC-4400'));
            await expect(editor).toHaveClass(/kp-field__input/);
            await expect(editor).toHaveAttribute('data-kp-select-attached', '');
            await page.keyboard.press('ArrowDown');
            await expect(editor).toHaveAttribute('aria-expanded', 'true');
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('Enter');
            const cell = table.locator('tr[data-kp-row-key="INC-4400"] td[data-label="Status"]');
            await expect(editor).toHaveCount(0);
            await expect(cell).toContainText('Watching');
            await expect(cell.locator('.kp-badge')).toHaveText('Watching');
            await expect(table.getByRole('button', { name: S.tableEdit('Status', 'INC-4400', 'Watching') })).toBeFocused();
            expect((await edits(page)).at(-1)).toMatchObject({ key: 'INC-4400', label: 'Status', value: 'Watching', previous: 'Open', undo: false });
            const log = table.locator('[data-kp-datatable-edit-log]');
            await expect(log).toContainText(S.tableEdited('INC-4400', 'Status', 'Open', 'Watching'));
            await log.getByRole('button', { name: S.undo }).click();
            await expect(cell.locator('.kp-badge')).toHaveText('Open');
            await expect(log).toContainText(S.tableEditUndone('INC-4400', 'Status', 'Open'));
            expect((await edits(page)).at(-1)).toMatchObject({ value: 'Open', previous: 'Watching', undo: true });
        });

        test('Escape cancels, a required value refuses to be empty, and the app can refuse a value with its own message [feature 6]', async ({
            page,
        }) => {
            // Before: no edit button to click in either channel (the click timed out).
            await open(page, key);
            const table = page.locator(tableOf(key, 'edit'));
            const site = table.locator('tr[data-kp-row-key="INC-4401"] td[data-label="Site"]');
            const siteBefore = (await site.innerText()).trim();
            await table.getByRole('button', { name: S.tableEdit('Site', 'INC-4401', siteBefore) }).click();
            const editor = table.locator('input[data-kp-datatable-editor]');
            await expect(editor).toBeFocused();
            await editor.fill('Somewhere else');
            await page.keyboard.press('Escape');
            await expect(editor).toHaveCount(0);
            await expect(site.locator('[data-kp-edit-value]')).toHaveText(siteBefore);
            await expect(table.locator('[data-kp-datatable-edit-log]')).toHaveText(S.tableEditCancelled);

            await table.getByRole('button', { name: S.tableEdit('Site', 'INC-4401', siteBefore) }).click();
            await editor.fill('');
            await page.keyboard.press('Enter');
            const message = table.locator('td .kp-field__error:visible');
            await expect(message).toHaveText(S.tableEditRequired);
            await expect(editor).toHaveAttribute('aria-invalid', 'true');
            await expect(editor).toBeFocused();
            await page.keyboard.press('Escape');

            const hours = table.locator('tr[data-kp-row-key="INC-4401"] td[data-label="Hours"]');
            const hoursBefore = (await hours.innerText()).trim();
            await table.getByRole('button', { name: S.tableEdit('Hours', 'INC-4401', hoursBefore) }).click();
            await table.locator('input[data-kp-datatable-editor]').fill('150');
            await page.keyboard.press('Enter');
            await expect(message).toHaveText('Hours must be 100 or fewer');
            await page.keyboard.press('Escape');
            await expect(hours.locator('[data-kp-edit-value]')).toHaveText(hoursBefore);

            await table.getByRole('button', { name: S.tableEdit('Hours', 'INC-4401', hoursBefore) }).click();
            await table.locator('input[data-kp-datatable-editor]').fill('42');
            await page.keyboard.press('Enter');
            await expect(hours.locator('[data-kp-edit-value]')).toHaveText('42');
        });

        test("the date column edits through the package's date picker [feature 6]", async ({ page }) => {
            // Before: no edit button to click in either channel (the click timed out).
            await open(page, key);
            const table = page.locator(tableOf(key, 'edit'));
            await table.getByRole('button', { name: S.tableEdit('Opened', 'INC-4402', '2026-08-03') }).click();
            const picker = table.locator('td .kp-datepicker');
            await expect(picker).toBeVisible();
            await expect(picker.locator('[data-kp-date-open]')).toBeVisible();
            const input = picker.locator('input[data-kp-datatable-editor]');
            await expect(input).toBeFocused();
            await input.fill('2026-08-20');
            await page.keyboard.press('Enter');
            await expect(table.locator('tr[data-kp-row-key="INC-4402"] td[data-label="Opened"] [data-kp-edit-value]')).toHaveText('2026-08-20');
        });
    });

    // ── 7. Moving through cells with the arrow keys (#keyboard) ───────────
    test.describe(`datatable keyboard grid — ${channel.name}`, { tag: ['@component:datatable'] }, () => {
        test('Tab enters the grid once; arrows, Home, End, Ctrl + Home/End and Page Up/Down move a cell at a time, and the line says where [feature 7]', async ({
            page,
        }) => {
            // Before: role "" on the table in both channels — no grid; Tab walked into the sort header and on.
            await open(page, key);
            const table = page.locator(tableOf(key, 'grid'));
            await expect(table.locator('table')).toHaveAttribute('role', 'grid');
            const readout = table.locator('[data-kp-datatable-grid-readout]');
            await expect(readout).toHaveText(S.tableGridStart);
            await page.locator(`[data-test="${key}-before-grid"]`).focus();
            await page.keyboard.press('Tab');
            /** Where the focus is, as [row index in the table, cell index]. */
            const at = () =>
                page.evaluate(() => {
                    const cell = document.activeElement?.closest('td, th');
                    const row = /** @type {HTMLTableRowElement | null} */ (cell?.parentElement ?? null);
                    return cell && row ? [row.rowIndex, /** @type {HTMLTableCellElement} */ (cell).cellIndex] : null;
                });
            expect(await at()).toEqual([1, 0]);
            await expect(readout).toHaveText(S.tableGridPosition(1, 30, 'Reference', 'INC-4400'));
            await page.keyboard.press('ArrowRight');
            expect(await at()).toEqual([1, 1]);
            await page.keyboard.press('ArrowDown');
            expect(await at()).toEqual([2, 1]);
            await page.keyboard.press('End');
            expect(await at()).toEqual([2, 3]);
            await page.keyboard.press('Home');
            expect(await at()).toEqual([2, 0]);
            await page.keyboard.press('PageDown');
            expect(await at()).toEqual([7, 0]);
            await page.keyboard.press('Control+End');
            expect(await at()).toEqual([30, 3]);
            await page.keyboard.press('Control+Home');
            expect(await at()).toEqual([0, 0]);
            await expect(readout).toHaveText(S.tableGridPosition(0, 30, 'Reference', 'Reference'));
            await page.keyboard.press('ArrowUp');
            expect(await at()).toEqual([0, 0]);
            await page.keyboard.press('PageDown');
            expect(await at()).toEqual([5, 0]);
            // One Tab stop: the next Tab leaves the table.
            await page.keyboard.press('Tab');
            await expect(page.locator(`[data-test="${key}-after-grid"]`)).toBeFocused();
            await page.keyboard.press('Shift+Tab');
            expect(await at()).toEqual([5, 0]);
        });

        test(
            'Enter on an editable cell edits it, Escape hands the focus back to the cell, and the focus ring shows inside the cell in every theme [feature 7]',
            { tag: ['@sweep'] },
            async ({ page }) => {
                // Before: no grid and no edit button to reach in either channel.
                // Drilled [KT3]: the `.kp-table[role='grid'] :is(th, td):focus-visible` rule taken out of css/components.css — 20 themes
                // read inside:false in both channels (the two registers with their own answer held); restored, green.
                await open(page, key);
                const table = page.locator(tableOf(key, 'grid'));
                await page.locator(`[data-test="${key}-before-grid"]`).focus();
                await page.keyboard.press('Tab');
                await page.keyboard.press('ArrowRight');
                await page.keyboard.press('ArrowRight');
                const editButton = table.getByRole('button', { name: S.tableEdit('Status', 'INC-4400', 'Open') });
                await expect(editButton).toBeFocused();
                await page.keyboard.press('Enter');
                const editor = table.locator('select[data-kp-datatable-editor]');
                await expect(editor).toBeFocused();
                await page.keyboard.press('Escape');
                await expect(editor).toHaveCount(0);
                await expect(editButton).toBeFocused();
                await page.keyboard.press('ArrowLeft');
                const missing = [];
                for (const theme of THEME_NAMES) {
                    await page.evaluate((name) => document.documentElement.setAttribute('data-theme', name), theme);
                    const ring = await page.evaluate(() => {
                        const el = /** @type {HTMLElement} */ (document.activeElement);
                        const s = getComputedStyle(el);
                        const width = parseFloat(s.outlineWidth);
                        const outline = s.outlineStyle !== 'none' && width > 0;
                        return {
                            tag: el.tagName,
                            visible: el.matches(':focus-visible'),
                            outline,
                            // Inside the cell, so a neighbour's ground or the scroll box cannot cut it away: an outline
                            // drawn inward, or a ring drawn as an inset shadow where the theme draws no outline.
                            inside: outline ? parseFloat(s.outlineOffset) <= -width : s.boxShadow.includes('inset'),
                        };
                    });
                    if (ring.tag !== 'TD' || !ring.visible || !ring.inside) missing.push(`${theme}: ${JSON.stringify(ring)}`);
                }
                expect(missing).toEqual([]);
            },
        );
    });
}
