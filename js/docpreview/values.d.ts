/** An opener. */
export declare const PREVIEW = "[data-kp-preview]";
/** A glyph. */
export declare const DOC_GLYPH = ".kp-docglyph";
/** The kinds of a document glyph. */
export declare const DOC_KINDS: readonly ['pdf', 'doc', 'sheet', 'image', 'text', 'unknown'];
/** How long a frame may take before the preview is called failed, in ms. */
export declare const PREVIEW_TIMEOUT_MS = 15000;
/** The glyph's text lines: the least, the most, and the default for a large and for any other size. */
export declare const GLYPH_LINES: {
    min: number;
    max: number;
    large: number;
    normal: number;
};
/** The buttons a preview's foot has when `data-kp-preview-actions` does not say. */
export declare const DEFAULT_ACTIONS: readonly ['open', 'download'];
/** The glyphs to draw: one with a kind or a state. */
export declare const GLYPH_HOSTS = ".kp-docglyph[data-kp-doc-kind], .kp-docglyph[data-kp-state]";
/** What each file extension is drawn as. */
export declare const EXTENSIONS: Record<string, 'pdf' | 'image' | 'text'>;
