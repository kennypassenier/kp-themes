import { Controller } from '../controller.js';
export type ChartContext = import('./api.js').ChartContext;
export type ChartState = import('./api.js').ChartState;
export type ChartGroup = import('./group.js').ChartGroup;
export type ChartData = import('./words.js').ChartData;
export type ChartPoint = import('./words.js').ChartPoint;
export type SparkSettings = {
    group: ChartGroup;
    locale: string;
    ctx: ChartContext;
};
export declare class SparkChart extends Controller {
    group: import("./group.js").ChartGroup;
    ctx: import("./api.js").ChartContext;
    doc: Document;
    /** @type {ChartData} */
    data: ChartData;
    /** @type {ChartPoint[]} */
    pts: ChartPoint[];
    fmt: (v: number, where: import("./attach.js").ChartValueWhere) => string;
    /** @type {number | null} */
    cursor: number | null;
    name: HTMLElement;
    value: HTMLElement;
    svg: SVGSVGElement;
    plot: HTMLElement;
    readout: HTMLElement;
    axis: {
        row: HTMLElement;
        from: HTMLElement;
        to: HTMLElement;
        read: HTMLElement;
    } | null;
    /** Everything the chart adds to its host, in order. */
    parts: HTMLElement[];
    /** What attachCharts() keeps for this chart and its group holds. @type {ChartState} */
    state: ChartState;
    /** @param {HTMLElement} host @param {Record<string, unknown>} [options] */
    constructor(host: HTMLElement, options?: Record<string, unknown>);
    connect(): void;
    label(): string;
    draw(): void;
    /** @param {number} t */
    say(t: number): void;
    /** @param {PointerEvent} e */
    onMove(e: PointerEvent): void;
    /** Arrows, Home and End walk the readings on the group's crosshair; Escape lets go of it. @param {KeyboardEvent} e */
    onKey(e: KeyboardEvent): void;
    /** @param {ChartData} next */
    setData(next: ChartData): void;
    /** @returns {ChartState} */
    makeState(): ChartState;
}
