export type PlotContext = import('./context.js').PlotContext;
export type TipFields = {
    announce: () => void;
    paintLegend: () => void;
    paintTip: () => void;
};
/** @typedef {import('./context.js').PlotContext} PlotContext */
/**
 * What the the legend repaint, the tooltip and what the chart announces part adds to the table's context.
 *
 * @typedef {{
 *     announce: () => void;
 *     paintLegend: () => void;
 *     paintTip: () => void;
 * }} TipFields
 */
/**
 * The legend repaint, the tooltip and what the chart announces.
 *
 * @param {PlotContext} c
 */
export declare function installTip(c: PlotContext): void;
