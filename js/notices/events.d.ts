/** A notification centre. */
export declare const NOTICES = "[data-kp-notices]";
export declare const NOTICE_FIX_EVENT = "kp-notice-fix";
export declare const NOTICE_READ_EVENT = "kp-notice-read";
export declare const NOTICES_READ_ALL_EVENT = "kp-notices-read-all";
export declare const NOTICES_SOURCE_EVENT = "kp-notices-source";
export declare const NOTICES_RETRY_EVENT = "kp-notices-retry";
export declare const NOTICES_END_QUIET_EVENT = "kp-notices-end-quiet";
export declare const NOTICES_INBOX_EVENT = "kp-notices-open-inbox";
/** The severities, worst first. */
export declare const NOTICE_SEVERITIES: readonly ['critical', 'warning', 'info'];
/** Newest notices per severity the panel shows when `data-kp-panel-max` does not say. */
export declare const PANEL_MAX = 10;
/** How long a toast for a new notice stays [ms]. */
export declare const TOAST_MS = 8000;
/** How soon `i` must follow `g` to open the Inbox [ms]. */
export declare const G_I_WINDOW_MS = 1200;
/** On the centre: the key that marks the focused notice read (a key spec, js/key-spec.js; `none` for no key). */
export declare const NOTICES_READ_KEY_ATTRIBUTE = "data-kp-notices-read-key";
/** The key that marks the focused notice read when the centre names none. */
export declare const NOTICES_READ_KEY = "m";
/** On the centre: the first key of the Inbox chord (a key spec, js/key-spec.js; `none` for no chord). */
export declare const NOTICES_GO_KEY_ATTRIBUTE = "data-kp-notices-go-key";
/** The first key of the chord that opens the Inbox when the centre names none. */
export declare const NOTICES_GO_KEY = "g";
/** On the centre: the second key of the Inbox chord, pressed within a moment of the first. */
export declare const NOTICES_INBOX_KEY_ATTRIBUTE = "data-kp-notices-inbox-key";
/** The second key of the chord that opens the Inbox when the centre names none. */
export declare const NOTICES_INBOX_KEY = "i";
