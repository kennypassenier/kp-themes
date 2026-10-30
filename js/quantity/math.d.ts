export type QuantityRules = import('../quantity.js').QuantityRules;
/**
 * The decimals of a step: 0.5 has one, 50 has none.
 * @param {number} step
 */
export declare function decimalsOf(step: number): number;
/** @param {Element} root @returns {QuantityRules} */
export declare function rulesOf(root: Element): QuantityRules;
/**
 * The value written in the page's language: no grouping, the step's decimals.
 * @param {number} value @param {QuantityRules} rules
 */
export declare function formatQuantity(value: number, rules: QuantityRules): string;
/**
 * Read a typed number: a comma or a point is the decimal mark; with both, the
 * last one is, and the other groups thousands. Spaces are ignored. NaN when it
 * is not a number.
 * @param {string} text
 * @returns {number}
 */
export declare function parseQuantity(text: string): number;
/**
 * Keep a value inside the bounds and on a step (counted from the minimum when
 * there is one, else from 0), rounded to the step's decimals.
 * @param {number} value @param {QuantityRules} rules
 */
export declare function settleQuantity(value: number, rules: QuantityRules): number;
