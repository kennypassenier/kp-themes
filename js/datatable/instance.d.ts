/** @typedef {import('./events.js').Density} Density */
/** @typedef {import('./sort.js').Filter} Filter */
/** @typedef {import('./events.js').FilterValue} FilterValue */
/** @typedef {import('./events.js').Sort} Sort */
/** @typedef {import('./events.js').SortKey} SortKey */
/** @typedef {import('./events.js').State} State */
/** @typedef {import('./events.js').View} View */
export type Density = import('./events.js').Density;
export type Filter = import('./sort.js').Filter;
export type FilterValue = import('./events.js').FilterValue;
export type Sort = import('./events.js').Sort;
export type SortKey = import('./events.js').SortKey;
export type State = import('./events.js').State;
export type View = import('./events.js').View;
/** @type {Filter} */
export declare const defaultFilter: Filter;
export type DataTableHandle = {
    element: HTMLElement;
    view: () => View;
    /**
     * sort on one column, or null for none
     */
    sort: (sort: Sort) => void;
    /**
     * sort on several columns, the first key first
     */
    sortBy: (keys: readonly SortKey[]) => void;
    /**
     * show a page, counted from 0 as `view().page` is (the pager prints it from 1: `view().pageNumber`); past the last page it stops at the last [b3b4-1019]
     */
    page: (page: number) => void;
    pageSize: (size: number) => void;
    query: (query: string) => void;
    /**
     * limit the search to one column, or null for all; a column by number or by its id (`data-kp-field`, else its text) [wish-1028]
     */
    scope: (column: number | string | null) => void;
    /**
     * the number of the column with this id (`data-kp-field`, else its text), counting the control column; -1 when none [wish-1028, homelab 136]
     */
    columnIndex: (id: string) => number;
    /**
     * set one column's filter; null clears it; the column by number or by its id [wish-1028]
     */
    filter: (column: number | string, value: FilterValue | null) => void;
    clearFilters: () => void;
    /**
     * open a column's filter editor, or close it with null; in the panel mode, open or close the panel
     */
    editFilter: (column: number | string | null) => void;
    /**
     * the columns to hide; a locked column stays
     */
    hideColumns: (columns: readonly number[]) => void;
    /**
     * the rows to open, by key; in a `data-kp-expand-single` table only the last key opens
     */
    expand: (keys: readonly string[]) => void;
    /**
     * the group rows to fold, by group key; every other group unfolds [J2]
     */
    fold: (keys: readonly string[]) => void;
    density: (density: Density) => void;
    /**
     * loading, failed, or ready again
     */
    state: (state: State) => void;
    /**
     * the status line's words while the table loads, kept across refresh(), shown only while loading, cleared with no text [fix-80]; with `since` (a time or a Date) the table counts how long it has been loading by itself, in a part the live region does not announce [fix-84]; with `overlay: true` (or `data-kp-busy-overlay` on the wrapper) a large spinner with those words and that count sits over the rows while it loads, aria-hidden
     */
    busy: (words?: string | null | {
        text?: string | null;
        since?: number | Date | null;
        overlay?: boolean;
    }) => void;
    /**
     * the failed state with the app's reason in the failed slot's words, and Try again under them; any table, not only a server's [fix-85]
     */
    fail: (reason?: string | null) => void;
    /**
     * ask the server again for what the table shows
     */
    reload: () => void;
    /**
     * open a cell's editor
     */
    edit: (key: string, column: number) => void;
    cancelEdit: () => void;
    /**
     * the rows the table shows, in order: every page of the view, or this page
     */
    rows: (which?: 'view' | 'page') => HTMLTableRowElement[];
    selected: () => string[];
    select: (keys: readonly string[]) => void;
    /**
     * re-read the rows after the consumer added or removed some, and the filter panel's choice lists with them; the page goes back to the first unless `keepPage`. The table also notices rows added to or removed from its body by itself (a client-side table), so a removed row leaves the count and the pager at once and the reader stays on the page; a row marked `data-kp-row-hidden` is held out of the table and stays hidden until the attribute goes [b3b4-1019]
     */
    refresh: (options?: {
        keepPage?: boolean;
    }) => void;
};
/**
 * @typedef {object} DataTableHandle
 * @property {HTMLElement} element
 * @property {() => View} view
 * @property {(sort: Sort) => void} sort  sort on one column, or null for none
 * @property {(keys: readonly SortKey[]) => void} sortBy  sort on several columns, the first key first
 * @property {(page: number) => void} page  show a page, counted from 0 as `view().page` is (the pager prints it from 1: `view().pageNumber`); past the last page it stops at the last [b3b4-1019]
 * @property {(size: number) => void} pageSize
 * @property {(query: string) => void} query
 * @property {(column: number | string | null) => void} scope  limit the search to one column, or null for all; a column by number or by its id (`data-kp-field`, else its text) [wish-1028]
 * @property {(id: string) => number} columnIndex  the number of the column with this id (`data-kp-field`, else its text), counting the control column; -1 when none [wish-1028, homelab 136]
 * @property {(column: number | string, value: FilterValue | null) => void} filter  set one column's filter; null clears it; the column by number or by its id [wish-1028]
 * @property {() => void} clearFilters
 * @property {(column: number | string | null) => void} editFilter  open a column's filter editor, or close it with null; in the panel mode, open or close the panel
 * @property {(columns: readonly number[]) => void} hideColumns  the columns to hide; a locked column stays
 * @property {(keys: readonly string[]) => void} expand  the rows to open, by key; in a `data-kp-expand-single` table only the last key opens
 * @property {(keys: readonly string[]) => void} fold  the group rows to fold, by group key; every other group unfolds [J2]
 * @property {(density: Density) => void} density
 * @property {(state: State) => void} state  loading, failed, or ready again
 * @property {(words?: string | null | { text?: string | null, since?: number | Date | null, overlay?: boolean }) => void} busy  the status line's words while the table loads, kept across refresh(), shown only while loading, cleared with no text [fix-80]; with `since` (a time or a Date) the table counts how long it has been loading by itself, in a part the live region does not announce [fix-84]; with `overlay: true` (or `data-kp-busy-overlay` on the wrapper) a large spinner with those words and that count sits over the rows while it loads, aria-hidden
 * @property {(reason?: string | null) => void} fail  the failed state with the app's reason in the failed slot's words, and Try again under them; any table, not only a server's [fix-85]
 * @property {() => void} reload  ask the server again for what the table shows
 * @property {(key: string, column: number) => void} edit  open a cell's editor
 * @property {() => void} cancelEdit
 * @property {(which?: 'view' | 'page') => HTMLTableRowElement[]} rows  the rows the table shows, in order: every page of the view, or this page
 * @property {() => string[]} selected
 * @property {(keys: readonly string[]) => void} select
 * @property {(options?: { keepPage?: boolean }) => void} refresh re-read the rows after the consumer added or removed some, and the filter panel's choice lists with them; the page goes back to the first unless `keepPage`. The table also notices rows added to or removed from its body by itself (a client-side table), so a removed row leaves the count and the pager at once and the reader stays on the page; a row marked `data-kp-row-hidden` is held out of the table and stays hidden until the attribute goes [b3b4-1019]
 */
/** @type {WeakMap<Element, DataTableHandle>} */
export declare const handles: WeakMap<Element, DataTableHandle>;
/** The handle for an attached table, for code that did not call attach. @param {Element} element */
export declare function dataTable(element: Element): DataTableHandle | null;
