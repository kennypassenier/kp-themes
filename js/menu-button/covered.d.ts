/** @typedef {import('./types.js').Covered} Covered */
export type Covered = import('./types.js').Covered;
/**
 * How far in from each of the screen's edges a menu must stay: what the page
 * declares as covered (its scrolling box's `scroll-padding`, which the
 * package's sticky nav writes), or a bar stuck (fixed or sticky) along the
 * screen at that edge, whichever reaches further: a header or a footer
 * across it, a side nav down it. A menu over a side nav hung outside the
 * page it belongs to (the review page's nav, Kenny, 2026-10-05). A bar the
 * menu button lives in does not count, nor a small floating control (less
 * than half the screen along its edge).
 * @param {Window} view
 * @param {Element} wrapper
 * @param {Element} [skip] an element to see through (the open menu)
 * @returns {Covered}
 */
export declare function coveredEdges(view: Window, wrapper: Element, skip?: Element): Covered;
