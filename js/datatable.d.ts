export type Direction = 'ascending' | 'descending' | 'none';
export type Sort = {
    column: number;
    direction: Direction;
} | null;
export type View = {
    shown: number;
    total: number;
    page: number;
    pages: number;
    query: string;
    sort: Sort;
};
/** @typedef {'ascending' | 'descending' | 'none'} Direction */
/** @typedef {{ column: number, direction: Direction } | null} Sort */
/** @typedef {{ shown: number, total: number, page: number, pages: number, query: string, sort: Sort }} View */
/** Fired on the wrapper when the visible set changes. A contract value [TH26]. Detail: View. */
export declare const VIEW_EVENT = "kp-datatable-view";
/** Fired when the selection changes; the detail carries the selected row keys and rows. */
export declare const SELECT_EVENT = "kp-datatable-select";
/** Fired when the sort changes: `{ column, direction }` or null. */
export declare const SORT_EVENT = "kp-datatable-sort";
/** Rows per page when the consumer does not say. An operational knob; per table as `data-kp-page-size`. */
export declare const PAGE_SIZE = 10;
export type Compare = (a: string, b: string, kind: string, locale: string) => number;
export type Filter = (row: HTMLTableRowElement, query: string) => boolean;
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
export declare function compare(a: string, b: string, kind: string, locale: string): number;
export type DataTableHandle = {
    element: HTMLElement;
    view: () => View;
    sort: (sort: Sort) => void;
    page: (page: number) => void;
    query: (query: string) => void;
    selected: () => string[];
    select: (keys: readonly string[]) => void;
    /**
     * re-read the rows after the consumer added or removed some
     */
    refresh: () => void;
};
/** The handle for an attached table, for code that did not call attach. @param {Element} element */
export declare function dataTable(element: Element): DataTableHandle | null;
/**
 * Attach every data table under `root`.
 *
 * @param {ParentNode} root
 * @param {{ locale?: string, compare?: Compare, filter?: Filter, debounceMs?: number, sortCycle?: 'two' | 'three', pagerClassName?: string, pageLabel?: (at: number, of: number) => string }} [options]
 *   Defaults, each also settable per table: `data-kp-locale`, `data-kp-debounce`, `data-kp-sort-cycle`.
 * @returns {(() => void) & { handles: DataTableHandle[] }} detach
 */
export declare function attachDataTables(root?: ParentNode, { locale: localeOption, compare: compareFn, filter: filterFn, debounceMs, sortCycle, pagerClassName, pageLabel, }?: {
    locale?: string;
    compare?: Compare;
    filter?: Filter;
    debounceMs?: number;
    sortCycle?: 'two' | 'three';
    pagerClassName?: string;
    pageLabel?: (at: number, of: number) => string;
}): (() => void) & {
    handles: DataTableHandle[];
};
