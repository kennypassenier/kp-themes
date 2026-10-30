export type MenuDecorateInfo = import('./types.js').MenuDecorateInfo;
export type MenuGroup = import('./types.js').MenuGroup;
export type MenuItem = import('./types.js').MenuItem;
export type MenuState = import('./types.js').MenuState;
export type Strings = import('./types.js').Strings;
/** @typedef {import('./types.js').MenuDecorateInfo} MenuDecorateInfo */
/** @typedef {import('./types.js').MenuGroup} MenuGroup */
/** @typedef {import('./types.js').MenuItem} MenuItem */
/** @typedef {import('./types.js').MenuState} MenuState */
/** @typedef {import('./types.js').Strings} Strings */
/** What counts as an item of the menu: a radio or a checkbox item (the refresh chooser's choices) is picked and reached by key like a plain one [CHA 21]. */
export declare const ITEM_ROLES = "[role=\"menuitem\"], [role=\"menuitemradio\"], [role=\"menuitemcheckbox\"]";
/** @param {MenuState} s @returns {HTMLElement[]} */
export declare const menuItems: (s: MenuState) => HTMLElement[];
/** @param {HTMLElement} item */
export declare const labelOf: (item: HTMLElement) => string;
/** @param {MenuState} s @param {HTMLElement} item @param {number} index */
export declare const decorateItem: (s: MenuState, item: HTMLElement, index: number) => void;
/** @param {MenuState} s @param {MenuGroup[] | 'loading'} groups */
export declare function drawMenu(s: MenuState, groups: MenuGroup[] | 'loading'): void;
