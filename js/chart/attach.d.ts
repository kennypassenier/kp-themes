export type ChartContext = import('./api.js').ChartContext;
export type ChartData = import('./words.js').ChartData;
export type ChartOptions = import('./words.js').ChartOptions;
export type ChartSeries = import('./words.js').ChartSeries;
export type ChartState = import('./api.js').ChartState;
export type ChartValueWhere = import('./words.js').ChartValueWhere;
/** @typedef {import('./api.js').ChartContext} ChartContext */
/** @typedef {import('./words.js').ChartData} ChartData */
/** @typedef {import('./words.js').ChartOptions} ChartOptions */
/** @typedef {import('./words.js').ChartSeries} ChartSeries */
/** @typedef {import('./api.js').ChartState} ChartState */
/** @typedef {import('./words.js').ChartValueWhere} ChartValueWhere */
/**
 * Draw every `[data-kp-chart]` under `root` and wire it: the charts of one
 * `[data-kp-chart-group]` (or, outside any group, all the others on the
 * page) share their crosshair, zoom and range, also with charts an earlier
 * or a later call attached. A chart's data comes from its JSON child or from
 * setChartData(), before or after this runs.
 * Every time is printed as dd/mm/yyyy HH:mm (or a part of it) on a 24-hour
 * clock in `timeZone`, Europe/Brussels by default, whatever the page's
 * language (rule 52); `time` prints them another way.
 * @param {ParentNode} [root]
 * @param {ChartOptions} [options] `strings`: any of the dictionary's `chart…` words for these charts only;
 *   `locale`: the numbers, else the nearest `lang` above each group; `timeZone`: the zone of every printed time
 *   and of the time axis; `time`: prints every time itself (`(ms, style, ctx) => string`); `format`: prints
 *   values itself (`(v, where, chart) => string`); `decorate`: marks every control a chart builds
 * @returns {() => void} detach: these charts taken away (detachChart() each)
 */
export declare function attachCharts(root?: ParentNode, options?: ChartOptions): () => void;
/**
 * Draw only the key figures' trends under `root` (`TREND_CHART`), with the
 * options attachCharts() takes; for a page that wires its trends apart from
 * its other charts. attachCharts() draws them too.
 * @param {ParentNode} [root]
 * @param {ChartOptions} [options]
 * @returns {() => void} detach
 */
export declare function attachTrendCharts(root?: ParentNode, options?: ChartOptions): () => void;
/**
 * The colour hooks of source `i` on an element: `data-kp-series` (1-5, its
 * `--chart-n`), `data-kp-dash` from the sixth on, or the series' own colour.
 * @param {Element} el
 * @param {ChartSeries} series
 * @param {number} i
 */
export declare function paintSeries(el: Element, series: ChartSeries, i: number): void;
/**
 * A chart's value printer: the page's `format` first, else formatChartValue().
 * @param {string} locale
 * @param {ChartContext} ctx
 * @param {() => ChartData} current the chart's data now
 * @returns {(v: number, where: ChartValueWhere) => string}
 */
export declare function valueFormat(locale: string, ctx: ChartContext, current: () => ChartData): (v: number, where: ChartValueWhere) => string;
/**
 * A plot's height: its data's, else `--kp-chart-height` on the chart (px or
 * rem), else 168.
 * @param {HTMLElement} host
 * @param {ChartData} data
 */
export declare function chartHeight(host: HTMLElement, data: ChartData): number;
