export type WeekOptions = import('./types.js').WeekOptions;
/** @typedef {import('./types.js').WeekOptions} WeekOptions */
/**
 * Attach every week agenda under `root` (below it: the root itself is not one of them).
 * @param {ParentNode} [root]
 * @param {WeekOptions} [options]
 * @returns {() => void} detach
 */
export declare function attachWeeks(root?: ParentNode, options?: WeekOptions): () => void;
