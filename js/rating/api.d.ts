/**
 * Draw and wire every rating under `root`.
 * @param {ParentNode} [root]
 * @param {import('./constants.js').RatingOptions} [options] defaults; each element's own `data-kp-rating-*` wins
 * @returns {() => void} detach
 */
export declare const attachRatings: (root?: ParentNode, options?: import('./constants.js').RatingOptions) => () => void;
/**
 * The handle of an attached rating.
 * @param {Element} element
 * @returns {import('./constants.js').RatingHandle | null}
 */
export declare function rating(element: Element): import('./constants.js').RatingHandle | null;
/**
 * Set the value from a script, without the event (the page read it from somewhere).
 * @param {Element} element @param {number} value 0 clears
 */
export declare function setRating(element: Element, value: number): void;
/**
 * The state: `loading` (dashed stars that pulse, the row's size kept), `error` (the stars replaced at the same size by
 * "Could not read the rating" and Retry), `ready`.
 * @param {Element} element @param {'ready' | 'loading' | 'error'} next
 */
export declare function setRatingState(element: Element, next: 'ready' | 'loading' | 'error'): void;
/**
 * A rating inside a data table cell: the display row, and the number the table sorts and filters the cell by.
 * @param {HTMLElement} cell the `td` (or any element inside one)
 * @param {number} value 0 is not rated
 * @param {{ max?: number, count?: number, for?: string }} [options]
 * @returns {HTMLElement} the rating element
 */
export declare function ratingCell(cell: HTMLElement, value: number, { max, count, for: item }?: {
    max?: number;
    count?: number;
    for?: string;
}): HTMLElement;
