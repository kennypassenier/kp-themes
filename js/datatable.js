// DataTable, framework-free [TH37].
//
// The features are measured against TanStack Table, which is what "the
// best in 2026" means: sorting, per-column and global filtering,
// pagination, column visibility, row selection, expandable rows. What is
// deliberately absent is virtualisation, in-cell editing and export —
// that is a grid, a different product, and TH42 records the decision.
//
// **This works on a table the server already rendered.** It sorts and
// filters the rows that are in the DOM; it does not fetch, and it does not
// own the data. kyu and almanac render their HTML from a Rust binary, so a
// table that only exists after JavaScript runs would leave them with an
// empty box on first paint — and a table is exactly the thing a reader
// needs before the scripts arrive.
//
//   <div class="kp-datatable" data-kp-datatable data-kp-page-size="10" data-kp-locale="nl">
//     <input data-kp-datatable-search type="search" />
//     <table class="kp-table">
//       <thead><tr>
//         <th data-kp-sort="text">Name</th>
//         <th data-kp-sort="number">Amount</th>
//       </tr></thead>
//       <tbody>…</tbody>
//     </table>
//     <p data-kp-datatable-status role="status" aria-live="polite"></p>
//     <nav data-kp-datatable-pager></nav>
//   </div>
//
// The hard part of a data table is not the features. It is that a sighted
// user sees the rows rearrange and everyone else is told nothing: the sort
// state has to live in `aria-sort`, and the row count after a filter has
// to be announced. That is where nearly every implementation stops short,
// so both are asserted by the suite rather than left to care.
//
// Since 3.0.0 [KT6]: the view — sort, page, query, selection — is readable
// and settable through the handle attach returns, so a consumer can put
// it in the URL and bring it back; the comparator collates in the page's
// locale rather than in Dutch; a header sorts from the keyboard; detach
// restores the row order the server rendered, which the first version
// left permanently sorted; and every knob is a data-attribute or an
// option.

import { getStrings } from './strings.js';
import { collator, parseNumber, resolveLocale } from './locale.js';

const TABLE = '[data-kp-datatable]';
const SEARCH = '[data-kp-datatable-search]';
const STATUS = '[data-kp-datatable-status]';
const PAGER = '[data-kp-datatable-pager]';
const EMPTY = '[data-kp-datatable-empty]';
const SELECT_ALL = '[data-kp-select-all]';
const SELECT_ROW = '[data-kp-select-row]';

/** @typedef {'ascending' | 'descending' | 'none'} Direction */
/** @typedef {{ column: number, direction: Direction } | null} Sort */
/** @typedef {{ shown: number, total: number, page: number, pages: number, query: string, sort: Sort }} View */

/** Fired on the wrapper when the visible set changes. A contract value [TH26]. Detail: View. */
export const VIEW_EVENT = 'kp-datatable-view';
/** Fired when the selection changes; the detail carries the selected row keys and rows. */
export const SELECT_EVENT = 'kp-datatable-select';
/** Fired when the sort changes: `{ column, direction }` or null. */
export const SORT_EVENT = 'kp-datatable-sort';

/** Rows per page when the consumer does not say. An operational knob; per table as `data-kp-page-size`. */
export const PAGE_SIZE = 10;

/** @typedef {(a: string, b: string, kind: string, locale: string) => number} Compare */
/** @typedef {(row: HTMLTableRowElement, query: string) => boolean} Filter */

/**
 * Compare two cells the way their column asks to be compared.
 *
 * A number column sorted as text puts 100 before 20, which is the single
 * most common data-table bug and the reason the column declares its type
 * rather than the code guessing from the first row. Numbers and text are
 * read in the locale: "1.284,50" is a number in Dutch and "1,284.50" in
 * English, and both sort correctly on their own page.
 *
 * @type {Compare}
 */
export function compare(a, b, kind, locale) {
    if (kind === 'number') {
        const left = parseNumber(a, locale);
        const right = parseNumber(b, locale);
        if (Number.isNaN(left) || Number.isNaN(right)) return collator(locale).compare(a, b);
        return left - right;
    }
    if (kind === 'date') {
        const left = Date.parse(a);
        const right = Date.parse(b);
        if (Number.isNaN(left) || Number.isNaN(right)) return collator(locale).compare(a, b);
        return left - right;
    }
    // A collator, not <: "Zoetermeer" before "école" is wrong in every
    // language a consumer's labels are written in.
    return collator(locale).compare(a, b);
}

