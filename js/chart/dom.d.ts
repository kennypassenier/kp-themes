import { ChartGroup } from './group.js';
export type ChartData = import('./words.js').ChartData;
export type ChartDecorate = import('./words.js').ChartDecorate;
export type ChartDecorateInfo = import('./words.js').ChartDecorateInfo;
/** @typedef {import('./words.js').ChartData} ChartData */
/** @typedef {import('./words.js').ChartDecorate} ChartDecorate */
/** @typedef {import('./words.js').ChartDecorateInfo} ChartDecorateInfo */
/** @param {Element | Document} el @returns {ChartGroup | null} */
export declare function groupOf(el: Element | Document): ChartGroup | null;
/**
 * The group a zoom chip belongs to, as a key: `data-kp-chart-zoom-for`'s
 * element, else the group element around the chip, else the document.
 * @param {Element} chip
 * @returns {Element | Document | null}
 */
export declare function chipKey(chip: Element): Element | Document | null;
/** The data in a chart's JSON child, if any. @param {Element} el @returns {ChartData | null} */
export declare function dataInMarkup(el: Element): ChartData | null;
/**
 * An element with attributes and children.
 * @param {Document} doc
 * @param {string} tag
 * @param {Record<string, string | number | null | undefined>} [attrs]
 * @param {...(Node | string)} kids
 * @returns {HTMLElement}
 */
export declare function h(doc: Document, tag: string, attrs?: Record<string, string | number | null | undefined>, ...kids: (Node | string)[]): HTMLElement;
/**
 * An SVG element with attributes.
 * @param {Document} doc
 * @param {string} tag
 * @param {Record<string, string | number | null | undefined>} [attrs]
 * @returns {SVGElement}
 */
export declare function s(doc: Document, tag: string, attrs?: Record<string, string | number | null | undefined>): SVGElement;
/**
 * The axis labels are centred on their ticks, which puts half of the first and of the last one outside the drawing when a tick
 * stands near an edge. Those two are anchored to their tick instead (the first starts at it, the last ends at it), so no label
 * crosses the edge and the plot keeps its width. Needs the labels laid out; a hidden chart keeps them centred.
 * @param {readonly SVGTextElement[]} labels the axis labels, left to right, already in the document
 * @param {number} width the drawing's width
 * @param {number} [inset] the least room kept between a label and the edge
 */
export declare function keepEndsInside(labels: readonly SVGTextElement[], width: number, inset?: number): void;
/**
 * Hand a control to the page's `decorate`, the info without its empty
 * fields. A throwing decorate is the page's fault and must not stop the
 * chart drawing.
 * @param {ChartDecorate | undefined} decorate
 * @param {HTMLElement} part
 * @param {ChartDecorateInfo} info
 */
export declare function decorateWith(decorate: ChartDecorate | undefined, part: HTMLElement, info: ChartDecorateInfo): void;
