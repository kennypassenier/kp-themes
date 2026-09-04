/** Fired on a reorder list when the order changed. A contract value [TH26]. */
export declare const REORDER_EVENT = "kp-reorder";
/** Fired on a split pane when the divider moved; the detail carries the percentage. */
export declare const SPLIT_EVENT = "kp-split";
/**
 * @param {ParentNode} root
 * @returns {() => void} detach
 */
export declare function attachStructure(root?: ParentNode): () => void;
