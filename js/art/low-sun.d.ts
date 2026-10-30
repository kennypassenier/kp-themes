/** @typedef {import('./types.js').ArtKind} ArtKind */
/** @typedef {import('./types.js').ArtStroke} ArtStroke */
export type ArtKind = import('./types.js').ArtKind;
export type ArtStroke = import('./types.js').ArtStroke;
/**
 * Solstice's set, the low sun [kpadopt4]: every drawing is something the sun does on a horizon. The horizon is a faint line
 * and what is drawn comes up from it, so the strokes are listed from the foot upward, the order they rise in; the sun and
 * what acts is amber, the rays and the arc its path, what needs the eye a red sky. Round at every end.
 * @type {Record<ArtKind, ArtStroke[]>}
 */
export declare const LOW_SUN: Record<ArtKind, ArtStroke[]>;
