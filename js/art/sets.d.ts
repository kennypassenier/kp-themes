export type ArtKind = import('./types.js').ArtKind;
export type ArtStroke = import('./types.js').ArtStroke;
/** @typedef {import('./types.js').ArtKind} ArtKind */
/** @typedef {import('./types.js').ArtStroke} ArtStroke */
/** Every set the package has, by the name a register shows. @type {Record<string, Record<ArtKind, ArtStroke[]>>} */
export declare const ART_SETS: Record<string, Record<ArtKind, ArtStroke[]>>;
