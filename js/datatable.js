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
//   <div class="kp-datatable" data-kp-datatable data-kp-cards data-kp-max-height="24rem">
//     <div class="kp-datatable__bar">
//       <input class="kp-datatable__search" data-kp-datatable-search type="search" />
//       <select class="kp-field__input kp-datatable__select" data-kp-datatable-scope></select>
//       <select class="kp-field__input kp-datatable__select" data-kp-datatable-density></select>
//     </div>
//     <div class="kp-datatable__actions" data-kp-datatable-actions hidden>
//       <span data-kp-datatable-selected-count></span> …the app's buttons…
//     </div>
//     <div class="kp-table-wrap">
//       <table class="kp-table">
//         <caption>Incidents</caption>
//         <thead><tr>
//           <th><input type="checkbox" data-kp-select-all /></th>
//           <th data-kp-sort="text" data-kp-filter="choice">Site</th>
//           <th data-kp-sort="text" data-kp-sort-order="Low,Medium,High,Critical">Severity</th>
//           <th data-kp-sort="number" data-kp-filter="range">Hours</th>
//           <th data-kp-sort="date" data-kp-filter="date">Opened</th>
//         </tr></thead>
//         <tbody>…</tbody>
//       </table>
//     </div>
//     <div class="kp-empty" data-kp-datatable-empty hidden>… <button data-kp-datatable-clear>…</button></div>
//     <div class="kp-datatable__bar">
//       <p class="kp-datatable__status" data-kp-datatable-status role="status" aria-live="polite"></p>
//       <div class="kp-datatable__pager" data-kp-datatable-pager></div>
//     </div>
//   </div>
//
// The wrapper was optional until 3.2.0 and is now what carries the
// keyboard-reachable scroll region [TH95] and the container query the
// card layout reads [TH96, AR24]. Without it a wide table still scrolls
// the page sideways and the cards fall back to the whole datatable's
// width, which is the same number in every layout this package draws.
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
//
// Round eight [gap-13, Kenny 2026-09-13]: search limited to one column,
// per-column filters declared on the header with removable pills, a sort
// order per column, a density choice that reaches the search box, a
// page-size choice (25 by default), selection scoped to the page with an
// action bar slot, a sticky header under a max height, loading and failed
// states, a sort control for the card layout, the package's own themed
// checkboxes, and the rows the table shows handed to the app — which is
// all an export needs, so export stays the app's.

import { getStrings } from './strings.js';
import { collator, parseNumber, resolveLocale } from './locale.js';
import { attachTableRegions } from './tables.js';
import { attachDatePickers, datePicker, DATE_EVENT } from './datepicker.js';
import { attachSelect, drawsSelect } from './combobox.js';

const TABLE = '[data-kp-datatable]';
const SEARCH = '[data-kp-datatable-search]';
const SCOPE = '[data-kp-datatable-scope]';
const DENSITY = '[data-kp-datatable-density]';
const STATUS = '[data-kp-datatable-status]';
const PAGER = '[data-kp-datatable-pager]';
const EMPTY = '[data-kp-datatable-empty]';
const CLEAR = '[data-kp-datatable-clear]';
const LOADING = '[data-kp-datatable-loading]';
const FAILED = '[data-kp-datatable-failed]';
const RETRY = '[data-kp-datatable-retry]';
const ACTIONS = '[data-kp-datatable-actions]';
const SELECTED_COUNT = '[data-kp-datatable-selected-count]';
const CLEAR_SELECTION = '[data-kp-datatable-clear-selection]';
const FILTERS = '[data-kp-datatable-filters]';
const FILTER_TOGGLE = '[data-kp-datatable-filter-toggle]';
const PILLS = '[data-kp-datatable-pills]';
const CARD_SORT = '[data-kp-datatable-card-sort]';
const SELECT_ALL = '[data-kp-select-all]';
const SELECT_ROW = '[data-kp-select-row]';
/** The package's own checkbox [gap-13]: every register already answers it. */
const CHECK_CLASS = 'kp-field__check';

/** @typedef {'ascending' | 'descending' | 'none'} Direction */
/** @typedef {{ column: number, direction: Direction } | null} Sort */
/** @typedef {'choice' | 'range' | 'date'} FilterKind */
/** A choice filter's ticked values, or a range's bounds as typed. @typedef {string[] | { from?: string, to?: string }} FilterValue */
/** @typedef {'ready' | 'loading' | 'failed'} State */
/** @typedef {'comfortable' | 'compact'} Density */
/**
 * @typedef {{ shown: number, total: number, page: number, pages: number, pageSize: number, query: string, scope: number | null,
 *   filters: Record<number, FilterValue>, sort: Sort, density: Density, state: State, keys: string[], pageKeys: string[] }} View
 */

/** Fired on the wrapper when the visible set changes. A contract value [TH26]. Detail: View, plus `rows` and `pageRows` (the elements). */
export const VIEW_EVENT = 'kp-datatable-view';
/** Fired when the selection changes; the detail carries the selected row keys and rows. */
export const SELECT_EVENT = 'kp-datatable-select';
/** Fired when the sort changes: `{ column, direction }` or null. */
export const SORT_EVENT = 'kp-datatable-sort';
/** Fired when the failed state's retry control is pressed; the app loads again and sets the state. */
export const RETRY_EVENT = 'kp-datatable-retry';

/** Rows per page when the consumer does not say [Kenny, 2026-09-13]. Per table as `data-kp-page-size`. */
export const PAGE_SIZE = 25;
/** The page sizes on offer when the consumer does not say. Per table as `data-kp-page-sizes="10,25"`, or `none`. */
export const PAGE_SIZES = Object.freeze([10, 25, 50, 100]);

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

