/** A hub-and-ring graph: `figure.kp-graph[data-kp-graph]`. */
export declare const GRAPH = "[data-kp-graph]";
/** Fired on the graph, bubbling, when its selection, hover or hidden kinds change: `detail` `{ selected, hover, hiddenKinds }`. */
export declare const GRAPH_CHANGE_EVENT = "kp-graph-change";
/** Fired on the graph, bubbling, when the Retry of its failed state is pressed [state-plates-1019]. */
export declare const GRAPH_RETRY_EVENT = "kp-graph-retry";
/** Fired on the graph, bubbling, when a picked node's details open [graph-1020]: `detail` `{ id, node, slot, host }`; the page fills `slot`. */
export declare const GRAPH_DETAIL_EVENT = "kp-graph-detail";
/** The attributes that are the graph's options; a change to one redraws [graph-1020]. */
export declare const GRAPH_OPTION_ATTRIBUTES: string[];
