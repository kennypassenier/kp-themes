export type Direction = 'ascending' | 'descending' | 'none';
export type Sort = {
    column: number;
    direction: Direction;
} | null;
export type FilterKind = 'choice' | 'range' | 'date';
export type FilterValue = string[] | {
    from?: string;
    to?: string;
};
export type State = 'ready' | 'loading' | 'failed';
export type Density = 'comfortable' | 'compact';
export type View = {
    shown: number;
    total: number;
    page: number;
    pages: number;
    pageSize: number;
    query: string;
    scope: number | null;
    filters: Record<number, FilterValue>;
    sort: Sort;
    density: Density;
    state: State;
    keys: string[];
    pageKeys: string[];
};
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
export declare const VIEW_EVENT = "kp-datatable-view";
/** Fired when the selection changes; the detail carries the selected row keys and rows. */
export declare const SELECT_EVENT = "kp-datatable-select";
/** Fired when the sort changes: `{ column, direction }` or null. */
export declare const SORT_EVENT = "kp-datatable-sort";
/** Fired when the failed state's retry control is pressed; the app loads again and sets the state. */
export declare const RETRY_EVENT = "kp-datatable-retry";
/** Rows per page when the consumer does not say [Kenny, 2026-09-13]. Per table as `data-kp-page-size`. */
export declare const PAGE_SIZE = 25;
/** The page sizes on offer when the consumer does not say. Per table as `data-kp-page-sizes="10,25"`, or `none`. */
export declare const PAGE_SIZES: readonly number[];
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
export declare function compareByOrder(order: readonly string[], a: string, b: string, fallback: (a: string, b: string) => number): number;
/**
 * Whether a filter holds anything; an empty one filters nothing.
 * @param {FilterKind} kind
 * @param {FilterValue | undefined} value
 */
export declare function filterActive(kind: FilterKind, value: FilterValue | undefined): boolean;
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
export declare function matchesFilter(kind: FilterKind, value: FilterValue | undefined, text: string, locale: string): boolean;
/**
 * The pills an active filter shows, each with the value that removes it.
 *
 * @param {FilterKind} kind
 * @param {string} column the column's name
 * @param {FilterValue | undefined} value
 * @param {import('./strings.js').Strings} s
 * @returns {{ label: string, without: FilterValue | undefined }[]}
 */
export declare function filterPills(kind: FilterKind, column: string, value: FilterValue | undefined, s: import('./strings.js').Strings): {
    label: string;
    without: FilterValue | undefined;
}[];
export type DataTableHandle = {
    element: HTMLElement;
    view: () => View;
    sort: (sort: Sort) => void;
    page: (page: number) => void;
    pageSize: (size: number) => void;
    query: (query: string) => void;
    /**
     * limit the search to one column, or null for all
     */
    scope: (column: number | null) => void;
    /**
     * set one column's filter; null clears it
     */
    filter: (column: number, value: FilterValue | null) => void;
    clearFilters: () => void;
    density: (density: Density) => void;
    /**
     * loading, failed, or ready again
     */
    state: (state: State) => void;
    /**
     * the rows the table shows, in order: every page of the view, or this page
     */
    rows: (which?: 'view' | 'page') => HTMLTableRowElement[];
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
 * @param {{ locale?: string, compare?: Compare, filter?: Filter, debounceMs?: number, sortCycle?: 'two' | 'three', pagerClassName?: string, pageLabel?: (at: number, of: number) => string, regions?: boolean, pageSizes?: readonly number[], removeGlyph?: string }} [options]
 *   Defaults, each also settable per table: `data-kp-locale`, `data-kp-debounce`, `data-kp-sort-cycle`, `data-kp-page-size`,
 *   `data-kp-page-sizes` (`none` for no choice). `regions` upgrades the scroll wrapper to a named region [TH95]; off leaves the
 *   wrapper untouched.
 * @returns {(() => void) & { handles: DataTableHandle[] }} detach
 */
export declare function attachDataTables(root?: ParentNode, { locale: localeOption, compare: compareFn, filter: filterFn, debounceMs, sortCycle, pagerClassName, pageLabel, regions, pageSizes: pageSizesOption, removeGlyph, }?: {
    locale?: string;
    compare?: Compare;
    filter?: Filter;
    debounceMs?: number;
    sortCycle?: 'two' | 'three';
    pagerClassName?: string;
    pageLabel?: (at: number, of: number) => string;
    regions?: boolean;
    pageSizes?: readonly number[];
    removeGlyph?: string;
}): (() => void) & {
    handles: DataTableHandle[];
};
