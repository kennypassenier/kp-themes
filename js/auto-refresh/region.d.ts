/**
 * Why a refresh should wait now: the tab is hidden, a dialog is open, a field outside the control has the focus, or the
 * pointer is over a table being read. Empty when nothing stops it.
 * @param {HTMLElement} el
 */
export declare function blockedReason(el: HTMLElement): "" | "dialog" | "hidden" | "reading" | "typing";
/**
 * Fetch the page again and swap the children of the `data-kp-refresh-region` element, keeping the element, its scroll and an open menu on it.
 * @param {HTMLElement} el
 * @returns {Promise<boolean>} whether it worked
 */
export declare function regionRefresh(el: HTMLElement): Promise<boolean>;
