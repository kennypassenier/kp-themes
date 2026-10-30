export type ChartData = import('../words.js').ChartData;
export type ChartState = import('../api.js').ChartState;
export type PlotContext = import('./context.js').PlotContext;
export type ApiFields = {
    state: ChartState;
};
/** @typedef {import('../words.js').ChartData} ChartData */
/** @typedef {import('../api.js').ChartState} ChartState */
/** @typedef {import('./context.js').PlotContext} PlotContext */
/**
 * What the the chart's data setter and its public state object part adds to the table's context.
 *
 * @typedef {{
 *     state: ChartState;
 * }} ApiFields
 */
/**
 * The chart's data setter and its public state object.
 *
 * @param {PlotContext} c
 */
export declare function installApi(c: PlotContext): void;
