/**
 * @param {import('../strings.js').Strings} t
 * @param {import('../connection.js').ConnectionState} state
 * @param {{ attempt: number, pending: number, refusedWhy: string }} facts
 * @returns {string[]} the title and the reason
 */
export declare function textFor(t: import('../strings.js').Strings, state: import('../connection.js').ConnectionState, { attempt, pending, refusedWhy }: {
    attempt: number;
    pending: number;
    refusedWhy: string;
}): string[];
