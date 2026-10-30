/** An upload and its three parts. */
export declare const UPLOAD = "[data-kp-upload]";
export declare const UPLOAD_INPUT = "[data-kp-upload-input]";
export declare const UPLOAD_ZONE = "[data-kp-upload-zone]";
export declare const UPLOAD_LIST = "[data-kp-upload-list]";
/** Fired for each accepted file. A contract value [TH26]: the detail carries the File and its row. */
export declare const FILE_EVENT = "kp-upload-file";
/** Fired for a file the zone refused: `{ file, reason, item }`. */
export declare const REJECT_EVENT = "kp-upload-reject";
/** Fired on the row before it is removed, cancelable: `{ file, item }`. */
export declare const REMOVE_EVENT = "kp-upload-remove";
/** The look of a row's remove button when the page names none. */
export declare const REMOVE_CLASS = "kp-button kp-button--ghost";
/** What a row's remove button shows when the page names no words. */
export declare const REMOVE_GLYPH = "\u00D7";
/** A progress bar's end, in percent. */
export declare const PERCENT = 100;
