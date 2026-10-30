/** The lists this module looks after. */
export declare const TIMERS = "[data-kp-timers]";
/** A button anywhere in the page that starts a timer. */
export declare const TIMER_START = "[data-kp-timer-start]";
export declare const TIMER_START_EVENT = "kp-timer-start";
export declare const TIMER_CHANGE_EVENT = "kp-timer-change";
export declare const TIMER_DONE_EVENT = "kp-timer-done";
export declare const TIMER_STOP_EVENT = "kp-timer-stop";
/** Fired on the list, bubbling, when the Retry of its failed state is pressed [r6r8-1019]. */
export declare const TIMERS_RETRY_EVENT = "kp-timers-retry";
/** How often the shown time is brought up to date [ms]; the time itself comes from the end, not from this. */
export declare const TIMER_TICK_MS = 250;
