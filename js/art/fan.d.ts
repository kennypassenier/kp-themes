/** @typedef {import('./types.js').ArtKind} ArtKind */
/** @typedef {import('./types.js').ArtStroke} ArtStroke */
export type ArtKind = import('./types.js').ArtKind;
export type ArtStroke = import('./types.js').ArtStroke;
/**
 * Deco's set, the lobby's fan [kpadopt4]: every drawing is the fan, the deco gesture, in gold hairlines: closed it is a
 * pointed shape standing on its pivot (a lozenge) over the double rule, open it is ribs from that pivot with the leaf's arcs
 * across them. Strokes are listed from the centre outward, the order the inlay is drawn in, two at a time. The lozenge is
 * the jewel, the chevron the cut, ruby only where something broke.
 * @type {Record<ArtKind, ArtStroke[]>}
 */
export declare const FAN: Record<ArtKind, ArtStroke[]>;
