export { COMPARE, COMPARE_EVENT, COMPARE_RETRY_EVENT } from './compare/values.js';
export { compareKey } from './compare/keys.js';
/**
 * Hold a slider in its loading state (the busy card over the box) while the page reads its panes, or let it go.
 * @param {Element} el @param {boolean} busy
 */
export declare function setCompareBusy(el: Element, busy: boolean): void;
/**
 * Move a slider's divider from a script, without the event.
 * @param {Element} el @param {number} position 0 (all after) to 100 (all before)
 */
export declare function setCompare(el: Element, position: number): void;
/**
 * Wire every compare slider under `root`.
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export declare function attachCompares(root?: ParentNode): () => void;
