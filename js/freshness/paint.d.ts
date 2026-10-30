export type AgoContext = import('../freshness.js').AgoContext;
export type AgoState = import('../freshness.js').AgoState;
export type Strings = import('../freshness.js').Strings;
/**
 * Write one line as it stands at `now`.
 * @param {HTMLElement} el @param {AgoContext} ctx
 */
export declare function paint(el: HTMLElement, ctx: AgoContext): void;
