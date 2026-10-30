// The context the parts of one full chart share.
/** @typedef {import('./setup.js').SetupFields} SetupFields */
/** @typedef {import('./readers.js').ReadersFields} ReadersFields */
/** @typedef {import('./legend.js').LegendFields} LegendFields */
/** @typedef {import('./draw.js').DrawFields} DrawFields */
/** @typedef {import('./tip.js').TipFields} TipFields */
/** @typedef {import('./api.js').ApiFields} ApiFields */
/** @typedef {import('../api.js').ChartContext} ChartContext */
/** @typedef {import('../group.js').ChartGroup} ChartGroup */

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
