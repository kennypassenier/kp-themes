import { getQuantity } from './quantity/read.js';
export { QUANTITY, QUANTITY_EVENT, HOLD_DELAY, HOLD_SLOW, HOLD_FAST } from './quantity/values.js';
export { getQuantity };
export { decimalsOf, formatQuantity, parseQuantity, settleQuantity } from './quantity/math.js';
export type QuantityRules = {
    min: number;
    max: number;
    step: number;
    decimals: number;
    locale: string;
};
/** @typedef {{ min: number, max: number, step: number, decimals: number, locale: string }} QuantityRules */
/**
 * Set the value without firing the event (a page that moves it because
 * something else moved), kept inside the bounds and on a step. A focused field keeps the text being typed.
 * @param {Element} root @param {number} value
 */
export declare function setQuantity(root: Element, value: number): void;
/**
 * Change the unit after the number (`data-kp-quantity-unit`, and `-unit-one` for exactly 1) once the control is attached: a page whose unit
 * follows something else (the medicine picked) needs no rebuild. The value stays; the unit's width and the spin button's words follow;
 * `unitOne` omitted or empty clears the singular. [mc-34]
 * @param {Element} root @param {string} unit @param {string} [unitOne]
 */
export declare function setQuantityUnit(root: Element, unit: string, unitOne?: string): void;
/**
 * Wire every quantity under `root`: its parts, its buttons (a held button
 * repeats), its keys and its typing.
 * @param {ParentNode} [scope]
 * @returns {() => void} detach
 */
export declare function attachQuantities(scope?: ParentNode): () => void;
