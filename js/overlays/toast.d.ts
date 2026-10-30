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
/** The toasts dismissed and leaving now, which a stack's `max` no longer counts. @type {WeakSet<Element>} */
export declare const goingToasts: WeakSet<Element>;
/**
 * Show a toast in the page's toast region, creating the region if it is
 * not there. role="status" rather than role="alert" by default: a toast
 * is an announcement, and alert interrupts whatever a screen reader was
 * saying. An error that must interrupt passes `live: 'assertive'` on its
 * own toast, which gets its own live region so the politeness is per
 * message rather than per page.
 *
 * A toast does not leave under a reader's eye: while the pointer is on it or
 * focus is inside it, its clock stops (`data-kp-paused` on the toast, and
 * TOAST_PAUSE_EVENT), and `linger` ms after both have gone it leaves. Esc on a
 * focused toast closes it. `pause: false` brings back the plain timer.
 * `close: true` adds a close button; `sticky: true` is `ms: 0` plus that
 * button, a toast that stays until it is closed (an undo that needs a
 * decision, an error to be read). The buttons sit at the toast's end.
 *
 * @param {string | Node} content text, or a node the consumer built
 * @param {{ ms?: number, region?: HTMLElement | null, live?: 'polite' | 'assertive', className?: string, action?: { label: string, onClick: () => void }, max?: number, pause?: boolean, linger?: number, close?: boolean, sticky?: boolean }} [options]
 *   ms: 0 keeps the toast until dismissed; max: drop the oldest beyond this many;
 *   pause: stop the clock while hovered or focused (default true); linger: ms left after both have gone (default TOAST_LINGER_MS);
 *   close: add a close button; sticky: stay until closed, with a close button
 * @returns {HTMLElement & { dismiss: () => void }} the toast, so a caller can remove it early
 */
export declare function toast(content: string | Node, { ms, region, live, className, action, max, pause, linger, close, sticky, }?: {
    ms?: number;
    region?: HTMLElement | null;
    live?: 'polite' | 'assertive';
    className?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    max?: number;
    pause?: boolean;
    linger?: number;
    close?: boolean;
    sticky?: boolean;
}): HTMLElement & {
    dismiss: () => void;
};
