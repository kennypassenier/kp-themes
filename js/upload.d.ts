/** Fired for each accepted file. A contract value [TH26]: the detail carries the File and its row. */
export declare const FILE_EVENT = "kp-upload-file";
/** Fired for a file the zone refused, with the reason. */
export declare const REJECT_EVENT = "kp-upload-reject";
/**
 * @param {ParentNode} root
 * @returns {() => void} detach
 */
export declare function attachUploads(root?: ParentNode): () => void;
/**
 * Set a file row's progress. Exported because the consumer owns the
 * request and therefore owns the numbers.
 *
 * @param {HTMLElement} item
 * @param {number} percent
 */
export declare function setProgress(item: HTMLElement, percent: number): void;
