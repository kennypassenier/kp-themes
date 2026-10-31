export type SecretLoad = import('./types.js').SecretLoad;
/** @typedef {import('./types.js').SecretLoad} SecretLoad */
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
