export type SecretLoad = import('./types.js').SecretLoad;
/** @typedef {import('./types.js').SecretLoad} SecretLoad */
/**
 * Attach the patterns under `root`.
 *
 * `secretLoad(field, purpose)` reads a secret field's value when it is shown or copied (purpose `reveal` or `copy`), so the
 * value is in the page only while it is shown; without it a field asks through `kp-secret-request`, and last reads its
 * own `data-kp-secret-value`.
 *
 * `clearAfterMs` is how long after a Copy the clipboard is emptied again (default 30 000 ms; 0 or false: never), for every
 * secret field without its own `data-kp-secret-clear`.
 *
 * @param {ParentNode} root
 * @param {{ copiedMs?: number, undoMs?: number, clearAfterMs?: number | false, toastOnCopyFailure?: boolean, undoClassName?: string, secretLoad?: SecretLoad }} [options]
 * @returns {() => void} detach
 */
export declare function attachPatterns(root?: ParentNode, { copiedMs, undoMs, clearAfterMs, toastOnCopyFailure, undoClassName, secretLoad, }?: {
    copiedMs?: number;
    undoMs?: number;
    clearAfterMs?: number | false;
    toastOnCopyFailure?: boolean;
    undoClassName?: string;
    secretLoad?: SecretLoad;
}): () => void;
