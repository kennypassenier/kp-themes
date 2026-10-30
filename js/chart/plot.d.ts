import { ChartGroup } from './group.js';
export type PlotContext = import('./plot/context.js').PlotContext;
export type ChartContext = import('./api.js').ChartContext;
export type ChartState = import('./api.js').ChartState;
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
export declare function plotChart(host: HTMLElement, group: ChartGroup, locale: string, ctx: ChartContext): ChartState;
