export type GraphData = import('./options.js').GraphData;
/** @typedef {import('./options.js').GraphData} GraphData */
/**
 * Give a graph its nodes, edges and kinds. Ids that stay keep their
 * selection and focus; picked ids that went are dropped (and said so with
 * `kp-graph-change`).
 * @param {Element} el
 * @param {GraphData} data
 */
export declare function setGraphData(el: Element, data: GraphData): void;
/**
 * `loading`, `empty` or `error`, with the sentence to show in the picture at
 * its final height (loading says `graphLoading` when given none). Loading is the ghost of the coming network, the register's own loading picture; empty
 * and error are the package's state plate over it (`words` is its heading, `text` its sentence, `art` a picture over the
 * heading), an error with a Retry that fires `kp-graph-retry` [state-plates-1019].
 * @param {Element} el
 * @param {'loading' | 'empty' | 'error'} state
 * @param {string} [words]
 * @param {{ text?: string, art?: Node | string | null }} [plate]
 */
export declare function setGraphState(el: Element, state: 'loading' | 'empty' | 'error', words?: string, { text, art }?: {
    text?: string;
    art?: Node | string | null;
}): void;
/** Pick these nodes (and only these). With the details option on, the last one's details open. @param {Element} el @param {string[]} ids */
export declare function graphSelect(el: Element, ids: string[]): void;
/** Hide or show one kind of link. @param {Element} el @param {string} kind @param {boolean} hide */
export declare function graphHideKind(el: Element, kind: string, hide: boolean): void;
/**
 * Open the details of a node, or close them with `null` (the node need not be picked) [graph-1020]. It does nothing unless the
 * graph has `data-kp-detail`.
 * @param {Element} el
 * @param {string | null} id
 */
export declare function graphDetail(el: Element, id: string | null): void;
/**
 * Zoom the view from the page: `in`, `out` or `reset` [graph-1020]. It does nothing unless the graph has `data-kp-zoom`.
 * @param {Element} el
 * @param {'in' | 'out' | 'reset'} action
 */
export declare function graphZoom(el: Element, action: 'in' | 'out' | 'reset'): void;
/** The data of a `script[type="application/json"][data-kp-graph-data]` child, if it has one that reads. @param {Element} el @returns {GraphData | null} */
export declare function dataChild(el: Element): GraphData | null;
