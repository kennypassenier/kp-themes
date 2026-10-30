export type FacetItem = import('../facets.js').FacetItem;
/** @param {string} className @param {string} [tag] */
export declare const el: (className: string, tag?: string) => HTMLElement;
/** @param {number | string | null | undefined} count */
export declare const countText: (count: number | string | null | undefined) => string;
/** @param {Element} group @returns {HTMLElement[]} the value rows, in order */
export declare const rowsOf: (group: Element) => HTMLElement[];
/** @param {Element} row @returns {HTMLInputElement | null} */
export declare const checkOf: (row: Element) => HTMLInputElement | null;
/** @param {Element} group @returns {HTMLElement} */
export declare function listOf(group: Element): HTMLElement;
/** @param {Element} row */
export declare const nameOf: (row: Element) => string;
/**
 * Give a row its ids, its checkbox's name and description, and its "only"
 * button's name. Safe to run again.
 * @param {HTMLElement} row
 */
export declare function wireRow(row: HTMLElement): void;
/**
 * Write a row's text, count and swatch from an item.
 * @param {HTMLElement} row
 * @param {FacetItem} item
 */
export declare function paintRow(row: HTMLElement, item: FacetItem): void;
/**
 * Build one row.
 * @param {FacetItem} item
 * @returns {HTMLLIElement}
 */
export declare function buildRow(item: FacetItem): HTMLLIElement;
/**
 * The "Everything" row, made when the group asks for it.
 * @param {Element} group
 * @returns {HTMLElement | null}
 */
export declare function ensureAll(group: Element): HTMLElement | null;
/**
 * Bring the "Everything" row, the empty message and every row's wiring in step.
 * @param {Element} group
 */
export declare function syncGroup(group: Element): void;
