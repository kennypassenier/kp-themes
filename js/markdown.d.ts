export { MARKDOWN_LIMIT } from './markdown/values.js';
export { safeHref } from './markdown/inline.js';
export { markdownFragment } from './markdown/reader.js';
export type MarkdownOptions = {
    /**
     * the level a `#` heading is written at, 1 to 6 (default 4); deeper headings follow, to 6
     */
    headings?: number;
    /**
     * the most characters read (default 40 000); more is cut at a line with a sentence saying so
     */
    limit?: number;
};
/**
 * @typedef {object} MarkdownOptions
 * @property {number} [headings] the level a `#` heading is written at, 1 to 6 (default 4); deeper headings follow, to 6
 * @property {number} [limit] the most characters read (default 40 000); more is cut at a line with a sentence saying so
 */
