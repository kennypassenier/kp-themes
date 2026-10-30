/**
 * The moment an `until` option names, in epoch ms: "14:30" or "14:30:15" is the next such time on the clock of `timeZone`
 * (the device's when none; today when it is still ahead, else tomorrow), a date and time is that moment (read in `timeZone`
 * when it carries no offset of its own), a number of 10 digits or more is epoch ms.
 * @param {string | number | null | undefined} value
 * @param {number} nowMs
 * @param {string | null} [timeZone] an IANA zone name
 * @returns {number | null} null when the value names no moment
 */
export declare function parseUntil(value: string | number | null | undefined, nowMs: number, timeZone?: string | null): number | null;
/**
 * A moment as the words after "until": "14:30" when it is today, else "20/10/2026 09:00", read on the clock of `zone`
 * (the zone the moment was given in; the device's when null).
 * @param {number} ms @param {number} nowMs @param {import('./constants.js').UntilZone} [zone]
 */
export declare function untilLabel(ms: number, nowMs: number, zone?: import('./constants.js').UntilZone): string;
