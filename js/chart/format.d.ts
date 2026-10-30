/** @typedef {import('./words.js').ChartData} ChartData */
/** @typedef {import('./words.js').ChartUnitKind} ChartUnitKind */
/** @typedef {import('./words.js').ChartValueWhere} ChartValueWhere */
export type ChartData = import('./words.js').ChartData;
export type ChartUnitKind = import('./words.js').ChartUnitKind;
export type ChartValueWhere = import('./words.js').ChartValueWhere;
/**
 * The top of the y axis: a round number just above the highest value. For
 * `percent` 10, 25, 50 or 100 (above 100 the round number, so nothing is
 * cut off); for `bytes` and `bytes/s` round in the binary unit the value is
 * printed in (2 GiB, not 1.86).
 * @param {number} v
 * @param {ChartUnitKind} [kind]
 * @returns {number}
 */
export declare function niceMax(v: number, kind?: ChartUnitKind): number;
/**
 * A value as a chart prints it, without a page's own `format`. With a
 * `unitKind`: `percent` one decimal under 10 (`7.5%`, `42%`, `0%`); `bytes`
 * in binary steps, a decimal under 100 of a unit (`512 B`, `1.5 GiB`,
 * `120 MiB`); `bytes/s` (or `rate`) the same per second (`3.2 MiB/s`);
 * `celsius` whole degrees (`54 °C`); `count` and `flag` exact and grouped
 * (`12,345`), on the axis only abbreviated (`12.3k`). The axis carries the
 * unit for a unit kind. Without one: `digits` (else by size) and `unit`
 * after it, not on the axis.
 * @param {number} v
 * @param {ChartValueWhere} [where]
 * @param {Pick<ChartData, 'unit' | 'unitKind' | 'digits'>} [data]
 * @param {string} [locale] the numbers' grouping and decimal sign; `en-GB` by default
 */
export declare function formatChartValue(v: number, where?: ChartValueWhere, data?: Pick<ChartData, 'unit' | 'unitKind' | 'digits'>, locale?: string): string;
