export type MenuButtonOptions = import('./types.js').MenuButtonOptions;
export type MenuState = import('./types.js').MenuState;
/**
 * Wire every menu button under `root`: the button opens and closes the menu,
 * and the menu answers the keys of a menu (APG menu button). A disabled
 * entry (`aria-disabled`) keeps the focus, so its reason is read; it does
 * nothing. Idempotent.
 * @param {ParentNode} [root]
 * @param {MenuButtonOptions} [options]
 * @returns {() => void} detach
 */
export declare function attachMenuButtons(root?: ParentNode, { decorate, strings }?: MenuButtonOptions): () => void;
