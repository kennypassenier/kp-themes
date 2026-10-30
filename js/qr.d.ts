export { QR, QR_COPY_EVENT, QR_REVEAL_EVENT, QR_EXPIRED_EVENT, QR_RETRY_EVENT, QR_FOLD, QR_LEVELS, QR_PLATE } from './qr/state.js';
export { qrMatrix, qrContrast } from './qr/matrix.js';
export { setQr, qrSvg } from './qr/actions.js';
export type QrSpec = {
    value?: string;
    state?: 'ready' | 'loading' | 'empty' | 'error';
    /**
     * the failed plate's sentence
     */
    message?: string;
};
/**
 * @typedef {object} QrSpec
 * @property {string} [value]
 * @property {'ready' | 'loading' | 'empty' | 'error'} [state]
 * @property {string} [message]  the failed plate's sentence
 */
/**
 * Wire every QR code under `root`.
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export declare function attachQr(root?: ParentNode): () => void;
