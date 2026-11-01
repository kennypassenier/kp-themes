export { continueList, link, prefixLines, wrap } from './markdown-editor/edits.js';
/** An editor: an element holding the text area. */
export declare const MD_EDITOR = "[data-kp-md-editor]";
/**
 * Wire every editor under `root` (the root itself included).
 * @param {ParentNode} [root]
 * @param {{ strings?: Partial<import('./strings.js').Strings> }} [options]
 * @returns {() => void} detach
 */
export declare function attachMarkdownEditors(root?: ParentNode, options?: {
    strings?: Partial<import('./strings.js').Strings>;
}): () => void;
/**
 * Show the text or the preview of a narrow editor (a wide one shows both).
 * @param {Element} el
 * @param {'write' | 'preview'} view
 */
export declare function showMarkdownView(el: Element, view: 'write' | 'preview'): void;
/**
 * Draw the preview again after the page set the text area's value by script (typing draws it by itself).
 * @param {Element} el
 */
export declare function refreshMarkdownPreview(el: Element): void;
