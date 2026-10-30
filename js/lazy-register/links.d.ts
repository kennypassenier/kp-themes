export type LazyRegisterOptions = import('../lazy-register.js').LazyRegisterOptions;
/**
 * The loads started and the URLs loaded in a document.
 * @param {Document} doc
 * @returns {{ loads: Map<string, Promise<HTMLLinkElement>>, loaded: Set<string> }}
 */
export declare function stateOf(doc: Document): {
    loads: Map<string, Promise<HTMLLinkElement>>;
    loaded: Set<string>;
};
/**
 * The URL of a theme's register.
 *
 * @param {string} theme
 * @param {{ pattern?: string, doc?: Document }} [options]
 * @returns {string} absolute, resolved against the document
 */
export declare function registerHref(theme: string, { pattern, doc }?: {
    pattern?: string;
    doc?: Document;
}): string;
/**
 * The link in the document that serves `theme`'s register: one carrying
 * REGISTER_ATTRIBUTE for it, or else a plain stylesheet link at its URL.
 *
 * @param {string} theme
 * @param {LazyRegisterOptions} [options]
 * @returns {HTMLLinkElement | null}
 */
export declare function registerLink(theme: string, { pattern, doc }?: LazyRegisterOptions): HTMLLinkElement | null;
/**
 * The themes whose register links are in the document, in document order.
 *
 * @param {Document} [doc]
 * @returns {string[]}
 */
export declare function registersPresent(doc?: Document): string[];
/**
 * Whether a link's stylesheet has finished loading. A sheet object can
 * exist while the file is still on its way; reading its rules throws
 * until it has arrived (same-origin), and the resource log has an entry
 * once it has (either origin).
 *
 * @param {HTMLLinkElement} link
 */
export declare function hasLoaded(link: HTMLLinkElement): boolean;
/**
 * Whether `theme`'s register is in the document and has loaded.
 *
 * @param {string} theme
 * @param {LazyRegisterOptions} [options]
 */
export declare function registerLoaded(theme: string, { pattern, doc }?: LazyRegisterOptions): boolean;
