export type ChartPoint = import('../words.js').ChartPoint;
export type PlotContext = import('./context.js').PlotContext;
export type DrawFields = {
    draw: () => void;
};
/** @typedef {import('../words.js').ChartPoint} ChartPoint */
/** @typedef {import('./context.js').PlotContext} PlotContext */
/**
 * What the draws the chart: the state plate and the plot itself part adds to the table's context.
 *
 * @typedef {{
 *     draw: () => void;
 * }} DrawFields
 */
/**
 * Draws the chart: the state plate and the plot itself.
 *
 * @param {PlotContext} c
 */
export declare function installDraw(c: PlotContext): void;
