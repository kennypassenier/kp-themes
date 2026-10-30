/**
 * Draw (or redraw) a passkey list.
 * @param {HTMLElement} el the root, a `.kp-passkeys`
 * @param {import('./constants.js').PasskeysSpec} spec
 */
export declare function setPasskeys(el: HTMLElement, spec: import('./constants.js').PasskeysSpec): void;
/**
 * Fill every `[data-kp-passkeys]` under `root` that carries its spec as JSON in
 * the attribute (a page that draws with setPasskeys() needs nothing).
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export declare function attachPasskeys(root?: ParentNode): () => void;
