/** A ticking line. */
export declare const AGO = "[data-kp-ago]";
/** The zone a moment is written in, whatever the reader's (rule 52). */
export declare const FRESHNESS_TIME_ZONE = "Europe/Brussels";
/** Milliseconds in a second; the one timer repaints every line this often. */
export declare const MS_PER_SECOND = 1000;
export declare const TICK_MS = 1000;
/** The seconds in a minute, an hour and a day: where the units change. */
export declare const SECONDS: {
    minute: number;
    hour: number;
    day: number;
};
/** The widest age a line shows in days ("99 days 23 h"), for the width it reserves. */
export declare const WIDEST_DAYS = 99;
/** The hours that go with them. */
export declare const WIDEST_HOURS = 23;
/** The attributes whose change repaints a line. */
export declare const AGO_OBSERVED: string[];
