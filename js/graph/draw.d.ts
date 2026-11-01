export type DrawnLabel = import('./instance.js').DrawnLabel;
export type GraphLayoutOptions = import('./layout.js').GraphLayoutOptions;
export type GraphModel = import('./instance.js').GraphModel;
export type GraphNode = import('./options.js').GraphNode;
/** @typedef {import('./instance.js').DrawnLabel} DrawnLabel */
/** @typedef {import('./layout.js').GraphLayoutOptions} GraphLayoutOptions */
/** @typedef {import('./instance.js').GraphModel} GraphModel */
/** @typedef {import('./options.js').GraphNode} GraphNode */
/** Draw the whole graph for the box's width. @param {GraphModel} g */
export declare function drawGraph(g: GraphModel, attempt?: number, tried?: {
    best: number;
    count: number;
    locked: boolean;
}): void;
