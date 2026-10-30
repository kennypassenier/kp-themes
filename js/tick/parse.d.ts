export type TickParse = import('../tick.js').TickParse;
/**
 * Read the first number out of `text` in the shape `locale` writes numbers,
 * with a way to write another value back in the same shape (the same text
 * around it, grouping and decimals). Null when the text holds no number.
 * @param {string} text @param {string | undefined} locale
 * @returns {TickParse | null}
 */
export declare function parseTick(text: string, locale: string | undefined): TickParse | null;
/** The text node a number lives in: the element's first text node with a digit. @param {Element} el */
export declare function numberNode(el: Element): Text | null;
/** @param {Element} el */
export declare const localeOf: (el: Element) => string | undefined;
