/** @param {Date} date */
export declare function toISO(date: Date): string;
/**
 * A date as a locale writes it. `toDutch` remains for the consumers that
 * imported it in 1.x; it is `formatDate(date, 'nl-NL')`.
 *
 * @param {Date} date
 * @param {string} [locale]
 */
export declare function formatLocalDate(date: Date, locale?: string): string;
/** @deprecated since 3.0.0 — `formatLocalDate(date, 'nl-NL')`. @param {Date} date */
export declare function toDutch(date: Date): string;
/**
 * Read what someone typed: ISO always, and the locale's own order for
 * the numeric form. "31-02-2026" is refused rather than rounded to 3
 * March, in every locale.
 *
 * @param {string} text
 * @param {string} [locale]
 * @returns {Date | null}
 */
export declare function parseDate(text: string, locale?: string): Date | null;
/** The first year of the block of twelve that holds `year`. @param {number} year */
export declare function yearBlockStart(year: number): number;
/**
 * A day of a month, the day kept where the month has it and the month's last
 * day otherwise: 31 January to February lands on the 28th, not in March.
 *
 * @param {number} year @param {number} month may run past 0-11 @param {number} day
 */
export declare function clampToMonth(year: number, month: number, day: number): Date;
/**
 * Whether a span of days lies wholly before the minimum or after the maximum:
 * a month or a year that still holds one day to choose stays a way in.
 *
 * @param {Date} from first day @param {Date} to last day @param {Date | null} min @param {Date | null} max
 */
export declare function outsideRange(from: Date, to: Date, min: Date | null, max: Date | null): boolean;
/**
 * How far a key moves the focus in a month or year grid, in cells; null for a
 * key the grid does not take. Arrows by a cell and a row, Home and End to the
 * ends of the row, PageUp and PageDown by twelve — the day grid's keys, one
 * size up. A move past the drawn grid crosses into the next year or block.
 *
 * @param {string} key @param {number} index the focused cell, 0-11
 * @returns {number | null}
 */
export declare function jumpMove(key: string, index: number): number | null;
