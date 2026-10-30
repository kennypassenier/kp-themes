/** A strip. */
export declare const UPTIME = "[data-kp-uptime]";
/** Fired on the strip when a cell is pressed: `{ key, index, period }`. */
export declare const UPTIME_PICK_EVENT = "kp-uptime-pick";
/** Fired on the strip, cancelable, before a period's quick info opens: `{ key, index, period, panel }`. */
export declare const UPTIME_OPEN_EVENT = "kp-uptime-open";
/** Fired on the strip, bubbling, when the Retry of its failed state is pressed [kyu-plates-1019]. */
export declare const UPTIME_RETRY_EVENT = "kp-uptime-retry";
/** A cell a person can press: a button, or a link to its period's page. */
export declare const CELL = ".kp-uptime__cell:is(button, a)";
/** The states of a period, in the order of how bad they are. */
export declare const UPTIME_STATES: readonly ['up', 'degraded', 'down', 'none'];
/** How many cells a strip waits with when the page has not said (`data-kp-uptime-count`). */
export declare const UPTIME_COUNT = 90;
