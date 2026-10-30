export type GraphBox = import('./labels.js').GraphBox;
export type GraphData = import('./options.js').GraphData;
export type GraphNode = import('./options.js').GraphNode;
/** @typedef {import('./labels.js').GraphBox} GraphBox */
/** @typedef {import('./options.js').GraphData} GraphData */
/** @typedef {import('./options.js').GraphNode} GraphNode */
/** @param {Element} host @returns {string | undefined} */
export declare const keyOf: (host: Element) => string | undefined;
/**
 * The hub: the one named, else the node with the most links.
 * @param {GraphData} data
 * @returns {string | null}
 */
export declare function hubOf(data: GraphData): string | null;
/**
 * The ring's order: the nodes by label, then the outside ones; the first at
 * the top, clockwise.
 * @param {GraphData} data
 * @param {string | null} hub
 * @returns {GraphNode[]}
 */
export declare const ringOf: (data: GraphData, hub: string | null) => GraphNode[];
export type GraphLayoutOptions = {
    ring?: number;
    inset?: {
        top?: number;
        bottom?: number;
    };
    phase?: number;
    stretch?: number;
};
export type GraphRing = {
    cx: number;
    cy: number;
    rx: number;
    ry: number;
};
/**
 * Where every node sits in a W×H box: the hub in the middle, the others on an
 * ellipse around it (stretched sideways on a wide box). On a narrow box the
 * ellipse gives up width for height, so the labels beside the ring keep room.
 * `options.ring` sizes the ring (a share of the box, 0.36) and `options.inset`
 * keeps a strip at the top or the bottom clear and `options.phase` turns the ring by a share of the step between two nodes
 * (0, the approved look, unless a page asks) [graph-1020].
 * @param {GraphData} data
 * @param {number} W
 * @param {number} H
 * @param {GraphLayoutOptions} [options]
 * @returns {Map<string, { x: number, y: number, angle: number }>}
 */
export declare const graphLayout: (data: GraphData, W: number, H: number, options?: GraphLayoutOptions) => Map<string, {
    x: number;
    y: number;
    angle: number;
}>;
/**
 * The layout for names that stand whole under their nodes [graph-1020]: the ring is narrowed until every name lies inside the
 * box, and the box grows taller (up to `maxHeight`) until no name touches another or a node. Nothing is cut: the picture gets the
 * room the names need. `widthOf(node)` is the width of the node's name as drawn.
 *
 * When names so long that even the tallest picture cannot hold them on one line are given a `wrapOf(node, target)`, the same search runs
 * again with every name wider than `target` on several centred lines (`{ width, lines }`, the widest line's width) and the
 * best of the tries wins; the lines come back in `wraps` by node id. Names that fit stay on one line, so a set that cleared before
 * is drawn as it was.
 * @param {GraphData} data
 * @param {number} W
 * @param {number} H
 * @param {(node: GraphNode) => number} widthOf
 * @param {GraphLayoutOptions & { radiusOf?: (node: GraphNode) => number, line?: number, maxHeight?: number, wrapOf?: (node: GraphNode, target: number) => { width: number, lines: string[] } | null }} [options]
 * @returns {{ at: Map<string, { x: number, y: number, angle: number }>, H: number, wraps: Map<string, string[]> }}
 */
export declare function graphRoom(data: GraphData, W: number, H: number, widthOf: (node: GraphNode) => number, { radiusOf: rOf, line, maxHeight, wrapOf, ...layout }?: GraphLayoutOptions & {
    radiusOf?: (node: GraphNode) => number;
    line?: number;
    maxHeight?: number;
    wrapOf?: (node: GraphNode, target: number) => {
        width: number;
        lines: string[];
    } | null;
}): {
    at: Map<string, {
        x: number;
        y: number;
        angle: number;
    }>;
    H: number;
    wraps: Map<string, string[]>;
};
