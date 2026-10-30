export type AvailabilityColumn = import('./types.js').AvailabilityColumn;
/** @typedef {import('./types.js').AvailabilityColumn} AvailabilityColumn */
/**
 * Day columns in rule 52: `Sat 21/6`, with the long date under it.
 * @param {string} start an ISO date `2026-06-19`
 * @param {number} count
 * @param {string} [zone]
 * @returns {AvailabilityColumn[]}
 */
export declare function availabilityDays(start: string, count: number, zone?: string): AvailabilityColumn[];
/**
 * A proposed period as one column: `21 to 23 Jun`, with its length under it.
 * @param {string} start an ISO date @param {string} end an ISO date (the last day, inclusive)
 * @returns {AvailabilityColumn}
 */
export declare function availabilityRange(start: string, end: string): AvailabilityColumn;
