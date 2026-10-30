/** @typedef {import('./types.js').ArtKind} ArtKind */
/** @typedef {import('./types.js').ArtStroke} ArtStroke */
export type ArtKind = import('./types.js').ArtKind;
export type ArtStroke = import('./types.js').ArtStroke;
/**
 * Pastel's set, the sticker sheet [G7, G9, G18]: every drawing is something done to a page of a planner. A sticker is
 * white paper with its second pass, a flat sky shape 5 units off register (`line`, filled); the paper is `ink` (a closed
 * shape, filled with the card colour, outlined in plum); what is drawn on it is `rule` (plum, open); a mistake is `red`.
 * The last stroke of every drawing is the washi tape that holds it (the register fills it mint). In a 120 by 72 box,
 * strokes listed in the order they are stuck on.
 * @type {Record<ArtKind, ArtStroke[]>}
 */
export declare const STICKERS: Record<ArtKind, ArtStroke[]>;
