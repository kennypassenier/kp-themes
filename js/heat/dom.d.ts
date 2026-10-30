export type GridTone = import('./types.js').GridTone;
/** @typedef {import('./types.js').GridTone} GridTone */
/**
 * @param {Document} doc @param {string} tag @param {string} [cls] @param {Record<string, string>} [attrs]
 * @returns {HTMLElement}
 */
export declare function make(doc: Document, tag: string, cls?: string, attrs?: Record<string, string>): HTMLElement;
/** @param {string | undefined} tone @returns {GridTone} */
export declare const toneOf: (tone: string | undefined) => GridTone;
/** @param {number | undefined} v */
export declare const unit: (v: number | undefined) => string;
