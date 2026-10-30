export { TRACE, TRACE_RULE_EVENT, TRACE_SWAP_EVENT, TRACE_RETRY_EVENT } from './path-trace/values.js';
export { traceStates, traceSummary, traceText } from './path-trace/states.js';
export type TraceHop = {
    /**
     * the thing the packet reaches (a device, a network, a rule, a target)
     */
    title: string;
    /**
     * one line under it
     */
    note?: string;
    verdict: 'allowed' | 'refused' | 'unknown';
    /**
     * the rule that decided it
     */
    rule?: string;
    /**
     * "tcp 8096"
     */
    ports?: string;
};
export type TraceHandle = {
    element: HTMLElement;
    /**
     * draw the hops (clears any state)
     */
    set: (hops: readonly TraceHop[]) => void;
    setState: (state: 'ready' | 'running' | 'empty' | 'error', options?: {
        message?: string;
    }) => void;
    /**
     * the trace as text
     */
    text: () => string;
};
/**
 * @typedef {object} TraceHop
 * @property {string} title the thing the packet reaches (a device, a network, a rule, a target)
 * @property {string} [note] one line under it
 * @property {'allowed' | 'refused' | 'unknown'} verdict
 * @property {string} [rule] the rule that decided it
 * @property {string} [ports] "tcp 8096"
 */
/**
 * @typedef {object} TraceHandle
 * @property {HTMLElement} element
 * @property {(hops: readonly TraceHop[]) => void} set draw the hops (clears any state)
 * @property {(state: 'ready' | 'running' | 'empty' | 'error', options?: { message?: string }) => void} setState
 * @property {() => string} text the trace as text
 */
/**
 * The handle of a trace.
 * @param {Element} el
 * @returns {TraceHandle | null}
 */
export declare function trace(el: Element): TraceHandle | null;
/**
 * Give every trace under `root` its parts; fill one with `setTrace` or the handle.
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export declare function attachTraces(root?: ParentNode): () => void;
/**
 * Draw the hops of a trace (attaching it first when it was not yet).
 * @param {HTMLElement} el
 * @param {readonly TraceHop[]} hops
 */
export declare function setTrace(el: HTMLElement, hops: readonly TraceHop[]): void;
