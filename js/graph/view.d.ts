export type DrawnLabel = import('./instance.js').DrawnLabel;
export type GraphData = import('./options.js').GraphData;
export type GraphDetailInfo = import('./options.js').GraphDetailInfo;
export type GraphLayoutOptions = import('./layout.js').GraphLayoutOptions;
export type GraphModel = import('./instance.js').GraphModel;
export type GraphOptions = import('./options.js').GraphOptions;
/** @param {GraphModel} g */
export declare function graphChanged(g: GraphModel): void;
/** Selection, hover and hidden kinds change classes only, never the nodes. @param {GraphModel} g */
export declare function restyleGraph(g: GraphModel): void;
/** Fit the drawn labels, writing each shortened text into its element. @param {DrawnLabel[]} labels @param {number} W @param {number} H */
export declare function fitDrawnLabels(labels: DrawnLabel[], W: number, H: number): void;
/** The strip kept clear at the top and the bottom for what is drawn inside the picture: Show all and the zoom controls over the top, the hint, as tall as it is, at the foot [graph-1020]. @param {GraphOptions} o @param {number} hintHeight */
export declare const insetOf: (o: GraphOptions, hintHeight: number) => {
    top: number;
    bottom: number;
};
/**
 * The ghost of the coming network, drawn while loading [PACKAGE_FINDINGS, 2026-10-06]: the last network's nodes and
 * links, or a hub with a ring of six when nothing was drawn yet, in the package's own edge, node, ring and core
 * classes so the theme's settled shape draws it, quieted by the `kp-graph__ghost` rules. Each link carries `pathLength` 100
 * (a register's travelling dash is a percentage of the link). Every part carries `--i`
 * (its order from the hub round the ring) and the group `--n` (how many), for a register's staggered motion.
 * @param {Document} doc
 * @param {GraphData | null} last
 * @param {number} W
 * @param {number} H
 * @param {GraphLayoutOptions} layoutOptions
 * @param {number} base  the base node radius
 * @returns {SVGGElement}
 */
export declare function ghostOf(doc: Document, last: GraphData | null, W: number, H: number, layoutOptions: GraphLayoutOptions, base: number): SVGGElement;
/** Show a view: one transform on the world group, nothing else moves. @param {GraphModel} g @param {boolean} [eased] */
export declare function applyView(g: GraphModel, eased?: boolean): void;
/** Keep part of the drawing in sight: a pan may not carry it away. @param {GraphModel} g */
export declare function clampView(g: GraphModel): void;
/** Zoom to `k` about the picture point (px, py), so the point under the pointer stays under it. @param {GraphModel} g @param {number} k @param {number} px @param {number} py @param {boolean} [eased] */
export declare function zoomTo(g: GraphModel, k: number, px: number, py: number, eased?: boolean): void;
/** Where a pointer is in the picture's own units. @param {GraphModel} g @param {number} clientX @param {number} clientY */
export declare function pictureAt(g: GraphModel, clientX: number, clientY: number): {
    x: number;
    y: number;
};
/** Bring a node into the view without moving it further than needed (a focus walk on a zoomed picture). @param {GraphModel} g @param {string | null} id */
export declare function revealNode(g: GraphModel, id: string | null): void;
/** Put Show all and the hint where the option says. @param {GraphModel} g */
export declare function placeChrome(g: GraphModel): void;
/** The words under the picture follow the options on: they are what a pointer and the keys do now. @param {GraphModel} g */
export declare function sayHint(g: GraphModel): void;
/**
 * Open, refresh or close the details panel inside the picture for `g.detail` [graph-1020]. It is built when it opens (the page
 * fills its slot through the `kp-graph-detail` event or the `detail` hook); a redraw of the picture never rebuilds it.
 * @param {GraphModel} g
 */
export declare function renderDetail(g: GraphModel): void;
