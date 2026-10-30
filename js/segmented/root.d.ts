import { Controller } from '../controller.js';
/** The listeners of one attach. The "host" is the root the page attached, which may be the document. */
export declare class SegmentedRoot extends Controller {
    root: ParentNode;
    /** Every group this attach has enhanced, for the detach. @type {Set<Element>} */
    groups: Set<Element>;
    /** @param {ParentNode} root */
    constructor(root: ParentNode);
    connect(): void;
    /** A group that arrives later (rendered by the page, or a copy of one) is wired when it arrives, so its first paint already has the plate in place. */
    watchArrivals(): void;
    /** @param {Node} node */
    wireArrival(node: Node): void;
    /** Let go of every group this attach enhanced. */
    releaseGroups(): void;
    /** @param {Event} event */
    onClick(event: Event): void;
    /** @param {KeyboardEvent} event */
    onKey(event: KeyboardEvent): void;
    /** @param {FocusEvent} event */
    onFocus(event: FocusEvent): void;
}
/**
 * Wire every `[data-kp-segmented]` under `root`: its roles and states, its
 * roving tab stop, its clicks and its arrow keys, and the plate under the
 * chosen segment. A group rendered later is picked up on its first use, or
 * by calling this again on its subtree.
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export declare function attachSegmented(root?: ParentNode): () => void;
