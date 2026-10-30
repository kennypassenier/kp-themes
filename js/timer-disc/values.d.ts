/** A visual timer. */
export declare const TIMER_DISC = "[data-kp-timer-disc], [data-kp-timer-disc-until]";
/** The custom property the disc is drawn by: 1 full, 0 gone. */
export declare const TIMER_DISC_LEFT = "--kp-timer-disc-left";
/** The options the disc reads again when one of them changes (js/live-options.js) [gaps-time-1019]. */
export declare const WATCHED_OPTIONS: string[];
/** The options that start the clock over when they change. */
export declare const RESTARTING_OPTIONS: string[];
/** Milliseconds in a minute and in a second. */
export declare const MINUTE_MS = 60000;
export declare const SECOND_MS = 1000;
/** The edge is written only when it moved a tenth of a degree: this many tenths make a turn. */
export declare const TENTHS_OF_A_TURN = 3600;
/** The fill is never quicker than this, so it can be seen [ms]. */
export declare const MIN_FILL_MS = 240;
/** The fill's time when the theme names none [s], and what that is in ms. */
export declare const DEFAULT_FILL_S = 0.2;
export declare const FALLBACK_FILL_MS = 200;
