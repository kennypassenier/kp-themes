/**
 * Give every `[data-kp-logviewer]` under `root` its bar, its buffer and its states.
 *
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export declare function attachLogViewers(root?: ParentNode): () => void;
