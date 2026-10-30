export { QUANTITY, QUANTITY_EVENT, HOLD_DELAY, HOLD_SLOW, HOLD_FAST } from './quantity/values.js';
export { decimalsOf, formatQuantity, parseQuantity, settleQuantity } from './quantity/math.js';
export { getQuantity } from './quantity/read.js';
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
 * something else moved), kept inside the bounds and on a step.
 * @param {Element} root @param {number} value
 */
export declare function setQuantity(root: Element, value: number): void;
/**
 * Wire every quantity under `root`: its parts, its buttons (a held button
 * repeats), its keys and its typing.
 * @param {ParentNode} [scope]
 * @returns {() => void} detach
 */
export declare function attachQuantities(scope?: ParentNode): () => void;
