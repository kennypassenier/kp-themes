/** A bar that folds. */
export declare const NAV_FOLD = "[data-kp-nav-fold]";
/** Fired on the nav, bubbling, when the set of folded items changed: `{ folded, items }`. */
export declare const NAV_FOLD_EVENT = "kp-nav-fold";
/** The item the script adds to the bar's list. */
export declare const NAV_MORE = "[data-kp-nav-more]";
/** A separator between two groups of links [kpadopt3]. */
export declare const NAV_SEP = ".kp-nav__sep";
/** The mark the React NavBar puts on a bar it wires itself [AR29]; it folds its own (`fold`). */
export declare const NAV_FOLD_OWNED = "[data-kp-nav-owner]";
/** @param {Element} el @returns {string} the visible words of a link, less its counter */
export declare function wordsOf(el: Element): string;
/** @param {Element} el @returns {string} its counter's text, or '' */
export declare function counterOf(el: Element): string;
/** @param {Element} li @returns {boolean} */
export declare const isSep: (li: Element) => boolean;
/** @param {HTMLElement} el @returns {boolean} */
export declare const unavailable: (el: HTMLElement) => boolean;
