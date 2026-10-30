/**
 * Whether the step's fields are all valid; the first invalid one is shown and focused.
 * @param {HTMLElement | undefined} step
 * @returns {boolean}
 */
export declare function stepIsValid(step: HTMLElement | undefined): boolean;
/**
 * The way out of a message the wizard wrote [KT6]: a field it marked
 * is checked again as it changes, and the mark goes once it is valid.
 *
 * @param {Event} event
 */
export declare function recheckField(event: Event): void;
