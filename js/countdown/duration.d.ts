/**
 * A length in seconds from "90", "25m", "1h30m", "45s", "25:00" or "1:30:00".
 * @param {string | number | null | undefined} value
 * @returns {number} seconds, 0 when unreadable
 */
export declare function parseDuration(value: string | number | null | undefined): number;
/**
 * The digits of a time left, rounded up to the second: "25:00", "0:08", "1:02:03".
 * @param {number} ms the time left
 * @param {boolean} hours whether the timer shows hours (it holds an hour or more)
 * @param {boolean} [days] whether 24 hours or more is written with a days unit ("6 d 22 h"); off, it reads "167:59:59"
 */
export declare function formatCountdown(ms: number, hours: boolean, days?: boolean): string;
