/** @typedef {import('./types.js').ArtKind} ArtKind */
/** @typedef {import('./types.js').ArtStroke} ArtStroke */
export type ArtKind = import('./types.js').ArtKind;
export type ArtStroke = import('./types.js').ArtStroke;
/**
 * Brutalism's set, the slab [kpadopt4]: every drawing is a thing of weight on its footprint, drawn in the one ink line. A
 * slab is a square outline, its footprint the L of ground its hard shadow would fall on, and each stroke is listed in the
 * order it is set down: the ground first, then what falls on it. Nothing is round; a bolt is a small square; what is
 * wrong is taped off in red stripes.
 * @type {Record<ArtKind, ArtStroke[]>}
 */
export declare const SLAB: Record<ArtKind, ArtStroke[]>;