/**
 * Compare two cells by a declared order, "Low,Medium,High,Critical" [gap-13].
 *
 * Severity sorted as text reads Critical, High, Low, Medium: alphabetical
 * and meaningless. A value the order does not name sorts after every value
 * it does, by the column's own comparison, so a stray "Unknown" neither
 * disappears nor jumps to the top.
 *
 * @param {readonly string[]} order
 * @param {string} a
 * @param {string} b
 * @param {(a: string, b: string) => number} fallback
 */
export function compareByOrder(order, a, b, fallback) {
    const rank = (/** @type {string} */ value) => {
        const at = order.findIndex((entry) => entry.trim().toLowerCase() === value.trim().toLowerCase());
        return at === -1 ? order.length : at;
    };
    return rank(a) - rank(b) || fallback(a, b);
}

/** @param {string | undefined | null} attribute */
const splitList = (attribute) =>
    (attribute ?? '')
        .split(',')
        .map((part) => part.trim())
        .filter((part) => part !== '');

/**
 * Whether a filter holds anything; an empty one filters nothing.
 * @param {FilterKind} kind
 * @param {FilterValue | undefined} value
 */
export function filterActive(kind, value) {
    if (value === undefined) return false;
    if (kind === 'choice') return Array.isArray(value) && value.length > 0;
    const range = /** @type {{ from?: string, to?: string }} */ (value);
    return (range.from ?? '') !== '' || (range.to ?? '') !== '';
}

/**
 * Whether a cell's text passes a column's filter [gap-13].
 *
 * A range reads the cell in the page's locale, the way the sort does; a
 * date reads it as the date the cell writes, and the upper bound takes
 * the whole of its day, so "to 12 August" includes 12 August.
 *
 * @param {FilterKind} kind
 * @param {FilterValue | undefined} value
 * @param {string} text the cell's text
 * @param {string} locale
 */
export function matchesFilter(kind, value, text, locale) {
    if (!filterActive(kind, value)) return true;
    if (kind === 'choice') return /** @type {string[]} */ (value).includes(text.trim());
    const { from = '', to = '' } = /** @type {{ from?: string, to?: string }} */ (value);
    if (kind === 'range') {
        const n = parseNumber(text, locale);
        if (Number.isNaN(n)) return false;
        if (from !== '' && n < Number(from)) return false;
        if (to !== '' && n > Number(to)) return false;
        return true;
    }
    const at = Date.parse(text.trim());
    if (Number.isNaN(at)) return false;
    if (from !== '' && at < Date.parse(from)) return false;
    if (to !== '' && at > Date.parse(to) + (/^\d{4}-\d{2}-\d{2}$/.test(to) ? 86_399_999 : 0)) return false;
    return true;
}

/**
 * The pills an active filter shows, each with the value that removes it.
 *
 * @param {FilterKind} kind
 * @param {string} column the column's name
 * @param {FilterValue | undefined} value
 * @param {import('./strings.js').Strings} s
 * @returns {{ label: string, without: FilterValue | undefined }[]}
 */
export function filterPills(kind, column, value, s) {
    if (!filterActive(kind, value)) return [];
    if (kind === 'choice') {
        const list = /** @type {string[]} */ (value);
        return list.map((item) => ({ label: s.tableFilterValue(column, item), without: list.filter((other) => other !== item) }));
    }
    const { from = '', to = '' } = /** @type {{ from?: string, to?: string }} */ (value);
    return [{ label: s.tableFilterRange(column, from || s.tableFilterOpenEnd, to || s.tableFilterOpenEnd), without: undefined }];
}

/** @type {Filter} */
const defaultFilter = (row, query) => (row.textContent ?? '').toLowerCase().includes(query);

