import { PlotFrame } from './frame.js';
export type ChartSeries = import('../words.js').ChartSeries;
export type PlotMedian = import('./base.js').PlotMedian;
export type PlotGeometry = import('./base.js').PlotGeometry;
export declare class PlotDrawing extends PlotFrame {
    /** The most readings any source has, and whether that is too few for a trend. */
    have: number;
    few: boolean;
    /** The median of each shown source in this drawing. @type {PlotMedian[]} */
    medians: PlotMedian[];
    /** @param {ConstructorParameters<typeof PlotFrame>} args */
    constructor(...args: ConstructorParameters<typeof PlotFrame>);
    /** Draw everything, in order. */
    build(): void;
    /** Where this drawing put things, for the pointer and the tooltip. @returns {PlotGeometry} */
    geometry(): PlotGeometry;
    /**
     * The sources on view. Too few readings for a trend: no line, no area and no dot is drawn, only the empty plot and the sentence
     * (Kenny, 2026-10-18 17:45: a faint line still showed through the "3 of 7 days" plate).
     */
    sources(): void;
    /** A source's group, painted and marked hot or dim. @param {ChartSeries} series @param {number} si */
    seriesGroup(series: ChartSeries, si: number): SVGElement;
    /**
     * A histogram: one column per reading, `columnShare` of the room its neighbours leave, stood on the baseline (or on the columns
     * below it when stacked) [wish-1120, homelab 104].
     * @param {Element} sg @param {number[][]} pts @param {number[]} base
     */
    columns(sg: Element, pts: number[][], base: number[]): void;
    /** A source's line, over its stacked or lone area. @param {Element} sg @param {number[][]} pts @param {number[]} base @param {number} si */
    line(sg: Element, pts: number[][], base: number[], si: number): void;
    /** @param {ChartSeries} series @param {number} si @param {number[]} at */
    loneDot(series: ChartSeries, si: number, at: number[]): SVGElement;
    /** The median of each shown source and, when asked, the runs of six or more on one side of it. */
    medianLines(): void;
    /** One ring is built, the rest are copies of it: a typical-level chart marks hundreds. @param {PlotMedian} m */
    runs(m: PlotMedian): void;
    /** The one median's words at the plot's end, above its line or below it when there is no room. @param {PlotMedian} m */
    medianLabel(m: PlotMedian): void;
    /** A mark above the plot per event in the window, named in its title. */
    marks(): void;
    /** Events past the window: an arrow at that edge with their count. */
    edges(): void;
    /** The span a drag is choosing. */
    brushRect(): void;
    /** The crosshair at the pin or the cursor, with a dot where it meets each source. */
    crosshair(): void;
}
