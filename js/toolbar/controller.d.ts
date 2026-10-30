import { Controller } from '../controller.js';
/** One attach call on a root (a document, a shadow root or an element), which is the controller's host, built directly. */
export declare class ToolbarWatch extends Controller {
    scope: ParentNode;
    /** @param {ParentNode} scope */
    constructor(scope: ParentNode);
    connect(): void;
    /** Escape in the search clears it, and fires `input` so the page filters. @param {KeyboardEvent} event */
    onKey(event: KeyboardEvent): void;
    /** A press on a tag's cross or on Clear all becomes the toolbar's event. @param {MouseEvent} event */
    onClick(event: MouseEvent): void;
    /**
     * The tag that was pressed is gone once the page has redrawn: the focus
     * goes to the tag that took its place, else the last one, else the search.
     * @param {Element} toolbar @param {HTMLElement} pressed @param {number} at
     */
    keepFocus(toolbar: Element, pressed: HTMLElement, at: number): void;
    /** The search key focuses the first visible toolbar's search, from anywhere that is not a field. @param {KeyboardEvent} event */
    onHotkey(event: KeyboardEvent): void;
}
/**
 * Wire every toolbar under `root` (the body of attachToolbars()).
 * @param {ParentNode} root
 * @returns {() => void} detach
 */
export declare function watchToolbars(root: ParentNode): () => void;
