/** @typedef {import('./types.js').ViewerState} ViewerState */
export type ViewerState = import('./types.js').ViewerState;
/** The text a message's marks were built for. @type {WeakMap<Element, string>} */
export declare const BUILT: WeakMap<Element, string>;
/** @param {string} className @param {string} [tag] */
export declare const el: (className: string, tag?: string) => HTMLElement;
/** @param {Element} root @param {string} name @param {string} fallback */
export declare const attr: (root: Element, name: string, fallback: string) => string;
/** @param {HTMLElement} root @returns {ViewerState} */
export declare function stateOf(root: HTMLElement): ViewerState;
