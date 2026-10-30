export type QrSpec = import('../qr.js').QrSpec;
/**
 * Give a code its link or its state.
 * @param {HTMLElement} root @param {QrSpec} spec
 */
export declare function setQr(root: HTMLElement, spec: QrSpec): void;
/** The code's SVG text, or null when none is drawn. @param {HTMLElement} root */
export declare function qrSvg(root: HTMLElement): string | null;
/** @param {HTMLElement} root */
export declare function copyLink(root: HTMLElement): Promise<void>;
/** @param {HTMLElement} root @param {'png' | 'svg'} kind */
export declare function download(root: HTMLElement, kind: 'png' | 'svg'): Promise<void>;
