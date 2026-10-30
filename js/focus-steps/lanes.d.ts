export type Lane = import('./blockers.js').Lane;
/** @typedef {import('./blockers.js').Lane} Lane */
/** The lanes and the band, made once, around the head. @param {HTMLElement} root */
export declare function ensureLanes(root: HTMLElement): Element;
/** Take the lanes and the band away again (the steps no longer name two tracks). @param {HTMLElement} root */
export declare function dropLanes(root: HTMLElement): void;
/**
 * Draw the lanes in place: only a word that changed is written, so a focused lane keeps its focus and the clocks cost nothing.
 * @param {HTMLElement} root @param {Lane[]} [lanes]
 */
export declare function paintLanes(root: HTMLElement, lanes?: Lane[]): void;
/** Which side the lanes stand on: beside the step on a wide root, above it on a narrow one. @param {HTMLElement} root */
export declare function layoutLanes(root: HTMLElement): void;
