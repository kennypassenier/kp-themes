export type RunInput = import('../runs.js').RunInput;
export type Run = import('../runs.js').Run;
/** @typedef {import('../runs.js').RunInput} RunInput */
/** @typedef {import('../runs.js').Run} Run */
/** @param {RunInput} input @returns {Run | null} */
export declare function toRun(input: RunInput): Run | null;
