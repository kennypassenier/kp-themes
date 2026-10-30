export type Kept = import('./types.js').Kept;
/** @typedef {import('./types.js').Kept} Kept */
/** @param {HTMLElement} root @returns {string[]} */
export declare function toolsOf(root: HTMLElement): string[];
/** The options as one string, to know whether the rows must be drawn again. @param {HTMLElement} root */
export declare const signature: (root: HTMLElement) => string;
/** @param {HTMLElement} root @returns {HTMLElement} */
export declare const logOf: (root: HTMLElement) => HTMLElement;
/** @param {HTMLElement} root @returns {number} */
export declare const maxOf: (root: HTMLElement) => number;
/** Lowest level index shown. @param {HTMLElement} root */
export declare const floorOf: (root: HTMLElement) => number;
/** @param {HTMLElement} root */
export declare const queryOf: (root: HTMLElement) => string;
/** @param {HTMLElement} root @param {string} message */
export declare function say(root: HTMLElement, message: string): void;
/** The text of one line as copied and downloaded. @param {Kept} line */
export declare const textOf: (line: Kept) => string;
