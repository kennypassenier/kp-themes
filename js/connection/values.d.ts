/** A connection banner. */
export declare const CONNECTION = "[data-kp-connection]";
/** Fired when the shown state changed. */
export declare const CONNECTION_STATE_EVENT = "kp-connection-state";
/** Fired when a try should be made. */
export declare const CONNECTION_RETRY_EVENT = "kp-connection-retry";
/** The states. */
export declare const CONNECTION_STATES: readonly ['online', 'offline', 'reconnecting', 'back', 'refused'];
/** A drop shorter than this shows nothing, and "Connected again" stays this long [ms]. */
export declare const DEFAULT_GRACE_MS = 3000;
export declare const DEFAULT_BACK_MS = 3000;
/** The seconds between automatic tries when the page names none; the last repeats. */
export declare const DEFAULT_DELAYS: number[];
/** How often the time to the next try is redrawn [ms]. */
export declare const TICK_MS = 500;
/** Milliseconds in a second. */
export declare const SECOND_MS = 1000;
