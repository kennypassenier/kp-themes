export type DiffLine = import('./types.js').DiffLine;
export type Part = import('./types.js').Part;
/** @typedef {import('./types.js').DiffLine} DiffLine */
/** @typedef {import('./types.js').Part} Part */
/**
 * Cut a hunk's lines into stretches that show and stretches that fold. A run of unchanged lines keeps `keep` lines next to
 * every change and folds the middle when that hides at least `min` lines; a run at the start or the end of the hunk keeps
 * its lines next to the change only. A hunk with no change, and `keep` of 0, fold nothing.
 *
 * @param {readonly DiffLine[]} lines @param {number} [keep] @param {number} [min]
 * @returns {Part[]}
 */
export declare function foldContext(lines: readonly DiffLine[], keep?: number, min?: number): Part[];
