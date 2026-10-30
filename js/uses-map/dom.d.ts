/** The SVG namespace the lines are drawn in. */
export declare const SVG_NS = "http://www.w3.org/2000/svg";
/** The mark each tone puts before its label (never colour alone). */
export declare const TONE_GLYPH: Readonly<{
    ok: "✓";
    warn: "!";
    bad: "×";
    muted: "–";
}>;
export type UsesLine = import('../uses-map.js').UsesLine;
/** @typedef {import('../uses-map.js').UsesLine} UsesLine */
/** @param {Document} doc @param {string} tag @param {string} cls */
export declare const make: (doc: Document, tag: string, cls: string) => HTMLElement;
/** @param {Element} el @param {string} name @param {string} fallback */
export declare const attr: (el: Element, name: string, fallback: string) => string;
/**
 * The words of a line: the tone's mark and the label, in one span [r3r5-1019 line-tone].
 * @param {Document} doc @param {string} cls @param {UsesLine} line
 */
export declare function tagOf(doc: Document, cls: string, line: UsesLine): HTMLElement;
