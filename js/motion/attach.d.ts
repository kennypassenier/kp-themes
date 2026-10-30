export type SizeOptions = import('./fold-size.js').SizeOptions;
/** @typedef {import('./fold-size.js').SizeOptions} SizeOptions */
/**
 * Give every dialog its leaving motion and every box above its easing, under
 * `root` and in whatever is added to it later. A box, dialog or disclosure
 * that leaves the page is let go (its observers disconnected) a microtask
 * after it left, so a page that rebuilds itself on every navigation does not
 * keep the old boxes' watchers alive; one moved within the page stays.
 *
 * @param {ParentNode} [root]
 * @param {SizeOptions & { size?: string }} [options] `size`: more boxes to ease, as a selector, beside the package's own and `[data-kp-size-motion]` (a consumer's cards and panels, without marking each one); `arrive` and `arriveKeys` as for easeSize()
 * @returns {() => void} detach
 */
export declare function attachMotion(root?: ParentNode, { size, arrive, arriveKeys }?: SizeOptions & {
    size?: string;
}): () => void;
