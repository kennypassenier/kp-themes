export type FocusState = import('./constants.js').FocusState;
/** @typedef {import('./constants.js').FocusState} FocusState */
/** @param {string} className @param {string} [tag] */
export declare const el: (className: string, tag?: string) => HTMLElement;
/** @param {Element} root @returns {FocusState} */
export declare const stateOf: (root: Element) => FocusState;
/** @param {Element} root @param {string} name @returns {HTMLElement} */
export declare const part: (root: Element, name: string) => HTMLElement;
/** Lay the parts once. @param {HTMLElement} root */
export declare function build(root: HTMLElement): void;
