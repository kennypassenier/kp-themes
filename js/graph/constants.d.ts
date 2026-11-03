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
/** On the graph: the key that zooms in (a key spec, js/key-spec.js; `none` for no key; the `or` list gives several keys). */
export declare const GRAPH_ZOOM_IN_KEY_ATTRIBUTE = "data-kp-zoom-in-key";
/** The keys that zoom in when the graph names none (`=` is the unshifted key of `+` on a US layout). */
export declare const GRAPH_ZOOM_IN_KEY = "+ or =";
/** On the graph: the key that zooms out. */
export declare const GRAPH_ZOOM_OUT_KEY_ATTRIBUTE = "data-kp-zoom-out-key";
/** The keys that zoom out when the graph names none (`_` is the shifted key of `-`). */
export declare const GRAPH_ZOOM_OUT_KEY = "- or _";
/** On the graph: the key that resets the zoom. */
export declare const GRAPH_ZOOM_RESET_KEY_ATTRIBUTE = "data-kp-zoom-reset-key";
/** The key that resets the zoom when the graph names none. */
export declare const GRAPH_ZOOM_RESET_KEY = "0";
