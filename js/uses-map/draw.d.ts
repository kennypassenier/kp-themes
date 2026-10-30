export type Context = import('../uses-map.js').Context;
export type UsesModel = import('./model.js').UsesModel;
/**
 * Draw the lines view of a matrix.
 *
 * @param {HTMLElement} el
 * @param {any} spec a MatrixSpec with the lines fields
 * @param {Context} ctx
 */
export declare function drawUsesMap(el: HTMLElement, spec: any, ctx: Context): void;
/**
 * Pin a node (or none) from a script, without a page event beyond `kp-uses-pin`.
 * @param {HTMLElement} el @param {string | null} key
 */
export declare function setUsesPin(el: HTMLElement, key: string | null): void;
/**
 * Take the lines view off a matrix that goes back to its grid.
 * @param {HTMLElement} el
 */
export declare function leaveUsesMap(el: HTMLElement): void;
