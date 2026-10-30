export type Side = import('../diagnostics.js').Side;
/** @typedef {import('../diagnostics.js').Side} Side */
/** The custom property carrying the stylesheet's version [AR25]. */
export declare const VERSION_PROPERTY = "--kp-themes-version";
/** The custom property carrying the stylesheet's theme names [AR25]. */
export declare const NAMES_PROPERTY = "--kp-themes-names";
/**
 * What the stylesheet on this page says about itself.
 *
 * A stylesheet older than 3.2.0 declares neither property, and that is
 * information rather than an error: it is older than any JavaScript that
 * can ask the question.
 *
 * @param {{ root?: Element }} [options]
 * @returns {Side}
 */
export declare function stylesheetSide({ root }?: {
    root?: Element;
}): Side;
/**
 * What the JavaScript on this page says about itself.
 *
 * @returns {Side}
 */
export declare function scriptSide(): Side;
