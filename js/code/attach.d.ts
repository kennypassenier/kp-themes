/**
 * Draw (or redraw) a code block. The reader's Wrap, layout and fold are kept
 * across calls unless the spec names them again.
 * @param {HTMLElement} el the root, a `.kp-code`
 * @param {import('./constants.js').CodeSpec} given
 */
export declare function setCode(el: HTMLElement, given: import('./constants.js').CodeSpec): void;
/**
 * Fill every `[data-kp-code]` under `root` from its markup: the text of its
 * `code` (or `pre`), and `data-kp-code-title`, `-language`, `-size`,
 * `-lines`, `-wrap`, `-max`, `-layout`, `-state`, `-highlight` (`off`).
 * A drawn block belongs to its element and stays drawn, so the detach has nothing to undo.
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export declare function attachCodes(root?: ParentNode): () => void;
