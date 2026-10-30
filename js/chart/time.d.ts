export type ChartPoint = import('./words.js').ChartPoint;
export type ChartTimeFormat = import('./words.js').ChartTimeFormat;
/** @typedef {import('./words.js').ChartPoint} ChartPoint */
/** @typedef {import('./words.js').ChartTimeFormat} ChartTimeFormat */
export declare const MINUTE = 60000;
export declare const HOUR: number;
/**
 * The wall-clock date and time of `ms` in `timeZone`, to the minute. An
 * unknown zone throws a RangeError (from Intl).
 * @param {number} ms
 * @param {string} [timeZone]
 * @returns {{ year: number, month: number, day: number, hour: number, minute: number }}
 */
export declare function wallTime(ms: number, timeZone?: string): {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
};
/**
 * The moment a wall-clock time in `timeZone` names: null when the clock
 * skips it (the hour lost when summer time starts); the earlier of the two
 * when the clock runs it twice (the hour gained when it ends).
 * @param {number} year
 * @param {number} month 1-12
 * @param {number} day
 * @param {number} hour
 * @param {number} minute
 * @param {string} [timeZone]
 * @returns {number | null}
 */
export declare function zonedTime(year: number, month: number, day: number, hour: number, minute: number, timeZone?: string): number | null;
/**
 * The built-in way a chart prints a time (rule 52): `clock` `14:05`, `full`
 * `04/10/2026 14:05`, `tick` `14:00` below a day's stride and `04/10/2026`
 * from a day on, `range` `14:00–16:30` within one day of `timeZone` and
 * `03/10/2026 22:00 – 04/10/2026 02:00` across days. 24-hour, day before
 * month, no weekday or month name, in whatever language the page is.
 * @param {string} [timeZone] an IANA zone, `Europe/Brussels` by default
 * @returns {ChartTimeFormat}
 */
export declare function numericTime(timeZone?: string): ChartTimeFormat;
/** What a trend's axis says while it has no line to name: two no-break spaces keep the row. */
export declare const BLANK = "\u00A0";
/**
 * The words under a key figure's trend (`data-kp-spark-axis="relative"`):
 * where it starts, as the first point's clock and its day (`14:40
 * yesterday`, `07:00 today`, or `08:10 02/10/2026` when older), and where it
 * ends: `now` while the last point is at most two steps old, else that
 * point's clock (`14:00`, with its day when it is not today's). Fewer than
 * two points: a no-break space each, so the row keeps its height. Days are
 * the wall clock's in `timeZone` (rule 52).
 * @param {readonly ChartPoint[]} points oldest first
 * @param {{ now: number, step?: number, timeZone?: string, time?: ChartTimeFormat,
 *   words?: { now: string, today: string, yesterday: string } }} context `step` is the points' spacing (10 min by
 *   default); `time` prints the clock and an older date (`numericTime(timeZone)` by default); `words` are the
 *   dictionary's `chartNow`, `chartToday` and `chartYesterday` unless given
 * @returns {[string, string]}
 */
export declare function trendAxis(points: readonly ChartPoint[], { now, step, timeZone, time, words }: {
    now: number;
    step?: number;
    timeZone?: string;
    time?: ChartTimeFormat;
    words?: {
        now: string;
        today: string;
        yesterday: string;
    };
}): [string, string];
/**
 * The distance between two time ticks over a window of `span`: the finest
 * the span allows (15 min up to 2 h, 30 min up to 4 h, 1 h up to 8 h, 3 h up
 * to 16 h, 6 h up to 1.2 days, a day beyond), coarser until no more than
 * `most` strides fit.
 * @param {number} span ms
 * @param {number} most
 */
export declare function tickStride(span: number, most: number): number;
/**
 * The time ticks of a window: round wall-clock times in `timeZone` (six-hour
 * ticks on 00:00, 06:00, 12:00 and 18:00, day ticks at midnight), worked out
 * one by one, so a change of the clock inside the window neither moves them
 * off the round hour nor prints an hour twice. Weeks start on a Monday.
 * @param {number} from ms
 * @param {number} to ms
 * @param {number} most the most strides that fit (the plot's width over 70 px)
 * @param {string} [timeZone]
 * @returns {{ stride: number, ticks: number[] }}
 */
export declare function timeTicks(from: number, to: number, most: number, timeZone?: string): {
    stride: number;
    ticks: number[];
};
