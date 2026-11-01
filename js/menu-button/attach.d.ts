export type MenuButtonOptions = import('./types.js').MenuButtonOptions;
/**
 * Wire every menu button under `root`: the button opens and closes the menu,
 * and the menu answers the keys of a menu (APG menu button). A disabled
 * entry (`aria-disabled`) keeps the focus, so its reason is read; it does
 * nothing. Idempotent. A menu button that arrives after the call (a table redraws its rows, a card is rebuilt) is wired the
 * moment a pointer, the keyboard or a click reaches it, by one delegated listener on `root`.
 * @param {ParentNode} [root]
 * @param {MenuButtonOptions} [options]
 * @returns {() => void} detach
 */
export declare function attachMenuButtons(root?: ParentNode, { decorate, strings }?: MenuButtonOptions): () => void;
