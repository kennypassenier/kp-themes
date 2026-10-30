/**
 * Tell a register whether an overlay's box scrolls, and where [retro notes, 2026-09-15].
 *
 * Theme-neutral data, nothing drawn: `data-kp-popover-overflowing` exactly while the
 * content is taller than the box, and three custom properties while it is —
 * `--kp-scroll-view` (the box's inner height in px), `--kp-scroll-ratio`
 * (the part of the content in view, 0–1) and `--kp-scroll-progress` (how far
 * it is scrolled, 0–1). A register that draws its own scrollbar reads them;
 * every other theme never notices them.
 *
 * Such a register also declares `--kp-scrollbar-size` (the bar's width),
 * `--kp-scrollbar-inset` (its distance from the padding box's end edge and
 * from the top and bottom) and `--kp-scrollbar-button` (an arrow button's
 * height) on the box. Only then does a press on the drawn bar do what a
 * platform scrollbar's does: an arrow scrolls a line, the track a page,
 * and the thumb is dragged. A press on a bar with nothing to scroll does
 * nothing. The bar is drawn at the inline end of a left-to-right box.
 *
 * @param {HTMLElement} box
 * @returns {() => void} stop, which also takes the attribute and the properties away
 */
export declare function watchScrollbar(box: HTMLElement): () => void;
/**
 * `watchScrollbar` on every `.kp-popover`, `.kp-dialog` and
 * `.kp-dialog__body` under `root`, including the ones added later (a theme
 * menu, a data table's column menu). Idempotent.
 *
 * @param {ParentNode} root
 * @returns {() => void} detach
 */
export declare function attachScrollbars(root?: ParentNode): () => void;
