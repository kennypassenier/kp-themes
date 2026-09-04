/** Fired on the wrapper when the visible set changes. A contract value [TH26]. */
export declare const VIEW_EVENT = "kp-datatable-view";
/** Fired when the selection changes; the detail carries the selected row keys. */
export declare const SELECT_EVENT = "kp-datatable-select";
/** Rows per page when the consumer does not say. An operational knob. */
export declare const PAGE_SIZE = 10;
/**
 * Attach every data table under `root`.
 *
 * @param {ParentNode} root
 * @returns {() => void} detach
 */
export declare function attachDataTables(root?: ParentNode): () => void;
