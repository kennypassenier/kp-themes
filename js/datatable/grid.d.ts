/**
 * Keep the leading columns of a table in place while its box scrolls
 * sideways [Kenny, 2026-09-13, #sticky]. Measures the header cells and
 * writes, on every cell of the first `count` columns, `data-kp-fixed`
 * (`last` on the one that draws the hairline) and the offset it sticks at
 * as `--kp-datatable-fixed-start`; the stylesheet does the sticking. Call
 * it again after the columns change; both channels do.
 *
 * @param {HTMLTableElement} table
 * @param {number} count how many leading columns stay; 0 takes the marks away
 * @param {number} [endCount] how many trailing columns stay at the end edge (`data-kp-fixed-end`); 0 takes the marks away
 */
export declare function syncFixedColumns(table: HTMLTableElement, count: number, endCount?: number): void;
/**
 * Mark a data table while its scroll box is scrolled away from the top
 * [scope-90]: `data-kp-scrolled` on `element` while `box.scrollTop` is
 * above 0, removed at the top. The stylesheet draws the sticky header's
 * reach (`fix-32`) only under it, so a caption right above the header is
 * not painted over at rest. One decision per frame, on a passive listener.
 * Both channels use this one.
 *
 * @param {HTMLElement} element the `.kp-datatable`
 * @param {HTMLElement} box its `.kp-table-wrap`, the box that scrolls
 * @returns {() => void} detach, which removes the attribute
 */
export declare function watchScrolled(element: HTMLElement, box: HTMLElement): () => void;
export type GridHandle = {
    /**
     * re-read the rows and cells after they changed; keeps one cell in the tab order
     */
    sync: () => void;
    /**
     * move to a cell, by row index in the table and column
     */
    focus: (row: number, column: number) => void;
    detach: () => void;
};
/**
 * @typedef {object} GridHandle
 * @property {() => void} sync  re-read the rows and cells after they changed; keeps one cell in the tab order
 * @property {(row: number, column: number) => void} focus  move to a cell, by row index in the table and column
 * @property {() => void} detach
 */
/**
 * A roving focus grid over a table [Kenny, 2026-09-13, #keyboard; APG grid].
 *
 * Tab enters on one cell and leaves with the next Tab; inside, the arrow
 * keys move a cell at a time, Home and End go to the start and end of the
 * row, Ctrl + Home and Ctrl + End to the first and last cell, and Page Up
 * and Page Down `pageRows` rows. A cell that holds exactly one control — a
 * sort button, a checkbox, an edit button — hands the focus to that
 * control, so Enter and Space do what the control does. Hidden rows and
 * columns are stepped over, and keys pressed inside an open editor belong
 * to the editor. Both channels use this one.
 *
 * @param {HTMLTableElement} table
 * @param {{ pageRows?: number, onMove?: (position: { row: number, rows: number, column: number, cell: HTMLTableCellElement }) => void }} [options]
 * @returns {GridHandle}
 */
export declare function attachGrid(table: HTMLTableElement, { pageRows, onMove }?: {
    pageRows?: number;
    onMove?: (position: {
        row: number;
        rows: number;
        column: number;
        cell: HTMLTableCellElement;
    }) => void;
}): GridHandle;
