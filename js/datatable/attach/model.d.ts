export type FilterValue = import('../events.js').FilterValue;
export type SortKey = import('../events.js').SortKey;
export type State = import('../events.js').State;
export type TableContext = import('./context.js').TableContext;
export type ModelFields = {
    all: HTMLTableRowElement[];
    busyClock: HTMLElement | null;
    busyOverlay: boolean;
    busySince: number | null;
    busyText: string | null;
    busyTimer: ReturnType<typeof setTimeout> | null;
    failReason: string | null;
    filters: Map<number, FilterValue>;
    holdRows: () => void;
    isRow: (row: HTMLTableRowElement) => boolean;
    overlayClock: HTMLElement | null;
    overlayLayer: HTMLElement | null;
    page: number;
    pageRows: HTMLTableRowElement[];
    query: string;
    rendered: HTMLTableRowElement[];
    scope: number | null;
    shownRows: HTMLTableRowElement[];
    sorts: SortKey[];
    state: State;
};
/** @typedef {import('../events.js').FilterValue} FilterValue */
/** @typedef {import('../events.js').SortKey} SortKey */
/** @typedef {import('../events.js').State} State */
/** @typedef {import('./context.js').TableContext} TableContext */
/**
 * What the the table's view state: rows, page, query, scope, filters, sorts and busy flags part adds to the table's context.
 *
 * @typedef {{
 *     all: HTMLTableRowElement[];
 *     busyClock: HTMLElement | null;
 *     busyOverlay: boolean;
 *     busySince: number | null;
 *     busyText: string | null;
 *     busyTimer: ReturnType<typeof setTimeout> | null;
 *     failReason: string | null;
 *     filters: Map<number, FilterValue>;
 *     holdRows: () => void;
 *     isRow: (row: HTMLTableRowElement) => boolean;
 *     overlayClock: HTMLElement | null;
 *     overlayLayer: HTMLElement | null;
 *     page: number;
 *     pageRows: HTMLTableRowElement[];
 *     query: string;
 *     rendered: HTMLTableRowElement[];
 *     scope: number | null;
 *     shownRows: HTMLTableRowElement[];
 *     sorts: SortKey[];
 *     state: State;
 * }} ModelFields
 */
/**
 * The table's view state: rows, page, query, scope, filters, sorts and busy flags.
 *
 * @param {TableContext} c
 */
export declare function installModel(c: TableContext): void;
