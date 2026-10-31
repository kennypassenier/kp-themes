import { Controller } from '../controller.js';
export type ChartContext = import('./api.js').ChartContext;
export type ChartGroup = import('./group.js').ChartGroup;
export type ChartData = import('./words.js').ChartData;
export type ChartPoint = import('./words.js').ChartPoint;
export type TrendSettings = {
    group: ChartGroup;
    locale: string;
    ctx: ChartContext;
};
/** @typedef {import('./api.js').ChartContext} ChartContext */
/** @typedef {import('./group.js').ChartGroup} ChartGroup */
/** @typedef {import('./words.js').ChartData} ChartData */
/** @typedef {import('./words.js').ChartPoint} ChartPoint */
/** What trendChart() hands its controller. @typedef {{ group: ChartGroup, locale: string, ctx: ChartContext }} TrendSettings */
export declare class TrendView extends Controller {
    group: import("./group.js").ChartGroup;
    ctx: import("./api.js").ChartContext;
    doc: Document;
    /** @type {ChartData | null} */
    data: ChartData | null;
    /** @type {ChartPoint[]} */
    pts: ChartPoint[];
    fmt: (v: number, where: import("./attach.js").ChartValueWhere) => string;
    /** The moment being read, kept across a live update; null while nothing is read. @type {number | null} */
    at: number | null;
    /** @type {number | null} */
    index: number | null;
    /** The busy card over the plot while it loads [kyu-plates-1019]. @type {import('../busy-card.js').BusyCard | null} */
    busy: import('../busy-card.js').BusyCard | null;
    /** The state plate in the plot's place while it is empty or failed. @type {HTMLElement | null} */
    plate: HTMLElement | null;
    /** Set while the busy card leaves: the data is drawn once it has gone. */
    leaving: boolean;
    first: boolean;
    /** The tile's link, followed by a click that was not a drag; found when the trend is wired. @type {HTMLElement | null} */
    link: HTMLElement | null;
    svg: SVGSVGElement;
    cross: HTMLElement;
    chip: HTMLElement;
    plot: HTMLElement;
    keys: HTMLElement;
    axis: {
        row: HTMLElement;
        from: HTMLElement;
        to: HTMLElement;
        read: HTMLElement;
    } | null;
    live: HTMLElement;
    /** Everything the trend adds to its host, in order. */
    parts: HTMLElement[];
    /** @param {HTMLElement} host @param {Record<string, unknown>} [options] */
    constructor(host: HTMLElement, options?: Record<string, unknown>);
    loading(): boolean;
    /** @returns {'loading' | 'error' | 'empty' | 'ready'} */
    kind(): 'loading' | 'error' | 'empty' | 'ready';
    /** Stop reading: the crosshair and the chip go, and the axis row shows its ends again. */
    hide(): void;
    /**
     * Read point `k`: the crosshair, and the chip with its moment and value over the line, inside the trend.
     * @param {number} k
     * @param {boolean} [announce] say it to a screen reader (keys only)
     */
    show(k: number, announce?: boolean): void;
    /**
     * The chip over the line, kept inside the trend; the value under the moment when the two do not fit on one line, and in the
     * axis row when even that does not fit.
     * @param {string} moment @param {string} shown @param {number} x @param {number} width
     */
    placeChip(moment: string, shown: string, x: number, width: number): void;
    /** The state plate, or nothing: the plot and the axis give way to it while it stands. @param {'empty' | 'error' | null} k */
    setPlate(k: 'empty' | 'error' | null): void;
    /** The busy card while loading: placed again, opened, or taken away once the data is in. @param {string} k */
    syncBusy(k: string): void;
    draw(): void;
    /** @param {ChartData} next */
    setData(next: ChartData): void;
}
