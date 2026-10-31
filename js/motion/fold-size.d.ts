/** The value of `data-kp-folding` on what folds out of a box: it is gone from the box's layout once its fold has played. */
export declare const FOLDING_OUT = "out";
/**
 * The height `box` settles at once what folds out of it is gone: the
 * elements marked `[data-kp-folding="out"]` (a data table's rows while
 * they play their arrival backwards) are taken out of the flow for one
 * read. The box then glides shut while they play, the mirror of its glide
 * open while they arrived (Kenny's form v21, 2026-10-05: the table box
 * snapped shut once the rows had gone).
 * @param {HTMLElement} box
 */
export declare function settledHeight(box: HTMLElement): number;
/**
 * How long what folds out of `box` still plays, in ms: the box's glide
 * shut ends with it, as its glide open started with their arrival, so
 * frame t of the fold is frame (T - t) of the open.
 * @param {HTMLElement} box
 */
export declare function foldingOutFor(box: HTMLElement): number;
/**
 * Elements whose leave (or arrival as a leave turned around) folds their
 * own height: the box around them follows that fold frame by frame.
 * @type {WeakSet<HTMLElement>}
 */
export declare const heightFolds: WeakSet<HTMLElement>;
/**
 * Whether something drawn in `box` folds its own height now, which the box
 * follows instead of gliding. A fold sideways (a button in a cell) or of
 * something not drawn (a hidden list) is not the box's height folding: it
 * held every glide of the box for as long as the page's first arrivals
 * played, ten seconds on the catalogue's tables, and the table snapped open
 * and shut meanwhile.
 * @param {HTMLElement} box
 */
export declare const followsAFold: (box: HTMLElement) => boolean;
/**
 * Which arrivals play under `el`: its closest `data-kp-arrive` (`all`,
 * `new` or `none`), else the attach's own default.
 * @param {Element} el @param {string} fallback
 * @returns {string}
 */
export declare const arriveMode: (el: Element, fallback: string) => string;
/**
 * Whether what changes in `el` now is still its first render, which is not
 * news [fix-100]: until two frames are painted after motion attached to it,
 * and while it is under a root that is settling (js/as-of.js; js/auto.js
 * holds the page's root so until every module it fetched has drawn). In
 * that time nothing in it arrives and its box takes its size at once, as a
 * fold already took its first state at once. Since every opposite motion
 * became a mirror (fff6fe45) a first render arrived as a leave turned
 * around: 263 elements on the catalogue's index in one queue of about ten
 * seconds, the data table's pager folded to a third of its width and its
 * bar 186 px tall instead of 52 until the first click redrew it.
 * @param {Element} el
 * @returns {() => boolean}
 */
export declare function firstRender(el: Element): () => boolean;
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
