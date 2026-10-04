/** A chart: `data-kp-chart` (a plot) or `data-kp-chart="spark"`. */
export declare const CHART = "[data-kp-chart]";
/** Charts that share one crosshair, one zoom and one range. */
export declare const CHART_GROUP = "[data-kp-chart-group]";
/** Fired on a chart, bubbling, when its sources on change: `detail.on`, indexes (none = all shown). */
export declare const CHART_SELECT_EVENT = "kp-chart-select";
/** Fired on a group, bubbling, when its zoom changes: `detail` `{ from, to }` or null. */
export declare const CHART_ZOOM_EVENT = "kp-chart-zoom";
/** Fired on a group, bubbling, when a range button is pressed, before the charts redraw: `detail` `{ range, span }`. */
export declare const CHART_RANGE_EVENT = "kp-chart-range";
export type ChartPoint = [number, number];
export type ChartSeries = {
    label: string;
    /**
     * oldest first
     */
    points?: ChartPoint[];
    /**
     * with `step` and `values`: evenly spaced points, compact in JSON
     */
    start?: number;
    /**
     * ms
     */
    step?: number;
    values?: number[];
    /**
     * the consumer's own colour (`var(--…)`) instead of the next `--chart-n`
     */
    colour?: string;
    /**
     * shown in the legend while no time is under the crosshair
     */
    total?: number;
};
export type ChartEvent = {
    /**
     * ms since the epoch
     */
    at: number;
    label: string;
    tone?: 'critical' | 'warning' | 'info';
    /**
     * offered once the event is pinned
     */
    href?: string;
};
export type ChartData = {
    /**
     * the chart's name; else the element's `aria-label`
     */
    label?: string;
    /**
     * printed after a value ("bar", "m³/h")
     */
    unit?: string;
    /**
     * fraction digits of a value; else by its size
     */
    digits?: number;
    series: ChartSeries[];
    events?: ChartEvent[];
    /**
     * the window, when the group's range should not set it
     */
    from?: number;
    to?: number;
    /**
     * the top of the axis; else a round number above the highest value
     */
    yMax?: number;
    /**
     * a dashed line (an alarm level)
     */
    threshold?: number;
    /**
     * sources on top of each other, as areas
     */
    stacked?: boolean;
    /**
     * px, 168 by default
     */
    height?: number;
};
export type ChartWindow = {
    from: number;
    to: number;
};
export type ChartStrings = ReturnType<typeof chartWords>;
export type Strings = import('./strings.js').Strings;
/**
 * @typedef {[number, number]} ChartPoint time (ms since the epoch), value
 * @typedef {object} ChartSeries
 * @property {string} label
 * @property {ChartPoint[]} [points] oldest first
 * @property {number} [start] with `step` and `values`: evenly spaced points, compact in JSON
 * @property {number} [step] ms
 * @property {number[]} [values]
 * @property {string} [colour] the consumer's own colour (`var(--…)`) instead of the next `--chart-n`
 * @property {number} [total] shown in the legend while no time is under the crosshair
 * @typedef {object} ChartEvent
 * @property {number} at ms since the epoch
 * @property {string} label
 * @property {'critical' | 'warning' | 'info'} [tone]
 * @property {string} [href] offered once the event is pinned
 * @typedef {object} ChartData
 * @property {string} [label] the chart's name; else the element's `aria-label`
 * @property {string} [unit] printed after a value ("bar", "m³/h")
 * @property {number} [digits] fraction digits of a value; else by its size
 * @property {ChartSeries[]} series
 * @property {ChartEvent[]} [events]
 * @property {number} [from] the window, when the group's range should not set it
 * @property {number} [to]
 * @property {number} [yMax] the top of the axis; else a round number above the highest value
 * @property {number} [threshold] a dashed line (an alarm level)
 * @property {boolean} [stacked] sources on top of each other, as areas
 * @property {number} [height] px, 168 by default
 * @typedef {{ from: number, to: number }} ChartWindow
 * @typedef {ReturnType<typeof chartWords>} ChartStrings
 * @typedef {import('./strings.js').Strings} Strings
 */
