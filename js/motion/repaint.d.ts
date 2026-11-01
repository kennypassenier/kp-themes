export type RepaintNode = {
    getAttribute: (name: string) => string | null;
    tagName: string;
    className: string;
    id?: string;
    nodeType: number;
    matches?: (selector: string) => boolean;
    querySelector?: (selector: string) => unknown;
};
/**
 * @typedef {{ getAttribute: (name: string) => string | null, tagName: string, className: string, id?: string, nodeType: number, matches?: (selector: string) => boolean, querySelector?: (selector: string) => unknown }} RepaintNode
 */
/**
 * The added elements of one batch of changes that only repaint what was
 * there [port spec G; the homelab dashboard's `repaints()`, moved here]:
 * an element is a repaint when its parent lost, in the same batch, an
 * element with its key (the first of `keys` it carries) or, with no key,
 * one more element of its tag and class than it already took back. An
 * element added where a loading skeleton left (`.kp-skeleton`,
 * `[data-kp-skeleton]`) is not news either: it is the data the skeleton
 * waited for. Everything else is new content.
 *
 * Measured by the dashboard (8 quiet seconds per page): without this, a
 * live refresh that redrew its rows replayed the arrival on 158 cells of
 * one page, 112 on another and 72 on a third, though nothing new had come.
 *
 * @param {Iterable<{ type: string, target: unknown, addedNodes: ArrayLike<any>, removedNodes: ArrayLike<any> }>} records
 * @param {{ keys?: readonly string[] }} [options]
 * @returns {Set<any>} the added elements that are repaints
 */
export declare function repaintedIn(records: Iterable<{
    type: string;
    target: unknown;
    addedNodes: ArrayLike<any>;
    removedNodes: ArrayLike<any>;
}>, { keys }?: {
    keys?: readonly string[];
}): Set<any>;
/**
 * What one batch of records says before any arrives: which targets were hidden before it, and which nodes it took out.
 * @param {MutationRecord[]} records
 */
export declare function batchOf(records: MutationRecord[]): {
    hiddenBefore: Map<Node, boolean>;
    moved: Set<Node>;
};
