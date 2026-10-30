export type ChartTimeUnit = import('./api.js').ChartTimeUnit;
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
     * `columns` draws one column per reading (a histogram: a count per bucket) instead of the line and its area;
     * columns of a stacked chart stand on each other [wish-1120, homelab 104]. Default `line`
     */
    shape?: 'line' | 'columns';
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
    /**
     * the app's own name for it ("operation", "update", "failure"); `kinds` maps it to a tone and a word
     */
    kind?: string;
    /**
     * ms: the event is a band from `at` to here (a maintenance window) instead of a line
     */
    until?: number;
};
export type ChartUnitKind = 'percent' | 'bytes' | 'bytes/s' | 'rate' | 'celsius' | 'count' | 'flag';
export type ChartValueWhere = 'axis' | 'tip' | 'delta' | 'legend' | 'readout' | 'spark';
export type ChartValueFormat = (v: number, where: ChartValueWhere, chart: ChartData) => string | null | undefined;
export type ChartPartKind = 'source' | 'show-all' | 'zoom-reset' | 'release' | 'plot' | 'range';
export type ChartDecorateInfo = {
    /**
     * which control: a legend `source`, `show-all`, a zoom chip's `zoom-reset`, a pinned
     * tooltip's `release` (✕), a chart's `plot`, a group's `range` button
     */
    kind: ChartPartKind;
    /**
     * the chart's element (for `range` the group's, for `zoom-reset` the chip)
     */
    host: Element;
    /**
     * the chart's `key` (or `data-kp-key`), or the group element's `data-kp-key`
     */
    key?: string;
    /**
     * `source`: the source's place in `series`
     */
    index?: number;
    /**
     * `source`: the source's label
     */
    label?: string;
    /**
     * `range`: the range, as `data-kp-chart-range` names it
     */
    value?: string;
};
export type ChartDecorate = (part: HTMLElement, info: ChartDecorateInfo) => void;
export type ChartData = {
    /**
     * the chart's name; else the element's `aria-label`
     */
    label?: string;
    /**
     * the chart's stable name for the page (written as `data-kp-key`, passed to `decorate`)
     */
    key?: string;
    /**
     * printed after a value ("bar", "m³/h"); not on the axis
     */
    unit?: string;
    /**
     * the value's kind, printed and scaled the dashboard's way, its unit on
     * the axis too; `unit` and `digits` then do nothing
     */
    unitKind?: ChartUnitKind;
    /**
     * fraction digits of a value; else by its size
     */
    digits?: number;
    /**
     * why there are no readings: shown in the plot, at its height, instead of the lines
     */
    error?: string;
    /**
     * a sentence under `error` on a key figure's trend (its failed plate; else the package's own)
     */
    errorText?: string;
    /**
     * a picture over the heading of a key figure's empty and failed trend plate
     */
    art?: Node | string | null;
    /**
     * while every source has a single reading, say so under the plot (`chartOnePoint`)
     */
    onePointNote?: boolean;
    series: ChartSeries[];
    events?: ChartEvent[];
    /**
     * what each event `kind` is called in the key, and its tone
     */
    kinds?: Record<string, {
        label?: string;
        tone?: 'critical' | 'warning' | 'info';
    }>;
    /**
     * a dashed median line per shown source; a string is the words in front of its value (`data-kp-chart-median`, `-median-label`)
     */
    median?: boolean | string;
    /**
     * `mark` rings the points of every run of six or more on one side of the median (`data-kp-chart-runs`)
     */
    runs?: 'off' | 'mark';
    /**
     * below this many readings the chart says it is too early for a trend (`data-kp-chart-min-points`)
     */
    minPoints?: number;
    /**
     * what the readings are called in that sentence ("days"; `data-kp-chart-min-unit`)
     */
    minUnit?: string;
    /**
     * how a band is drawn: a `tint` across the plot (default), `hatch` diagonal lines (readable without colour) or a `bracket` along the top with short ticks (`data-kp-chart-band`)
     */
    band?: 'tint' | 'hatch' | 'bracket';
    /**
     * false leaves the key above the plot out (`data-kp-chart-annotation-key="off"`)
     */
    annotationKey?: boolean;
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
     * a dashed line (an alarm level), or several: the first is the main one, the others are
     * drawn finer and dotted (a warning level beside the alarm) [wish-1120, homelab 104]
     */
    threshold?: number | readonly number[];
    /**
     * the unit of every time in this data (a point's time, a series' `start` and `step`, an event's `at` and
     * `until`, `from` and `to`): `ms` (default), `s`, `min`, `h`, `d` or `w` since the epoch (a step in the same unit), which the chart turns into
     * milliseconds itself. Months and years are not units: their length varies, so a month is given as the moment it starts. The element's
     * `data-kp-chart-time-unit` says the same for data given by markup [wish-1120, homelab 103]
     */
    timeUnit?: ChartTimeUnit;
    /**
     * sources on top of each other, as areas
     */
    stacked?: boolean;
    /**
     * px; else `--kp-chart-height` on the chart (px or rem), else 168
     */
    height?: number;
};
export type ChartWindow = {
    from: number;
    to: number;
};
export type ChartTimeStyle = 'clock' | 'tick' | 'full' | 'range';
export type ChartTimeContext = {
    /**
     * `tick`: the distance between two ticks, ms (a day or more: the ticks are dates)
     */
    stride?: number;
    /**
     * `range`: the zoom's start, ms
     */
    from?: number;
    /**
     * `range`: the zoom's end, ms
     */
    to?: number;
};
export type ChartTimeFormat = (ms: number, style: ChartTimeStyle, ctx: ChartTimeContext) => string;
export type ChartOptions = {
    /**
     * any of the dictionary's `chart…` words, for these charts only
     */
    strings?: Partial<Strings>;
    /**
     * the numbers; else the nearest `lang` above each group
     */
    locale?: string;
    /**
     * the IANA zone every printed time is in and the time axis is aligned to;
     * `Europe/Brussels` by default
     */
    timeZone?: string;
    /**
     * prints every time itself; `numericTime(timeZone)` by default
     */
    time?: ChartTimeFormat;
    /**
     * prints values itself, `(v, where, chart) => string`; anything but a
     * string falls back to formatChartValue()
     */
    format?: ChartValueFormat;
    /**
     * called with every control a chart builds, each time it builds it (a
     * rebuilt legend included), so the page can mark it
     */
    decorate?: ChartDecorate;
    /**
     * draw the plots that are off screen only when they come into view, so a page of many
     * charts feeds in one short task instead of one long one. A number is how many charts one call must attach before it starts
     * (`12` by default); `true` always, `false` never. Each chart keeps its footprint (the loading plate) until it is drawn.
     * Per chart, `data-kp-chart-lazy="off"` draws it at once. Needs `IntersectionObserver`; without it every chart draws at once
     */
    lazy?: boolean | number;
    /**
     * the moment a trend's axis counts from (`now`, `today`, `yesterday`);
     * `Date.now()` by default
     */
    now?: () => number;
};
export type ChartStrings = ReturnType<typeof chartWords>;
export type Strings = import('../strings.js').Strings;
/** @typedef {import('./api.js').ChartTimeUnit} ChartTimeUnit */
/**
 * @typedef {[number, number]} ChartPoint time (ms since the epoch), value
 * @typedef {object} ChartSeries
 * @property {string} label
 * @property {ChartPoint[]} [points] oldest first
 * @property {number} [start] with `step` and `values`: evenly spaced points, compact in JSON
 * @property {number} [step] ms
 * @property {number[]} [values]
 * @property {string} [colour] the consumer's own colour (`var(--…)`) instead of the next `--chart-n`
 * @property {'line' | 'columns'} [shape] `columns` draws one column per reading (a histogram: a count per bucket) instead of the line and its area;
 *   columns of a stacked chart stand on each other [wish-1120, homelab 104]. Default `line`
 * @property {number} [total] shown in the legend while no time is under the crosshair
 * @typedef {object} ChartEvent
 * @property {number} at ms since the epoch
 * @property {string} label
 * @property {'critical' | 'warning' | 'info'} [tone]
 * @property {string} [href] offered once the event is pinned
 * @property {string} [kind] the app's own name for it ("operation", "update", "failure"); `kinds` maps it to a tone and a word
 * @property {number} [until] ms: the event is a band from `at` to here (a maintenance window) instead of a line
 * @typedef {'percent' | 'bytes' | 'bytes/s' | 'rate' | 'celsius' | 'count' | 'flag'} ChartUnitKind a value's kind:
 *   `bytes` and `bytes/s` (`rate` is the same) in binary steps, B to PiB; `percent` with an axis of 10, 25, 50 or
 *   100 (above 100 only when a value is); `celsius` whole degrees; `count` and `flag` exact numbers, abbreviated
 *   (`12.3k`) on the axis only
 * @typedef {'axis' | 'tip' | 'delta' | 'legend' | 'readout' | 'spark'} ChartValueWhere where a value is printed:
 *   `axis` a y-axis label, `tip` the tooltip's value, `delta` the tooltip's change over the hour before (its size),
 *   `legend` a legend button's value, `readout` what a screen reader hears, `spark` the spark variant's value
 * @typedef {(v: number, where: ChartValueWhere, chart: ChartData) => string | null | undefined} ChartValueFormat
 *   prints a value itself; anything but a string leaves it to the chart
 * @typedef {'source' | 'show-all' | 'zoom-reset' | 'release' | 'plot' | 'range'} ChartPartKind
 * @typedef {object} ChartDecorateInfo
 * @property {ChartPartKind} kind which control: a legend `source`, `show-all`, a zoom chip's `zoom-reset`, a pinned
 *   tooltip's `release` (✕), a chart's `plot`, a group's `range` button
 * @property {Element} host the chart's element (for `range` the group's, for `zoom-reset` the chip)
 * @property {string} [key] the chart's `key` (or `data-kp-key`), or the group element's `data-kp-key`
 * @property {number} [index] `source`: the source's place in `series`
 * @property {string} [label] `source`: the source's label
 * @property {string} [value] `range`: the range, as `data-kp-chart-range` names it
 * @typedef {(part: HTMLElement, info: ChartDecorateInfo) => void} ChartDecorate
 * @typedef {object} ChartData
 * @property {string} [label] the chart's name; else the element's `aria-label`
 * @property {string} [key] the chart's stable name for the page (written as `data-kp-key`, passed to `decorate`)
 * @property {string} [unit] printed after a value ("bar", "m³/h"); not on the axis
 * @property {ChartUnitKind} [unitKind] the value's kind, printed and scaled the dashboard's way, its unit on
 *   the axis too; `unit` and `digits` then do nothing
 * @property {number} [digits] fraction digits of a value; else by its size
 * @property {string} [error] why there are no readings: shown in the plot, at its height, instead of the lines
 * @property {string} [errorText] a sentence under `error` on a key figure's trend (its failed plate; else the package's own)
 * @property {Node | string | null} [art] a picture over the heading of a key figure's empty and failed trend plate
 * @property {boolean} [onePointNote] while every source has a single reading, say so under the plot (`chartOnePoint`)
 * @property {ChartSeries[]} series
 * @property {ChartEvent[]} [events]
 * @property {Record<string, { label?: string, tone?: 'critical' | 'warning' | 'info' }>} [kinds] what each event `kind` is called in the key, and its tone
 * @property {boolean | string} [median] a dashed median line per shown source; a string is the words in front of its value (`data-kp-chart-median`, `-median-label`)
 * @property {'off' | 'mark'} [runs] `mark` rings the points of every run of six or more on one side of the median (`data-kp-chart-runs`)
 * @property {number} [minPoints] below this many readings the chart says it is too early for a trend (`data-kp-chart-min-points`)
 * @property {string} [minUnit] what the readings are called in that sentence ("days"; `data-kp-chart-min-unit`)
 * @property {'tint' | 'hatch' | 'bracket'} [band] how a band is drawn: a `tint` across the plot (default), `hatch` diagonal lines (readable without colour) or a `bracket` along the top with short ticks (`data-kp-chart-band`)
 * @property {boolean} [annotationKey] false leaves the key above the plot out (`data-kp-chart-annotation-key="off"`)
 * @property {number} [from] the window, when the group's range should not set it
 * @property {number} [to]
 * @property {number} [yMax] the top of the axis; else a round number above the highest value
 * @property {number | readonly number[]} [threshold] a dashed line (an alarm level), or several: the first is the main one, the others are
 *   drawn finer and dotted (a warning level beside the alarm) [wish-1120, homelab 104]
 * @property {ChartTimeUnit} [timeUnit] the unit of every time in this data (a point's time, a series' `start` and `step`, an event's `at` and
 *   `until`, `from` and `to`): `ms` (default), `s`, `min`, `h`, `d` or `w` since the epoch (a step in the same unit), which the chart turns into
 *   milliseconds itself. Months and years are not units: their length varies, so a month is given as the moment it starts. The element's
 *   `data-kp-chart-time-unit` says the same for data given by markup [wish-1120, homelab 103]
 * @property {boolean} [stacked] sources on top of each other, as areas
 * @property {number} [height] px; else `--kp-chart-height` on the chart (px or rem), else 168
 * @typedef {{ from: number, to: number }} ChartWindow
 * @typedef {'clock' | 'tick' | 'full' | 'range'} ChartTimeStyle where a time is printed: `clock` the crosshair's
 *   and an event line's time, `tick` a time-axis label, `full` the tooltip's head, a marker's title and the readout,
 *   `range` the zoom chip
 * @typedef {object} ChartTimeContext
 * @property {number} [stride] `tick`: the distance between two ticks, ms (a day or more: the ticks are dates)
 * @property {number} [from] `range`: the zoom's start, ms
 * @property {number} [to] `range`: the zoom's end, ms
 * @typedef {(ms: number, style: ChartTimeStyle, ctx: ChartTimeContext) => string} ChartTimeFormat
 * @typedef {object} ChartOptions
 * @property {Partial<Strings>} [strings] any of the dictionary's `chart…` words, for these charts only
 * @property {string} [locale] the numbers; else the nearest `lang` above each group
 * @property {string} [timeZone] the IANA zone every printed time is in and the time axis is aligned to;
 *   `Europe/Brussels` by default
 * @property {ChartTimeFormat} [time] prints every time itself; `numericTime(timeZone)` by default
 * @property {ChartValueFormat} [format] prints values itself, `(v, where, chart) => string`; anything but a
 *   string falls back to formatChartValue()
 * @property {ChartDecorate} [decorate] called with every control a chart builds, each time it builds it (a
 *   rebuilt legend included), so the page can mark it
 * @property {boolean | number} [lazy] draw the plots that are off screen only when they come into view, so a page of many
 *   charts feeds in one short task instead of one long one. A number is how many charts one call must attach before it starts
 *   (`12` by default); `true` always, `false` never. Each chart keeps its footprint (the loading plate) until it is drawn.
 *   Per chart, `data-kp-chart-lazy="off"` draws it at once. Needs `IntersectionObserver`; without it every chart draws at once
 * @property {() => number} [now] the moment a trend's axis counts from (`now`, `today`, `yesterday`);
 *   `Date.now()` by default
 * @typedef {ReturnType<typeof chartWords>} ChartStrings
 * @typedef {import('../strings.js').Strings} Strings
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
    zoomedSpan: (span: string) => string;
    zoomedByEnds: boolean;
    reset: string;
    resetTitle: string;
    up: string;
    down: string;
    same: string;
    now: string;
    empty: string;
    retry: string;
    trendFailed: string;
    onePoint: string;
    loading: string;
    pinnedOutside: string;
    today: string;
    yesterday: string;
    trendKeys: string;
    median: string;
    few: (have: number, need: number, unit: string) => string;
    fewUnit: string;
    keyLabel: string;
    kindTone: (tone: string) => string;
    runsKey: string;
    markBand: (label: string, from: string, until: string) => string;
    bandWhen: (from: string, until: string) => string;
    edgeBefore: (count: number) => string;
    edgeAfter: (count: number) => string;
    kindOn: (kind: string) => string;
};
