/** Dispatched when an alarm closes, bubbling, on its trigger (or the document): `{ reason, id }`. */
export declare const ALARM_CLOSE_EVENT = "kp-alarm-close";
/** Dispatched on the alarm, bubbling, once it is open: `{ id, mode }`. */
export declare const ALARM_OPEN_EVENT = "kp-alarm-open";
/** How long an auto alarm stays when the caller names no `seconds`. An operational knob. */
export declare const ALARM_SECONDS = 8;
/** How often the countdown writes its share. Fast enough for a smooth bar, far below any flash rate: the bar only shrinks. */
export declare const TICK_MS = 100;
/** Milliseconds in a second. */
export declare const SECOND_MS = 1000;
