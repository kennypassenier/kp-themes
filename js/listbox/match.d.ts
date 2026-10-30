/**
 * Does `text` match `query` as a subsequence, the way a command palette
 * matches? "thm" finds "Theme".
 *
 * Deliberately not a fuzzy-score library: this returns whether it matches
 * and the caller keeps its own order. A ranking function that nobody can
 * explain is how a palette starts putting the wrong thing first.
 *
 * @param {string} text
 * @param {string} query
 * @returns {boolean}
 */
export declare function subsequence(text: string, query: string): boolean;
