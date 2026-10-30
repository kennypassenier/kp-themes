/** A picker with the usual on top. */
export declare const USUAL = "[data-kp-usual]";
/** Fired on the picker when something is picked: `{ value, from }`. */
export declare const USUAL_PICK_EVENT = "kp-usual-pick";
/** Fired on the picker, cancelable, before a typed name is added: `{ label, nearTo }`. */
export declare const USUAL_ADD_EVENT = "kp-usual-add";
/** Fired on the picker when an item's "Not today" is set or cleared: `{ value, on }`. */
export declare const USUAL_NOT_TODAY_EVENT = "kp-usual-not-today";
/** Fired on the picker when Retry is pressed on the plate of a list that could not be read. */
export declare const USUAL_RETRY_EVENT = "kp-usual-retry";
/** The states a picker can be in. */
export declare const USUAL_STATES: readonly ['ready', 'loading', 'empty', 'error'];
/** More items than this fold behind "Show all N" unless `data-kp-all` says otherwise. */
export declare const USUAL_FOLD_ABOVE = 12;
