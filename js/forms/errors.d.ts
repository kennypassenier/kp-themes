/** What the browser's own message becomes when the field says nothing better. */
export declare const fallback: () => string;
/**
 * The name a summary line uses for a field: its label, its
 * `aria-label`, or as a last resort its name attribute.
 *
 * @param {HTMLElement} field
 */
export declare function nameOf(field: HTMLElement): string;
/**
 * What carries the state for this control.
 *
 * For everything except a radio that is the control itself. A radio
 * belongs to a group, and `aria-invalid` on one button says the wrong
 * thing about the other three, so the group carries it.
 *
 * @param {HTMLElement} field
 * @returns {HTMLElement}
 */
export declare function stateHolder(field: HTMLElement): HTMLElement;
/**
 * Show a message on a field — the browser's, or one the server found.
 *
 * @param {HTMLElement} field
 * @param {string} message
 * @param {{ wrapper?: string, invalidClass?: string }} [options]
 */
export declare function showError(field: HTMLElement, message: string, { wrapper, invalidClass }?: {
    wrapper?: string;
    invalidClass?: string;
}): void;
/**
 * Clear what showError put there.
 *
 * @param {HTMLElement} field
 * @param {{ wrapper?: string, invalidClass?: string }} [options]
 */
export declare function clearError(field: HTMLElement, { wrapper, invalidClass }?: {
    wrapper?: string;
    invalidClass?: string;
}): void;
