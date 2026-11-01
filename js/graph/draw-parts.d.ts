export type DrawnLabel = import('./instance.js').DrawnLabel;
export type GraphModel = import('./instance.js').GraphModel;
export type GraphNode = import('./options.js').GraphNode;
export type GraphData = NonNullable<GraphModel['data']>;
/** @typedef {import('./instance.js').DrawnLabel} DrawnLabel */
/** @typedef {import('./instance.js').GraphModel} GraphModel */
/** @typedef {import('./options.js').GraphNode} GraphNode */
/** @typedef {NonNullable<GraphModel['data']>} GraphData */
/**
 * The edges and their arrow heads of the world, one path each.
 * @param {Document} doc
 * @param {GraphData} data
 * @param {Map<string, { x: number, y: number, angle: number }>} at
 * @param {number} base
 */
export declare function drawEdges(doc: Document, data: GraphData, at: Map<string, {
    x: number;
    y: number;
    angle: number;
}>, base: number): SVGElement;
/**
 * The nodes with their names, appended to the world; returns the drawn labels. Sets the keyboard focus to the first node when it is not on one.
 * @param {GraphModel} g
 * @param {SVGGElement} world
 * @param {{ data: GraphData, at: Map<string, { x: number, y: number, angle: number }>, base: number, hub: string | null, wraps: Map<string, string[]> }} parts
 * @returns {DrawnLabel[]}
 */
export declare function drawNodes(g: GraphModel, world: SVGGElement, { data, at, base, hub, wraps }: {
    data: GraphData;
    at: Map<string, {
        x: number;
        y: number;
        angle: number;
    }>;
    base: number;
    hub: string | null;
    wraps: Map<string, string[]>;
}): DrawnLabel[];
/** The kinds: one toggle per kind the edges use, none when nothing links. @param {GraphModel} g @param {Document} doc @param {GraphData} data */
export declare function drawLegend(g: GraphModel, doc: Document, data: GraphData): void;
