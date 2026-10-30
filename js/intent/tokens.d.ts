export type IntentOptions = import('../intent.js').IntentOptions;
/**
 * The words of a text, each with where it stands in the text as written (so a match can be marked).
 *
 * @param {string} text
 * @param {IntentOptions} [options]
 * @returns {{ w: string, start: number, end: number }[]}
 */
export declare function intentTokens(text: string, { foldDiacritics, splitHyphen }?: IntentOptions): {
    w: string;
    start: number;
    end: number;
}[];
/**
 * The searchable words of a text: lower case, accents folded, hyphenated words also split.
 * @param {string} text
 * @param {IntentOptions} [options]
 * @returns {string[]}
 */
export declare const intentWords: (text: string, options?: IntentOptions) => string[];
/**
 * The words a person typed.
 * @param {string} query
 * @param {IntentOptions} [options]
 * @returns {string[]}
 */
export declare function queryWords(query: string, { foldDiacritics }?: IntentOptions): string[];
