export type AvailabilityAnswer = import('./types.js').AvailabilityAnswer;
/** @typedef {import('./types.js').AvailabilityAnswer} AvailabilityAnswer */
/** The next answer in a press. @param {HTMLElement} root @param {AvailabilityAnswer | undefined} now @returns {AvailabilityAnswer | null} */
export declare function next(root: HTMLElement, now: AvailabilityAnswer | undefined): AvailabilityAnswer | null;
/** Open the answers under a cell. @param {HTMLElement} root @param {HTMLElement} cell */
export declare function openMenu(root: HTMLElement, cell: HTMLElement): void;
