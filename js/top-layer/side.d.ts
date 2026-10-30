/** @param {HTMLElement} element */
export declare const clearBlockSide: (element: HTMLElement) => void;
/**
 * Choose the side of its field a raised overlay opens on [fix-30].
 *
 * Measured on 2026-09-15: a combobox, a drawn select and a date picker at
 * the bottom of a 520px window each opened their overlay below the
 * window's edge (a list from y=486 to 604, a calendar from 512 to 788),
 * where neither a person nor a click could reach it; a fixed box outside
 * the viewport cannot be scrolled into view.
 *
 * The caller has just put the overlay below its field, where it always
 * opened; this reads that spot and keeps it when the overlay fits under
 * the window's bottom edge. When it does not and the room above the field
 * is larger, the overlay moves above the field at the same distance it hung
 * below it, and `data-kp-overlay-side="above"` says so, for a register that
 * wants to mirror something. When neither side holds it, the larger side
 * gets it with a `max-block-size` and the overlay scrolls itself.
 * Only the block axis: the inline placement stays the caller's, RTL
 * included. Horizontal writing modes only, as every caller is.
 *
 * @param {HTMLElement} element the overlay, in the top layer and placed below its field in window coordinates (its `top` written inline)
 * @param {{ top: number, bottom: number }} field the field's box in window coordinates
 * @returns {'below' | 'above'} the side taken
 */
export declare function placeBlockSide(element: HTMLElement, field: {
    top: number;
    bottom: number;
}): 'below' | 'above';
