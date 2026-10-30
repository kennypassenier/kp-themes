export type Direction = 'ascending' | 'descending' | 'none';
export type Sort = {
    column: number;
    direction: Direction;
} | null;
export type SortKey = {
    column: number;
    direction: 'ascending' | 'descending';
};
export type FilterKind = 'choice' | 'range' | 'date';
export type FilterValue = string[] | {
    from?: string;
    to?: string;
};
export type State = 'ready' | 'loading' | 'failed';
export type Density = 'comfortable' | 'compact';
export type EditKind = 'text' | 'number' | 'select' | 'date';
export type View = {
    shown: number;
    total: number;
    page: number;
    pageNumber: number;
    pages: number;
    pageSize: number;
    query: string;
    scope: number | null;
    filters: Record<number, FilterValue>;
    filtersByField: Record<string, FilterValue>;
    sort: Sort;
    sorts: SortKey[];
    hidden: number[];
    expanded: string[];
    density: Density;
    state: State;
    keys: string[];
    pageKeys: string[];
    folded: string[];
};
export type DataRequest = {
    id: number;
    query: string;
    scope: number | null;
    sort: SortKey | null;
    sorts: SortKey[];
    filters: Record<number, FilterValue>;
    filtersByField: Record<string, FilterValue>;
    page: number;
    pageSize: number;
    signal: AbortSignal;
};
export type DataAnswer = {
    rows: ReadonlyArray<HTMLTableRowElement | Record<string, unknown>>;
    total: number;
};
export type EditDetail = {
    key: string;
    row: HTMLTableRowElement;
    cell: HTMLTableCellElement;
    column: number;
    label: string;
    value: string;
    previous: string;
    undo: boolean;
    reject: (message?: string) => void;
    waitUntil: (promise: Promise<unknown>) => void;
};
/** @typedef {'ascending' | 'descending' | 'none'} Direction */
/** @typedef {{ column: number, direction: Direction } | null} Sort */
/** One key of a sort on several columns. @typedef {{ column: number, direction: 'ascending' | 'descending' }} SortKey */
/** @typedef {'choice' | 'range' | 'date'} FilterKind */
/** A choice filter's ticked values, or a range's bounds as typed. @typedef {string[] | { from?: string, to?: string }} FilterValue */
/** @typedef {'ready' | 'loading' | 'failed'} State */
/** @typedef {'comfortable' | 'compact'} Density */
/** @typedef {'text' | 'number' | 'select' | 'date'} EditKind */
/**
 * @typedef {{ shown: number, total: number, page: number, pageNumber: number, pages: number, pageSize: number, query: string, scope: number | null,
 *   filters: Record<number, FilterValue>, filtersByField: Record<string, FilterValue>, sort: Sort, sorts: SortKey[], hidden: number[], expanded: string[], density: Density, state: State,
 *   keys: string[], pageKeys: string[], folded: string[] }} View
 */
/**
 * What a server-backed table asks its `load` for [Kenny, 2026-09-13].
 * @typedef {{ id: number, query: string, scope: number | null, sort: SortKey | null, sorts: SortKey[], filters: Record<number, FilterValue>,
 *   filtersByField: Record<string, FilterValue>,
 *   page: number, pageSize: number, signal: AbortSignal }} DataRequest
 */
/**
 * What `load` answers: one page of rows — table rows, or objects read through each header's `data-kp-field` — and how many
 * rows there are in all.
 * @typedef {{ rows: ReadonlyArray<HTMLTableRowElement | Record<string, unknown>>, total: number }} DataAnswer
 */
/**
 * An edit about to be saved. `reject(message)` refuses it with a message the cell shows; `waitUntil(promise)` holds the
 * save until the promise settles, and a promise that resolves to a string or to false refuses it too.
 * @typedef {{ key: string, row: HTMLTableRowElement, cell: HTMLTableCellElement, column: number, label: string, value: string,
 *   previous: string, undo: boolean, reject: (message?: string) => void, waitUntil: (promise: Promise<unknown>) => void }} EditDetail
 */
/** Fired on the wrapper when the visible set changes. A contract value [TH26]. Detail: View, plus `rows` and `pageRows` (the elements). */
export declare const VIEW_EVENT = "kp-datatable-view";
/** Fired when the selection changes; the detail carries the selected row keys and rows. */
export declare const SELECT_EVENT = "kp-datatable-select";
/** Fired when the sort changes: `{ column, direction }` or null — the first key; the view carries all of them as `sorts`. */
export declare const SORT_EVENT = "kp-datatable-sort";
/** Fired when the failed state's retry control is pressed; the app loads again and sets the state. */
export declare const RETRY_EVENT = "kp-datatable-retry";
/** Fired when the reader shows or hides a column: `{ hidden }`, the column indices. */
export declare const COLUMNS_EVENT = "kp-datatable-columns";
/**
 * Fired when a row opens or closes: `{ key, row, open, cell, expanded }`; `cell` is the detail cell, for an app that fills it then.
 * In a `data-kp-expand-single` table an opening that closed the row open before fires once, with those keys in `closed`.
 */
export declare const EXPAND_EVENT = "kp-datatable-expand";
/** Fired when a server-backed table needs rows: the DataRequest, plus `respond(answer)` and `fail(error)`. */
export declare const REQUEST_EVENT = "kp-datatable-request";
/** Fired, cancelable, when an edited value is about to be saved (EditDetail); `preventDefault()` refuses it. */
export declare const EDIT_EVENT = "kp-datatable-edit";
/** Fired when a group row folds or unfolds [J2]: `{ key, row, open, members, folded }`; `members` are the group's rows, `folded` every folded key. */
export declare const GROUP_EVENT = "kp-datatable-group";
/** Fired on the table when a row was moved by its handle: `{ order, key, from, to }` (the row keys in the new order, the moved row's key, its old and new place, counted from 0) [wish-1120, homelab 93]. */
export declare const REORDER_EVENT = "kp-datatable-reorder";
/** Rows per page when the consumer does not say [Kenny, 2026-09-13]. Per table as `data-kp-page-size`. */
export declare const PAGE_SIZE = 25;
/** The page sizes on offer when the consumer does not say. Per table as `data-kp-page-sizes="10,25"`, or `none`. */
export declare const PAGE_SIZES: readonly number[];
/** How long a server-backed table waits after the last key before it asks [research/datatable, "300 ms server"]. */
export declare const SERVER_DEBOUNCE_MS = 300;
/** Rows Page Up and Page Down move in the keyboard grid, as the approved mock does. */
export declare const GRID_PAGE_ROWS = 5;
