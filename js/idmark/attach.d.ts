/**
 * Fill every `[data-kp-idmark]` under `root`, and each one added or renamed
 * later. Marks inside one `[data-kp-idmark-set]` share out the palette with
 * idmarkColours(), in document order.
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export declare function attachIdmarks(root?: ParentNode): () => void;
