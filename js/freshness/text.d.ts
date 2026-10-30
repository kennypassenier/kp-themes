export type Strings = import('../freshness.js').Strings;
/** @typedef {import('../freshness.js').Strings} Strings */
/**
 * A span of seconds in the units a person reads best: seconds under a
 * minute, minutes and seconds under an hour, hours and minutes under a day,
 * days and hours beyond; a zero second part is left out ("2 min"). With
 * `units: 'days'` a span of a day or more is whole days only ("97 days").
 * @param {number} seconds
 * @param {Strings} [strings]
 * @param {'days' | undefined} [units]
 * @returns {string}
 */
export declare function humanDuration(seconds: number, strings?: Strings, units?: 'days' | undefined): string;
/** The units option of a line: `days`, or none. @param {Element} el @returns {'days' | undefined} */
export declare const unitsOf: (el: Element) => 'days' | undefined;
/**
 * The line's words: "updated 12 s ago", or "not updated yet" with no moment.
 * A moment after `nowMs` reads 0 s.
 * @param {string} verb
 * @param {number | null | undefined} atMs
 * @param {number} nowMs
 * @param {Strings} [strings]
 * @param {'days' | undefined} [units] `days`: a day or more reads as whole days
 * @returns {string}
 */
export declare function agoText(verb: string, atMs: number | null | undefined, nowMs: number, strings?: Strings, units?: 'days' | undefined): string;
/**
 * A moment as a person reads it (rule 52): `dd/mm/yyyy HH:mm`, 24-hour, in
 * `timeZone`. The parts are read one by one, so no locale reorders or names
 * them.
 * @param {number} ms
 * @param {string} [timeZone]
 * @returns {string}
 */
export declare function agoMoment(ms: number, timeZone?: string): string;
/**
 * The moment an element carries, in ms, or null: its `datetime`, else the
 * value of `data-kp-ago` (ISO or milliseconds).
 * @param {Element} el
 * @returns {number | null}
 */
export declare function momentOf(el: Element): number | null;
