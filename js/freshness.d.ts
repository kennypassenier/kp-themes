export { AGO, FRESHNESS_TIME_ZONE } from './freshness/values.js';
export { humanDuration, agoText, agoMoment, momentOf } from './freshness/text.js';
export { setAgo } from './freshness/engine.js';
export type Strings = import('./strings.js').Strings;
export type AgoContext = {
    timeZone: string;
    now: () => number;
    /**
     * the attach's own words, over the dictionary's as they stand
     */
    overrides: Partial<Strings> | undefined;
    /**
     * the attach that found the line
     */
    owner: object;
};
export type AgoState = {
    /**
     * the moment last painted
     */
    at: number | null | undefined;
    /**
     * the text the reserved width was measured from
     */
    sample: string;
    /**
     * the stale state last painted (null before the first)
     */
    stale: boolean | null;
};
/** @typedef {import('./strings.js').Strings} Strings */
/**
 * @typedef {object} AgoContext
 * @property {string} timeZone
 * @property {() => number} now
 * @property {Partial<Strings> | undefined} overrides the attach's own words, over the dictionary's as they stand
 * @property {object} owner the attach that found the line
 */
/**
 * @typedef {object} AgoState
 * @property {number | null | undefined} at the moment last painted
 * @property {string} sample the text the reserved width was measured from
 * @property {boolean | null} stale the stale state last painted (null before the first)
 */
/**
 * Keep every freshness line under `root` ticking, now and as lines arrive,
 * change or leave. One timer serves the whole page.
 *
 * @param {ParentNode} [root]
 * @param {{ timeZone?: string, now?: () => number, strings?: Partial<Strings> }} [options]
 * @returns {() => void} detach
 */
export declare function attachAgo(root?: ParentNode, { timeZone, now, strings }?: {
    timeZone?: string;
    now?: () => number;
    strings?: Partial<Strings>;
}): () => void;
