export type AvState = import('./types.js').AvState;
export type AvailabilityAnswer = import('./types.js').AvailabilityAnswer;
/** @typedef {import('./types.js').AvState} AvState */
/** @typedef {import('./types.js').AvailabilityAnswer} AvailabilityAnswer */
/**
 * Ask for a change of one or more cells in one row.
 * @param {HTMLElement} root @param {string} person @param {string[]} keys @param {AvailabilityAnswer | null} answer
 * @param {{ stroke?: boolean }} [options]
 */
export declare function request(root: HTMLElement, person: string, keys: string[], answer: AvailabilityAnswer | null, { stroke }?: {
    stroke?: boolean;
}): Promise<void>;
