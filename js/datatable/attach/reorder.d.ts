export type TableContext = import('./context.js').TableContext;
export type ReorderFields = {
    labelRow: (row: HTMLTableRowElement) => void;
    prepareRow: (row: HTMLTableRowElement) => void;
    prepared: Set<HTMLTableRowElement>;
    unprepareRow: (row: HTMLTableRowElement) => void;
};
/** @typedef {import('./context.js').TableContext} TableContext */
/**
 * What the row preparation and the drag and keyboard reorder of rows part adds to the table's context.
 *
 * @typedef {{
 *     labelRow: (row: HTMLTableRowElement) => void;
 *     prepareRow: (row: HTMLTableRowElement) => void;
 *     prepared: Set<HTMLTableRowElement>;
 *     unprepareRow: (row: HTMLTableRowElement) => void;
 * }} ReorderFields
 */
/**
 * Row preparation and the drag and keyboard reorder of rows.
 *
 * @param {TableContext} c
 */
export declare function installReorder(c: TableContext): void;
