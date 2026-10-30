/** @typedef {import('./types.js').ArtKind} ArtKind */
/** @typedef {import('./types.js').ArtStroke} ArtStroke */
export type ArtKind = import('./types.js').ArtKind;
export type ArtStroke = import('./types.js').ArtStroke;
/**
 * Dark's set, the spectrum [kpadopt4]: every drawing is the instrument's screen. The screen is a frame cut on two opposite
 * corners with its grid faint; the baseline is the line's track; the film (the acting stroke) is what the spectral line has
 * laid; a bracket closes on a reading; coral is the one colour that is meaning. In a 120 by 72 box.
 * @type {Record<ArtKind, ArtStroke[]>}
 */
export declare const SPECTRUM: Record<ArtKind, ArtStroke[]>;
