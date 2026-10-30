export type GanttModel = import('./constants.js').GanttModel;
export type GanttOptions = import('./constants.js').GanttOptions;
/** @typedef {import('./constants.js').GanttModel} GanttModel */
/** @typedef {import('./constants.js').GanttOptions} GanttOptions */
/**
 * Attach every run timeline under `root`.
 * @param {ParentNode} [root]
 * @param {GanttOptions} [options]
 * @returns {() => void} detach
 */
export declare function attachGantts(root?: ParentNode, options?: GanttOptions): () => void;
/** A new window: lanes may need fewer rows again, the axis starts over. @param {GanttModel} c */
export declare function freshWindow(c: GanttModel): void;
