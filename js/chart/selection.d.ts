/** @typedef {import('./words.js').ChartPoint} ChartPoint */
/** @typedef {import('./words.js').ChartSeries} ChartSeries */
export type ChartPoint = import('./words.js').ChartPoint;
export type ChartSeries = import('./words.js').ChartSeries;
/**
 * The index of the point nearest to `t` (the points oldest first).
 * @param {readonly ChartPoint[]} points
 * @param {number} t
 */
export declare function indexAt(points: readonly ChartPoint[], t: number): number;
/**
 * A source's change over the hour before point `i`: its value there minus
 * the value an hour of points earlier (or the first point).
 * @param {readonly ChartPoint[]} points
 * @param {number} i
 */
export declare function hourChange(points: readonly ChartPoint[], i: number): number;
/**
 * The legend's selection after a click on source `i` of `n`: on or off,
 * several allowed; all on is the same as none (everything shown).
 * @param {ReadonlySet<number>} sel
 * @param {number} i
 * @param {number} n
 * @returns {Set<number>}
 */
export declare function toggleSource(sel: ReadonlySet<number>, i: number, n: number): Set<number>;
/**
 * The legend's selection after chartSelect(el, index, on): `null` shows
 * every source again; without `on` source `index` toggles, as a click does;
 * with `on` it is put on or off. Null when nothing changes (an index outside
 * `0..n-1`, or a source already as asked).
 * @param {ReadonlySet<number>} sel
 * @param {number | null} index
 * @param {number} n the number of sources
 * @param {boolean} [on]
 * @returns {Set<number> | null}
 */
export declare function nextSelection(sel: ReadonlySet<number>, index: number | null, n: number, on?: boolean): Set<number> | null;
/**
 * A series' points, whichever way it was given.
 * @param {ChartSeries} series
 * @returns {ChartPoint[]}
 */
export declare function pointsOf(series: ChartSeries): ChartPoint[];
