/** The value of `data-kp-folding` on what folds out of a box: it is gone from the box's layout once its fold has played. */
export declare const FOLDING_OUT = "out";
/**
 * Elements whose leave (or arrival as a leave turned around) folds their
 * own height: the box around them follows that fold frame by frame.
 * @type {WeakSet<HTMLElement>}
 */
export declare const heightFolds: WeakSet<HTMLElement>;
export type SizeOptions = {
    /**
     * which added elements arrive the theme's way when no `data-kp-arrive` says otherwise: every one (`all`, the default), only those that are not a repaint of a row that just left under the same key (`new`), or none
     */
    arrive?: 'all' | 'new' | 'none';
    /**
     * more attributes that carry a row's stable id, read before `data-kp-key`, `data-kp-row-key` and `id`
     */
    arriveKeys?: readonly string[];
};
/**
 * @typedef {object} SizeOptions
 * @property {'all' | 'new' | 'none'} [arrive] which added elements arrive the theme's way when no `data-kp-arrive` says otherwise: every one (`all`, the default), only those that are not a repaint of a row that just left under the same key (`new`), or none
 * @property {readonly string[]} [arriveKeys] more attributes that carry a row's stable id, read before `data-kp-key`, `data-kp-row-key` and `id`
 */
/**
 * Ease `box` to its new height whenever what is in it changes size, in both
 * directions; a change during a glide continues from where the box is.
 * @param {HTMLElement} box
 * @param {SizeOptions} [options]
 * @returns {() => void}
 */
export declare function easeSize(box: HTMLElement, { arrive: fallback, arriveKeys }?: SizeOptions): () => void;
/**
 * Unfold a `<details>` from its summary's height to its open height, and
 * fold it back before `open` goes away.
 * @param {HTMLDetailsElement} details
 * @returns {() => void}
 */
export declare function attachFold(details: HTMLDetailsElement): () => void;
