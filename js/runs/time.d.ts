/**
 * A moment's distance from now in the coarsest honest words: "in 35 min", "in 3 h 20 min", "in 2 days". Pure.
 * @param {number} ms the moment
 * @param {number} now
 * @param {import('../strings.js').Strings} [strings]
 */
export declare function runsRelative(ms: number, now: number, strings?: import('../strings.js').Strings): string;
/**
 * How far a zone's wall clock runs ahead of UTC at a moment, in minutes. Pure.
 * @param {number} ms @param {string} zone
 */
export declare function zoneOffset(ms: number, zone?: string): number;
/**
 * A run as rule 52 writes it with its weekday: "Mon 20/10/2026 03:00". Pure.
 * @param {number} ms @param {string} [zone] @param {string} [locale]
 */
export declare function runMoment(ms: number, zone?: string, locale?: string): string;
/**
 * The hours the clock was turned between two runs: positive when it went forward. 0 when it was not. Pure.
 * @param {number} before @param {number} after @param {string} [zone]
 */
export declare function clockShift(before: number, after: number, zone?: string): number;
