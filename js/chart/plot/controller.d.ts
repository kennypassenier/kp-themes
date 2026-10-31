import { PlotPointer } from './pointer.js';
export type ChartData = import('../words.js').ChartData;
export type ChartState = import('../api.js').ChartState;
/** @typedef {import('../words.js').ChartData} ChartData */
/** @typedef {import('../api.js').ChartState} ChartState */
export declare class PlotChart extends PlotPointer {
    /** @param {HTMLElement} host @param {Record<string, unknown>} [options] */
    constructor(host: HTMLElement, options?: Record<string, unknown>);
    connect(): void;
    /**
     * A page that sets or clears `data-kp-chart-loading` itself (the feed removes `data-kp-chart-loading` just before it draws,
     * which this watch need not draw again).
     */
    watchAttributes(): void;
    /** @param {ChartData} next */
    setData(next: ChartData): void;
    /** Whether the last drawing no longer fits the group's window (a neighbour's new data moved it). */
    stale(): boolean;
    /** The newest reading's time over every source, or null without readings. */
    lastTime(): number | null;
    /** What attachCharts() keeps for this chart and its group holds. @returns {ChartState} */
    makeState(): ChartState;
}
