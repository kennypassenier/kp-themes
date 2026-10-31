import { Controller } from '../../controller.js';
export type ChartContext = import('../api.js').ChartContext;
export type ChartState = import('../api.js').ChartState;
export type ChartGroup = import('../group.js').ChartGroup;
export type ChartData = import('../words.js').ChartData;
export type ChartEvent = import('../words.js').ChartEvent;
export type ChartPoint = import('../words.js').ChartPoint;
export type ChartWindow = import('../words.js').ChartWindow;
export type PlotOptions = {
    median: boolean;
    medianWords: string;
    runs: boolean;
    minPoints: number;
    minUnit: string;
    key: boolean;
    band: 'tint' | 'hatch' | 'bracket';
};
export type PlotGeometry = {
    x: (t: number) => number;
    inv: (px: number) => number;
    W: number;
    P: {
        l: number;
        r: number;
        t: number;
        b: number;
    };
    from: number;
    to: number;
    svg: SVGSVGElement;
};
export type PlotMedian = {
    si: number;
    label: string;
    v: number;
};
export type PlotSettings = {
    group: ChartGroup;
    locale: string;
    ctx: ChartContext;
};
/** @typedef {import('../api.js').ChartContext} ChartContext */
/** @typedef {import('../api.js').ChartState} ChartState */
/** @typedef {import('../group.js').ChartGroup} ChartGroup */
/** @typedef {import('../words.js').ChartData} ChartData */
/** @typedef {import('../words.js').ChartEvent} ChartEvent */
/** @typedef {import('../words.js').ChartPoint} ChartPoint */
/** @typedef {import('../words.js').ChartWindow} ChartWindow */
/** @typedef {{ median: boolean, medianWords: string, runs: boolean, minPoints: number, minUnit: string, key: boolean, band: 'tint' | 'hatch' | 'bracket' }} PlotOptions */
/** @typedef {{ x: (t: number) => number, inv: (px: number) => number, W: number, P: { l: number, r: number, t: number, b: number }, from: number, to: number, svg: SVGSVGElement }} PlotGeometry */
/** @typedef {{ si: number, label: string, v: number }} PlotMedian */
/** What plotChart() hands its controller. @typedef {{ group: ChartGroup, locale: string, ctx: ChartContext }} PlotSettings */
/**
 * The parts one chart draws into, detached.
 * @param {Document} doc
 * @param {ChartContext['strings']} strings
 */
