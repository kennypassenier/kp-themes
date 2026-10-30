export type AvState = import('./types.js').AvState;
export type AvailabilityAnswer = import('./types.js').AvailabilityAnswer;
export type AvailabilityAnswers = import('./types.js').AvailabilityAnswers;
export type AvailabilitySpec = import('./types.js').AvailabilitySpec;
/** @typedef {import('./types.js').AvState} AvState */
/** @typedef {import('./types.js').AvailabilityAnswer} AvailabilityAnswer */
/** @typedef {import('./types.js').AvailabilityAnswers} AvailabilityAnswers */
/** @typedef {import('./types.js').AvailabilitySpec} AvailabilitySpec */
/**
 * Give the grid its people, columns and answers.
 * @param {HTMLElement} root @param {AvailabilitySpec} spec
 */
export declare function setAvailability(root: HTMLElement, spec: AvailabilitySpec): void;
/** The answers as they stand. @param {HTMLElement} root @returns {AvailabilityAnswers} */
export declare function availabilityAnswers(root: HTMLElement): AvailabilityAnswers;
/**
 * Change one cell as the page (no event): a push update from another person.
 * @param {HTMLElement} root @param {string} person @param {string} column @param {AvailabilityAnswer | null} answer
 */
export declare function setAvailabilityAnswer(root: HTMLElement, person: string, column: string, answer: AvailabilityAnswer | null): void;
/** @param {HTMLElement} root */
export declare function ensureParts(root: HTMLElement): void;
/** Give a state to a cell that is waiting for the server or refused. @param {HTMLElement} root @param {string[]} keys @param {string} person */
export declare function paintKeys(root: HTMLElement, person: string, keys: string[]): void;
