export type AgoContext = import('../freshness.js').AgoContext;
/** @typedef {import('../freshness.js').AgoContext} AgoContext */
/** @returns {AgoContext} */
export declare const defaultContext: () => AgoContext;
/** One pass over every line: no layout reads unless a unit changed. */
export declare function tick(): void;
/** Start, keep or stop the one timer, as the page's lines and visibility ask. */
export declare function steer(): void;
export declare const onVisibility: () => void;
/**
 * Take a line into the ticking set and paint it at once.
 * @param {HTMLElement} el @param {AgoContext} ctx
 */
export declare function adopt(el: HTMLElement, ctx: AgoContext): void;
/**
 * Set a line's moment (ms since the epoch, or null for none) and repaint it
 * at once. The moment is written to `datetime` as ISO, for machines.
 * @param {HTMLElement} el
 * @param {number | null | undefined} ms
 */
export declare function setAgo(el: HTMLElement, ms: number | null | undefined): void;
