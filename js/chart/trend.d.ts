export type ChartContext = import('./api.js').ChartContext;
export type ChartState = import('./api.js').ChartState;
export type ChartGroup = import('./group.js').ChartGroup;
/** @typedef {import('./api.js').ChartContext} ChartContext */
/** @typedef {import('./api.js').ChartState} ChartState */
/** @typedef {import('./group.js').ChartGroup} ChartGroup */
/**
 * The spark variant as a key figure's 24-hour trend
 * (`data-kp-spark-head="none"`): no name and value line; a pointer, a finger
 * or the arrow keys read one point, with a crosshair and a chip over the line
 * (its moment and value, kept inside the trend; the value under the moment
 * when the two do not fit on one line, and in the axis row when even that
 * does not fit). The trend keeps its own crosshair, not the group's. A click
 * that was not a drag follows the tile's `.kp-kpi__link`. The plot is a tab
 * stop only while there are two points or more. Loading (no data yet, or
 * `data-kp-chart-loading`) keeps the trend empty at its height and marks the
 * tile `aria-busy`.
 * @param {HTMLElement} host
 * @param {ChartGroup} group
 * @param {string} locale
 * @param {ChartContext} ctx
 * @returns {ChartState}
 */
export declare function trendChart(host: HTMLElement, group: ChartGroup, locale: string, ctx: ChartContext): ChartState;
