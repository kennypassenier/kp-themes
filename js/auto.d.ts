/**
 * Attach every behaviour under `root`. Returns one detach for all of it.
 *
 * @param {ParentNode} [root]
 * @returns {() => void}
 */
export declare function attachAll(root?: ParentNode): () => void;
