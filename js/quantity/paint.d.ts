export type QuantityRules = import('../quantity.js').QuantityRules;
/**
 * Write a value everywhere it shows: the field, the unit, the spin button's numbers and words, the buttons at a bound, the field's width.
 * @param {HTMLElement} root @param {number} value
 */
export declare function paint(root: HTMLElement, value: number): void;
/**
 * Change the value as a person did, and fire the event when it moved.
 * @param {HTMLElement} root @param {number} wanted @param {'button' | 'key' | 'typed'} source
 * @returns {boolean} whether it moved
 */
export declare function change(root: HTMLElement, wanted: number, source: 'button' | 'key' | 'typed'): boolean;
