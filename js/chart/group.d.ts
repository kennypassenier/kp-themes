export type ChartContext = import('./api.js').ChartContext;
export type ChartState = import('./api.js').ChartState;
export type ChartWindow = import('./words.js').ChartWindow;
/** @typedef {import('./api.js').ChartContext} ChartContext */
/** @typedef {import('./api.js').ChartState} ChartState */
/** @typedef {import('./words.js').ChartWindow} ChartWindow */
/** Charts that share one crosshair, one zoom and one range, across attachCharts() calls. */
export declare class ChartGroup {
    el: HTMLElement | null;
    doc: Document;
    ctx: import("./api.js").ChartContext;
    /** @type {Set<ChartState>} */
    charts: Set<ChartState>;
    /** @type {ChartWindow | null} */
    zoom: ChartWindow | null;
    /** The chart the crosshair was last moved on: the only one, unpinned, that shows its tooltip. @type {ChartState | null} */
    owner: ChartState | null;
    span: number | null;
    /** @type {(() => void)[]} */
    stops: (() => void)[];
    /** Every chip given to this group, and its words. @type {Map<HTMLElement, HTMLElement>} */
    chips: Map<HTMLElement, HTMLElement>;
    /**
     * @param {HTMLElement | null} el the `[data-kp-chart-group]`, or none (the document's loose charts)
     * @param {Document} doc
     * @param {ChartContext} ctx the first call's words and times, for the chips
     */
    constructor(el: HTMLElement | null, doc: Document, ctx: ChartContext);
    /** Take every chip on the page that names this group and is not taken yet. */
    bindChips(): void;
    /** @param {HTMLElement} chip */
    bindChip(chip: HTMLElement): void;
    wireRanges(): void;
    /** The newest point of any plot in the group. */
    end(): number | null;
    /** @param {ChartWindow | null} zoom */
    setZoom(zoom: ChartWindow | null): void;
    /**
     * The chip's words for a zoom: its span in the `range` style (dates
     * once it spans more than one day).
     * @param {ChartWindow} zoom
     */
    zoomText(zoom: ChartWindow): string;
    /** @param {number | null} t @param {ChartState | null} owner */
    cursor(t: number | null, owner: ChartState | null): void;
    /** No chart left: let go of the page. */
    stop(): void;
}
