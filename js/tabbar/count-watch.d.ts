/**
 * Keep the count of every tab under `root` drawn from its attributes: now, and whenever an attribute of the count changes or a
 * tab comes. Idempotent.
 *
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export declare function attachTabCounts(root?: ParentNode): () => void;
