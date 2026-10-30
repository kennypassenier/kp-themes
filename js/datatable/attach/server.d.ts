export type DataAnswer = import('../events.js').DataAnswer;
export type DataRequest = import('../events.js').DataRequest;
export type TableContext = import('./context.js').TableContext;
export type ServerFields = {
    controller: AbortController | null;
    pending: number;
    request: () => void;
};
/** @typedef {import('../events.js').DataAnswer} DataAnswer */
/** @typedef {import('../events.js').DataRequest} DataRequest */
/** @typedef {import('./context.js').TableContext} TableContext */
/**
 * What the server mode: sending a request and applying the answer part adds to the table's context.
 *
 * @typedef {{
 *     controller: AbortController | null;
 *     pending: number;
 *     request: () => void;
 * }} ServerFields
 */
/**
 * Server mode: sending a request and applying the answer.
 *
 * @param {TableContext} c
 */
export declare function installServer(c: TableContext): void;
