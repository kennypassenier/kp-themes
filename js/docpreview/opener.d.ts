import { Controller } from '../controller.js';
export type PreviewOptions = import('../docpreview.js').PreviewOptions;
/** @typedef {import('../docpreview.js').PreviewOptions} PreviewOptions */
export declare class DocOpener extends Controller {
    connect(): void;
    /** @param {Event} event */
    onClick(event: Event): void;
    /** What the opener's attributes ask for. @param {string} url @returns {PreviewOptions} */
    previewOptions(url: string): PreviewOptions;
    /** The openers that share this one's group, as the documents the viewer steps through. @returns {Pick<PreviewOptions, 'group' | 'index'>} */
    groupOptions(): Pick<PreviewOptions, 'group' | 'index'>;
}
