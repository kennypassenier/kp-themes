/**
 * Whether an address may be a link: http, https, mailto, or no scheme at all.
 * @param {string} href
 * @returns {boolean}
 */
export declare function safeHref(href: string): boolean;
/**
 * The inline parts of one line of text, appended to `parent`: code, bold, italic, links and autolinks; the rest is text.
 * @param {Document} doc @param {ParentNode} parent @param {string} text
 */
export declare function inline(doc: Document, parent: ParentNode, text: string): void;
