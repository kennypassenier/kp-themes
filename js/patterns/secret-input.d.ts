/**
 * @param {HTMLElement} field
 * @param {{ copiedMs: number, clearAfterMs: number | false }} options
 * @returns {() => void} detach
 */
export declare function wireSecretInput(field: HTMLElement, { copiedMs, clearAfterMs }: {
    copiedMs: number;
    clearAfterMs: number | false;
}): () => void;
