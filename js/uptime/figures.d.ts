export type UptimeFigures = import('./types.js').UptimeFigures;
export type UptimePeriod = import('./types.js').UptimePeriod;
/** @typedef {import('./types.js').UptimeFigures} UptimeFigures */
/** @typedef {import('./types.js').UptimePeriod} UptimePeriod */
/**
 * The window's figures from its periods.
 * @param {readonly UptimePeriod[]} periods
 * @returns {UptimeFigures}
 */
export declare function uptimeFigures(periods: readonly UptimePeriod[]): UptimeFigures;
/**
 * A share as a percentage with one decimal, cut rather than rounded, so a window with any time down never reads 100.
 * @param {number} share 0 to 1
 * @returns {string} "99.4", "99.0", "100", "0"
 */
export declare function uptimePercent(share: number): string;
/**
 * How many of `count` cells fit in `width` px, each at least `min` px with `gap` px between.
 * @param {number} count @param {number} width @param {number} min @param {number} gap
 * @returns {number}
 */
export declare function uptimeFit(count: number, width: number, min: number, gap: number): number;
