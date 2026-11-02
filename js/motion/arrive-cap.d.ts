/** How many elements of one batch arrive when neither the attach nor the region names a number. */
export declare const ARRIVE_MAX = 12;
/** The attribute that sets the cap for a region of the page: a number, or `all` for no cap. */
export declare const ARRIVE_MAX_ATTRIBUTE = "data-kp-arrive-max";
/**
 * The cap that applies under `el`: its closest `data-kp-arrive-max`, else `fallback`.
 * A value that is neither a whole number from 0 up nor `all` is a mistake in the page and is reported, then ignored.
 * @param {Element} el @param {number} fallback
 * @returns {number}
 */
export declare function arriveMaxOf(el: Element, fallback: number): number;
/**
 * The arrivals one batch may still play, per region: every region under its own closest cap, counted apart.
 * @param {number} fallback the cap where no region says another
 * @returns {(el: Element) => boolean} whether `el` may arrive; each yes uses one of its region's arrivals
 */
export declare function arriveBudget(fallback: number): (el: Element) => boolean;
