/** @typedef {import('./types.js').DiffState} DiffState */
export type DiffState = import('./types.js').DiffState;
/** @param {string} className @param {string} [tag] */
export declare const el: (className: string, tag?: string) => HTMLElement;
/** @param {Element} root @param {string} name @param {string} fallback */
export declare const attr: (root: Element, name: string, fallback: string) => string;
/** `off` and `0` mean no. @param {Element} root @param {string} name @param {number} fallback */
export declare function count(root: Element, name: string, fallback: number): number;
/** @param {HTMLElement} root */
export declare function stateOf(root: HTMLElement): import("./types.js").DiffState;
