export type DaylineItem = import('./constants.js').DaylineItem;
export type Placed = import('./constants.js').Placed;
/** @typedef {import('./constants.js').DaylineItem} DaylineItem */
/** @typedef {import('./constants.js').Placed} Placed */
/** `HH:MM` → minutes after midnight, or null. @param {string | null | undefined} text @returns {number | null} */
export declare function toMinutes(text: string | null | undefined): number | null;
/** Minutes after midnight (wrapped into one day) → `HH:MM`. @param {number} minutes */
export declare function clockOf(minutes: number): string;
/** The minute of the day timeline a clock time stands at, 0 at the day's start hour. @param {number} clock @param {number} startHour */
export declare const dayMinute: (clock: number, startHour: number) => number;
/** The clock time of a minute of the day timeline. @param {number} minute @param {number} startHour */
export declare const clockAt: (minute: number, startHour: number) => string;
/** A whole number in a range, or the fallback. @param {string | null} text @param {number} min @param {number} max @param {number} fallback */
export declare function intIn(text: string | null, min: number, max: number, fallback: number): number;
/** The step: a divisor of 60 between 5 and 60, else the default. @param {string | null} text */
export declare function stepOf(text: string | null): number;
/**
 * The hold time, read as a time in any unit (`350ms`, `0.4s`, `350` as milliseconds, `0.01m`), from 0 (a finger lifts at once:
 * a page whose day does not scroll) to 2 s; anything else is the package's long press, 500 ms.
 * @param {string | null} text
 */
export declare function holdOf(text: string | null): number;
/**
 * Place every timed item on the grid of `rowsTotal` rows of `step` minutes, and give the items that overlap their lanes.
 * @param {readonly DaylineItem[]} items @param {{ startHour: number, step: number, rowsTotal: number }} grid
 * @returns {Placed[]}
 */
export declare function placeItems(items: readonly DaylineItem[], { startHour, step, rowsTotal }: {
    startHour: number;
    step: number;
    rowsTotal: number;
}): Placed[];
