/** @typedef {import('./types.js').ArtKind} ArtKind */
/** @typedef {import('./types.js').ArtStroke} ArtStroke */
export type ArtKind = import('./types.js').ArtKind;
export type ArtStroke = import('./types.js').ArtStroke;
/**
 * Blueprint's set, the working drawing [G6, G13, G16]: every drawing is something a draughtsman does on a sheet. The part
 * is the finished line (`ink`), what the pen draws now is cyan (`rule`), the construction and the hatch are faint (`line`),
 * a flagged fault is `red`. In a 120 by 72 box, strokes listed in the order the pen draws them.
 * @type {Record<ArtKind, ArtStroke[]>}
 */
export declare const DRAWING: Record<ArtKind, ArtStroke[]>;
