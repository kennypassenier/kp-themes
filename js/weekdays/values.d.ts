/** A weekday picker. */
export declare const WEEKDAYS = "[data-kp-weekdays]";
/** Fired on the picker when the days change by a person: `{ values, summary, valid }`. */
export declare const WEEKDAYS_EVENT = "kp-weekdays-change";
/** The quick picks a week picker offers when it does not say. */
export declare const WEEKDAY_PRESETS: readonly ['weekdays', 'weekend', 'every'];
/** The days of the working week and of the weekend, in `Date#getDay` numbers. */
export declare const SETS: {
    weekdays: number[];
    weekend: number[];
    every: number[];
};
/** The English names a value may be written with, by day number. */
export declare const NAMES: string[];
/** Days in a week, and the days a month picker offers. */
export declare const WEEK = 7;
export declare const MONTH_DAYS = 31;
/** The fewest days a schedule needs when it does not say. */
export declare const DEFAULT_MIN = 1;
