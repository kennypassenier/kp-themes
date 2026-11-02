/**
 * How many rows hold each value, in the order the values first appear.
 * @param {readonly string[]} values one per row
 * @returns {Map<string, number>}
 */
export declare function countValues(values: readonly string[]): Map<string, number>;
/**
 * The chips a column asks for: the header's own list when it gives one, else every value it holds in the reader's order.
 * @param {Map<string, number>} counts
 * @param {readonly string[] | null} declared the header's `data-kp-filter-options`
 * @param {string} [locale]
 * @returns {string[]}
 */
export declare function chipValues(counts: Map<string, number>, declared: readonly string[] | null, locale?: string): string[];
/**
 * The counts every chip shows: each value's rows, 0 for a value no row holds, and the total under the All item's value.
 * @param {Map<string, number>} counts @param {readonly string[]} values @param {string} allValue
 * @returns {Record<string, number>}
 */
export declare function chipCounts(counts: Map<string, number>, values: readonly string[], allValue: string): Record<string, number>;
