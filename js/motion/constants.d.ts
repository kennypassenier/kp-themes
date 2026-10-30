/** Any box a consumer wants eased, beside the components below. */
export declare const SIZE_ATTRIBUTE = "data-kp-size-motion";
/** The boxes that ease to a new size. */
export declare const SIZE_SELECTOR: string;
/** The disclosures that unfold and fold back. */
export declare const FOLD_SELECTOR = ".kp-accordion__item";
/**
 * The attributes that give a row its stable id, in the order they are read,
 * for `data-kp-arrive="new"` [port spec G]: a row added back under the key
 * of a row that just left is the same row, repainted.
 */
export declare const ARRIVE_KEYS: readonly string[];
/** A loading placeholder: what replaces one is the data it waited for, not news. */
export declare const SKELETON = ".kp-skeleton, [data-kp-skeleton]";
/**
 * How many dialogs, boxes and disclosures motion is watching right now. A
 * diagnostic: after a page removes its boxes it returns to where it was,
 * because a box that leaves the page is let go.
 * @returns {number}
 */
export declare function motionWatchCount(): number;
