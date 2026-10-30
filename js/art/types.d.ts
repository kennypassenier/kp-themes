export type ArtKind = 'none' | 'nomatch' | 'error' | 'offline' | 'done' | 'locked';
export type ArtInk = 'rule' | 'line' | 'ink' | 'red';
export type ArtStroke = [ArtInk, string];
/**
 * @typedef {'none' | 'nomatch' | 'error' | 'offline' | 'done' | 'locked'} ArtKind
 * @typedef {'rule' | 'line' | 'ink' | 'red'} ArtInk the stroke's colour: the theme's acting colour, a faint ruled line, the page's ink, the destructive ink
 * @typedef {[ArtInk, string]} ArtStroke an ink and an SVG path, drawn in that order
 */
export {};
