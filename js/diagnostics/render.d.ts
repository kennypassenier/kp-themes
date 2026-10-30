export type Side = import('../diagnostics.js').Side;
export type Report = import('../diagnostics.js').Report;
export type Strings = import('../strings.js').Strings;
/**
 * Render the report into an element, as a table and one sentence.
 *
 * Every side is overridable, which is how the test feeds it a pair it
 * knows to be wrong [KT6]: nothing here reaches for a value it was not
 * given or could not read from the page it was pointed at.
 *
 * @param {Element} target
 * @param {{ root?: Element, stylesheet?: Side, script?: Side, strings?: Strings }} [options]
 * @returns {Report} the report it just drew
 */
export declare function renderDiagnostics(target: Element, { root, stylesheet, script, strings }?: {
    root?: Element;
    stylesheet?: Side;
    script?: Side;
    strings?: Strings;
}): Report;
