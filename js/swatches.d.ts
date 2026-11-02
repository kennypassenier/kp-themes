export { SWATCHES, SWATCH_CHANGE_EVENT } from './swatches/constants.js';
export type Swatch = import('./swatches/constants.js').Swatch;
/** @typedef {import('./swatches/constants.js').Swatch} Swatch */
/**
 * Wire every swatch picker under `root` (the root itself included). Idempotent.
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export declare function attachSwatches(root?: ParentNode): () => void;
/**
 * Give a picker its swatches and the current value (none: `null`).
 * @param {Element} el
 * @param {readonly Swatch[]} swatches
 * @param {string | null} [current]
 */
export declare function setSwatches(el: Element, swatches: readonly Swatch[], current?: string | null): void;
/**
 * The current value of a wired picker, or null.
 * @param {Element} el
 * @returns {string | null}
 */
export declare function getSwatchValue(el: Element): string | null;
