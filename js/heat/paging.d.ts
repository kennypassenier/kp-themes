export type HeatPaging = import('./types.js').HeatPaging;
/** @param {HTMLElement} el @returns {number} the page the grid shows now: 0 is today, 1 the page before */
export declare function heatOffset(el: HTMLElement): number;
/**
 * The Earlier / Today / Later bar before a heat grid [wish-1120, homelab 100]: three buttons and the words of the window between
 * them. A press fires `kp-heat-page` on the grid (the event Page Up and Page Down already send) with `{ direction: 'earlier' | 'later'
 * | 'today', offset, source: 'pager' }`, where `offset` is the page it asks for (0 is today, 1 the page before); a grid that is not
 * `data-kp-heat-owned` also moves its `data-kp-heat-offset` and the bar's disabled buttons itself, an owned one waits for the page to
 * call this again with the new `offset` and `label`. Today is off at offset 0, Later at `min` (0), Earlier at `max` (none). Called
 * again it rewrites in place. The page draws the window's columns with `setHeat` as it always did.
 * @param {HTMLElement} el the heat grid
 * @param {HeatPaging} [paging]
 * @returns {HTMLElement | null} the bar, null for a grid that is not in a page
 */
export declare function setHeatPaging(el: HTMLElement, paging?: HeatPaging): HTMLElement | null;
/** The paging each grid was last given. @type {WeakMap<Element, HeatPaging>} */
export declare const PAGING: WeakMap<Element, HeatPaging>;
/**
 * Take the paging bar away.
 * @param {HTMLElement} el the heat grid
 */
export declare function removeHeatPaging(el: HTMLElement): void;
