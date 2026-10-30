export type MarkdownOptions = import('../markdown.js').MarkdownOptions;
export type ListLevel = {
    list: HTMLElement;
    indent: number;
    last: HTMLElement | null;
};
/** One reading of one text. */
export declare class MarkdownReader {
    doc: Document;
    limit: number;
    out: DocumentFragment;
    /** Whether the text was cut at the limit. */
    cut: boolean;
    /** The level a `#` heading is written at. */
    base: number;
    lines: string[];
    /** The line being read. */
    i: number;
    /** The lines of the paragraph being gathered. @type {string[]} */
    paragraph: string[];
    /**
     * @param {Document} doc
     * @param {string} text
     * @param {MarkdownOptions} [options]
     */
    constructor(doc: Document, text: string, { headings, limit }?: MarkdownOptions);
    /** @returns {DocumentFragment} */
    read(): DocumentFragment;
    /** Offer a line to each block in turn; what none takes belongs to the paragraph. @param {string} line */
    readLine(line: string): void;
    flush(): void;
    /** @param {string} line */
    blank(line: string): boolean;
    /** @param {string} line */
    fence(line: string): boolean;
    /** @param {string} line */
    heading(line: string): boolean;
    /** @param {string} line */
    rule(line: string): boolean;
    /** @param {string} line */
    quote(line: string): boolean;
    /** @param {string} line */
    list(line: string): boolean;
    /** One item: the levels deeper than its indent are closed, a deeper indent opens a nested list. @param {ListLevel[]} stack @param {RegExpExecArray} m */
    listItem(stack: ListLevel[], m: RegExpExecArray): void;
}
/**
 * Build the DOM of a markdown text. Nothing is parsed as HTML.
 * @param {Document} doc
 * @param {string} text
 * @param {MarkdownOptions} [options]
 * @returns {DocumentFragment}
 */
export declare function markdownFragment(doc: Document, text: string, options?: MarkdownOptions): DocumentFragment;
