/** A week agenda: `section.kp-week[data-kp-week]`. */
export declare const WEEK = "[data-kp-week]";
/** Fired on the agenda, bubbling, when an item was opened: `detail` `{ id, event, source: 'pointer' | 'keyboard' }`. */
export declare const WEEK_OPEN_EVENT = "kp-week-open";
/** Fired on the agenda, bubbling, when a week button moved the range: `detail` `{ start: 'YYYY-MM-DD', source: 'nav' }`. */
export declare const WEEK_RANGE_EVENT = "kp-week-range";
/** How often the now-line and the past marks move, in ms. */
export declare const WEEK_TICK_MS = 30000;
/** Fired on the agenda, bubbling, when the Retry of its failed state is pressed [state-plates-1019]. */
export declare const WEEK_RETRY_EVENT = "kp-week-retry";
/** The gap between two stacked pills, px. */
export declare const GAP = 2;
/** The hours the axis names. */
export declare const AXIS_HOURS: number[];
