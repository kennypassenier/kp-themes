export type IntentOptions = import('../intent.js').IntentOptions;
export type IntentItem = import('../intent.js').IntentItem;
/** @typedef {import('../intent.js').IntentOptions} IntentOptions */
/** @typedef {import('../intent.js').IntentItem} IntentItem */
/**
 * How well an item answers the typed words; -1 when it does not. A word found in the label counts 4 (one more when it
 * is the exact word, two more when it is the first typed word starting the label's first word); one found in the hint
 * or the hidden words counts 1.
 *
 * @param {IntentItem} item
 * @param {string[]} want the typed words (queryWords())
 * @param {IntentOptions} [options]
 */
export declare function intentScore(item: IntentItem, want: string[], options?: IntentOptions): number;
/**
 * Where the typed words start words of a text, as ranges of the text as written, merged and in order: what a list
 * marks so the reader sees why a row matched.
 *
 * @param {string} text
 * @param {string[]} want
 * @param {IntentOptions} [options]
 * @returns {[number, number][]}
 */
export declare function intentRanges(text: string, want: string[], options?: IntentOptions): [number, number][];
