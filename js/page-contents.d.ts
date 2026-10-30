export { CONTENTS, CONTENTS_EVENT } from './page-contents/values.js';
export { contentsSlug, currentSection } from './page-contents/slug.js';
export type ContentsItem = {
    /**
     * the section's `id`
     */
    id: string;
    /**
     * the entry's words
     */
    label: string;
    /**
     * 0 (default) for a section, 1 under it, and so on
     */
    level?: number;
    /**
     * a small number or word after the label
     */
    count?: string | number;
};
export type ContentsHandle = {
    /**
     * the id of the current entry
     */
    current: () => string | null;
    /**
     * read the headings again now
     */
    refresh: () => void;
    /**
     * entries the page gives; null goes back to the headings
     */
    setItems: (items: readonly ContentsItem[] | null) => void;
};
/**
 * @typedef {object} ContentsItem
 * @property {string} id the section's `id`
 * @property {string} label the entry's words
 * @property {number} [level] 0 (default) for a section, 1 under it, and so on
 * @property {string | number} [count] a small number or word after the label
 */
/**
 * @typedef {object} ContentsHandle
 * @property {() => string | null} current the id of the current entry
 * @property {() => void} refresh read the headings again now
 * @property {(items: readonly ContentsItem[] | null) => void} setItems entries the page gives; null goes back to the headings
 */
/**
 * The handle of an attached list.
 * @param {Element} nav
 * @returns {ContentsHandle | null}
 */
export declare function contents(nav: Element): ContentsHandle | null;
/**
 * Give a list its entries (the page's own sections), or `null` to go back to reading the headings.
 * @param {Element} nav an attached `[data-kp-contents]`
 * @param {readonly ContentsItem[] | null} items
 */
export declare function setContents(nav: Element, items: readonly ContentsItem[] | null): void;
/**
 * Build a contents list for every `[data-kp-contents]` under `root` and follow the reader.
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export declare function attachContents(root?: ParentNode): () => void;
