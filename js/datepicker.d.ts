/** Fired when a date is chosen or typed. A contract value [TH26]: the detail carries the ISO date. */
export declare const DATE_EVENT = "kp-date-change";
/** @param {Date} date */
export declare function toISO(date: Date): string;
/** @param {Date} date */
export declare function toDutch(date: Date): string;
/**
 * Read what someone typed. Accepts `4-9-2026`, `04-09-2026` and
 * `2026-09-04`, because insisting on one shape is how a date field earns
 * its reputation.
 *
 * @param {string} text
 * @returns {Date | null}
 */
export declare function parseDate(text: string): Date | null;
/**
 * @param {ParentNode} root
 * @returns {() => void} detach
 */
export declare function attachDatePickers(root?: ParentNode): () => void;
