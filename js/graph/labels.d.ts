/** @typedef {import('./options.js').GraphEdge} GraphEdge */
export type GraphEdge = import('./options.js').GraphEdge;
/**
 * The arrowhead of a link [graph-1020]: a triangle whose tip stands `clear` px short of the node at the link's end, turned to
 * follow the curve there. The link is the quadratic curve `from`, `bend`, `to`. `at: 'from'` puts it at the other end.
 * @param {{ x: number, y: number }} from
 * @param {{ x: number, y: number }} bend
 * @param {{ x: number, y: number }} to
 * @param {number} clear  how far from the end node's centre the tip stands (its radius and a gap)
 * @param {number} [size]
 * @returns {string} the `d` of the head
 */
export declare function graphArrow(from: {
    x: number;
    y: number;
}, bend: {
    x: number;
    y: number;
}, to: {
    x: number;
    y: number;
}, clear: number, size?: number): string;
/**
 * Each edge's bend: edges between the same two nodes fan out (0, +26, −26,
 * +52 …) so two kinds never draw on top of each other.
 * @param {GraphEdge[]} edges
 * @returns {number[]}
 */
export declare function graphBends(edges: GraphEdge[]): number[];
/**
 * A label kept to `length` letters: the whole name, or its first letters and
 * an ellipsis (`Pump h…`).
 * @param {string} full
 * @param {number} length
 * @returns {string}
 */
export declare const graphLabelText: (full: string, length: number) => string;
export type GraphLabel = {
    full: string;
    length: number;
};
export type GraphBox = {
    x: number;
    y: number;
    width: number;
    height: number;
};
/**
 * @typedef {{ full: string, length: number }} GraphLabel
 * @typedef {{ x: number, y: number, width: number, height: number }} GraphBox
 */
/**
 * Shorten labels until each lies inside the W×H box and no two touch: the
 * longer of two that touch loses a letter, an ellipsis marks the cut, and the
 * full name stays in the node's title and accessible name. `measure(label)`
 * gives the box of the label as `graphLabelText(label.full, label.length)`
 * draws it; each label's `length` is shortened in place.
 * @template {GraphLabel} L
 * @param {L[]} labels
 * @param {number} W
 * @param {number} H
 * @param {(label: L) => GraphBox} measure
 */
export declare function fitGraphLabels<L extends GraphLabel>(labels: L[], W: number, H: number, measure: (label: L) => GraphBox): void;
