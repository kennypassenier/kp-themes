/** How long a toast stays before it removes itself. An operational knob. */
export declare const TOAST_MS = 5000;
/**
 * Wire `[data-kp-dialog="<id>"]` buttons to the dialog with that id.
 *
 * showModal(), not show(): the modal form is the one that traps focus and
 * makes the rest of the page inert. Escape and focus return need no code.
 *
 * @param {ParentNode} root
 * @returns {() => void} detach
 */
export declare function attachDialogs(root?: ParentNode): () => void;
/**
 * Tabs: one stop in the tab order, arrows to move between them.
 *
 * This is the ARIA authoring practice, and it is genuinely not free: a
 * tab list where every tab is a tab stop makes a keyboard user press Tab
 * seven times to leave a row of tabs.
 *
 * @param {ParentNode} root
 * @returns {() => void} detach
 */
export declare function attachTabs(root?: ParentNode): () => void;
/**
 * Show a toast in the page's toast region, creating the region if it is
 * not there. role="status" rather than role="alert": a toast is an
 * announcement, and alert interrupts whatever a screen reader was saying.
 *
 * @param {string} text
 * @param {{ ms?: number }} [options]
 * @returns {HTMLElement} the toast, so a caller can remove it early
 */
export declare function toast(text: string, { ms }?: {
    ms?: number;
}): HTMLElement;
