export { FILE_EVENT, REJECT_EVENT, REMOVE_EVENT } from './upload/values.js';
export { acceptsFile } from './upload/accepts.js';
export { setProgress, setDone, setError } from './upload/item.js';
export type RejectReason = 'too-large' | 'too-many' | 'total-too-large' | 'wrong-type' | string;
export type Validator = (file: File, accepted: File[]) => RejectReason | null;
export type UploadHandle = {
    element: HTMLElement;
    files: () => File[];
    add: (files: File[] | FileList) => void;
    clear: () => void;
};
/** @typedef {'too-large' | 'too-many' | 'total-too-large' | 'wrong-type' | string} RejectReason */
/** @typedef {(file: File, accepted: File[]) => RejectReason | null} Validator */
/**
 * @typedef {object} UploadHandle
 * @property {HTMLElement} element
 * @property {() => File[]} files
 * @property {(files: File[] | FileList) => void} add
 * @property {() => void} clear
 */
/** The handle for an attached upload. @param {Element} element @returns {UploadHandle | null} */
export declare function upload(element: Element): UploadHandle | null;
/**
 * @param {ParentNode} root
 * @param {import('./upload/core.js').UploadOptions} [options]
 *   Defaults; per upload as data-attributes: `data-kp-max-bytes`, `data-kp-max-files`, `data-kp-max-total`, `data-kp-drop="false"`, `data-kp-locale`, and the input's own `accept`.
 * @returns {(() => void) & { handles: UploadHandle[] }} detach
 */
export declare function attachUploads(root?: ParentNode, options?: import('./upload/core.js').UploadOptions): (() => void) & {
    handles: UploadHandle[];
};
