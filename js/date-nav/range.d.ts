export type DateNavMode = import('./constants.js').DateNavMode;
export type DateNavRange = import('./constants.js').DateNavRange;
/** @typedef {import('./constants.js').DateNavMode} DateNavMode */
/** @typedef {import('./constants.js').DateNavRange} DateNavRange */
/** A mode as the page wrote it, `month` for anything else. @param {string | null | undefined} text @returns {DateNavMode} */
export declare const modeOf: (text: string | null | undefined) => DateNavMode;
/** Whether a text is a day the navigation can stand on. @param {string | null | undefined} text */
export declare const isDay: (text: string | null | undefined) => boolean;
/**
 * The range `mode` shows around `at`: its month, its week (from `firstDay`, 0 = Sunday) or the day itself.
 * @param {DateNavMode} mode @param {string} at @param {number} firstDay
 * @returns {DateNavRange}
 */
export declare function rangeOf(mode: DateNavMode, at: string, firstDay: number): DateNavRange;
/**
 * The day one step away: a month, a week or a day, before (`-1`) or after (`1`).
 * A month step keeps the day of the month where it can (31 January + 1 month is 28 or 29 February).
 * @param {DateNavMode} mode @param {string} at @param {-1 | 1} direction
 */
export declare function stepFrom(mode: DateNavMode, at: string, direction: -1 | 1): string;
/** The ISO week number of a day (weeks from Monday; week 1 holds the year's first Thursday). @param {string} iso */
export declare function isoWeek(iso: string): number;
/**
 * What the navigation says it shows: "November 2026", "Week 45 · 02/11 to 08/11/2026", "Monday 02/11/2026".
 * @param {DateNavRange} range
 * @param {{ months: string[], weekdays: string[] }} names the locale's month names (January first) and weekday names (Sunday first)
 * @param {(n: number, from: string, to: string) => string} weekWords the dictionary's week label
 */
export declare function labelOf(range: DateNavRange, names: {
    months: string[];
    weekdays: string[];
}, weekWords: (n: number, from: string, to: string) => string): string;
/** Whether the range holds the day. @param {DateNavRange} range @param {string} day */
export declare const holds: (range: DateNavRange, day: string) => boolean;
