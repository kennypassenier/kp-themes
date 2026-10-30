export type GridTone = import('./types.js').GridTone;
export type HeatDecorateInfo = import('./types.js').HeatDecorateInfo;
export type HeatRow = import('./types.js').HeatRow;
export type HeatSpec = import('./types.js').HeatSpec;
/** @typedef {import('./types.js').GridTone} GridTone */
/** @typedef {import('./types.js').HeatDecorateInfo} HeatDecorateInfo */
/** @typedef {import('./types.js').HeatRow} HeatRow */
/** @typedef {import('./types.js').HeatSpec} HeatSpec */
/**
 * The cells a key may land on, in reading order, with their row and column.
 * @param {Element} grid @param {string} cellSelector
 * @returns {HTMLElement[][]}
 */
export declare function cellGrid(grid: Element, cellSelector: string): HTMLElement[][];
/** @param {Element} grid @param {string} selector @param {{ r: number, c: number } | undefined} stop */
export declare function placeStop(grid: Element, selector: string, stop: {
    r: number;
    c: number;
} | undefined): void;
/**
 * Write a heat grid: the column axis, an optional summary row and the rows,
 * replacing what the element held. The grid keeps its columns, its row
 * heights and its picked column across a rewrite; a focused cell keeps its
 * place.
 *
 * @param {HTMLElement} el
 * @param {HeatSpec} spec
 * @param {{ decorate?: (part: HTMLElement, info: HeatDecorateInfo) => void }} [options]  `decorate`: called with every row label button and
 *   every cell button the grid builds (and the paging buttons), each time it builds one, the same shape gantt and the data table have;
 *   kept for later redraws until another is given [wish-1120, homelab 65, 114]
 */
export declare function setHeat(el: HTMLElement, spec: HeatSpec, options?: {
    decorate?: (part: HTMLElement, info: HeatDecorateInfo) => void;
}): void;