/** @type {Filter} */
const defaultFilter = (row, query) => (row.textContent ?? '').toLowerCase().includes(query);

/**
 * @typedef {object} DataTableHandle
 * @property {HTMLElement} element
 * @property {() => View} view
 * @property {(sort: Sort) => void} sort
 * @property {(page: number) => void} page
 * @property {(query: string) => void} query
 * @property {() => string[]} selected
 * @property {(keys: readonly string[]) => void} select
 * @property {() => void} refresh re-read the rows after the consumer added or removed some
 */

/** @type {WeakMap<Element, DataTableHandle>} */
const handles = new WeakMap();

/** The handle for an attached table, for code that did not call attach. @param {Element} element */
export function dataTable(element) {
    return handles.get(element) ?? null;
}

/**
 * Attach every data table under `root`.
 *
 * @param {ParentNode} root
 * @param {{ locale?: string, compare?: Compare, filter?: Filter, debounceMs?: number, sortCycle?: 'two' | 'three', pagerClassName?: string, pageLabel?: (at: number, of: number) => string }} [options]
 *   Defaults, each also settable per table: `data-kp-locale`, `data-kp-debounce`, `data-kp-sort-cycle`.
 * @returns {(() => void) & { handles: DataTableHandle[] }} detach
 */
export function attachDataTables(
    root = document,
    {
        locale: localeOption,
        compare: compareFn = compare,
        filter: filterFn = defaultFilter,
        debounceMs = 0,
        sortCycle = 'two',
        pagerClassName = 'kp-button kp-button--ghost',
        pageLabel,
    } = {},
) {
    /** @type {(() => void)[]} */
    const cleanups = [];
    /** @type {DataTableHandle[]} */
    const created = [];

    for (const element of root.querySelectorAll(TABLE)) {
        const wrap = /** @type {HTMLElement} */ (element);
        if (wrap.dataset.kpDatatableAttached !== undefined) continue;
        const table = /** @type {HTMLTableElement | null} */ (wrap.querySelector('table'));
        const body = table?.tBodies[0];
        if (table === undefined || table === null || body === undefined) continue;
        wrap.dataset.kpDatatableAttached = '';

        const search = /** @type {HTMLInputElement | null} */ (wrap.querySelector(SEARCH));
        const status = /** @type {HTMLElement | null} */ (wrap.querySelector(STATUS));
        const pager = /** @type {HTMLElement | null} */ (wrap.querySelector(PAGER));
        const empty = /** @type {HTMLElement | null} */ (wrap.querySelector(EMPTY));
        const selectAll = /** @type {HTMLInputElement | null} */ (wrap.querySelector(SELECT_ALL));
        const size = Number.parseInt(wrap.dataset.kpPageSize ?? '', 10) || PAGE_SIZE;
        const locale = resolveLocale(wrap.dataset.kpLocale ?? localeOption, wrap);
        const debounce = Number.parseInt(wrap.dataset.kpDebounce ?? '', 10) || debounceMs;
        const cycle = wrap.dataset.kpSortCycle ?? sortCycle;

        /** Every row as it was rendered. Sorting reorders this array, never the DOM's idea of it. */
        let all = /** @type {HTMLTableRowElement[]} */ ([...body.rows]);
        /** The order the server rendered, so detach can put it back. */
        const rendered = [...all];
        /** @type {HTMLTableRowElement[]} */
        let shown = [...all];
        let page = 0;
        let query = '';
        /** @type {Sort} */
        let sort = null;
        const emptyWasHidden = empty?.hidden ?? false;

        const headers = /** @type {HTMLTableCellElement[]} */ ([...(table.tHead?.rows[0]?.cells ?? [])]);
        const headerSort = headers.map((h) => h.getAttribute('aria-sort'));
        const headerTab = headers.map((h) => h.getAttribute('tabindex'));

        /** @param {HTMLTableRowElement} row @param {number} at */
        const cellText = (row, at) => (row.cells[at]?.textContent ?? '').trim();
        /** @returns {View} */
        const view = () => ({ shown: shown.length, total: all.length, page, pages: Math.max(1, Math.ceil(shown.length / size)), query, sort });

        const render = () => {
            const pages = Math.max(1, Math.ceil(shown.length / size));
            page = Math.min(page, pages - 1);
            const from = page * size;
            const slice = pager === null ? shown : shown.slice(from, from + size);
            for (const row of all) row.hidden = true;
            for (const row of slice) row.hidden = false;
            // Reordering by appending: the rows are the same elements, so
            // anything a consumer attached to them survives a sort.
            for (const row of shown) body.append(row);

            const s = getStrings();
            if (status !== null) {
                const total = all.length;
                const count = shown.length;
                status.textContent = count === total ? s.tableRows(total) : s.tableRowsFiltered(count, total);
            }
            if (pager !== null) {
                pager.textContent = '';
                pager.append(pagerButton(s.previous, page > 0, () => (page -= 1)));
                const label = document.createElement('span');
                label.className = 'kp-datatable__page';
                label.textContent = (pageLabel ?? s.tablePage)(page + 1, pages);
                pager.append(label);
                pager.append(pagerButton(s.next, page < pages - 1, () => (page += 1)));
            }
            if (empty !== null) empty.hidden = shown.length > 0;
            wrap.dispatchEvent(new CustomEvent(VIEW_EVENT, { bubbles: true, detail: view() }));
        };

        /** @param {string} text @param {boolean} enabled @param {() => void} go */
        const pagerButton = (text, enabled, go) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = pagerClassName;
            button.textContent = text;
            button.disabled = !enabled;
            button.addEventListener('click', () => {
                go();
                render();
            });
            return button;
        };

        const applyFilter = () => {
            const needle = query.trim().toLowerCase();
            shown = all.filter((row) => needle === '' || filterFn(row, needle));
            if (sort !== null && sort.direction !== 'none') applySort(sort.column, sort.direction);
            page = 0;
            render();
        };
        let pending = 0;
        const onSearch = () => {
            query = search?.value ?? '';
            clearTimeout(pending);
            if (debounce > 0) pending = window.setTimeout(applyFilter, debounce);
            else applyFilter();
        };

        /** @param {number} at @param {Direction} direction */
        const applySort = (at, direction) => {
            const kind = headers[at]?.dataset.kpSort ?? 'text';
            if (direction === 'none') {
                // Back to the rendered order, filtered.
                const keep = new Set(shown);
                shown = rendered.filter((row) => keep.has(row));
            } else {
                const sign = direction === 'ascending' ? 1 : -1;
                shown = [...shown].sort((a, b) => sign * compareFn(cellText(a, at), cellText(b, at), kind, locale));
            }
            // aria-sort on the sorted column and NOWHERE else: leaving a
            // stale "ascending" on a column that is no longer the sort key
            // is worse than saying nothing.
            headers.forEach((header, i) => {
                if (header.dataset.kpSort === undefined) return;
                header.setAttribute('aria-sort', i === at && direction !== 'none' ? direction : 'none');
            });
        };
        /** @param {Sort} next */
        const setSort = (next) => {
            sort = next;
            if (next === null) applySort(-1, 'none');
            else applySort(next.column, next.direction);
            wrap.dispatchEvent(new CustomEvent(SORT_EVENT, { bubbles: true, detail: sort }));
            render();
        };
        /** @param {HTMLTableCellElement} header */
        const toggleSort = (header) => {
            const at = headers.indexOf(header);
            if (at === -1) return;
            const current = header.getAttribute('aria-sort');
            /** @type {Direction} */
            let next = 'ascending';
            if (current === 'ascending') next = 'descending';
            else if (current === 'descending') next = cycle === 'three' ? 'none' : 'ascending';
            setSort({ column: at, direction: next });
        };
        /** @param {Event} event */
        const onHeadClick = (event) => {
            const header = /** @type {HTMLTableCellElement | null} */ (/** @type {HTMLElement} */ (event.target).closest('th[data-kp-sort]'));
            if (header !== null) toggleSort(header);
        };
        // From the keyboard too [KT6]: a header the first version made
        // clickable was reachable by nobody who could not click. The
        // consumer may put a <button> inside the header; a bare header is
        // made focusable here.
        /** @param {KeyboardEvent} event */
        const onHeadKey = (event) => {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            const header = /** @type {HTMLTableCellElement | null} */ (/** @type {HTMLElement} */ (event.target).closest('th[data-kp-sort]'));
            if (header === null) return;
            event.preventDefault();
            toggleSort(header);
        };
        for (const header of headers) {
            if (header.dataset.kpSort !== undefined && header.querySelector('button, a') === null && !header.hasAttribute('tabindex'))
                header.tabIndex = 0;
        }

        const selectedRows = () =>
            all.filter((row) => {
                const box = /** @type {HTMLInputElement | null} */ (row.querySelector(SELECT_ROW));
                return box !== null && box.checked;
            });
        const syncSelectAll = () => {
            if (selectAll === null) return;
            const boxes = shown.map((row) => /** @type {HTMLInputElement | null} */ (row.querySelector(SELECT_ROW))).filter((b) => b !== null);
            const checked = boxes.filter((b) => b.checked).length;
            selectAll.checked = boxes.length > 0 && checked === boxes.length;
            // Indeterminate is the honest third state: a header box that
            // reads "checked" while three of ten rows are selected lies.
            selectAll.indeterminate = checked > 0 && checked < boxes.length;
        };
        const announceSelection = () => {
            const rows = selectedRows();
            const keys = rows.map((row) => row.dataset.kpRowKey ?? row.id ?? '');
            wrap.dispatchEvent(new CustomEvent(SELECT_EVENT, { bubbles: true, detail: { keys, rows } }));
        };
        /** @param {Event} event */
        const onBodyChange = (event) => {
            if (!(/** @type {HTMLElement} */ (event.target).matches(SELECT_ROW))) return;
            syncSelectAll();
            announceSelection();
        };
        const onSelectAll = () => {
            if (selectAll === null) return;
            for (const row of shown) {
                const box = /** @type {HTMLInputElement | null} */ (row.querySelector(SELECT_ROW));
                if (box !== null) box.checked = selectAll.checked;
            }
            selectAll.indeterminate = false;
            announceSelection();
        };

        search?.addEventListener('input', onSearch);
        table.tHead?.addEventListener('click', onHeadClick);
        table.tHead?.addEventListener('keydown', onHeadKey);
        body.addEventListener('change', onBodyChange);
        selectAll?.addEventListener('change', onSelectAll);
        query = search?.value ?? '';
        // A header the server rendered already sorted keeps its sort.
        const presorted = headers.findIndex((h) => h.getAttribute('aria-sort') === 'ascending' || h.getAttribute('aria-sort') === 'descending');
        if (presorted !== -1) sort = { column: presorted, direction: /** @type {Direction} */ (headers[presorted]?.getAttribute('aria-sort')) };
        applyFilter();

        /** @type {DataTableHandle} */
        const handle = {
            element: wrap,
            view,
            sort: setSort,
            page: (next) => {
                page = Math.max(0, next);
                render();
            },
            query: (next) => {
                query = next;
                if (search !== null) search.value = next;
                applyFilter();
            },
            selected: () => selectedRows().map((row) => row.dataset.kpRowKey ?? row.id ?? ''),
            select: (keys) => {
                const want = new Set(keys);
                for (const row of all) {
                    const box = /** @type {HTMLInputElement | null} */ (row.querySelector(SELECT_ROW));
                    if (box !== null) box.checked = want.has(row.dataset.kpRowKey ?? row.id ?? '');
                }
                syncSelectAll();
                announceSelection();
            },
            refresh: () => {
                all = [...body.rows];
                for (const row of all) if (!rendered.includes(row)) rendered.push(row);
                applyFilter();
            },
        };
        handles.set(wrap, handle);
        created.push(handle);

        cleanups.push(() => {
            clearTimeout(pending);
            search?.removeEventListener('input', onSearch);
            table.tHead?.removeEventListener('click', onHeadClick);
            table.tHead?.removeEventListener('keydown', onHeadKey);
            body.removeEventListener('change', onBodyChange);
            selectAll?.removeEventListener('change', onSelectAll);
            // Put back what the server rendered: order, visibility, the
            // sort marks, the pager, the empty state, the focusability.
            for (const row of rendered) {
                row.hidden = false;
                body.append(row);
            }
            headers.forEach((header, i) => {
                const was = headerSort[i];
                if (was === null || was === undefined) header.removeAttribute('aria-sort');
                else header.setAttribute('aria-sort', was);
                const tab = headerTab[i];
                if (tab === null || tab === undefined) header.removeAttribute('tabindex');
                else header.setAttribute('tabindex', tab);
            });
            if (pager !== null) pager.textContent = '';
            if (empty !== null) empty.hidden = emptyWasHidden;
            handles.delete(wrap);
            delete wrap.dataset.kpDatatableAttached;
        });
    }

    const detach = () => {
        for (const c of cleanups) c();
    };
    return Object.assign(detach, { handles: created });
}
