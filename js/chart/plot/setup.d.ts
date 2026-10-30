export type ChartData = import('../words.js').ChartData;
export type ChartDecorate = import('../words.js').ChartDecorate;
export type ChartPoint = import('../words.js').ChartPoint;
export type ChartTimeContext = import('../words.js').ChartTimeContext;
export type ChartTimeStyle = import('../words.js').ChartTimeStyle;
export type ChartValueWhere = import('../words.js').ChartValueWhere;
export type PlotContext = import('./context.js').PlotContext;
export type SetupFields = {
    annKey: HTMLElement;
    axisMemo: {
        key: string;
        axis: {
            stride: number;
            ticks: number[];
        };
    };
    behind: boolean;
    brush: {
        x0: number;
        x1: number;
    } | null;
    clip: string;
    cursor: number | null;
    data: ChartData;
    decorate: ChartDecorate | undefined;
    doc: Document;
    drawnFor: string;
    drawnKey: () => string;
    drawnWindow: string;
    fmt: (v: number, where: ChartValueWhere) => string;
    geo: {
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
    } | null;
    held: boolean;
    hint: HTMLElement;
    hot: number | null;
    items: {
        button: HTMLElement;
        value: HTMLElement;
    }[];
    key: () => string | undefined;
    keyMemo: string;
    kindsOff: Set<string>;
    label: () => string;
    legend: HTMLElement;
    medians: {
        si: number;
        label: string;
        v: number;
    }[];
    note: HTMLElement;
    parts: HTMLElement[];
    pin: HTMLElement;
    pinWord: HTMLElement;
    pinned: number | null;
    plot: HTMLElement;
    points: ChartPoint[][];
    readout: HTMLElement;
    release: HTMLElement;
    sel: Set<number>;
    showAll: HTMLElement;
    shown: string;
    skeleton: boolean;
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
    time: (ms: number, style: ChartTimeStyle, ctx: ChartTimeContext) => string;
    tip: HTMLElement;
    tipEvents: HTMLElement;
    tipFoot: HTMLElement;
    tipMedian: HTMLElement;
    tipRows: HTMLElement;
    tipTime: HTMLElement;
};
/** @typedef {import('../words.js').ChartData} ChartData */
/** @typedef {import('../words.js').ChartDecorate} ChartDecorate */
/** @typedef {import('../words.js').ChartPoint} ChartPoint */
/** @typedef {import('../words.js').ChartTimeContext} ChartTimeContext */
/** @typedef {import('../words.js').ChartTimeStyle} ChartTimeStyle */
/** @typedef {import('../words.js').ChartValueWhere} ChartValueWhere */
/** @typedef {import('./context.js').PlotContext} PlotContext */
/**
 * What the the chart's mutable state and the elements it draws into part adds to the table's context.
 *
 * @typedef {{
 *     annKey: HTMLElement;
 *     axisMemo: { key: string; axis: { stride: number; ticks: number[]; }; };
 *     behind: boolean;
 *     brush: { x0: number; x1: number; } | null;
 *     clip: string;
 *     cursor: number | null;
 *     data: ChartData;
 *     decorate: ChartDecorate | undefined;
 *     doc: Document;
 *     drawnFor: string;
 *     drawnKey: () => string;
 *     drawnWindow: string;
 *     fmt: (v: number, where: ChartValueWhere) => string;
 *     geo: { x: (t: number) => number; inv: (px: number) => number; W: number; P: { l: number; r: number; t: number; b: number; }; from: number; to: number; svg: SVGSVGElement; } | null;
 *     held: boolean;
 *     hint: HTMLElement;
 *     hot: number | null;
 *     items: { button: HTMLElement; value: HTMLElement; }[];
 *     key: () => string | undefined;
 *     keyMemo: string;
 *     kindsOff: Set<string>;
 *     label: () => string;
 *     legend: HTMLElement;
 *     medians: { si: number; label: string; v: number; }[];
 *     note: HTMLElement;
 *     parts: HTMLElement[];
 *     pin: HTMLElement;
 *     pinWord: HTMLElement;
 *     pinned: number | null;
 *     plot: HTMLElement;
 *     points: ChartPoint[][];
 *     readout: HTMLElement;
 *     release: HTMLElement;
 *     sel: Set<number>;
 *     showAll: HTMLElement;
 *     shown: string;
 *     skeleton: boolean;
 *     strings: { plot: (label: string) => string; spark: (label: string) => string; sources: (label: string) => string; source: (label: string) => string; showAll: string; showAllTitle: string; hintPointer: string; hintTouch: string; pinned: string; release: string; change: string; open: string; mark: (label: string, time: string) => string; zoomed: (from: string, to: string) => string; zoomedSpan: (span: string) => string; zoomedByEnds: boolean; reset: string; resetTitle: string; up: string; down: string; same: string; now: string; empty: string; retry: string; trendFailed: string; onePoint: string; loading: string; pinnedOutside: string; today: string; yesterday: string; trendKeys: string; median: string; few: (have: number, need: number, unit: string) => string; fewUnit: string; keyLabel: string; kindTone: (tone: string) => string; runsKey: string; markBand: (label: string, from: string, until: string) => string; bandWhen: (from: string, until: string) => string; edgeBefore: (count: number) => string; edgeAfter: (count: number) => string; kindOn: (kind: string) => string; };
 *     time: (ms: number, style: ChartTimeStyle, ctx: ChartTimeContext) => string;
 *     tip: HTMLElement;
 *     tipEvents: HTMLElement;
 *     tipFoot: HTMLElement;
 *     tipMedian: HTMLElement;
 *     tipRows: HTMLElement;
 *     tipTime: HTMLElement;
 * }} SetupFields
 */
/**
 * The chart's mutable state and the elements it draws into.
 *
 * @param {PlotContext} c
 */
export declare function installSetup(c: PlotContext): void;
