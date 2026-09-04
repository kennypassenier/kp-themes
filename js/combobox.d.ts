/**
 * The event a consumer listens for. A contract value [TH26]: the detail
 * carries `{ value, values }` — the value just chosen, and every value
 * held (one for a combobox, the whole set for a tag input).
 */
export declare const CHANGE_EVENT = "kp-combobox-change";
/**
 * Attach every combobox and tag input under `root`.
 *
 * @param {ParentNode} root
 * @returns {() => void} detach
 */
export declare function attachComboboxes(root?: ParentNode): () => void;
