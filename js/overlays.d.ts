/** How long a toast stays before it removes itself. An operational knob; per toast as `ms`. */
export declare const TOAST_MS = 5000;
/** Dispatched on the dialog, bubbling, when a wired trigger opened it: `{ trigger, modal }`. */
export declare const DIALOG_OPEN_EVENT = "kp-dialog-open";
/** Dispatched on a tab list, bubbling, when the selected tab changed: `{ index, tab, panel, previous }`. */
export declare const TAB_CHANGE_EVENT = "kp-tab-change";
/** Dispatched on the toast region when a toast was shown / removed: `{ toast, text }`. */
export declare const TOAST_SHOW_EVENT = "kp-toast-show";
export declare const TOAST_HIDE_EVENT = "kp-toast-hide";
/**
 * Wire `[data-kp-dialog="<id>"]` buttons to the dialog with that id.
 *
 * showModal() by default: the modal form is the one that traps focus and
 * makes the rest of the page inert. `data-kp-dialog-mode="non-modal"` on
 * the trigger opens with show() instead, for a palette-like panel that
 * must not inert the page.
 *
 * @param {ParentNode} root
 * @param {{ modal?: boolean }} [options] the default mode when a trigger says nothing
 * @returns {() => void} detach
 */
export declare function attachDialogs(root?: ParentNode, { modal }?: {
    modal?: boolean;
}): () => void;
/**
 * Select a tab in an attached tab list from outside — for a "next" button,
 * a URL hash, or a restored view.
 *
 * @param {Element} list the `[role="tablist"]`
 * @param {number | string} which an index, or a tab's id
 */
export declare function selectTab(list: Element, which: number | string): void;
/**
 * Tabs: one stop in the tab order, arrows to move between them.
 *
 * This is the ARIA authoring practice, and it is genuinely not free: a
 * tab list where every tab is a tab stop makes a keyboard user press Tab
 * seven times to leave a row of tabs.
 *
 * Options, each also readable from the list's own attributes so a
 * server-written page needs no JavaScript to set them:
 *   - `aria-orientation="vertical"` → Up/Down move instead of Left/Right
 *   - `data-kp-activation="manual"` → arrows move focus only; Enter or
 *     Space selects. The other half of the ARIA practice, for a panel
 *     that is expensive to show.
 *   - `data-kp-loop="false"` → no wrap-around at the ends
 *
 * @param {ParentNode} root
 * @param {{ activation?: 'automatic' | 'manual', loop?: boolean }} [options] defaults for lists that say nothing
 * @returns {() => void} detach
 */
export declare function attachTabs(root?: ParentNode, { activation, loop }?: {
    activation?: 'automatic' | 'manual';
    loop?: boolean;
}): () => void;
/**
 * The page's toast region, created on first use.
 *
 * @param {{ region?: HTMLElement | null, role?: string, live?: 'polite' | 'assertive' | 'off', className?: string }} [options]
 * @returns {HTMLElement}
 */
export declare function toastRegion({ region, role, live, className }?: {
    region?: HTMLElement | null;
    role?: string;
    live?: 'polite' | 'assertive' | 'off';
    className?: string;
}): HTMLElement;
/**
 * Show a toast in the page's toast region, creating the region if it is
 * not there. role="status" rather than role="alert" by default: a toast
 * is an announcement, and alert interrupts whatever a screen reader was
 * saying. An error that must interrupt passes `live: 'assertive'` on its
 * own toast, which gets its own live region so the politeness is per
 * message rather than per page.
 *
 * @param {string | Node} content text, or a node the consumer built
 * @param {{ ms?: number, region?: HTMLElement | null, live?: 'polite' | 'assertive', className?: string, action?: { label: string, onClick: () => void }, max?: number }} [options]
 *   ms: 0 keeps the toast until dismissed; max: drop the oldest beyond this many
 * @returns {HTMLElement & { dismiss: () => void }} the toast, so a caller can remove it early
 */
export declare function toast(content: string | Node, { ms, region, live, className, action, max }?: {
    ms?: number;
    region?: HTMLElement | null;
    live?: 'polite' | 'assertive';
    className?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    max?: number;
}): HTMLElement & {
    dismiss: () => void;
};
/** The close label a consumer's markup can use: `data-kp-dialog-close` with the dictionary's word. */
export declare const closeLabel: () => string;
