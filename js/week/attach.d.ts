export type WeekModel = import('./types.js').WeekModel;
export type WeekOptions = import('./types.js').WeekOptions;
/** @typedef {import('./types.js').WeekModel} WeekModel */
/** @typedef {import('./types.js').WeekOptions} WeekOptions */
/**
 * Attach every week agenda under `root`.
 * @param {ParentNode} [root]
 * @param {WeekOptions} [options]
 * @returns {() => void} detach
 */
export declare function attachWeeks(root?: ParentNode, options?: WeekOptions): () => void;
