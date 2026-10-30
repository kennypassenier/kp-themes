export type MatrixSpec = import('./types.js').MatrixSpec;
/** @typedef {import('./types.js').MatrixSpec} MatrixSpec */
/**
 * Write a matrix: the corner, the column headers, then a row header and a
 * cell for each column on every row. The headers are `position: sticky`.
 *
 * @param {HTMLElement} el
 * @param {MatrixSpec} spec
 */
export declare function setMatrix(el: HTMLElement, spec: MatrixSpec): void;
/** Mark the cells a lit header touches `data-kp-hot`. @param {HTMLElement} el */
export declare function markHot(el: HTMLElement): void;
/**
 * Light these headers (their row and their column) and dim the rest, without an event.
 * @param {HTMLElement} el
 * @param {readonly string[]} keys
 */
export declare function setMatrixLit(el: HTMLElement, keys: readonly string[]): void;
/**
 * Pin one cell (or none) without an event.
 * @param {HTMLElement} el
 * @param {{ row: string, column: string } | null} pick
 */
export declare function setMatrixPick(el: HTMLElement, pick: {
    row: string;
    column: string;
} | null): void;
