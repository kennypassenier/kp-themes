import { PlotBase } from './base.js';
export type PlotOptions = import('./base.js').PlotOptions;
export declare class PlotLegend extends PlotBase {
    /** The legend's own listeners: Show all, Escape in the legend, and the pin's ✕. */
    wireLegend(): void;
    /** Draw the chart: PlotDraw does it; the legend has none of its own. */
    draw(): void;
    /** The kinds of event the data holds, with their tone and count. */
    countKinds(): Map<string, {
        tone: string;
        count: number;
    }>;
    /** Build (or update) the key above the plot: one switch per kind, and a note for the median and the runs. @param {PlotOptions} opt */
    paintKey(opt: PlotOptions): void;
    /**
     * Put the key's switches and notes in again, keeping the focus on the switch that had it.
     * @param {Map<string, { tone: string, count: number }>} kinds
     * @param {string[]} notes
     */
    rebuildKey(kinds: Map<string, {
        tone: string;
        count: number;
    }>, notes: string[]): void;
    /** One switch of the key: its kind on or off. @param {string} k @param {string} tone @param {number} count */
    keyButton(k: string, tone: string, count: number): HTMLElement;
    /** One note of the key: the median line or the runs' ring. @param {string} n */
    keyNote(n: string): HTMLElement;
    buildLegend(): void;
    /**
     * One source of the legend: a button that isolates it while pointed at or focused, and presses it on a click.
     * @param {import('../words.js').ChartSeries} series
     * @param {number} i
     */
    sourceButton(series: import('../words.js').ChartSeries, i: number): {
        button: HTMLElement;
        value: HTMLElement;
    };
    /** The legend row kept for `data-kp-chart-sources` sources while loading. */
    skeletonLegend(): void;
}
