/** @typedef {import('./types.js').ArtKind} ArtKind */
/** @typedef {import('./types.js').ArtStroke} ArtStroke */
export type ArtKind = import('./types.js').ArtKind;
export type ArtStroke = import('./types.js').ArtStroke;
/**
 * Synthwave's set, the floor [kpadopt4]: the empty state already carries the striped sun on its horizon, so each drawing is
 * what stands on the floor under it, in neon tubes: the marquee's bulbs (what waits), a ring (what is looked for or what
 * failed), the horizon's tube in two halves (what is cut), the lock on a shutter. Pink acts (the acting stroke), cyan
 * reads, red is a tube that failed; the floor's lines close on a point, nothing else runs diagonal. In a 120 by 72 box.
 * @type {Record<ArtKind, ArtStroke[]>}
 */
export declare const HORIZON: Record<ArtKind, ArtStroke[]>;
