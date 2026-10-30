/** A next-times list. */
export declare const RUNS = "[data-kp-runs]";
/** Fired on the list, bubbling, when Try again is pressed: `{ element }`. */
export declare const RUNS_RETRY_EVENT = "kp-runs-retry";
/** The states a list can be in. */
export declare const RUNS_STATES: readonly ['ready', 'empty', 'loading', 'error'];
/** How many rows a list shows when it is not told. */
export declare const DEFAULT_COUNT = 3;
/** How often the relative words are refreshed [ms]. */
export declare const REFRESH_MS = 60000;
/** Seconds in a minute, and in a day. */
export declare const MINUTE_S = 60;
export declare const DAY_S = 86400;
/** Under this many seconds a run is "now". */
export declare const NOW_S = 30;
/** Milliseconds in a minute. */
export declare const MINUTE_MS = 60000;
