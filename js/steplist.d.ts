export { STEPLIST_SELECTOR, STEP_ID_ATTRIBUTE, STEPLIST_EVENT, STEP_STATES } from './steplist/values.js';
export { buildSteplist, setStep } from './steplist/build.js';
export type StepState = 'pending' | 'running' | 'done' | 'failed' | 'skipped' | 'current';
export type StepRow = {
    /**
     * names the step for setStep(); defaults to its index
     */
    id?: string;
    title: string;
    /**
     * the one-line description under the title; give every step one, so a note arriving later moves nothing
     */
    note?: string;
    /**
     * pending when absent
     */
    state?: StepState;
    /**
     * how long it took, as the page prints it (in a journey: the date the step was reached)
     */
    time?: string;
    /**
     * the step's own colour, `--chart-1` … `--chart-5` (`data-kp-tone`) [kpadopt4]
     */
    tone?: 1 | 2 | 3 | 4 | 5;
};
/**
 * @typedef {'pending' | 'running' | 'done' | 'failed' | 'skipped' | 'current'} StepState
 * @typedef {object} StepRow
 * @property {string} [id] names the step for setStep(); defaults to its index
 * @property {string} title
 * @property {string} [note] the one-line description under the title; give every step one, so a note arriving later moves nothing
 * @property {StepState} [state] pending when absent
 * @property {string} [time] how long it took, as the page prints it (in a journey: the date the step was reached)
 * @property {1 | 2 | 3 | 4 | 5} [tone] the step's own colour, `--chart-1` … `--chart-5` (`data-kp-tone`) [kpadopt4]
 */
/**
 * Sync every `.kp-steplist` under `root`, and follow `data-state` changes
 * later, so a framework or a hand-written `setAttribute` is followed too.
 * A list rendered after this ran is attached by calling it on that subtree.
 *
 * @param {ParentNode} [root]
 * @returns {() => void} detach: stops following the lists
 */
export declare function attachSteplists(root?: ParentNode): () => void;
