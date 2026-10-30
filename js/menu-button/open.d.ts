export type MenuButtonOptions = import('./types.js').MenuButtonOptions;
export type MenuDecorateInfo = import('./types.js').MenuDecorateInfo;
export type MenuGroup = import('./types.js').MenuGroup;
export type MenuState = import('./types.js').MenuState;
/** @typedef {import('./types.js').MenuButtonOptions} MenuButtonOptions */
/** @typedef {import('./types.js').MenuDecorateInfo} MenuDecorateInfo */
/** @typedef {import('./types.js').MenuGroup} MenuGroup */
/** @typedef {import('./types.js').MenuState} MenuState */
/**
 * Open a menu button's menu and put the focus on its first (or last) entry;
 * `none` leaves the focus where it is (a page showing the menu on its own,
 * not the reader asking for it).
 * @param {Element} wrapper
 * @param {{ focus?: 'first' | 'last' | 'none' }} [options]
 */
export declare function openMenu(wrapper: Element, { focus }?: {
    focus?: 'first' | 'last' | 'none';
}): void;
/**
 * Close it; with `focus`, the focus goes back to the button. A fill that
 * waited while it was open is drawn now.
 * @param {Element} wrapper
 * @param {{ focus?: boolean }} [options]
 */
export declare function closeMenu(wrapper: Element, { focus }?: {
    focus?: boolean;
}): void;
/**
 * Give a menu button its entries. Skipped when they show the same as now;
 * while the menu is open the change waits until it closes, so a live refill
 * never moves an entry under the pointer or the focus. `'loading'` shows one
 * disabled entry at the final row height. A wrapper not attached yet is
 * wired (without listeners) so the fill is kept.
 * @param {Element} wrapper
 * @param {MenuGroup[] | 'loading'} groups
 */
export declare function setMenu(wrapper: Element, groups: MenuGroup[] | 'loading'): void;
/**
 * @param {HTMLElement} wrapper
 * @param {MenuButtonOptions} options
 * @returns {MenuState | null}
 */
export declare function wireMenu(wrapper: HTMLElement, { decorate, strings }: MenuButtonOptions): MenuState | null;
/** @param {MenuState} s */
export declare const decorateButton: (s: MenuState) => void;
