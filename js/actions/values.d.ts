/** A row's button box. */
export declare const ROW_ACTIONS = ".kp-row-actions";
/** A list or table whose rows' buttons share columns. */
export declare const ACTION_LIST = ".kp-action-list, table";
/** A list whose rows the keyboard walks. */
export declare const ROW_KEYS = "[data-kp-row-keys]";
/** Fired on a row, bubbling, when Enter is pressed on the row itself: `{ row }`. */
export declare const ROW_OPEN_EVENT = "kp-row-open";
/** On the actions host: the key that moves to the next row (a key spec, js/key-spec.js; `none` for none; the Down arrow always works). */
export declare const ROW_NEXT_KEY_ATTRIBUTE = "data-kp-row-next-key";
/** The key that moves to the next row when the host names none. */
export declare const ROW_NEXT_KEY = "j";
/** On the actions host: the key that moves to the previous row (the Up arrow always works). */
export declare const ROW_PREV_KEY_ATTRIBUTE = "data-kp-row-prev-key";
/** The key that moves to the previous row when the host names none. */
export declare const ROW_PREV_KEY = "k";
