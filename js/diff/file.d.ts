export type DiffState = import('./types.js').DiffState;
export type NormFile = import('./types.js').NormFile;
/** @param {HTMLElement} root @param {DiffState} st @param {NormFile} file @param {number} index */
export declare function fileEl(root: HTMLElement, st: DiffState, file: NormFile, index: number): HTMLElement;
/** The bar: how much changed, and Expand all / Collapse all. @param {HTMLElement} root @param {DiffState} st */
export declare function barEl(root: HTMLElement, st: DiffState): HTMLElement;
/** Keep the two bar buttons honest about what they can still do. @param {HTMLElement} root */
export declare function syncBar(root: HTMLElement): void;
