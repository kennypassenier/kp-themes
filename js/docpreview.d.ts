export { PREVIEW, DOC_GLYPH, DOC_KINDS, PREVIEW_TIMEOUT_MS } from './docpreview/values.js';
export { docKindOf, plainFileName, previewTypeOf } from './docpreview/kinds.js';
export { docGlyph } from './docpreview/glyph.js';
export { openDocPreview } from './docpreview/open.js';
export type PreviewOptions = {
    url: string;
    type?: 'auto' | 'pdf' | 'image' | 'text';
    engine?: 'native' | 'none';
    size?: 'wide' | 'full';
    /**
     * open, download, print, copy-link
     */
    actions?: readonly string[];
    title?: string;
    page?: number;
    sandbox?: 'strict' | 'off';
    /**
     * the saved file name
     */
    name?: string;
    opener?: Element | null;
    /**
     * documents the viewer can step through
     */
    group?: readonly {
        url: string;
        title?: string;
        name?: string;
    }[];
    /**
     * where in the group this one is
     */
    index?: number;
    doc?: Document;
    /**
     * the Open key (default `o`; `false` or `none` for no key)
     */
    openKey?: string | false;
    /**
     * the Download key (default `d`)
     */
    downloadKey?: string | false;
    /**
     * the Print key (default `p`)
     */
    printKey?: string | false;
};
/**
 * @typedef {object} PreviewOptions
 * @property {string} url
 * @property {'auto' | 'pdf' | 'image' | 'text'} [type]
 * @property {'native' | 'none'} [engine]
 * @property {'wide' | 'full'} [size]
 * @property {readonly string[]} [actions] open, download, print, copy-link
 * @property {string} [title]
 * @property {number} [page]
 * @property {'strict' | 'off'} [sandbox]
 * @property {string} [name] the saved file name
 * @property {Element | null} [opener]
 * @property {readonly { url: string, title?: string, name?: string }[]} [group] documents the viewer can step through
 * @property {number} [index] where in the group this one is
 * @property {Document} [doc]
 * @property {string | false} [openKey] the Open key (default `o`; `false` or `none` for no key)
 * @property {string | false} [downloadKey] the Download key (default `d`)
 * @property {string | false} [printKey] the Print key (default `p`)
 */
/**
 * Draw every glyph under `root`.
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export declare function attachDocGlyphs(root?: ParentNode): () => void;
/**
 * Wire every opener under `root`.
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export declare function attachDocPreviews(root?: ParentNode): () => void;
