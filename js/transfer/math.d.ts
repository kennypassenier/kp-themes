/**
 * Moving-average speed in bytes per second over the last `windowS` seconds of samples; null with fewer than two.
 * @param {{ t: number, done: number }[]} samples oldest first
 * @param {number} windowS
 * @returns {number | null}
 */
export declare function transferRate(samples: {
    t: number;
    done: number;
}[], windowS?: number): number | null;
/**
 * The time left in human words, coarse so it does not shimmer: exact under 10 s, to 5 s under a minute, to the minute under
 * an hour.
 * @param {number} seconds
 * @returns {string}
 */
export declare function transferEta(seconds: number): string;
