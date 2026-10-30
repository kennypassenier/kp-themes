// The full chart: its plotting closure.
import { ChartGroup } from './group.js';
import { installSetup } from './plot/setup.js';
import { installReaders } from './plot/readers.js';
import { installLegend } from './plot/legend.js';
import { installDraw } from './plot/draw.js';
import { installTip } from './plot/tip.js';
import { installPointer } from './plot/pointer.js';
import { installApi } from './plot/api.js';
/** @typedef {import('./plot/context.js').PlotContext} PlotContext */
/** @typedef {import('./api.js').ChartContext} ChartContext */
/** @typedef {import('./api.js').ChartState} ChartState */

/**
 * The full chart: axes, sources, events, legend, tooltip, readout.
 * @param {HTMLElement} host
 * @param {ChartGroup} group
 * @param {string} locale
 * @param {ChartContext} ctx
 * @returns {ChartState}
 */
export function plotChart(host, group, locale, ctx) {
    const c = /** @type {PlotContext} */ (/** @type {unknown} */ ({ host, ctx, locale, group }));
    installSetup(c);
    installReaders(c);
    installLegend(c);
    installDraw(c);
    installTip(c);
    installPointer(c);
    installApi(c);
    return c.state;
}
