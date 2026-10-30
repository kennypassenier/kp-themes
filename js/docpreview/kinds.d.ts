/** The kind of glyph a file name or type means. Pure. @param {string} nameOrType */
export declare function docKindOf(nameOrType: string): "doc" | "image" | "pdf" | "sheet" | "text" | "unknown";
/** The plain name of a file: the last part of the address, decoded, no query. Pure. @param {string} url */
export declare function plainFileName(url: string): string;
/** What the preview should draw a file as. Pure over the extension. @param {string} url @param {string} [contentType] */
export declare function previewTypeOf(url: string, contentType?: string): "image" | "pdf" | "text";
