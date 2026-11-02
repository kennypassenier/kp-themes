/** The two layers a tooltip can be drawn on; `top` is the default. */
export declare const TOOLTIP_LAYERS: readonly ['top', 'inline'];
/** The attribute on a tooltip this module put on the top layer; the stylesheet keeps its tooltip placement for it. */
export declare const TOOLTIP_LAYER_ATTR = "data-kp-tooltip-layer";
/**
 * The layer an anchor asks for: its own `data-kp-tooltip-layer`, else the call's, else `top`. An unknown word is said once in
 * the console and read as `top`, never silently taken.
 *
 * @param {HTMLElement} anchor @param {string | undefined} asked
 * @returns {'top' | 'inline'}
 */
export declare function layerOf(anchor: HTMLElement, asked: string | undefined): 'top' | 'inline';
/**
 * Make the tooltip a manual popover, unless it is one already or the browser has no popover API (then it stays in the
 * anchor's layer, as before). Returns whether it was promoted, so restore() can take exactly that back.
 *
 * @param {HTMLElement} tooltip
 */
export declare function promote(tooltip: HTMLElement): boolean;
/** Take the popover back off a tooltip promote() put on the top layer. @param {HTMLElement} tooltip */
export declare function demote(tooltip: HTMLElement): void;
/** Is the tooltip on the top layer now? @param {HTMLElement} tooltip */
export declare const onTopLayer: (tooltip: HTMLElement) => boolean;
/**
 * Put a promoted tooltip on the top layer (after its `hidden` was cleared). A tooltip that cannot be shown there (it left
 * the document between the timer and now, or the browser refuses) is said in the console and hidden again: it stays a
 * promoted popover, so the next hover tries the top layer once more, and it can never stay on screen drawn in the anchor's
 * layer with the control believing it is closed [ovfix-1102 #1].
 *
 * @param {HTMLElement} tooltip
 * @returns {boolean} whether the tooltip is on the top layer now (a tooltip that was not promoted is not, and is left as it is)
 */
export declare function showLayer(tooltip: HTMLElement): boolean;
/** Take a promoted tooltip off the top layer (it stays a popover, closed). @param {HTMLElement} tooltip */
export declare function hideLayer(tooltip: HTMLElement): void;
