import { ChartGroup } from './group.js';
export type ChartContext = import('./api.js').ChartContext;
export type ChartData = import('./words.js').ChartData;
export type ChartPoint = import('./words.js').ChartPoint;
export type ChartSeries = import('./words.js').ChartSeries;
export type ChartState = import('./api.js').ChartState;
/** @typedef {import('./api.js').ChartContext} ChartContext */
/** @typedef {import('./words.js').ChartData} ChartData */
/** @typedef {import('./words.js').ChartPoint} ChartPoint */
/** @typedef {import('./words.js').ChartSeries} ChartSeries */
/** @typedef {import('./api.js').ChartState} ChartState */
/**
 * The spark variant: one source's last 24 hours as a tile's sparkline
 * (drawSparkline(), the KPI tile's own drawing), on the group's crosshair,
 * with its value at the crosshair (or now) beside its name.
 * @param {HTMLElement} host
 * @param {ChartGroup} group
 * @param {string} locale
 * @param {ChartContext} ctx
 * @returns {ChartState}
 */
export declare function sparkChart(host: HTMLElement, group: ChartGroup, locale: string, ctx: ChartContext): ChartState;
/**
 * The axis row under a trend, when the spark asks for one
 * (`data-kp-spark-axis="relative"`): where the line starts and where it ends.
 * @param {HTMLElement} host
 * @returns {{ row: HTMLElement, from: HTMLElement, to: HTMLElement, read: HTMLElement } | null}
 */
export declare function trendAxisRow(host: HTMLElement): {
    row: HTMLElement;
    from: HTMLElement;
    to: HTMLElement;
    read: HTMLElement;
} | null;
/**
 * trendAxis() for a spark's points, in its chart context.
 * @param {readonly ChartPoint[]} pts
 * @param {ChartSeries | undefined} series
 * @param {ChartContext} ctx
 */
export declare function trendWords(pts: readonly ChartPoint[], series: ChartSeries | undefined, ctx: ChartContext): [string, string];
