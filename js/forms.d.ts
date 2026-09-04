/**
 * Fired when a form passes validation. A contract value [TH26]: the
 * detail carries the FormData and, since KT6, a `done()` that ends the
 * busy state. A consumer may call it, or return nothing and dispatch
 * `DONE_EVENT` on the form themselves — same effect.
 */
export declare const VALID_EVENT = "kp-form-valid";
/**
 * Ends the busy state the submit button took on `VALID_EVENT` [KT6].
 * Dispatched on the form by `detail.done()`, or by the consumer directly.
 * Nothing dispatches it on its own: a consumer who navigates away on
 * submit must not get back a button that double-sends.
 */
export declare const DONE_EVENT = "kp-form-done";
/**
 * Attach every form under `root`.
 *
 * @param {ParentNode} root
 * @returns {() => void} detach
 */
export declare function attachForms(root?: ParentNode): () => void;