declare function buildParts(doc: Document, strings: ChartContext['strings']): {
    plot: HTMLElement;
    tipTime: HTMLElement;
    release: HTMLElement;
    pinWord: HTMLElement;
    pin: HTMLElement;
    tipRows: HTMLElement;
    tipFoot: HTMLElement;
    tipEvents: HTMLElement;
    tip: HTMLElement;
    note: HTMLElement;
    readout: HTMLElement;
    legend: HTMLElement;
    showAll: HTMLElement;
    hint: HTMLElement;
    annKey: HTMLElement;
    tipMedian: HTMLElement;
    parts: HTMLElement[];
};
export type PlotParts = ReturnType<typeof buildParts>;
/** @typedef {ReturnType<typeof buildParts>} PlotParts */
export declare class PlotBase extends Controller {
    group: import("../group.js").ChartGroup;
    locale: string;
    ctx: import("../api.js").ChartContext;
    doc: Document;
    strings: {
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
    time: import("../words.js").ChartTimeFormat;
    decorate: import("../words.js").ChartDecorate | undefined;
    /** @type {ChartData} */
    data: ChartData;
    /** @type {ChartPoint[][]} */
    points: ChartPoint[][];
    fmt: (v: number, where: import("../attach.js").ChartValueWhere) => string;
    /** The sources the reader pressed; none is all shown. @type {Set<number>} */
    sel: Set<number>;
    /** The source the pointer or the focus is on. @type {number | null} */
    hot: number | null;
    /** @type {number | null} */
    pinned: number | null;
    /** @type {number | null} */
    cursor: number | null;
    /** @type {{ x0: number, x1: number } | null} */
    brush: {
        x0: number;
        x1: number;
    } | null;
    clip: string;
    /** The time axis of the last window drawn: a hover redraws, the window stays. */
    axisMemo: {
        key: string;
        axis: {
            stride: number;
            ticks: number[];
        };
    };
    /** The state the plot shows instead of lines, and its words, as last drawn. */
    shown: string;
    /** The window ('from to') the plot was last drawn in; '' while it shows a state instead. */
    drawnWindow: string;
    /** What the plot was last drawn for: its width, its height and the host attributes that change the drawing. */
    drawnFor: string;
    /** Held back while off screen (see ChartOptions.lazy); true from the moment a draw was skipped until the next. */
    held: boolean;
    behind: boolean;
    /** The kinds the reader switched off. @type {Set<string>} */
    kindsOff: Set<string>;
    /** What the key was last built from, so a redraw keeps the focused switch. */
    keyMemo: string;
    /** The median of each shown source, as last drawn. @type {PlotMedian[]} */
    medians: PlotMedian[];
    /** @type {{ button: HTMLElement, value: HTMLElement }[]} */
    items: {
        button: HTMLElement;
        value: HTMLElement;
    }[];
    /** The legend row holds skeletons while the chart loads. */
    skeleton: boolean;
    /** Where the last drawing put things; null while the plot shows a state. @type {PlotGeometry | null} */
    geo: PlotGeometry | null;
    /** The parts the chart draws into, built detached: `PlotChart.connect()` puts them in the host. */
    ui: {
        plot: HTMLElement;
        tipTime: HTMLElement;
        release: HTMLElement;
        pinWord: HTMLElement;
        pin: HTMLElement;
        tipRows: HTMLElement;
        tipFoot: HTMLElement;
        tipEvents: HTMLElement;
        tip: HTMLElement;
        note: HTMLElement;
        readout: HTMLElement;
        legend: HTMLElement;
        showAll: HTMLElement;
        hint: HTMLElement;
        annKey: HTMLElement;
        tipMedian: HTMLElement;
        parts: HTMLElement[];
    };
    /** What attachCharts() keeps for this chart (CHARTS) and its group holds; PlotChart builds it. @type {ChartState} */
    state: ChartState;
    /** @param {HTMLElement} host @param {Record<string, unknown>} [options] */
    constructor(host: HTMLElement, options?: Record<string, unknown>);
    label(): string;
    key(): string | undefined;
    /** What a drawing is for: the plot's width, its height and the host attributes that change the drawing. */
    drawnKey(): string;
    /** The indexes of the sources on view. */
    visible(): number[];
    /** @returns {ChartWindow | null} */
    range(): ChartWindow | null;
    /** @param {Set<number>} next */
    setSel(next: Set<number>): void;
    /** Mark the chart's own controls again (its key may have changed). */
    decorateOwn(): void;
    /** The tone an event is drawn in: its own, else its kind's, else info. @param {ChartEvent} ev */
    toneOf(ev: ChartEvent): "critical" | "info" | "warning";
    /** The key item an event belongs to: its kind, else its tone. @param {ChartEvent} ev */
    kindOf(ev: ChartEvent): string;
    /** @param {string} kind */
    kindWord(kind: string): string;
    /** The events the key has not switched off. */
    shownEvents(): import("../words.js").ChartEvent[];
    /** Reads a chart option from the data, else from the element's attribute. @returns {PlotOptions} */
    option(): PlotOptions;
    /** Whether the key's signature changed since the key was last built; remembers the new one. @param {string} signature */
    keyChanged(signature: string): boolean;
    /** Whether the plot shows something new instead of lines (said once, not on every redraw); remembers it. @param {string} shown */
    showsNew(shown: string): boolean;
    /** Show every source again. @returns {boolean} whether some were pressed */
    clearSelection(): boolean;
    /** The words in front of a median's value. @param {PlotOptions} opt */
    medianWords(opt: PlotOptions): string;
}
export {};
