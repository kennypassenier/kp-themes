/** @typedef {import('./types.js').ArtKind} ArtKind */
/** @typedef {import('./types.js').ArtStroke} ArtStroke */
export type ArtKind = import('./types.js').ArtKind;
export type ArtStroke = import('./types.js').ArtStroke;
/**
 * Nostromo's set, the console [kpadopt4]: every drawing is a vector the ship's computer writes on an amber screen, of the
 * hardware the case is made of: a cassette bay, a scope, a tape reel, a jack, a row of lamps, a key switch. The register
 * sets the drawing in dark glass: `rule` is the lit phosphor, `line` the dim trace, `ink` the cream of the case's own
 * markings, `red` the alarm. In a 120 by 72 box, strokes in the order the beam writes them, top down.
 * @type {Record<ArtKind, ArtStroke[]>}
 */
export declare const CONSOLE: Record<ArtKind, ArtStroke[]>;
