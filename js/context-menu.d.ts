export { CONTEXT_MENU, CONTEXT_OPEN_EVENT } from './context-menu/values.js';
export type MenuGroup = import('./menu-button.js').MenuGroup;
/** @typedef {import('./menu-button.js').MenuGroup} MenuGroup */
/**
 * Give an element its context menu: groups of entries as setMenu() takes them, or a function that answers them when the menu
 * opens (a row whose actions depend on its state). Marks the element `data-kp-context-menu`.
 * @param {HTMLElement} el
 * @param {MenuGroup[] | ((el: HTMLElement) => MenuGroup[])} groups
 */
export declare function setContextMenu(el: HTMLElement, groups: MenuGroup[] | ((el: HTMLElement) => MenuGroup[])): void;
/**
 * Listen for context menus under `root` (the document by default): every `[data-kp-context-menu]` element under it, also those
 * added later. Idempotent per root.
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export declare function attachContextMenus(root?: ParentNode): () => void;
/**
 * Open an element's context menu from the page, at a point in window coordinates (the element's start edge when not given).
 * @param {HTMLElement} el
 * @param {{ x?: number, y?: number }} [at]
 * @returns {boolean} whether it opened (false when it has no entries or nothing listens under a root that holds it)
 */
export declare function openContextMenu(el: HTMLElement, at?: {
    x?: number;
    y?: number;
}): boolean;
