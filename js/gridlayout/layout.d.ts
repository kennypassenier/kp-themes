export type Tile = import('../gridlayout.js').Tile;
/** @typedef {import('../gridlayout.js').Tile} Tile */
/**
 * @param {HTMLElement} grid
 * @returns {Tile[]}
 */
export declare function layoutOf(grid: HTMLElement): Tile[];
/**
 * Put a stored layout back on the tiles. Tiles the layout does not name
 * keep their place; ids the grid does not have are ignored.
 *
 * @param {HTMLElement} grid
 * @param {readonly Tile[]} layout
 */
export declare function applyLayout(grid: HTMLElement, layout: readonly Tile[]): void;
