/** The header cells of a table wrapper's last header row. @param {HTMLElement} wrap @returns {HTMLTableCellElement[]} */
export declare function headerCells(wrap: HTMLElement): HTMLTableCellElement[];
/** A column's number from its id or number, or -1. @param {HTMLTableCellElement[]} heads @param {string | null} id */
export declare function columnNumber(heads: HTMLTableCellElement[], id: string | null): number;
/**
 * Lay a table's add row out: one track per column as wide as the column, each field in its column's track, the Add button in
 * its own; or stacked. Returns whether it stacked.
 * @param {HTMLElement} row the add row (the form)
 * @param {HTMLElement} cells the grid that holds the cells
 * @param {HTMLElement} wrap the table's wrapper
 */
export declare function layTableRow(row: HTMLElement, cells: HTMLElement, wrap: HTMLElement): boolean;
/**
 * A line in a form grid stacks under the fold width of its own.
 * @param {HTMLElement} row
 */
export declare function layLine(row: HTMLElement): boolean;
