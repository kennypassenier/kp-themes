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
