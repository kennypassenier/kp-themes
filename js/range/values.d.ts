/** A range picker. */
export declare const RANGE = "[data-kp-range]";
/** Fired on the picker when the window changes by a person: `{ preset, start, end, label }`. */
export declare const RANGE_EVENT = "kp-range-change";
/** The presets a picker offers when it does not say (`data-kp-range-presets`). */
export declare const RANGE_PRESETS: string[];
/** The length in ms of the unit letters of a preset: minute, hour, day, week. */
export declare const UNIT: {
    m: number;
    h: number;
    d: number;
    w: number;
};
/** How far past "now" an end may lie before it counts as the future (a minute of clock drift). */
export declare const FUTURE_SLACK_MS = 60000;
/**
 * A preset's length in ms ("24h", "7d", "90m", "2w"); 0 when unreadable.
 * @param {string} key
 */
export declare function presetMs(key: string): number;
/** @param {number} n */
export declare const two: (n: number) => string;
/**
 * A moment as rule 52 writes it, in a zone: "16/10/2026 14:05".
 * @param {number} ms @param {string} [timeZone]
 */
export declare function rangeMoment(ms: number, timeZone?: string): string;
/**
 * A time typed as "14:05", "1405", "14.05" or "9"; null when it is not a time of day.
 * @param {string} text
 * @returns {{ hour: number, minute: number } | null}
 */
export declare function parseTime(text: string): {
    hour: number;
    minute: number;
} | null;
/**
 * What is wrong with a custom window, as dictionary keys; empty when it is right.
 * @param {number | null} start @param {number | null} end @param {{ now: number, future?: boolean, maxDays?: number }} rules
 * @returns {('order' | 'future' | 'span')[]}
 */
export declare function rangeFaults(start: number | null, end: number | null, { now, future, maxDays }: {
    now: number;
    future?: boolean;
    maxDays?: number;
}): ('order' | 'future' | 'span')[];
