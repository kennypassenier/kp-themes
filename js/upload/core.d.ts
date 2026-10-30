import { Controller } from '../controller.js';
export type UploadOptions = {
    locale?: string;
    validate?: import('../upload.js').Validator;
    renderRow?: (file: File) => HTMLElement;
    drop?: boolean;
    removeLabel?: string;
    removeClassName?: string;
};
/**
 * @typedef {object} UploadOptions
 * @property {string} [locale]
 * @property {import('../upload.js').Validator} [validate]
 * @property {(file: File) => HTMLElement} [renderRow]
 * @property {boolean} [drop]
 * @property {string} [removeLabel]
 * @property {string} [removeClassName]
 */
export declare class UploadCore extends Controller {
    cfg: UploadOptions;
    input: HTMLInputElement;
    zone: HTMLElement;
    list: HTMLElement;
    locale: string;
    maxBytes: number;
    maxFiles: number;
    maxTotal: number;
    dropping: boolean;
    /** The rows and the files they stand for. @type {Map<HTMLElement, File>} */
    rows: Map<HTMLElement, File>;
    /**
     * @param {HTMLElement} host the upload
     * @param {UploadOptions} [options]
     */
    constructor(host: HTMLElement, options?: UploadOptions);
    /** @param {File} file */
    row(file: File): HTMLElement;
    /** @param {File} file @param {string} reason @param {string} text */
    reject(file: File, reason: string, text: string): void;
    /**
     * Why a file is refused, or null: too many, too large, too large with the others, the wrong type, or the page's own validator.
     * @param {File} file @param {File[]} accepted the files already taken
     * @returns {{ reason: string, text: string } | null}
     */
    refusal(file: File, accepted: File[]): {
        reason: string;
        text: string;
    } | null;
    /** @param {FileList | File[]} files */
    take(files: FileList | File[]): void;
    /** Take every row out. */
    clear(): void;
}
