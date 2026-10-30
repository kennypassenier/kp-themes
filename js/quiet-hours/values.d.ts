/** The controls this module looks after. */
export declare const QUIET = "[data-kp-quiet]";
/** Fired on the control when a person changes it: `{ value, summary, valid }`. */
export declare const QUIET_EVENT = "kp-quiet-change";
/** The severities, most serious first, when the page names none. */
export declare const QUIET_SEVERITIES: readonly ['critical', 'warning', 'info', 'ok'];
export type QuietValue = import('../quiet-hours.js').QuietValue;
/** @typedef {import('../quiet-hours.js').QuietValue} QuietValue */
/** @type {QuietValue} */
export declare const DEFAULT: QuietValue;
/** The options the control reads again when they change. */
export declare const WATCHED_OPTIONS: string[];
/** The time fields step by this many minutes when the page names none. */
export declare const DEFAULT_STEP = "15";
/** The bars the loading state shows. */
export declare const WAIT_BONES = 4;
