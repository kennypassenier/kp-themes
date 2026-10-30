export type HeatLegendEntry = import('./types.js').HeatLegendEntry;
export type HeatLegendOptions = import('./types.js').HeatLegendOptions;
/**
 * Take the legend away (hidden, and out of the grid's description), keeping the element where it stands so it can come back.
 * @param {HTMLElement} el
 */
export declare function removeLegend(el: HTMLElement): void;
/**
 * The legend of a calm grid, drawn by the grid itself: Logged, Nothing logged, Paused. A legend the page wrote (setHeatLegend, or
 * markup) is left alone; `data-kp-legend="hide"`, or a grid that is no longer calm, takes the grid's own away.
 * @param {HTMLElement} el
 */
export declare function syncCalmLegend(el: HTMLElement): void;
/**
 * The legend under a heat grid: a swatch and its words per entry, in the order given, a value ramp where an entry asks for one,
 * and at the end the line of keys. The list is the one right after the grid (made when there is none), named in the grid's
 * `aria-describedby`; no entries and no keys hides it. Called again, it rewrites in place, so the legend keeps its place while the
 * grid loads.
 *
 * @param {HTMLElement} el the heat grid
 * @param {readonly HeatLegendEntry[]} entries
 * @param {HeatLegendOptions & { source?: 'auto' }} [options]
 * @returns {HTMLElement | null} the legend, null for a grid that is not in a page
 */
export declare function setHeatLegend(el: HTMLElement, entries: readonly HeatLegendEntry[], options?: HeatLegendOptions & {
    source?: 'auto';
}): HTMLElement | null;
