export type MenuGroup = import('./types.js').MenuGroup;
export type MenuState = import('./types.js').MenuState;
/** @typedef {import('./types.js').MenuGroup} MenuGroup */
/** @typedef {import('./types.js').MenuState} MenuState */
/** @type {WeakMap<Element, MenuState>} */
export declare const menus: WeakMap<Element, MenuState>;
/** @param {string} prefix */
export declare const nextId: (prefix: string) => string;
/** @param {Element} host @returns {string | undefined} */
export declare const keyOf: (host: Element) => string | undefined;
/**
 * What a fill shows, as one string: a fill that shows the same as the menu
 * does now is skipped.
 * @param {MenuGroup[] | 'loading'} groups
 * @returns {string}
 */
export declare const menuSignature: (groups: MenuGroup[] | 'loading') => string;
