export type ChartEvent = import('../words.js').ChartEvent;
export type ChartWindow = import('../words.js').ChartWindow;
export type PlotContext = import('./context.js').PlotContext;
export type ReadersFields = {
    decorateOwn: () => void;
    kindOf: (ev: ChartEvent) => string;
    kindWord: (kind: string) => string;
    option: () => {
        median: boolean;
        medianWords: string;
        runs: boolean;
        minPoints: number;
        minUnit: string;
        key: boolean;
        band: 'tint' | 'hatch' | 'bracket';
    };
    range: () => ChartWindow | null;
    setSel: (next: Set<number>) => void;
    shownEvents: () => ChartEvent[];
    toneOf: (ev: ChartEvent) => 'critical' | 'warning' | 'info';
    visible: () => number[];
};
/** @typedef {import('../words.js').ChartEvent} ChartEvent */
/** @typedef {import('../words.js').ChartWindow} ChartWindow */
/** @typedef {import('./context.js').PlotContext} PlotContext */
/**
 * What the small readers of the chart's state: visible series, window, tones and options part adds to the table's context.
 *
 * @typedef {{
 *     decorateOwn: () => void;
 *     kindOf: (ev: ChartEvent) => string;
 *     kindWord: (kind: string) => string;
 *     option: () => { median: boolean; medianWords: string; runs: boolean; minPoints: number; minUnit: string; key: boolean; band: 'tint' | 'hatch' | 'bracket'; };
 *     range: () => ChartWindow | null;
 *     setSel: (next: Set<number>) => void;
 *     shownEvents: () => ChartEvent[];
 *     toneOf: (ev: ChartEvent) => 'critical' | 'warning' | 'info';
 *     visible: () => number[];
 * }} ReadersFields
 */
/**
 * Small readers of the chart's state: visible series, window, tones and options.
 *
 * @param {PlotContext} c
 */
export declare function installReaders(c: PlotContext): void;
