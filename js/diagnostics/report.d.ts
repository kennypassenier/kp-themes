export type Side = import('../diagnostics.js').Side;
export type Report = import('../diagnostics.js').Report;
/** @typedef {import('../diagnostics.js').Side} Side */
/** @typedef {import('../diagnostics.js').Report} Report */
/**
 * Lay the two halves beside each other and name the one that is behind.
 *
 * Pure: same arguments, same report, no document and no clock. The test
 * that measures this feeds it a pair it knows to be mismatched, because a
 * verdict that has only ever seen a matching pair has never been read.
 *
 * @param {Side} stylesheet
 * @param {Side} script
 * @param {import('../strings.js').Strings} [strings]
 * @returns {Report}
 */
export declare function diagnose(stylesheet: Side, script: Side, strings?: import('../strings.js').Strings): Report;
/**
 * The same judgement, over the page this runs on.
 *
 * @param {{ root?: Element, strings?: import('../strings.js').Strings }} [options]
 * @returns {Report}
 */
export declare function diagnostics({ root, strings }?: {
    root?: Element;
    strings?: import('../strings.js').Strings;
}): Report;
