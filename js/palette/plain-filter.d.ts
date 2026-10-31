export type Matcher = import('./types.js').Matcher;
/** @typedef {import('./types.js').Matcher} Matcher */
/**
 * Show the commands `matcher` finds for `query`, on the label and not on the kbd hint; the markup's own indentation is not part of
 * the name, so a start of the name starts at its first letter. A group whose commands all vanished vanishes with them.
 * @param {HTMLElement} list @param {HTMLElement | null} status @param {Matcher} matcher @param {string} query
 * @returns {number} how many are shown
 */
export declare function filterPlain(list: HTMLElement, status: HTMLElement | null, matcher: Matcher, query: string): number;
