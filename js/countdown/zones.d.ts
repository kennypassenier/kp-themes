/**
 * The IANA zone a timer is given in: `attribute` (`data-kp-countdown-timezone`, `data-kp-timer-disc-timezone`) on it or an
 * ancestor; null (the device) when none or unknown.
 * @param {Element} el @param {string} attribute
 */
export declare function timerZone(el: Element, attribute: string): string | null;
/**
 * The wall-clock parts of `ms` in a zone.
 * @param {number} ms @param {import('./constants.js').UntilZone} zone
 * @returns {{ year: number, month: number, day: number, hour: number, minute: number, second: number }}
 */
export declare function wallParts(ms: number, zone: import('./constants.js').UntilZone): {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
};
/**
 * The moment a wall-clock time names in a zone (the earlier one when the clock runs it twice; the next valid one when the
 * clock skips it).
 * @param {number} year @param {number} month @param {number} day @param {number} hour @param {number} minute @param {number} second
 * @param {import('./constants.js').UntilZone} zone
 */
export declare function zonedMoment(year: number, month: number, day: number, hour: number, minute: number, second: number, zone: import('./constants.js').UntilZone): number;
/** The fixed offset, in minutes, a date and time string carries ("Z", "+02:00"); null when it carries none. @param {string} text */
export declare function untilOffset(text: string): number | null;
/**
 * The zone an `until` value is given in: the offset it carries, else the timer's zone, else the device.
 * @param {string | number | null | undefined} value @param {string | null} [timeZone]
 * @returns {import('./constants.js').UntilZone}
 */
export declare function untilZone(value: string | number | null | undefined, timeZone?: string | null): import('./constants.js').UntilZone;
