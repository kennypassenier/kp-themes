/** @param {Element} root */
export declare const inputOf: (root: Element) => HTMLInputElement | null;
/** @param {Element} root */
export declare const isDisabled: (root: Element) => boolean;
/** The value a root stands at, as a number (its last accepted value). @param {Element} root */
export declare function getQuantity(root: Element): number;
/**
 * The unit for a value: the singular for exactly 1 when there is one.
 * @param {Element} root @param {number} value
 */
export declare const unitFor: (root: Element, value: number) => string;
