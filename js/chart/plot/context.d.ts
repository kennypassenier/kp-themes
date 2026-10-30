/** @typedef {import('./setup.js').SetupFields} SetupFields */
/** @typedef {import('./readers.js').ReadersFields} ReadersFields */
/** @typedef {import('./legend.js').LegendFields} LegendFields */
/** @typedef {import('./draw.js').DrawFields} DrawFields */
/** @typedef {import('./tip.js').TipFields} TipFields */
/** @typedef {import('./api.js').ApiFields} ApiFields */
/** @typedef {import('../api.js').ChartContext} ChartContext */
/** @typedef {import('../group.js').ChartGroup} ChartGroup */
export type SetupFields = import('./setup.js').SetupFields;
export type ReadersFields = import('./readers.js').ReadersFields;
export type LegendFields = import('./legend.js').LegendFields;
export type DrawFields = import('./draw.js').DrawFields;
export type TipFields = import('./tip.js').TipFields;
export type ApiFields = import('./api.js').ApiFields;
export type ChartContext = import('../api.js').ChartContext;
export type ChartGroup = import('../group.js').ChartGroup;
export type BaseFields = {
    ctx: ChartContext;
    group: ChartGroup;
    host: HTMLElement;
    locale: string;
};
export type PlotContext = BaseFields & SetupFields & ReadersFields & LegendFields & DrawFields & TipFields & ApiFields;
/**
 * What exists before any part runs: the arguments, the guards' bindings and what the enclosing function holds.
 *
 * @typedef {{
 *     ctx: ChartContext;
 *     group: ChartGroup;
 *     host: HTMLElement;
 *     locale: string;
 * }} BaseFields
 */
/**
 * What the parts of one full chart share: its state, its elements and the functions that draw it.
 *
 * @typedef {BaseFields &
 *     SetupFields &
 *     ReadersFields &
 *     LegendFields &
 *     DrawFields &
 *     TipFields &
 *     ApiFields} PlotContext
 */
export {};
