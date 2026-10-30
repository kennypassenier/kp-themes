/**
 * The cells of an identity pattern: FNV-1a over the seed, then a 5 by 5 grid mirrored about its middle column, a cell
 * filled where its bit is set. Pure and the same everywhere, so a name has one pattern on every page [kpadopt3].
 * @param {string} seed
 * @returns {[number, number][]} filled cells as [column, row], 0 to 4
 */
export declare function identityCells(seed: string): [number, number][];
/**
 * Draw (or take away) the identity pattern over a swatch: an SVG of the filled cells in the pattern's ink, inside a
 * one-cell margin, so the swatch's colour stays its ground.
 * @param {HTMLElement} swatch
 * @param {string | null} seed
 */
export declare function drawPattern(swatch: HTMLElement, seed: string | null): void;
