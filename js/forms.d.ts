/** Fired when a form passes validation. A contract value [TH26]: the detail carries the FormData. */
export declare const VALID_EVENT = "kp-form-valid";
/**
 * Attach every form under `root`.
 *
 * @param {ParentNode} root
 * @returns {() => void} detach
 */
export declare function attachForms(root?: ParentNode): () => void;
