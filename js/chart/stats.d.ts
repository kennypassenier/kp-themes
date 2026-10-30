/**
 * The dash of the `i`-th source's line: none for the first five (each its
 * own `--chart-n`), one of three dashes when the colours come round again.
 * @param {number} i
 * @returns {0 | 1 | 2 | 3} 0 = solid
 */
export declare const dashOf: (i: number) => 0 | 1 | 2 | 3;
/**
 * "1h", "24h", "7d", "15m" in ms; anything else null.
 * @param {string | null | undefined} text
 * @returns {number | null}
 */
export declare function parseSpan(text: string | null | undefined): number | null;
/**
 * The median of a list of numbers (the mean of the two in the middle when
 * their count is even), or null for none [kpadopt5-people].
 * @param {readonly number[]} values
 * @returns {number | null}
 */
export declare function chartMedian(values: readonly number[]): number | null;
/**
 * The places of the points that belong to a run: six or more in a row on one
 * side of the median (the run-chart rule). A point exactly on the median
 * neither breaks a run nor counts in it.
 * @param {readonly number[]} values oldest first
 * @param {number} median
 * @param {number} [least] the run's least length, 6
 * @returns {Set<number>} indexes into `values`
 */
export declare function chartRuns(values: readonly number[], median: number, least?: number): Set<number>;
