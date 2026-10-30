export type FilterValue = import('../events.js').FilterValue;
export type GridHandle = import('../grid.js').GridHandle;
export type View = import('../events.js').View;
export type TableContext = import('./context.js').TableContext;
export type SyncFields = {
    byField: () => Record<string, FilterValue>;
    columnAt: (column: string | number) => number;
    detailFor: (row: HTMLTableRowElement) => HTMLTableRowElement | undefined;
    fixedCount: number;
    fixedEndCount: number;
    grid: GridHandle | null;
    labelCells: () => void;
    selectedRows: () => HTMLTableRowElement[];
    serverSelection: Set<string>;
    syncActions: () => void;
    syncCardSort: () => void;
    syncColumns: () => void;
    syncFixed: () => void;
    syncSelectAll: () => void;
    syncSortMarks: () => void;
    syncStateParts: () => void;
    view: () => View;
};
/** @typedef {import('../events.js').FilterValue} FilterValue */
/** @typedef {import('../grid.js').GridHandle} GridHandle */
/** @typedef {import('../events.js').View} View */
/** @typedef {import('./context.js').TableContext} TableContext */
/**
 * What the syncs the table's parts with its state: selection, sort marks, columns, fixed columns and card labels part adds to the table's context.
 *
 * @typedef {{
 *     byField: () => Record<string, FilterValue>;
 *     columnAt: (column: string | number) => number;
 *     detailFor: (row: HTMLTableRowElement) => HTMLTableRowElement | undefined;
 *     fixedCount: number;
 *     fixedEndCount: number;
 *     grid: GridHandle | null;
 *     labelCells: () => void;
 *     selectedRows: () => HTMLTableRowElement[];
 *     serverSelection: Set<string>;
 *     syncActions: () => void;
 *     syncCardSort: () => void;
 *     syncColumns: () => void;
 *     syncFixed: () => void;
 *     syncSelectAll: () => void;
 *     syncSortMarks: () => void;
 *     syncStateParts: () => void;
 *     view: () => View;
 * }} SyncFields
 */
/**
 * Syncs the table's parts with its state: selection, sort marks, columns, fixed columns and card labels.
 *
 * @param {TableContext} c
 */
export declare function installSync(c: TableContext): void;
