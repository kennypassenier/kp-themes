export type Kept = import('./types.js').Kept;
/** @typedef {import('./types.js').Kept} Kept */
/** Build one row. @param {Kept} line @returns {HTMLElement} */
export declare function rowFor(line: Kept): HTMLElement;
/**
 * Put the options on a row: the time, the filter, the marks.
 * @param {HTMLElement} root
 * @param {HTMLElement} row
 * @param {Kept} line
 */
export declare function dress(root: HTMLElement, row: HTMLElement, line: Kept): void;
/** The count text beside the search box. @param {HTMLElement} root */
export declare function matchWords(root: HTMLElement): string;
/** Collect the marks again and keep the current one where it was. @param {HTMLElement} root @param {boolean} [reset] */
export declare function collect(root: HTMLElement, reset?: boolean): void;
