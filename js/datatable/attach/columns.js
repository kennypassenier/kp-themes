// The columns: headers, labels, kinds and how a cell reads.
import { columnId } from '../../remember.js';
import { splitList } from '../filter.js';
import { EDIT_VALUE, EXPAND_COLUMN, REORDER_COLUMN, SELECT_ALL } from '../selectors.js';
/** @typedef {import('../events.js').EditKind} EditKind */
/** @typedef {import('../events.js').FilterKind} FilterKind */
/** @typedef {import('./context.js').TableContext} TableContext */

/**
 * What the the columns: headers, labels, kinds and how a cell reads part adds to the table's context.
 *
 * @typedef {{
 *     cellText: (row: HTMLTableRowElement, at: number) => string;
 *     cellValue: (row: HTMLTableRowElement, at: number) => string;
 *     choiceText: (row: HTMLTableRowElement, at: number) => string;
 *     columnIds: string[];
 *     controlColumn: (at: number) => boolean;
 *     editKinds: (EditKind | null)[];
 *     filterKinds: (FilterKind | null)[];
 *     headerSort: (string | null)[];
 *     headerTab: (string | null)[];
 *     headers: HTMLTableCellElement[];
 *     headersWereHidden: (boolean | 'until-found')[];
 *     keyColumn: number;
 *     keyOf: (row: HTMLTableRowElement) => string;
 *     labelOf: (at: number) => string;
 *     orders: (string[] | null)[];
 * }} ColumnsFields
 */

/**
 * The columns: headers, labels, kinds and how a cell reads.
 *
 * @param {TableContext} c
 */
export function installColumns(c) {
    const { headRow } = c;

    const headers = /** @type {HTMLTableCellElement[]} */ ([...(headRow?.cells ?? [])]);
    c.headers = headers;
    const headerSort = headers.map((h) => h.getAttribute('aria-sort'));
    c.headerSort = headerSort;
    const headerTab = headers.map((h) => h.getAttribute('tabindex'));
    c.headerTab = headerTab;
    const headersWereHidden = headers.map((h) => h.hidden);
    c.headersWereHidden = headersWereHidden;
    /** The column names, read once: the sort order a header shows later is not part of its name. */
    const labels = headers.map((h) => (h.textContent ?? '').trim());
    /** What a remembered column or sort key is stored under: never the index, which the control columns shift. */
    const columnIds = headers.map((h) => columnId(h));
    c.columnIds = columnIds;
    /** @param {number} at */
    const labelOf = (at) => labels[at] ?? '';
    c.labelOf = labelOf;
    const orders = headers.map((h) => (h.dataset.kpSortOrder === undefined ? null : splitList(h.dataset.kpSortOrder)));
    c.orders = orders;
    const filterKinds = headers.map((h) => {
        const kind = h.dataset.kpFilter;
        return kind === 'choice' || kind === 'range' || kind === 'date' ? /** @type {FilterKind} */ (kind) : null;
    });
    c.filterKinds = filterKinds;
    const editKinds = headers.map((h) => {
        const kind = h.dataset.kpEdit;
        return kind === 'text' || kind === 'number' || kind === 'select' || kind === 'date' ? /** @type {EditKind} */ (kind) : null;
    });
    c.editKinds = editKinds;
    /** A column of controls — the selection boxes, the expand buttons — rather than of values. @param {number} at */
    const controlColumn = (at) => {
        const header = headers[at];
        return header === undefined || header.querySelector(SELECT_ALL) !== null || header.matches(EXPAND_COLUMN) || header.matches(REORDER_COLUMN);
    };
    c.controlColumn = controlColumn;
    /** The column that names a row: the first that is not a column of controls. */
    const keyColumn = headers.findIndex((_, at) => !controlColumn(at));
    c.keyColumn = keyColumn;
    /** @param {HTMLTableRowElement} row @param {number} at */
    const cellText = (row, at) => {
        const cell = row.cells[at];
        if (cell === undefined) return '';
        return ((cell.querySelector(EDIT_VALUE) ?? cell).textContent ?? '').trim();
    };
    c.cellText = cellText;
    /**
     * What a cell sorts and range-filters by: its `data-kp-sort-value` [kpadopt2-grids] when it has one (a
     * bar cell shows "62%" and sorts by 62; a size shows "1.4 GB" and sorts by its bytes), else what it shows.
     * Search and choice filters keep reading the shown text.
     * @param {HTMLTableRowElement} row @param {number} at
     */
    const cellValue = (row, at) => row.cells[at]?.getAttribute('data-kp-sort-value') ?? cellText(row, at);
    c.cellValue = cellValue;
    /**
     * What a choice filter reads of a cell: its `data-kp-filter-value` [kpadopt3] when it has one (a status cell shows a
     * dot, a word and a time, and is listed and matched as "running"), else what it shows. Search keeps the shown text.
     * On a header the same attribute is the filter the page opens with (read below, from `headers`).
     * @param {HTMLTableRowElement} row @param {number} at
     */
    const choiceText = (row, at) => row.cells[at]?.getAttribute('data-kp-filter-value')?.trim() ?? cellText(row, at);
    c.choiceText = choiceText;
    /** @param {HTMLTableRowElement} row */
    const keyOf = (row) => row.dataset.kpRowKey ?? row.id ?? '';
    c.keyOf = keyOf;
}
