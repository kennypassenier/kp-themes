/** @typedef {import('./types.js').ArtKind} ArtKind */
/** @typedef {import('./types.js').ArtStroke} ArtStroke */
export type ArtKind = import('./types.js').ArtKind;
export type ArtStroke = import('./types.js').ArtStroke;
/**
 * Cyberpunk's set, the HUD [kpadopt4]: every drawing is the system looking at a holo card. The card is a plate cut at its
 * dossier corner and its foot; scan lines are faint; the reticle (four corner brackets, the acting stroke in signal
 * yellow) is the system targeting; cyan reads out; red is the alarm. In a 120 by 72 box.
 * @type {Record<ArtKind, ArtStroke[]>}
 */
export declare const HUD: Record<ArtKind, ArtStroke[]>;
