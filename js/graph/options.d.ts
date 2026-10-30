export type GraphNode = {
    id: string;
    label: string;
    kind?: string;
    hue?: number;
    colour?: string;
    radius?: number;
    weight?: number | null;
    flag?: 'mismatch' | null;
    description: string;
    external?: boolean;
};
export type GraphEdge = {
    from: string;
    to: string;
    kind: string;
    detail?: string;
    arrows?: 'to' | 'from' | 'both' | 'none';
};
export type GraphKind = {
    kind: string;
    label: string;
    hint: string;
    style: 'solid' | 'dash' | 'dot' | 'long-dash';
    colour: string;
};
export type GraphData = {
    nodes: GraphNode[];
    edges: GraphEdge[];
    kinds: GraphKind[];
    hub?: string;
};
export type GraphDecorateInfo = {
    kind: 'node' | 'kind' | 'show-all' | 'zoom-in' | 'zoom-out' | 'zoom-reset' | 'detail-close';
    host: HTMLElement;
    key?: string;
    index?: number;
    label?: string;
    value?: string;
};
export type GraphDetailInfo = {
    id: string;
    node: GraphNode;
    slot: HTMLElement;
    host: HTMLElement;
    key?: string;
};
export type GraphOptions = {
    labels: 'beside' | 'below';
    chrome: 'outside' | 'inside';
    colour: 'theme' | 'fixed';
    direction: 'none' | 'arrows';
    zoom: boolean;
    detail: boolean;
    ring: number | null;
    node: number | null;
};
/**
 * @typedef {{ id: string, label: string, kind?: string, hue?: number, colour?: string, radius?: number, weight?: number | null,
 *   flag?: 'mismatch' | null, description: string, external?: boolean }} GraphNode
 * @typedef {{ from: string, to: string, kind: string, detail?: string, arrows?: 'to' | 'from' | 'both' | 'none' }} GraphEdge
 * @typedef {{ kind: string, label: string, hint: string, style: 'solid' | 'dash' | 'dot' | 'long-dash', colour: string }} GraphKind
 * @typedef {{ nodes: GraphNode[], edges: GraphEdge[], kinds: GraphKind[], hub?: string }} GraphData
 */
/**
 * What `decorate` is told about the control it is handed: the same shape every kp module's `decorate` takes
 * (`DataTableDecorateInfo`). `kind` is `node` (a node of the picture; `value` is its id, `label` its name), `kind` (a
 * toggle in the list of kinds; `value` is the kind), `show-all`, or one of the option controls [graph-1020]: `zoom-in`, `zoom-out`, `zoom-reset` and `detail-close` (`value` is the node whose details they close). `host` is the graph and `key` its `data-kp-key`.
 * @typedef {{ kind: 'node' | 'kind' | 'show-all' | 'zoom-in' | 'zoom-out' | 'zoom-reset' | 'detail-close', host: HTMLElement, key?: string, index?: number, label?: string, value?: string }} GraphDecorateInfo
 */
/**
 * What the page hands the `detail` hook, and what the `kp-graph-detail` event carries: the picked node, the slot to fill
 * (an element inside the details panel) and the graph.
 * @typedef {{ id: string, node: GraphNode, slot: HTMLElement, host: HTMLElement, key?: string }} GraphDetailInfo
 * @typedef {{ labels: 'beside' | 'below', chrome: 'outside' | 'inside', colour: 'theme' | 'fixed', direction: 'none' | 'arrows',
 *   zoom: boolean, detail: boolean, ring: number | null, node: number | null }} GraphOptions
 */
/**
 * The graph's options as its attributes say them; anything missing or unreadable is the approved look.
 * @param {Element} host
 * @returns {GraphOptions}
 */
export declare function graphOptionsOf(host: Element): GraphOptions;
/**
 * Set options on a graph (they are attributes, so markup and script say the same thing); `null` or `false` takes one off.
 * @param {Element} el
 * @param {Partial<{ [K in keyof GraphOptions]: GraphOptions[K] | null | false }>} options
 */
export declare function setGraphOptions(el: Element, options: Partial<{ [K in keyof GraphOptions]: GraphOptions[K] | null | false; }>): void;
