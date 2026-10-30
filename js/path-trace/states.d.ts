import { getStrings } from '../strings.js';
export type TraceHop = import('../path-trace.js').TraceHop;
/** @typedef {import('../path-trace.js').TraceHop} TraceHop */
/**
 * The verdict of each hop once the first refusal stops the packet: `done`, `failed`, `skipped` or `pending`.
 * @param {readonly TraceHop[]} hops
 * @param {'first-refusal' | 'all'} [stop]
 * @returns {{ hop: TraceHop, state: 'done' | 'failed' | 'skipped' | 'pending' }[]}
 */
export declare function traceStates(hops: readonly TraceHop[], stop?: 'first-refusal' | 'all'): {
    hop: TraceHop;
    state: 'done' | 'failed' | 'skipped' | 'pending';
}[];
/**
 * The outcome in one sentence.
 * @param {readonly TraceHop[]} hops
 * @param {'first-refusal' | 'all'} [stop]
 */
export declare function traceSummary(hops: readonly TraceHop[], stop?: 'first-refusal' | 'all'): string;
/**
 * The word a hop's verdict is spoken as.
 * @param {'done' | 'failed' | 'skipped' | 'pending'} state
 * @param {ReturnType<typeof getStrings>} [s]
 */
export declare function verdictWord(state: 'done' | 'failed' | 'skipped' | 'pending', s?: ReturnType<typeof getStrings>): string;
/**
 * The trace as text for a bug report: "tv > Firewall refused (rule IoT to media) > Jellyfin not reached".
 * @param {readonly TraceHop[]} hops
 * @param {'first-refusal' | 'all'} [stop]
 */
export declare function traceText(hops: readonly TraceHop[], stop?: 'first-refusal' | 'all'): string;
