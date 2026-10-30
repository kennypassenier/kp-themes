export type ArtKind = import('./types.js').ArtKind;
/** @typedef {import('./types.js').ArtKind} ArtKind */
/** @param {string} value @returns {value is ArtKind} */
export declare const isKind: (value: string) => value is ArtKind;
/**
 * The drawing for one kind: an svg with every set's group, hidden from a screen reader.
 * @param {Document} doc
 * @param {ArtKind} kind
 * @returns {SVGSVGElement}
 */
export declare function drawArt(doc: Document, kind: ArtKind): SVGSVGElement;
