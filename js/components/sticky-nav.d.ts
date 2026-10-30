/** Fired on the wrapper when a sticky bar turns compact or back: `{ compact }`. */
export declare const NAV_COMPACT_EVENT = "kp-nav-compact";
/** The mark the React NavBar puts on a sticky wrapper it wires itself [AR29]. */
export declare const NAV_STICKY_OWNED = "[data-kp-nav-sticky-owner]";
/**
 * Wire every sticky nav bar under `root` [scope-48 wave 2].
 *
 * Opt-in by the modifier `.kp-nav-wrap--sticky`; the CSS makes the bar
 * stick, this decides when it is compact and tells the scrolling box how
 * tall it is. Two things, both undone by `detach`:
 *
 * - `data-kp-nav-compact` on the wrapper once the box has scrolled further
 *   than `data-kp-nav-sticky-after` (px, and never less than the bar's own
 *   height at rest, which is the default), and off again once it is back
 *   within that distance less the bar's height. The gap between the two is not decoration: shrinking the
 *   bar moves the content under it up, the browser's scroll anchoring moves
 *   the scroll position with it, and without a gap at least that wide the
 *   bar would flip between its two heights at the threshold.
 * - `--kp-nav-sticky-height` and `data-kp-nav-sticky-root` on the scrolling
 *   box (the document's root, or the nearest ancestor that scrolls), which
 *   the box's `scroll-padding-block-start` reads, so an anchor or a focused
 *   element lands below the bar. A page's own `--kp-scroll-offset` wins.
 *
 * @param {ParentNode} root
 * @param {{ ownedBy?: string, after?: number }} [options]
 * @returns {() => void} detach
 */
export declare function attachStickyNavs(root?: ParentNode, { ownedBy, after }?: {
    ownedBy?: string;
    after?: number;
}): () => void;
/**
 * One sticky bar; the React NavBar calls this for the wrapper it renders.
 *
 * @param {HTMLElement} wrap the `.kp-nav-wrap--sticky` element
 * @param {number} [after] px; overrides `data-kp-nav-sticky-after`
 * @returns {() => void} detach
 */
export declare function stickyNav(wrap: HTMLElement, after?: number): () => void;
