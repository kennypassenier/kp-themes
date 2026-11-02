export { SETTLED, SETTLED_ATTRIBUTE, SETTLED_EVENT } from './settled/constants.js';
/**
 * Wire every list under `root` that can hold settled rows (the root itself included). Idempotent.
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export declare function attachSettled(root?: ParentNode): () => void;
/**
 * Settle a row: where its item went, in words; an empty word takes the settled state away.
 * @param {Element} row
 * @param {string} word
 */
export declare function settleRow(row: Element, word: string): void;
/**
 * The list is left: take its settled rows out. Returns how many went.
 * @param {ParentNode} list
 * @returns {number}
 */
export declare function clearSettled(list: ParentNode): number;
