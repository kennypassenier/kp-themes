export type QuantityRules = import('../quantity.js').QuantityRules;
/**
 * Write a value everywhere it shows: the field, the unit, the spin button's numbers and words, the buttons at a bound, the field's width.
 * `keepText` leaves the field's own text alone (a person is typing in it; it is normalised when they commit) [stepper1102].
 * @param {HTMLElement} root @param {number} value @param {boolean} [keepText]
 */
export declare function paint(root: HTMLElement, value: number, keepText?: boolean): void;
/** Dim the buttons for a value that is only typed so far (not yet committed). @param {HTMLElement} root @param {number} value */
export declare function markButtons(root: HTMLElement, value: number): void;
/**
 * Change the value as a person did, and fire the event when it moved.
 * @param {HTMLElement} root @param {number} wanted @param {'button' | 'key' | 'typed'} source
 * @returns {boolean} whether it moved
 */
export declare function change(root: HTMLElement, wanted: number, source: 'button' | 'key' | 'typed'): boolean;
