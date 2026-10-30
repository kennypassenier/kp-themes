export { ANCHORS, ANCHOR, ANCHOR_COPY_EVENT, ANCHOR_REVEAL_EVENT, ANCHOR_MISSING_EVENT, ANCHOR_HIT_MS, ANCHOR_WAIT_MS, ANCHOR_QUIET_MS, ANCHOR_COPIED_MS, anchorSlug, uniqueAnchorId, } from './anchors/text.js';
export type AnchorOptions = {
    anchors?: 'headings' | 'rows' | 'both' | 'off';
    levels?: number[];
    show?: 'hover' | 'always' | 'touch';
    copy?: 'url' | 'hash';
    target?: 'highlight' | 'none';
    open?: boolean;
    copiedMs?: number;
    /**
     * the longest wait for a place not drawn yet, in ms
     */
    wait?: number;
};
/**
 * @typedef {object} AnchorOptions
 * @property {'headings' | 'rows' | 'both' | 'off'} [anchors]
 * @property {number[]} [levels]
 * @property {'hover' | 'always' | 'touch'} [show]
 * @property {'url' | 'hash'} [copy]
 * @property {'highlight' | 'none'} [target]
 * @property {boolean} [open]
 * @property {number} [copiedMs]
 * @property {number} [wait] the longest wait for a place not drawn yet, in ms
 */
/**
 * Draw a container's marks again, after an option changed (the position of the mark, the levels).
 * @param {Element} box
 */
export declare function refreshAnchors(box: Element): void;
/**
 * Wire every container under `root`.
 * @param {ParentNode} [root]
 * @param {AnchorOptions} [options] overrides the markup
 * @returns {() => void} detach
 */
export declare function attachAnchors(root?: ParentNode, options?: AnchorOptions): () => void;