/**
 * @typedef {object} DataTableHandle
 * @property {HTMLElement} element
 * @property {() => View} view
 * @property {(sort: Sort) => void} sort
 * @property {(page: number) => void} page
 * @property {(size: number) => void} pageSize
 * @property {(query: string) => void} query
 * @property {(column: number | null) => void} scope  limit the search to one column, or null for all
 * @property {(column: number, value: FilterValue | null) => void} filter  set one column's filter; null clears it
 * @property {() => void} clearFilters
 * @property {(density: Density) => void} density
 * @property {(state: State) => void} state  loading, failed, or ready again
 * @property {(which?: 'view' | 'page') => HTMLTableRowElement[]} rows  the rows the table shows, in order: every page of the view, or this page
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

let instances = 0;

/**
 * Attach every data table under `root`.
 *
 * @param {ParentNode} root
 * @param {{ locale?: string, compare?: Compare, filter?: Filter, debounceMs?: number, sortCycle?: 'two' | 'three', pagerClassName?: string, pageLabel?: (at: number, of: number) => string, regions?: boolean, pageSizes?: readonly number[], removeGlyph?: string }} [options]
 *   Defaults, each also settable per table: `data-kp-locale`, `data-kp-debounce`, `data-kp-sort-cycle`, `data-kp-page-size`,
 *   `data-kp-page-sizes` (`none` for no choice). `regions` upgrades the scroll wrapper to a named region [TH95]; off leaves the
 *   wrapper untouched.
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
        regions = true,
        pageSizes: pageSizesOption = PAGE_SIZES,
        removeGlyph = '×',
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
        instances += 1;
        const id = `kp-datatable-${instances}`;
        /** Everything this attach put into the page, taken out again by detach. @type {Element[]} */
        const added = [];
        /** @type {(() => void)[]} */
        const undo = [];

        // The scroll box is a region a keyboard can reach [TH95]. Here as
        // well as in auto.js, because a consumer who attaches only the
        // data tables should not have to know about a second call to make
        // their table operable.
        if (regions) cleanups.push(attachTableRegions(wrap));

        const search = /** @type {HTMLInputElement | null} */ (wrap.querySelector(SEARCH));
        const scopeSelect = /** @type {HTMLSelectElement | null} */ (wrap.querySelector(SCOPE));
        const densitySelect = /** @type {HTMLSelectElement | null} */ (wrap.querySelector(DENSITY));
        const status = /** @type {HTMLElement | null} */ (wrap.querySelector(STATUS));
        const pager = /** @type {HTMLElement | null} */ (wrap.querySelector(PAGER));
        const empty = /** @type {HTMLElement | null} */ (wrap.querySelector(EMPTY));
        const loadingSlot = /** @type {HTMLElement | null} */ (wrap.querySelector(LOADING));
        const failedSlot = /** @type {HTMLElement | null} */ (wrap.querySelector(FAILED));
        const actions = /** @type {HTMLElement | null} */ (wrap.querySelector(ACTIONS));
        const selectAll = /** @type {HTMLInputElement | null} */ (wrap.querySelector(SELECT_ALL));
        let size = Number.parseInt(wrap.dataset.kpPageSize ?? '', 10) || PAGE_SIZE;
        const locale = resolveLocale(wrap.dataset.kpLocale ?? localeOption, wrap);
        const debounce = Number.parseInt(wrap.dataset.kpDebounce ?? '', 10) || debounceMs;
        const cycle = wrap.dataset.kpSortCycle ?? sortCycle;
        const sizesAttribute = wrap.dataset.kpPageSizes;
        const sizes =
            sizesAttribute === 'none'
                ? []
                : [
                      ...new Set([
                          ...(sizesAttribute
                              ? splitList(sizesAttribute)
                                    .map(Number)
                                    .filter((n) => n > 0)
                              : pageSizesOption),
                          size,
                      ]),
                  ].sort((a, b) => a - b);

        /** Every row as it was rendered. Sorting reorders this array, never the DOM's idea of it. */
        let all = /** @type {HTMLTableRowElement[]} */ ([...body.rows]);
        /** The order the server rendered, so detach can put it back. */
        const rendered = [...all];
        /** @type {HTMLTableRowElement[]} */
        let shown = [...all];
        /** @type {HTMLTableRowElement[]} */
        let pageRows = [...all];
        let page = 0;
        let query = '';
        /** @type {number | null} */
        let scope = null;
        /** @type {Map<number, FilterValue>} */
        const filters = new Map();
        /** @type {Sort} */
        let sort = null;
        /** @type {State} */
        let state = /** @type {State} */ (['loading', 'failed'].includes(wrap.dataset.kpState ?? '') ? wrap.dataset.kpState : 'ready');
        const emptyWasHidden = empty?.hidden ?? false;
        const densityWas = wrap.getAttribute('data-density');
        const busyWas = wrap.getAttribute('aria-busy');

        const headers = /** @type {HTMLTableCellElement[]} */ ([...(table.tHead?.rows[0]?.cells ?? [])]);
        const headerSort = headers.map((h) => h.getAttribute('aria-sort'));
        const headerTab = headers.map((h) => h.getAttribute('tabindex'));
        /** @param {HTMLTableCellElement | undefined} header */
        const headerLabel = (header) => (header?.textContent ?? '').trim();
        const orders = headers.map((h) => (h.dataset.kpSortOrder === undefined ? null : splitList(h.dataset.kpSortOrder)));
        const filterKinds = headers.map((h) => {
            const kind = h.dataset.kpFilter;
            return kind === 'choice' || kind === 'range' || kind === 'date' ? /** @type {FilterKind} */ (kind) : null;
        });

        /** @param {HTMLTableRowElement} row @param {number} at */
        const cellText = (row, at) => (row.cells[at]?.textContent ?? '').trim();
        /** @param {HTMLTableRowElement} row */
        const keyOf = (row) => row.dataset.kpRowKey ?? row.id ?? '';

        // The package's own checkbox, whatever the markup wrote [gap-13,
        // Kenny's note]: a data table's boxes were the browser's, next to
        // themed boxes everywhere else on the page.
        /** @param {Element | null} box */
        const themeBox = (box) => {
            if (box === null || box.classList.contains(CHECK_CLASS)) return;
            box.classList.add(CHECK_CLASS);
            undo.push(() => box.classList.remove(CHECK_CLASS));
        };
        const themeBoxes = () => {
            themeBox(selectAll);
            for (const row of all) themeBox(row.querySelector(SELECT_ROW));
        };
        themeBoxes();
        if (selectAll !== null && !selectAll.hasAttribute('aria-label') && selectAll.labels?.length === 0) {
            selectAll.setAttribute('aria-label', getStrings().tableSelectAll);
            undo.push(() => selectAll.removeAttribute('aria-label'));
        }

        // A max height makes the header stick [Kenny, 2026-09-13]: the
        // stylesheet does the sticking, this only carries the value.
        const maxHeight = wrap.dataset.kpMaxHeight;
        if (maxHeight !== undefined && maxHeight !== '') {
            wrap.style.setProperty('--kp-datatable-max-height', maxHeight);
            undo.push(() => wrap.style.removeProperty('--kp-datatable-max-height'));
        }

        /** The direct child of the wrapper that holds the table: generated parts go before it. */
        let tableBlock = /** @type {Element} */ (table);
        while (tableBlock.parentElement !== null && tableBlock.parentElement !== wrap) tableBlock = tableBlock.parentElement;
        const topBar = /** @type {HTMLElement | null} */ (
            [...wrap.children].find(
                (child) =>
                    child.classList.contains('kp-datatable__bar') && child.compareDocumentPosition(tableBlock) & Node.DOCUMENT_POSITION_FOLLOWING,
            ) ?? null
        );
        /** @template {Element} T @param {T} node @returns {T} */
        const add = (node) => {
            added.push(node);
            return node;
        };
        /** @param {string} tag @param {string} [className] */
        const make = (tag, className) => {
            const node = document.createElement(tag);
            if (className) node.className = className;
            return node;
        };
        const s0 = getStrings();

        // ── The "In" choice ────────────────────────────────────────────
        if (scopeSelect !== null) {
            if (scopeSelect.options.length === 0) {
                const every = make('option');
                every.setAttribute('value', '');
                every.textContent = s0.tableSearchAllColumns;
                scopeSelect.append(add(every));
                headers.forEach((header, at) => {
                    if (header.dataset.kpSearch === 'false' || header.querySelector(SELECT_ALL) !== null || headerLabel(header) === '') return;
                    const option = /** @type {HTMLOptionElement} */ (make('option'));
                    option.value = String(at);
                    option.textContent = headerLabel(header);
                    scopeSelect.append(add(option));
                });
            }
            if (!scopeSelect.hasAttribute('aria-label') && scopeSelect.labels?.length === 0) {
                scopeSelect.setAttribute('aria-label', s0.tableSearchScope);
                undo.push(() => scopeSelect.removeAttribute('aria-label'));
            }
            scope = scopeSelect.value === '' ? null : Number(scopeSelect.value);
        }

        // ── The density choice ─────────────────────────────────────────
        if (densitySelect !== null) {
            if (densitySelect.options.length === 0) {
                for (const [value, text] of [
                    ['comfortable', s0.tableDensityComfortable],
                    ['compact', s0.tableDensityCompact],
                ]) {
                    const option = /** @type {HTMLOptionElement} */ (make('option'));
                    option.value = value ?? '';
                    option.textContent = text ?? '';
                    densitySelect.append(add(option));
                }
            }
            if (!densitySelect.hasAttribute('aria-label') && densitySelect.labels?.length === 0) {
                densitySelect.setAttribute('aria-label', s0.tableDensity);
                undo.push(() => densitySelect.removeAttribute('aria-label'));
            }
            densitySelect.value = wrap.getAttribute('data-density') === 'compact' ? 'compact' : 'comfortable';
        }

        // ── Filters, declared on the headers ───────────────────────────
        const filterColumns = filterKinds.flatMap((kind, at) => (kind === null ? [] : [at]));
        /** @type {HTMLElement | null} */
        let panel = null;
        /** @type {HTMLButtonElement | null} */
        let toggle = null;
        /** @type {HTMLElement | null} */
        let pills = null;
        if (filterColumns.length > 0) {
            panel = /** @type {HTMLElement | null} */ (wrap.querySelector(FILTERS));
            if (panel === null) {
                panel = add(make('div', 'kp-datatable__filters'));
                panel.dataset.kpDatatableFilters = '';
                panel.hidden = wrap.dataset.kpFiltersOpen === undefined;
                wrap.insertBefore(panel, tableBlock);
            }
            if (panel.id === '') {
                panel.id = `${id}-filters`;
                const node = panel;
                undo.push(() => node.removeAttribute('id'));
            }
            panel.setAttribute('role', 'group');
            panel.setAttribute('aria-label', s0.tableFiltersLabel);
            for (const at of filterColumns) {
                const kind = /** @type {FilterKind} */ (filterKinds[at]);
                const label = headerLabel(headers[at]);
                const set = add(make('fieldset', 'kp-fieldset kp-datatable__filter'));
                set.dataset.kpFilterColumn = String(at);
                const legend = make('legend', 'kp-field__label');
                legend.textContent = label;
                set.append(legend);
                if (kind === 'choice') {
                    const header = headers[at];
                    const declared = splitList(header?.dataset.kpFilterOptions);
                    const values = declared.length > 0 ? declared : [...new Set(all.map((row) => cellText(row, at)).filter((v) => v !== ''))];
                    const order = orders[at];
                    if (declared.length === 0)
                        values.sort((a, b) => (order ? compareByOrder(order, a, b, collator(locale).compare) : collator(locale).compare(a, b)));
                    for (const value of values) {
                        const option = make('label', 'kp-field__option');
                        const box = /** @type {HTMLInputElement} */ (make('input', CHECK_CLASS));
                        box.type = 'checkbox';
                        box.value = value;
                        option.append(box, ` ${value}`);
                        set.append(option);
                    }
                } else {
                    const range = make('div', 'kp-datatable__range');
                    for (const bound of ['from', 'to']) {
                        const input = /** @type {HTMLInputElement} */ (make('input', 'kp-field__input'));
                        input.dataset.kpFilterBound = bound;
                        input.setAttribute('aria-label', bound === 'from' ? s0.tableFilterFrom(label) : s0.tableFilterTo(label));
                        if (kind === 'range') {
                            input.type = 'number';
                            range.append(input);
                            continue;
                        }
                        // A date bound is the package's own date picker, not a
                        // bare date input, so it wears every theme's picker
                        // (scope-58, Kenny's second nostromo pass). The picker
                        // holds ISO in data-kp-date-value whatever the field shows.
                        const picker = make('div', 'kp-datepicker');
                        picker.dataset.kpDatepicker = '';
                        picker.dataset.kpLocale = locale;
                        input.type = 'text';
                        input.inputMode = 'numeric';
                        input.id = `${id}-filter-${at}-${bound}`;
                        input.dataset.kpDateInput = '';
                        const opener = /** @type {HTMLButtonElement} */ (make('button', 'kp-button kp-button--ghost'));
                        opener.type = 'button';
                        opener.dataset.kpDateOpen = '';
                        opener.setAttribute('aria-label', s0.calendarOpen);
                        opener.textContent = s0.calendarButton;
                        const datePanel = make('div', 'kp-datepicker__panel');
                        datePanel.dataset.kpDatePanel = '';
                        datePanel.hidden = true;
                        picker.append(input, opener, datePanel);
                        range.append(picker);
                    }
                    set.append(range);
                    if (kind === 'date') {
                        const detachPickers = attachDatePickers(range);
                        undo.push(detachPickers);
                    }
                }
                panel.append(set);
            }

            toggle = /** @type {HTMLButtonElement | null} */ (wrap.querySelector(FILTER_TOGGLE));
            if (toggle === null) {
                toggle = /** @type {HTMLButtonElement} */ (add(make('button', 'kp-button kp-button--ghost kp-datatable__filter-toggle')));
                toggle.type = 'button';
                toggle.dataset.kpDatatableFilterToggle = '';
                if (topBar !== null) topBar.append(toggle);
                else wrap.insertBefore(toggle, panel);
            }
            toggle.setAttribute('aria-controls', panel.id);
            toggle.setAttribute('aria-expanded', String(!panel.hidden));

            pills = /** @type {HTMLElement | null} */ (wrap.querySelector(PILLS));
            if (pills === null) {
                pills = add(make('div', 'kp-datatable__pills'));
                pills.dataset.kpDatatablePills = '';
                wrap.insertBefore(pills, tableBlock);
            }
        }

        // ── The card layout's sort control ─────────────────────────────
        const sortable = headers.flatMap((header, at) => (header.dataset.kpSort === undefined ? [] : [at]));
        /** @type {HTMLSelectElement | null} */
        let sortBy = null;
        /** @type {HTMLButtonElement | null} */
        let sortDirection = null;
        if (wrap.dataset.kpCards !== undefined && sortable.length > 0 && wrap.querySelector(CARD_SORT) === null) {
            const control = add(make('div', 'kp-datatable__card-sort'));
            control.dataset.kpDatatableCardSort = '';
            const label = make('label', 'kp-datatable__label');
            label.append(s0.tableSortBy, ' ');
            sortBy = /** @type {HTMLSelectElement} */ (make('select', 'kp-field__input kp-datatable__select'));
            sortBy.dataset.kpDatatableSortBy = '';
            sortBy.setAttribute('aria-label', s0.tableSortBy);
            const none = /** @type {HTMLOptionElement} */ (make('option'));
            none.value = '';
            none.textContent = s0.tableSortNone;
            sortBy.append(none);
            for (const at of sortable) {
                const option = /** @type {HTMLOptionElement} */ (make('option'));
                option.value = String(at);
                option.textContent = headerLabel(headers[at]);
                sortBy.append(option);
            }
            label.append(sortBy);
            sortDirection = /** @type {HTMLButtonElement} */ (make('button', 'kp-button kp-button--ghost'));
            sortDirection.type = 'button';
            sortDirection.dataset.kpDatatableSortDirection = '';
            control.append(label, sortDirection);
            wrap.insertBefore(control, tableBlock);
        }

        // ── The page-size choice ───────────────────────────────────────
        /** @type {HTMLLabelElement | null} */
        let sizeLabel = null;
        /** @type {HTMLSelectElement | null} */
        let sizeSelect = null;
        if (pager !== null && sizes.length > 0) {
            sizeLabel = /** @type {HTMLLabelElement} */ (make('label', 'kp-datatable__label'));
            sizeSelect = /** @type {HTMLSelectElement} */ (make('select', 'kp-field__input kp-datatable__select kp-datatable__page-size'));
            sizeSelect.dataset.kpDatatablePageSize = '';
            sizeSelect.setAttribute('aria-label', s0.tableRowsPerPage);
            for (const n of sizes) {
                const option = /** @type {HTMLOptionElement} */ (make('option'));
                option.value = String(n);
                option.textContent = String(n);
                sizeSelect.append(option);
            }
            sizeSelect.value = String(size);
            sizeLabel.append(s0.tableRowsPerPage, ' ', sizeSelect);
        }

        /** @returns {View} */
        const view = () => ({
            shown: shown.length,
            total: all.length,
            page,
            pages: Math.max(1, Math.ceil(shown.length / size)),
            pageSize: size,
            query,
            scope,
            filters: Object.fromEntries(filters),
            sort,
            density: wrap.getAttribute('data-density') === 'compact' ? 'compact' : 'comfortable',
            state,
            keys: shown.map(keyOf),
            pageKeys: pageRows.map(keyOf),
        });

        const selectedRows = () =>
            all.filter((row) => {
                const box = /** @type {HTMLInputElement | null} */ (row.querySelector(SELECT_ROW));
                return box !== null && box.checked;
            });
        /** The header box reads the rows on this page, which are the rows it acts on [gap-13]. */
        const syncSelectAll = () => {
            if (selectAll === null) return;
            const boxes = pageRows.map((row) => /** @type {HTMLInputElement | null} */ (row.querySelector(SELECT_ROW))).filter((b) => b !== null);
            const checked = boxes.filter((b) => b.checked).length;
            selectAll.checked = boxes.length > 0 && checked === boxes.length;
            // Indeterminate is the honest third state: a header box that
            // reads "checked" while three of ten rows are selected lies.
            selectAll.indeterminate = checked > 0 && checked < boxes.length;
        };
        const syncActions = () => {
            if (actions === null) return;
            const count = selectedRows().length;
            actions.hidden = count === 0;
            const counter = actions.querySelector(SELECTED_COUNT);
            if (counter !== null) counter.textContent = getStrings().tableSelected(count);
        };

        const syncStateParts = () => {
            if (state === 'loading') wrap.setAttribute('aria-busy', 'true');
            else if (busyWas === null) wrap.removeAttribute('aria-busy');
            else wrap.setAttribute('aria-busy', busyWas);
            wrap.dataset.kpState = state;
            // A skeleton on a first load, the old rows dimmed on a refresh:
            // the stylesheet dims, this only decides whether there is
            // anything to dim.
            if (loadingSlot !== null) loadingSlot.hidden = !(state === 'loading' && all.length === 0);
            if (failedSlot !== null) failedSlot.hidden = state !== 'failed';
        };

        const syncCardSort = () => {
            if (sortBy === null || sortDirection === null) return;
            const s = getStrings();
            sortBy.value = sort === null || sort.direction === 'none' ? '' : String(sort.column);
            const direction = sort?.direction === 'descending' ? 'descending' : 'ascending';
            sortDirection.textContent = direction === 'descending' ? s.tableSortDescending : s.tableSortAscending;
            sortDirection.disabled = sortBy.value === '';
        };

        const render = () => {
            const pages = Math.max(1, Math.ceil(shown.length / size));
            page = Math.min(page, pages - 1);
            const from = page * size;
            pageRows = pager === null ? shown : shown.slice(from, from + size);
            for (const row of all) row.hidden = true;
            for (const row of pageRows) row.hidden = false;
            // Reordering by appending: the rows are the same elements, so
            // anything a consumer attached to them survives a sort.
            for (const row of shown) body.append(row);

            const s = getStrings();
            if (status !== null) {
                status.textContent =
                    state === 'loading'
                        ? s.busy
                        : s.tableShowing(pageRows.length === 0 ? 0 : from + 1, from + pageRows.length, shown.length, all.length);
            }
            if (pager !== null) {
                pager.textContent = '';
                if (sizeLabel !== null) pager.append(sizeLabel);
                pager.append(pagerButton(s.previous, page > 0, () => (page -= 1)));
                const label = document.createElement('span');
                label.className = 'kp-datatable__page';
                label.textContent = (pageLabel ?? s.tablePage)(page + 1, pages);
                pager.append(label);
                pager.append(pagerButton(s.next, page < pages - 1, () => (page += 1)));
            }
            if (empty !== null) empty.hidden = shown.length > 0 || state !== 'ready';
            // After a search or a filter the ticked row may be gone from the
            // page, and the header box must say so [gap-13].
            syncSelectAll();
            syncActions();
            syncStateParts();
            syncCardSort();
            wrap.dispatchEvent(new CustomEvent(VIEW_EVENT, { bubbles: true, detail: { ...view(), rows: [...shown], pageRows: [...pageRows] } }));
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

        // The list is rebuilt, the clear button is not: a click on it blurs a
        // range field, whose change event re-renders the pills, and a button
        // rebuilt between the press and the release never gets its click.
        const pillsList = add(make('ul', 'kp-tag-list'));
        const clearButton = /** @type {HTMLButtonElement} */ (add(make('button', 'kp-button kp-button--ghost kp-datatable__clear-filters')));
        clearButton.type = 'button';
        clearButton.addEventListener('click', () => {
            clearFilters();
            toggle?.focus();
        });
        if (pills !== null) {
            pills.textContent = '';
            pills.append(pillsList, clearButton);
        }
        const renderPills = () => {
            if (pills === null) return;
            const s = getStrings();
            const list = pillsList;
            list.textContent = '';
            list.setAttribute('aria-label', s.tableActiveFilters);
            clearButton.textContent = s.tableClearFilters;
            let count = 0;
            for (const at of filterColumns) {
                const kind = /** @type {FilterKind} */ (filterKinds[at]);
                for (const pill of filterPills(kind, headerLabel(headers[at]), filters.get(at), s)) {
                    count += 1;
                    const item = make('li', 'kp-tag');
                    const remove = /** @type {HTMLButtonElement} */ (make('button', 'kp-tag__remove'));
                    remove.type = 'button';
                    remove.setAttribute('aria-label', s.tableRemoveFilter(pill.label));
                    remove.textContent = removeGlyph;
                    remove.addEventListener('click', () => {
                        setFilter(at, pill.without ?? null);
                        const next = /** @type {HTMLElement | null} */ (pills?.querySelector('.kp-tag__remove') ?? null);
                        (next ?? toggle)?.focus();
                    });
                    item.append(pill.label, remove);
                    list.append(item);
                }
            }
            pills.hidden = count === 0;
            if (toggle !== null) toggle.textContent = s.tableFilters(count);
        };

        /** True while writeControls sets a date picker, whose change event must not be read back. */
        let writing = false;
        /** Write the filter state into the panel's controls, so a pill or the handle and the panel agree. */
        const writeControls = () => {
            if (panel === null) return;
            for (const set of panel.querySelectorAll('[data-kp-filter-column]')) {
                const at = Number(/** @type {HTMLElement} */ (set).dataset.kpFilterColumn);
                const value = filters.get(at);
                for (const box of set.querySelectorAll('input[type="checkbox"]')) {
                    const input = /** @type {HTMLInputElement} */ (box);
                    input.checked = Array.isArray(value) && value.includes(input.value);
                }
                for (const bound of set.querySelectorAll('[data-kp-filter-bound]')) {
                    const input = /** @type {HTMLInputElement} */ (bound);
                    const range = /** @type {{ from?: string, to?: string } | undefined} */ (Array.isArray(value) ? undefined : value);
                    const wanted = (input.dataset.kpFilterBound === 'from' ? range?.from : range?.to) ?? '';
                    const picker = input.closest('[data-kp-datepicker]');
                    const handle = picker === null ? null : datePicker(picker);
                    if (handle === null) {
                        input.value = wanted;
                        continue;
                    }
                    // A date bound is set through its picker, which formats it for
                    // the locale; what the person is typing is left alone while it
                    // already means the same date.
                    if ((input.dataset.kpDateValue ?? '') === wanted) continue;
                    writing = true;
                    try {
                        handle.set(wanted === '' ? null : wanted);
                    } finally {
                        writing = false;
                    }
                }
            }
        };
        /** Read the panel's controls into the filter state. */
        const readControls = () => {
            if (panel === null) return;
            filters.clear();
            for (const set of panel.querySelectorAll('[data-kp-filter-column]')) {
                const at = Number(/** @type {HTMLElement} */ (set).dataset.kpFilterColumn);
                const kind = filterKinds[at];
                /** @type {FilterValue} */
                let value;
                if (kind === 'choice')
                    value = [...set.querySelectorAll('input[type="checkbox"]:checked')].map((b) => /** @type {HTMLInputElement} */ (b).value);
                else {
                    // A date bound reads the ISO its picker holds, never the text on screen.
                    const read = (/** @type {string} */ bound) => {
                        const input = /** @type {HTMLInputElement | null} */ (set.querySelector(`[data-kp-filter-bound="${bound}"]`));
                        if (input === null) return '';
                        return input.dataset.kpDateInput === undefined ? input.value : (input.dataset.kpDateValue ?? '');
                    };
                    value = { from: read('from'), to: read('to') };
                }
                if (kind !== null && kind !== undefined && filterActive(kind, value)) filters.set(at, value);
            }
        };

        const applyFilter = () => {
            const needle = query.trim().toLowerCase();
            shown = all.filter((row) => {
                if (needle !== '') {
                    const hit = scope === null ? filterFn(row, needle) : cellText(row, scope).toLowerCase().includes(needle);
                    if (!hit) return false;
                }
                for (const [at, value] of filters) {
                    const kind = filterKinds[at];
                    if (kind && !matchesFilter(kind, value, cellText(row, at), locale)) return false;
                }
                return true;
            });
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
        const onScope = () => {
            scope = scopeSelect === null || scopeSelect.value === '' ? null : Number(scopeSelect.value);
            applyFilter();
        };
        const onDensity = () => {
            if (densitySelect === null) return;
            setDensity(densitySelect.value === 'compact' ? 'compact' : 'comfortable');
        };
        /** @param {Density} next */
        const setDensity = (next) => {
            if (next === 'compact') wrap.setAttribute('data-density', 'compact');
            else wrap.removeAttribute('data-density');
            if (densitySelect !== null) densitySelect.value = next;
            render();
        };
        const onPanel = () => {
            // A picker set by writeControls announces it; that is not a person's change.
            if (writing) return;
            const before = JSON.stringify([...filters]);
            readControls();
            // A change event after the input event that already applied it.
            if (JSON.stringify([...filters]) === before) return;
            renderPills();
            applyFilter();
        };
        const onToggle = () => {
            if (panel === null || toggle === null) return;
            panel.hidden = !panel.hidden;
            toggle.setAttribute('aria-expanded', String(!panel.hidden));
        };
        /** @param {number} at @param {FilterValue | null} value */
        const setFilter = (at, value) => {
            const kind = filterKinds[at];
            if (!kind) return;
            if (value === null || !filterActive(kind, value)) filters.delete(at);
            else filters.set(at, value);
            writeControls();
            renderPills();
            applyFilter();
        };
        const clearFilters = () => {
            filters.clear();
            writeControls();
            renderPills();
            applyFilter();
        };
        const onClear = () => {
            query = '';
            if (search !== null) search.value = '';
            filters.clear();
            writeControls();
            renderPills();
            applyFilter();
            search?.focus();
        };
        const onRetry = () => {
            wrap.dispatchEvent(new CustomEvent(RETRY_EVENT, { bubbles: true }));
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
                const order = orders[at];
                /** @param {string} a @param {string} b */
                const by = (a, b) => compareFn(a, b, kind, locale);
                shown = [...shown].sort((a, b) => {
                    const left = cellText(a, at);
                    const right = cellText(b, at);
                    return sign * (order ? compareByOrder(order, left, right, by) : by(left, right));
                });
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
        const onSortBy = () => {
            if (sortBy === null) return;
            if (sortBy.value === '') setSort(null);
            else setSort({ column: Number(sortBy.value), direction: sort?.direction === 'descending' ? 'descending' : 'ascending' });
        };
        const onSortDirection = () => {
            if (sort === null || sort.direction === 'none') return;
            setSort({ column: sort.column, direction: sort.direction === 'ascending' ? 'descending' : 'ascending' });
        };
        const onPageSize = () => {
            if (sizeSelect === null) return;
            setPageSize(Number(sizeSelect.value));
        };
        /** Keep the first row the reader was looking at on the page they land on. @param {number} next */
        const setPageSize = (next) => {
            if (!(next > 0)) return;
            const first = page * size;
            size = next;
            if (sizeSelect !== null) sizeSelect.value = String(next);
            page = Math.floor(first / size);
            render();
        };

        const announceSelection = () => {
            const rows = selectedRows();
            const keys = rows.map(keyOf);
            wrap.dispatchEvent(new CustomEvent(SELECT_EVENT, { bubbles: true, detail: { keys, rows } }));
        };
        /** @param {Event} event */
        const onBodyChange = (event) => {
            if (!(/** @type {HTMLElement} */ (event.target).matches(SELECT_ROW))) return;
            syncSelectAll();
            syncActions();
            announceSelection();
        };
        const onSelectAll = () => {
            if (selectAll === null) return;
            // The page, and only the page [gap-13]: ticking rows on pages
            // nobody has looked at is how a bulk action reaches rows its
            // user never saw.
            for (const row of pageRows) {
                const box = /** @type {HTMLInputElement | null} */ (row.querySelector(SELECT_ROW));
                if (box !== null) box.checked = selectAll.checked;
            }
            selectAll.indeterminate = false;
            syncActions();
            announceSelection();
        };
        /** @param {readonly string[]} keys */
        const select = (keys) => {
            const want = new Set(keys);
            for (const row of all) {
                const box = /** @type {HTMLInputElement | null} */ (row.querySelector(SELECT_ROW));
                if (box !== null) box.checked = want.has(keyOf(row));
            }
            syncSelectAll();
            syncActions();
            announceSelection();
        };
        const onClearSelection = () => select([]);
        /** @param {Event} event */
        const onActionsClick = (event) => {
            if (/** @type {HTMLElement} */ (event.target).closest(CLEAR_SELECTION) !== null) onClearSelection();
        };
        /** @param {Event} event */
        const onEmptyClick = (event) => {
            if (/** @type {HTMLElement} */ (event.target).closest(CLEAR) !== null) onClear();
        };
        /** @param {Event} event */
        const onFailedClick = (event) => {
            if (/** @type {HTMLElement} */ (event.target).closest(RETRY) !== null) onRetry();
        };

        // The table's own selects wear the package's drawn list, as every
        // .kp-field__input select does since Kenny's form of 2026-09-13 — here
        // as well as in auto.js, because two of them are built by this attach
        // after auto.js has passed, and a consumer may attach only the tables.
        for (const select of [scopeSelect, densitySelect, sortBy, sizeSelect]) {
            if (select === null || select.dataset.kpSelectAttached !== undefined || !drawsSelect(select)) continue;
            cleanups.push(attachSelect(select));
        }

        search?.addEventListener('input', onSearch);
        scopeSelect?.addEventListener('change', onScope);
        densitySelect?.addEventListener('change', onDensity);
        panel?.addEventListener('input', onPanel);
        panel?.addEventListener('change', onPanel);
        panel?.addEventListener(DATE_EVENT, onPanel);
        toggle?.addEventListener('click', onToggle);
        sortBy?.addEventListener('change', onSortBy);
        sortDirection?.addEventListener('click', onSortDirection);
        sizeSelect?.addEventListener('change', onPageSize);
        actions?.addEventListener('click', onActionsClick);
        empty?.addEventListener('click', onEmptyClick);
        failedSlot?.addEventListener('click', onFailedClick);
        table.tHead?.addEventListener('click', onHeadClick);
        table.tHead?.addEventListener('keydown', onHeadKey);
        body.addEventListener('change', onBodyChange);
        selectAll?.addEventListener('change', onSelectAll);
        query = search?.value ?? '';
        // A header the server rendered already sorted keeps its sort.
        const presorted = headers.findIndex((h) => h.getAttribute('aria-sort') === 'ascending' || h.getAttribute('aria-sort') === 'descending');
        if (presorted !== -1) sort = { column: presorted, direction: /** @type {Direction} */ (headers[presorted]?.getAttribute('aria-sort')) };
        // A filter the markup declared as already set: `data-kp-filter-value`,
        // a list for a choice, "from,to" for a range or a date.
        for (const at of filterColumns) {
            const declared = headers[at]?.dataset.kpFilterValue;
            if (declared === undefined) continue;
            const kind = filterKinds[at];
            if (kind === 'choice') filters.set(at, splitList(declared));
            else {
                const [from = '', to = ''] = declared.split(',').map((part) => part.trim());
                filters.set(at, { from, to });
            }
        }
        writeControls();
        renderPills();
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
            pageSize: setPageSize,
            query: (next) => {
                query = next;
                if (search !== null) search.value = next;
                applyFilter();
            },
            scope: (column) => {
                scope = column;
                if (scopeSelect !== null) scopeSelect.value = column === null ? '' : String(column);
                applyFilter();
            },
            filter: setFilter,
            clearFilters,
            density: setDensity,
            state: (next) => {
                state = next;
                render();
            },
            rows: (which = 'view') => (which === 'page' ? [...pageRows] : [...shown]),
            selected: () => selectedRows().map(keyOf),
            select,
            refresh: () => {
                all = [...body.rows];
                for (const row of all) if (!rendered.includes(row)) rendered.push(row);
                themeBoxes();
                applyFilter();
            },
        };
        handles.set(wrap, handle);
        created.push(handle);

        cleanups.push(() => {
            clearTimeout(pending);
            search?.removeEventListener('input', onSearch);
            scopeSelect?.removeEventListener('change', onScope);
            densitySelect?.removeEventListener('change', onDensity);
            panel?.removeEventListener('input', onPanel);
            panel?.removeEventListener('change', onPanel);
            panel?.removeEventListener(DATE_EVENT, onPanel);
            toggle?.removeEventListener('click', onToggle);
            sortBy?.removeEventListener('change', onSortBy);
            sortDirection?.removeEventListener('click', onSortDirection);
            sizeSelect?.removeEventListener('change', onPageSize);
            actions?.removeEventListener('click', onActionsClick);
            empty?.removeEventListener('click', onEmptyClick);
            failedSlot?.removeEventListener('click', onFailedClick);
            table.tHead?.removeEventListener('click', onHeadClick);
            table.tHead?.removeEventListener('keydown', onHeadKey);
            body.removeEventListener('change', onBodyChange);
            selectAll?.removeEventListener('change', onSelectAll);
            // Put back what the server rendered: order, visibility, the
            // sort marks, the pager, the empty state, the focusability, and
            // every part this attach added.
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
            if (loadingSlot !== null) loadingSlot.hidden = true;
            if (failedSlot !== null) failedSlot.hidden = true;
            if (actions !== null) actions.hidden = true;
            for (const node of added) node.remove();
            for (const step of undo) step();
            if (densityWas === null) wrap.removeAttribute('data-density');
            else wrap.setAttribute('data-density', densityWas);
            if (busyWas === null) wrap.removeAttribute('aria-busy');
            else wrap.setAttribute('aria-busy', busyWas);
            delete wrap.dataset.kpState;
            handles.delete(wrap);
            delete wrap.dataset.kpDatatableAttached;
        });
    }

    const detach = () => {
        for (const c of cleanups) c();
    };
    return Object.assign(detach, { handles: created });
}
