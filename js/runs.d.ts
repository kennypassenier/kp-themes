export { RUNS, RUNS_RETRY_EVENT, RUNS_STATES } from './runs/values.js';
export { runsRelative, zoneOffset, runMoment, clockShift } from './runs/time.js';
export type RunInput = number | string | Date | {
    at: number | string | Date;
    conflict?: string;
};
export type Run = {
    /**
     * ms
     */
    at: number;
    conflict?: string;
};
export type RunsState = 'ready' | 'empty' | 'loading' | 'error';
export type RunsOptions = {
    /**
     * the sentence an empty list shows ("Pick a time")
     */
    reason?: string;
    /**
     * an error's first line
     */
    title?: string;
    /**
     * an error's sentence
     */
    text?: string;
};
export type RunsHandle = {
    element: HTMLElement;
    /**
     * the times; none is the empty state
     */
    set: (times: readonly RunInput[], options?: RunsOptions) => void;
    setState: (state: RunsState, options?: RunsOptions) => void;
    runs: () => Run[];
    state: () => RunsState;
};
/**
 * @typedef {number | string | Date | { at: number | string | Date, conflict?: string }} RunInput
 * @typedef {object} Run
 * @property {number} at ms
 * @property {string} [conflict]
 * @typedef {'ready' | 'empty' | 'loading' | 'error'} RunsState
 * @typedef {object} RunsOptions
 * @property {string} [reason] the sentence an empty list shows ("Pick a time")
 * @property {string} [title] an error's first line
 * @property {string} [text] an error's sentence
 */
/**
 * @typedef {object} RunsHandle
 * @property {HTMLElement} element
 * @property {(times: readonly RunInput[], options?: RunsOptions) => void} set the times; none is the empty state
 * @property {(state: RunsState, options?: RunsOptions) => void} setState
 * @property {() => Run[]} runs
 * @property {() => RunsState} state
 */
/** The handle of an attached list. @param {Element} element @returns {RunsHandle | null} */
export declare function runs(element: Element): RunsHandle | null;
/**
 * Give a list its times (none: the empty state, with `reason`).
 * @param {Element} element @param {readonly RunInput[]} times @param {RunsOptions} [options]
 */
export declare function setRuns(element: Element, times: readonly RunInput[], options?: RunsOptions): void;
/**
 * Put a list in a state: ready, empty, loading or error.
 * @param {Element} element @param {RunsState} state @param {RunsOptions} [options]
 */
export declare function setRunsState(element: Element, state: RunsState, options?: RunsOptions): void;
/**
 * Wire every next-times list under `root`.
 * @param {ParentNode} [root]
 * @param {{ now?: () => number }} [options]
 * @returns {() => void} detach
 */
export declare function attachRuns(root?: ParentNode, options?: {
    now?: () => number;
}): () => void;
