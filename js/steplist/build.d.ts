export type StepRow = import('../steplist.js').StepRow;
export type StepState = import('../steplist.js').StepState;
/** @typedef {import('../steplist.js').StepRow} StepRow */
/** @typedef {import('../steplist.js').StepState} StepState */
/**
 * Build a step list from rows. The result still needs attachSteplists() (on
 * the element or its container) for the spoken parts.
 *
 * @param {StepRow[]} rows
 * @param {{ label?: string }} [options] `label`: the list's accessible name
 * @returns {HTMLOListElement}
 */
export declare function buildSteplist(rows: StepRow[], { label }?: {
    label?: string;
}): HTMLOListElement;
/**
 * Change one step. `key` is the step's `data-kp-step-id` or its index.
 *
 * @param {Element} list
 * @param {string | number} key
 * @param {{ state?: StepState, title?: string, note?: string, time?: string }} change
 * @returns {Element | null} the item, or null when there is no such step
 */
export declare function setStep(list: Element, key: string | number, change: {
    state?: StepState;
    title?: string;
    note?: string;
    time?: string;
}): Element | null;
