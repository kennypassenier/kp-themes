export type Timer = import('./types.js').Timer;
/** @typedef {import('./types.js').Timer} Timer */
/**
 * A card for a timer, its parts in place.
 * @param {string} id
 * @returns {HTMLElement}
 */
export declare function buildCard(id: string): HTMLElement;
/** Bring a card in step with its timer. @param {Timer} timer */
export declare function paint(timer: Timer): void;
