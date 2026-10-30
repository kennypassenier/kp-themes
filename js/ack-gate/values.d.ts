/** The gates this module drives. */
export declare const ACK_GATE = "[data-kp-ack]";
/** Fired on the gate when its tick changes: `{ key, checked, remaining, at }`. */
export declare const ACK_EVENT = "kp-ack-change";
/** Fired on the gate when its Retry is pressed. */
export declare const ACK_RETRY_EVENT = "kp-ack-retry";
/** The pause before the live region says what changed, so a burst of changes is said once, in ms. */
export declare const SAY_DELAY_MS = 40;
/** The slack added to a `data-kp-ack-min-ms` wait before the gate repaints, in ms. */
export declare const WAIT_SLACK_MS = 20;
