export type Box = {
    top: number;
    right: number;
    bottom: number;
    left: number;
};
/** @typedef {{ top: number, right: number, bottom: number, left: number }} Box */
/**
 * The host's padding box in view.
 * @param {HTMLElement} host
 * @returns {Box}
 */
export declare function viewOf(host: HTMLElement): Box;
/**
 * The union of the rectangles, clipped to the view and to the span that is seen.
 * @param {readonly Box[]} rects @param {Box} view @param {{ left: number, right: number }} seen
 * @returns {Box}
 */
export declare function coverage(rects: readonly Box[], view: Box, seen: {
    left: number;
    right: number;
}): Box;
/**
 * An area shorter than the theme's panel (a heat grid of three rows; a register that gives its panel a foot of
 * its own) lends the card the room it needs from either side, within the host: the panel is never cut.
 * @param {Box} box @param {Box} view @param {number} need
 * @returns {Box}
 */
export declare function lendHeight(box: Box, view: Box, need: number): Box;
/**
 * The same sideways: an area narrower than the panel (the cells of a heat grid on a phone, beside its label column, in
 * the part a scroller shows) lends the card the width the panel needs, over what stands beside it, within what is seen,
 * so the panel stands centred in its card and is never cut [laststates-1019].
 * @param {Box} box @param {{ left: number, right: number }} seen @param {number} wide
 * @returns {Box}
 */
export declare function lendWidth(box: Box, seen: {
    left: number;
    right: number;
}, wide: number): Box;
