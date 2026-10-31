export type GanttOptions = import('./constants.js').GanttOptions;
/** @typedef {import('./constants.js').GanttOptions} GanttOptions */
/**
 * Attach every run timeline under `root` (below it: the root itself is not one of them).
 * @param {ParentNode} [root]
 * @param {GanttOptions} [options]
 * @returns {() => void} detach
 */
export declare function attachGantts(root?: ParentNode, options?: GanttOptions): () => void;
