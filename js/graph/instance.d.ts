/** @typedef {import('./options.js').GraphData} GraphData */
/** @typedef {import('./options.js').GraphDecorateInfo} GraphDecorateInfo */
/** @typedef {import('./options.js').GraphDetailInfo} GraphDetailInfo */
/** @typedef {import('./labels.js').GraphLabel} GraphLabel */
/** @typedef {import('./options.js').GraphNode} GraphNode */
/** @typedef {import('./options.js').GraphOptions} GraphOptions */
export type GraphData = import('./options.js').GraphData;
export type GraphDecorateInfo = import('./options.js').GraphDecorateInfo;
export type GraphDetailInfo = import('./options.js').GraphDetailInfo;
export type GraphLabel = import('./labels.js').GraphLabel;
export type GraphNode = import('./options.js').GraphNode;
export type GraphOptions = import('./options.js').GraphOptions;
/**
 * A node's radius: 14, or 10 to 24 by its weight; an outside node 9. A page's own `radius` on the node wins, and `base`
 * (14) scales the rest [graph-1020].
 * @param {GraphNode} n
 * @param {number} [base]
 */
export declare const radiusOf: (n: GraphNode, base?: number) => number;
/** Is `el` laid out (not hidden, not inside something hidden)? @param {Element | null} el */
export declare const isShown: (el: Element | null) => boolean;
/**
 * @template {keyof HTMLElementTagNameMap} K
 * @param {Document} doc
 * @param {K} tag
 * @param {string} [className]
 * @param {string} [text]
 * @returns {HTMLElementTagNameMap[K]}
 */
export declare const make: <K extends keyof HTMLElementTagNameMap>(doc: Document, tag: K, className?: string, text?: string) => HTMLElementTagNameMap[K];
/** @param {Document} doc @param {string} tag @param {Record<string, string | number>} [attrs] @returns {SVGElement} */
export declare const svgEl: (doc: Document, tag: string, attrs?: Record<string, string | number>) => SVGElement;
export type DrawnLabel = GraphLabel & {
    text: SVGTextElement;
};
export type GraphView = {
    k: number;
    x: number;
    y: number;
};
export type GraphModel = {
    el: HTMLElement;
    data: GraphData | null;
    state: 'loading' | 'ready' | 'empty' | 'error';
    words: string;
    text: string;
    art: Node | string | null;
    selected: Set<string>;
    hidden: Set<string>;
    hover: string | null;
    focus: string | null;
    drawnWidth: number;
    bar: HTMLElement;
    showAll: HTMLButtonElement;
    legend: HTMLElement;
    box: HTMLElement;
    svg: SVGSVGElement;
    note: HTMLElement;
    plate: HTMLElement;
    drawn: boolean;
    hint: HTMLElement;
    decorate?: (part: Element, info: GraphDecorateInfo) => void;
    strings: import('../strings.js').Strings;
    labels: DrawnLabel[];
    size: [number, number];
    options: GraphOptions;
    world: SVGGElement | null;
    at: Map<string, {
        x: number;
        y: number;
        angle: number;
    }>;
    view: GraphView;
    zoomBox: HTMLElement;
    zoomIn: HTMLButtonElement;
    zoomOut: HTMLButtonElement;
    zoomReset: HTMLButtonElement;
    panel: HTMLElement;
    detail: string | null;
    detailShown: string | null;
    detailHook?: (info: GraphDetailInfo) => Node | string | null | void;
    readyHeight: number;
    readyWidth: number;
};
/**
 * @typedef {GraphLabel & { text: SVGTextElement }} DrawnLabel
 * @typedef {{ k: number, x: number, y: number }} GraphView
 * @typedef {{ el: HTMLElement, data: GraphData | null, state: 'loading' | 'ready' | 'empty' | 'error', words: string, text: string, art: Node | string | null,
 *   selected: Set<string>, hidden: Set<string>, hover: string | null, focus: string | null, drawnWidth: number,
 *   bar: HTMLElement, showAll: HTMLButtonElement, legend: HTMLElement, box: HTMLElement, svg: SVGSVGElement,
 *   note: HTMLElement, plate: HTMLElement, drawn: boolean, hint: HTMLElement, decorate?: (part: Element, info: GraphDecorateInfo) => void,
 *   strings: import('../strings.js').Strings, labels: DrawnLabel[], size: [number, number],
 *   options: GraphOptions, world: SVGGElement | null, at: Map<string, { x: number, y: number, angle: number }>, view: GraphView,
 *   zoomBox: HTMLElement, zoomIn: HTMLButtonElement, zoomOut: HTMLButtonElement, zoomReset: HTMLButtonElement,
 *   panel: HTMLElement, detail: string | null, detailShown: string | null, detailHook?: (info: GraphDetailInfo) => Node | string | null | void,
 *   readyHeight: number, readyWidth: number }} GraphModel
 */
/** @type {WeakMap<Element, GraphModel>} */
export declare const graphs: WeakMap<Element, GraphModel>;
/** How far a view may zoom, and by how much a key or a button steps [graph-1020]. */
export declare const ZOOM_MIN = 0.5;
export declare const ZOOM_MAX = 4;
export declare const ZOOM_STEP = 1.25;