/**
 * The words a chart says, from the dictionary (`chart…` in js/strings.js),
 * with the caller's own on top: `attachCharts(root, { strings })` takes any
 * of the dictionary's keys.
 * @param {Partial<Strings>} [overrides]
 */
export declare function chartWords(overrides?: Partial<Strings>): {
    plot: (label: string) => string;
    spark: (label: string) => string;
    sources: (label: string) => string;
    source: (label: string) => string;
    showAll: string;
    showAllTitle: string;
    hintPointer: string;
    hintTouch: string;
    pinned: string;
    release: string;
    change: string;
    open: string;
    mark: (label: string, time: string) => string;
    zoomed: (from: string, to: string) => string;
    reset: string;
    resetTitle: string;
    up: string;
    down: string;
    same: string;
    now: string;
};
/**
 * The dash of the `i`-th source's line: none for the first five (each its
 * own `--chart-n`), one of three dashes when the colours come round again.
 * @param {number} i
 * @returns {0 | 1 | 2 | 3} 0 = solid
 */
export declare const dashOf: (i: number) => 0 | 1 | 2 | 3;
/**
 * "1h", "24h", "7d", "15m" in ms; anything else null.
 * @param {string | null | undefined} text
 * @returns {number | null}
 */
export declare function parseSpan(text: string | null | undefined): number | null;
/**
 * The top of the y axis: a round number just above the highest value.
 * @param {number} v
 */
export declare function niceMax(v: number): number;
/**
 * The index of the point nearest to `t` (the points oldest first).
 * @param {readonly ChartPoint[]} points
 * @param {number} t
 */
export declare function indexAt(points: readonly ChartPoint[], t: number): number;
/**
 * A source's change over the hour before point `i`: its value there minus
 * the value an hour of points earlier (or the first point).
 * @param {readonly ChartPoint[]} points
 * @param {number} i
 */
export declare function hourChange(points: readonly ChartPoint[], i: number): number;
/**
 * The legend's selection after a click on source `i` of `n`: on or off,
 * several allowed; all on is the same as none (everything shown).
 * @param {ReadonlySet<number>} sel
 * @param {number} i
 * @param {number} n
 * @returns {Set<number>}
 */
export declare function toggleSource(sel: ReadonlySet<number>, i: number, n: number): Set<number>;
/**
 * A series' points, whichever way it was given.
 * @param {ChartSeries} series
 * @returns {ChartPoint[]}
 */
export declare function pointsOf(series: ChartSeries): ChartPoint[];
export type ChartState = {
    host: HTMLElement;
    spark: boolean;
    draw: () => void;
    cursorAt: (t: number | null, own: boolean) => void;
    setData: (data: ChartData) => void;
    lastTime: () => number | null;
    destroy: () => void;
};
/**
 * @typedef {object} ChartState
 * @property {HTMLElement} host
 * @property {boolean} spark
 * @property {() => void} draw
 * @property {(t: number | null, own: boolean) => void} cursorAt
 * @property {(data: ChartData) => void} setData
 * @property {() => number | null} lastTime
 * @property {() => void} destroy
 */
/**
 * Give a chart its sources and events (the page's own data). Before the chart
 * is attached the data waits for it; a `<script type="application/json"
 * data-kp-chart-data>` child is the markup way to do the same.
 * @param {Element} el the `[data-kp-chart]` element
 * @param {ChartData} data
 */
export declare function setChartData(el: Element, data: ChartData): void;
/**
 * Draw every `[data-kp-chart]` under `root` and wire it: the charts of one
 * `[data-kp-chart-group]` (or, outside any group, all the others under
 * `root`) share their crosshair, zoom and range. A chart's data comes from
 * its JSON child or from setChartData(), before or after this runs.
 * @param {ParentNode} [root]
 * @param {{ strings?: Partial<Strings>, locale?: string }} [options] `strings`: any of the dictionary's `chart…` words for these charts only;
 *   `locale`: the clock and the numbers, else the nearest `lang` above each group
 * @returns {() => void} detach: listeners off, the drawn parts removed
 */
export declare function attachCharts(root?: ParentNode, options?: {
    strings?: Partial<Strings>;
    locale?: string;
}): () => void;
