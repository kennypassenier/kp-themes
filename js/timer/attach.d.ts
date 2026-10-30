/**
 * Wire every timer list under `root` (its buttons) and every starter in the
 * page. Counting goes on from the end time when the page comes back.
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export declare function attachTimers(root?: ParentNode): () => void;
