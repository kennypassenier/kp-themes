export type ChartGroup = import('./group.js').ChartGroup;
export type ChartContext = import('./api.js').ChartContext;
export type ChartState = import('./api.js').ChartState;
/** @typedef {import('./group.js').ChartGroup} ChartGroup */
/** @typedef {import('./api.js').ChartContext} ChartContext */
/** @typedef {import('./api.js').ChartState} ChartState */
/**
 * The full chart: axes, sources, events, legend, tooltip, readout.
 * A chart whose wiring throws is taken away again and the error is thrown on, for attachCharts() to report.
 * @param {HTMLElement} host
 * @param {ChartGroup} group
 * @param {string} locale
 * @param {ChartContext} ctx
 * @returns {ChartState}
 */
export declare function plotChart(host: HTMLElement, group: ChartGroup, locale: string, ctx: ChartContext): ChartState;
/**
 * Wire a chart's controller and hand back its state. A chart whose wiring throws is taken away again and the error is thrown on,
 * for attachCharts() to report.
 * @param {import('../controller.js').Controller & { state: ChartState }} chart
 * @returns {ChartState}
 */
export declare function startChart(chart: import('../controller.js').Controller & {
    state: ChartState;
}): ChartState;
