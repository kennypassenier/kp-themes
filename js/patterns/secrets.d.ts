export type SecretLoad = import('./types.js').SecretLoad;
export type SecretState = import('./types.js').SecretState;
/** @typedef {import('./types.js').SecretLoad} SecretLoad */
/** @typedef {import('./types.js').SecretState} SecretState */
/**
 * Attach every secret field under `root`.
 * @param {ParentNode} [root]
 * @param {{ load?: SecretLoad, copiedMs?: number, clearAfterMs?: number | false }} [options]
 * @returns {() => void} detach
 */
export declare function attachSecrets(root?: ParentNode, { load, copiedMs, clearAfterMs }?: {
    load?: SecretLoad;
    copiedMs?: number;
    clearAfterMs?: number | false;
}): () => void;
