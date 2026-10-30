/** A tab of the underline row. */
export declare const TAB = ".kp-tab";
/** The tones a count may carry; each is a plate the badge already has. */
export declare const TAB_COUNT_TONES: readonly ['neutral', 'info', 'success', 'warning', 'error'];
export type TabCountTone = import('../tabbar.js').TabCountTone;
/** @typedef {import('../tabbar.js').TabCountTone} TabCountTone */
/** Fired on a tab (bubbling) when what its count shows changed: `{ tab, count, state, tone }`. */
export declare const TAB_COUNT_EVENT = "kp-tab-count";
/** The attributes a count is drawn from. */
export declare const COUNT_ATTRIBUTES: string[];
/**
 * Draw the count part of one tab from its attributes. Made when missing, kept in place otherwise.
 *
 * @param {Element} tab a `.kp-tab`
 * @returns {HTMLElement | null} the count part, null while the tab has none
 */
export declare function drawTabCount(tab: Element): HTMLElement | null;
/**
 * Write the count of a tab of the underline row: every digit of it (12 is 12 and 1534 is 1534, never `9+` or `1.5k`), nothing at
 * `null` (a tab that has not been counted is not a tab with 0), nothing at 0 unless `zero: 'show'`. `'loading'` draws a skeleton
 * the width of the last number, `'error'` a dash with the words "could not be counted" for a screen reader. An option left out keeps
 * what the tab already says, so a refresh is `setTabCount(tab, 13)`; `null` as an option takes it away. The call writes the
 * `data-kp-tab-count…` attributes and draws, so markup and call are one thing.
 *
 * @param {Element} tab a `.kp-tab`
 * @param {number | null | 'loading' | 'error'} count
 * @param {{ tone?: TabCountTone | null, unit?: string | null, zero?: 'show' | 'hide' | null, showUnit?: boolean | null }} [options]
 *        `unit` is the singular and the plural, "error,errors"
 * @returns {HTMLElement | null} the count part
 */
export declare function setTabCount(tab: Element, count: number | null | 'loading' | 'error', options?: {
    tone?: TabCountTone | null;
    unit?: string | null;
    zero?: 'show' | 'hide' | null;
    showUnit?: boolean | null;
}): HTMLElement | null;
