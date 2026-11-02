/** A bar that folds. */
export declare const NAV_FOLD = "[data-kp-nav-fold]";
/** Fired on the nav, bubbling, when the set of folded items changed: `{ folded, items }`. */
export declare const NAV_FOLD_EVENT = "kp-nav-fold";
/** The item the script adds to the bar's list. Its class is part of the selector: a page's own item may carry
 * `data-kp-nav-more` too, which pins it behind this one (NAV_PINNED) [parts-1102]. */
export declare const NAV_MORE = ".kp-nav__more[data-kp-nav-more]";
/** A list item the page pins behind More whatever the width; a value names its group in the menu [parts-1102]. */
export declare const NAV_PINNED = "li[data-kp-nav-more]:not(.kp-nav__more)";
/** A separator between two groups of links [kpadopt3]. */
export declare const NAV_SEP = ".kp-nav__sep";
/** The mark the React NavBar puts on a bar it wires itself [AR29]; it folds its own (`fold`). */
export declare const NAV_FOLD_OWNED = "[data-kp-nav-owner]";
/** @param {Element} el @returns {string} the visible words of a link, less its counter */
export declare function wordsOf(el: Element): string;
/** @param {Element} el @returns {string} its counter's text, or '' */
export declare function counterOf(el: Element): string;
/** @param {Element} li @returns {boolean} */
export declare const isPinned: (li: Element) => boolean;
/** The group a pinned item names in the More menu ('' for none). @param {Element} li @returns {string} */
export declare const pinnedGroup: (li: Element) => string;
/** The one-line hint of a link in the More menu: `data-kp-nav-hint` on the link or on its item. @param {Element} el @returns {string} */
export declare const hintOf: (el: Element) => string;
/** @param {Element} li @returns {boolean} */
export declare const isSep: (li: Element) => boolean;
/** @param {HTMLElement} el @returns {boolean} */
export declare const unavailable: (el: HTMLElement) => boolean;
