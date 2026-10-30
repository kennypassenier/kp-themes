export type TriValues = import('./constants.js').TriValues;
/** @typedef {import('./constants.js').TriValues} TriValues */
/** @param {Element} group */
export declare const isMulti: (group: Element) => boolean;
/** @param {Element} group */
export declare const isTri: (group: Element) => boolean;
/** @param {Element} item @returns {'any' | 'include' | 'exclude'} */
export declare const triOf: (item: Element) => 'any' | 'include' | 'exclude';
/** @param {Element} group @returns {HTMLElement[]} */
export declare function itemsOf(group: Element): HTMLElement[];
/** @param {Element} item */
export declare const isAll: (item: Element) => boolean;
/** @param {Element} item */
export declare function valueOf(item: Element): string;
/** The words an item shows: its label's text. @param {Element} item */
export declare const labelOf: (item: Element) => string;
/** @param {Element} group @param {Element} item */
export declare const isOn: (group: Element, item: Element) => boolean;
/** @param {Element} group */
export declare const groupDisabled: (group: Element) => boolean;
/** @param {HTMLElement} item */
export declare const itemDisabled: (item: HTMLElement) => boolean;
/**
 * The values that are on. Single: the chosen one (empty when none is chosen).
 * Multi: every value on except the "All" item; empty means All.
 * @param {Element} group
 * @returns {string[]}
 */
export declare function getSegmentedValues(group: Element): string[];
/**
 * The values that must be in and the values that must not be in, in the
 * order of the chips (a three-way group) [kpadopt4].
 * @param {Element} group
 * @returns {TriValues}
 */
export declare function getSegmentedTri(group: Element): TriValues;
