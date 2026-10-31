export type PlotDraw = import('./draw.js').PlotDraw;
export type ChartEvent = import('../words.js').ChartEvent;
export type ChartPoint = import('../words.js').ChartPoint;
export type ChartWindow = import('../words.js').ChartWindow;
/** @typedef {import('./draw.js').PlotDraw} PlotDraw */
/** @typedef {import('../words.js').ChartEvent} ChartEvent */
/** @typedef {import('../words.js').ChartPoint} ChartPoint */
/** @typedef {import('../words.js').ChartWindow} ChartWindow */
/** The measures of a drawing, in SVG pixels unless named otherwise. */
export declare const LAYOUT: Readonly<{
    /** The narrowest a plot is drawn. */
    minWidth: 240;
    /** The room above the highest threshold, as a factor. */
    headroom: 1.08;
    /** The left padding: at least this, else the longest value tick's characters at `charWidth` plus `tickRoom`. */
    padLeft: 30;
    charWidth: 7;
    tickRoom: 12;
    padRight: 10;
    padTop: 18;
    padBottom: 22;
    /** A value tick's gap from the plot, its drop below its line, and the time ticks' distance from the bottom. */
    tickGap: 6;
    tickDrop: 4;
    axisLift: 6;
    /** The least room between two time ticks. */
    tickSpacing: 70;
    /** How far a band and an event line reach above the plot, and how far a bracket's ends reach into it. */
    bandRise: 4;
    bracketDrop: 8;
    /** The size of a hatch pattern's tile. */
    hatch: 6;
}>;
export declare class PlotFrame {
    chart: import("./draw.js").PlotDraw;
    doc: Document;
    from: number;
    to: number;
    H: number;
    W: number;
    vis: number[];
    stacked: boolean;
    thresholds: any[];
    hi: number;
    ticksY: string[];
    P: {
        l: number;
        r: 10;
        t: 18;
        b: 22;
    };
    svg: SVGSVGElement;
    defs: SVGElement;
    g: SVGElement;
    opt: import("./base.js").PlotOptions;
    /** The hatch patterns this drawing needs, one per tone. @type {Set<string>} */
    hatches: Set<string>;
    /** The time ticks, kept inside the plot's ends once it is in the page. @type {SVGTextElement[]} */
    axisLabels: SVGTextElement[];
    /** The events in the window, and how many lie before and after it. @type {ChartEvent[]} */
    events: ChartEvent[];
    beforeCount: number;
    afterCount: number;
    /**
     * @param {PlotDraw} chart
     * @param {ChartWindow} win
     * @param {number} H the plot's height
     */
    constructor(chart: PlotDraw, win: ChartWindow, H: number);
    /** @param {number} t */
    x(t: number): number;
    /** @param {number} v */
    y(v: number): number;
    /** @param {ChartPoint} p */
    inR(p: ChartPoint): boolean;
    /** The top of the value axis: the data's `yMax`, else a round value over every reading and threshold on view. */
    top(): number;
    /** The clip, the value grid and its ticks. */
    grid(): void;
    /**
     * Time ticks on round wall-clock times in the group's zone: 15 or 30 min, one, two, three, six or twelve hours, or days (the
     * dashboard's tiers, with 30 min and 3 h added so a zoomed span keeps more than one tick), at least `tickSpacing` apart.
     */
    timeAxis(): void;
    thresholdLines(): void;
    /** The events: a band (an event with `until`) is in the window while any of it is; the rest count at the edge. */
    eventLines(): void;
    /** One band, drawn as the chart's `band` option says: a bracket along the top, a tint or a hatch. @param {ChartEvent} ev @param {number} until */
    band(ev: ChartEvent, until: number): SVGElement;
    /** A band's fill: the tone's tint, or its hatch. @param {string} tone @param {number} x0 @param {number} x1 */
    bandFill(tone: string, x0: number, x1: number): SVGElement;
    /** The hatch pattern of a tone, made once per drawing. @param {string} tone */
    hatchFor(tone: string): string;
}
