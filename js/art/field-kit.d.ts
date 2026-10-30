/** @typedef {import('./types.js').ArtKind} ArtKind */
/** @typedef {import('./types.js').ArtStroke} ArtStroke */
export type ArtKind = import('./types.js').ArtKind;
export type ArtStroke = import('./types.js').ArtStroke;
/**
 * Forest's set, the field kit [G7, G14]: every drawing is something on a ranger's map or in the wood it describes. The
 * map sheet has the leaf corner (`ink`, the outline of a plate); what is drawn on it is the wood: contour lines are
 * `line`, the trail, a tree and a trig point are `rule` (the acting green), a blaze that marks a fault is `red`. In a 120
 * by 72 box, strokes listed from the ground up, the order they grow in.
 * @type {Record<ArtKind, ArtStroke[]>}
 */
export declare const FIELD_KIT: Record<ArtKind, ArtStroke[]>;
