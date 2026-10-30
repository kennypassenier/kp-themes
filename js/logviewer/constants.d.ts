/** The viewers this module looks after. */
export declare const LOGVIEWER = "[data-kp-logviewer]";
/** Fired when the buffer, the filter or the find changes: `{ total, shown, dropped, matches, current }`. */
export declare const LOGVIEWER_EVENT = "kp-logviewer-change";
/** Fired by the Retry of a viewer whose source failed. */
export declare const LOGVIEWER_RETRY_EVENT = "kp-logviewer-retry";
/** The default cap of the ring buffer. */
export declare const LOGVIEWER_MAX = 2000;
/** The levels, lowest first. */
export declare const LOG_LEVELS: readonly string[];
