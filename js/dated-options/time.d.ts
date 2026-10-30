/**
 * How long ago a moment was, in words: "just now", "35 min ago", "3 h ago", "3 days ago". Pure.
 * @param {number} ms @param {number} now @param {import('../strings.js').Strings} [strings]
 */
export declare function datedAge(ms: number, now: number, strings?: import('../strings.js').Strings): string;
/**
 * The options in the order a picker shows them. Options without a moment keep their place after those with one. Pure.
 * @param {readonly import('./constants.js').DatedOption[]} options @param {'newest' | 'oldest' | 'given'} order
 * @returns {import('./constants.js').DatedOption[]}
 */
export declare function orderDated(options: readonly import('./constants.js').DatedOption[], order?: 'newest' | 'oldest' | 'given'): import('./constants.js').DatedOption[];
