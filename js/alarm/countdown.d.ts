/**
 * Write the countdown's two shares and its words. Shared with the React
 * channel, so both bars read the same two custom properties.
 *
 * @param {HTMLElement} dialog
 * @param {HTMLElement | null} left the words under the bar
 * @param {number} share the continuous share of the time left, 1 to 0
 * @param {number} stepped the share in whole seconds, for reduced motion
 * @param {string} words
 */
export declare function writeCountdown(dialog: HTMLElement, left: HTMLElement | null, share: number, stepped: number, words: string): void;
