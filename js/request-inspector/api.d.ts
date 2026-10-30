export type Memory = import('./format.js').Memory;
export type CapturedRequest = import('./format.js').CapturedRequest;
/**
 * Show a list of requests, newest first. An empty list is the empty state.
 * @param {HTMLElement} el
 * @param {readonly CapturedRequest[]} requests
 */
export declare function setRequests(el: HTMLElement, requests: readonly CapturedRequest[]): void;
/**
 * Put the list in one of the card's four states.
 * @param {HTMLElement} el
 * @param {'loading' | 'empty' | 'error' | 'ready'} state
 * @param {{ message?: string }} [options] the sentence of a failed list
 */
export declare function setRequestsState(el: HTMLElement, state: 'loading' | 'empty' | 'error' | 'ready', options?: {
    message?: string;
}): void;
