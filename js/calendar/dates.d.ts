/** Two digits. @param {number} n */
export declare const two: (n: number) => string;
/** @param {number} y @param {number} m 1-12 @param {number} d */
export declare const isoOf: (y: number, m: number, d: number) => string;
/**
 * The day a moment falls on in `timeZone`, as `YYYY-MM-DD`: the wall clock of
 * that zone decides, so 22:30 UTC on 4 October is the 5th in Brussels.
 * @param {number} ms
 * @param {string} [timeZone]
 * @returns {string}
 */
export declare function dayKey(ms: number, timeZone?: string): string;
/** A date as a person reads it (rule 52): `2026-10-04` → `04/10/2026`. @param {string} iso */
export declare const formatDayKey: (iso: string) => string;
/**
 * The day `days` after `iso` (before, when negative), on the calendar: no
 * clock is involved, so a change to summer time moves nothing.
 * @param {string} iso `YYYY-MM-DD`
 * @param {number} days
 * @returns {string}
 */
export declare function shiftDay(iso: string, days: number): string;
/**
 * The same day `months` later (earlier, when negative), clamped to that
 * month's last day: 31/01 plus a month is 28/02.
 * @param {string} iso `YYYY-MM-DD`
 * @param {number} months
 * @returns {string}
 */
export declare function shiftMonth(iso: string, months: number): string;
/** Where `iso` falls in a week that starts on `firstDay`: 0 … 6. @param {string} iso @param {number} firstDay 0 = Sunday */
export declare const weekday: (iso: string, firstDay: number) => number;
/**
 * The 42 days a month's grid shows: six weeks from the first day of the week
 * on or before the month's first, so every month is six rows tall.
 * @param {number} year
 * @param {number} month 1-12
 * @param {number} [firstDay] the week's first day, 0 (Sunday) to 6; Monday by default
 * @returns {string[]} `YYYY-MM-DD`, oldest first
 */
export declare function monthCells(year: number, month: number, firstDay?: number): string[];
