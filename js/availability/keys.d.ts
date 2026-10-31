export type AvailabilityAnswer = import('./types.js').AvailabilityAnswer;
/**
 * Register the answer keys of one grid.
 * @param {HTMLElement} el the availability root
 * @returns {() => void} stop
 */
export declare function registerAvailabilityKeys(el: HTMLElement): () => void;
