/** @typedef {import('./types.js').ArtKind} ArtKind */
/** @typedef {import('./types.js').ArtStroke} ArtStroke */
export type ArtKind = import('./types.js').ArtKind;
export type ArtStroke = import('./types.js').ArtStroke;
/**
 * Titanium's set, the machined part [kpadopt4]: every drawing is a part on a machinist's drawing, cut from bar stock with the
 * chamfer at its top start and bottom end corners: a blank plate, a plate probed, a plate fractured, a bar cut in two, a
 * part with its bore inspected, a part under its clasp. `rule` is the bare tool edge, `line` the faint grain and centre
 * lines, `ink` the part's own outline, `red` the fracture. In a 120 by 72 box, strokes listed in the order they are cut.
 * @type {Record<ArtKind, ArtStroke[]>}
 */
export declare const MACHINED: Record<ArtKind, ArtStroke[]>;
