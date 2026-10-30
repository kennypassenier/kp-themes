export type IntentOptions = import('../intent.js').IntentOptions;
/**
 * Whether a typed word starts a word of the text (or, with `typo`, almost does).
 * @param {string} have a word of the text
 * @param {string} want a typed word
 * @param {IntentOptions} [options]
 */
export declare function startsWord(have: string, want: string, { typo }?: IntentOptions): boolean;
/**
 * Whether every typed word starts one of the text's words, in any order. An empty query matches everything.
 * @param {string} text
 * @param {string} query
 * @param {IntentOptions} [options]
 */
export declare function matchIntent(text: string, query: string, options?: IntentOptions): boolean;
