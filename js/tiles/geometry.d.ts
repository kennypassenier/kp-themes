/** The marker of a board whose grids share one tile height. */
export declare const TILES_SET = "[data-kp-tiles-set]";
/** The variable a set writes on each of its grids: the floor of a row. */
export declare const TILE_ROW_MIN = "--kp-tile-row-min";
/** @param {Element} tile */
export declare const visible: (tile: Element) => boolean;
/** The marker of a board whose tiles are one place in the tab order, moved with the arrow keys. */
export declare const TILES_KEYS = "[data-kp-tiles-keys]";
/** Fired on the board when the arrow keys moved the focus to another tile: `{ from, to, key }`. */
export declare const TILES_MOVE_EVENT = "kp-tiles-move";
/** Fired on the board when Up was pressed on the first row: `{ direction: 'up' }`. */
export declare const TILES_EXIT_EVENT = "kp-tiles-exit";
/** The keys that move. */
export declare const MOVES: Set<string>;
/**
 * The element of a tile that takes the focus: the one marked `data-kp-tile-stop`, else the tile itself when it can be focused,
 * else its first link, button or field.
 * @param {Element} tile
 * @returns {HTMLElement | null}
 */
export declare function tileStop(tile: Element): HTMLElement | null;
/** @param {Element} board @returns {HTMLElement[]} every tile that can take the focus now, in document order */
export declare function keyTiles(board: Element): HTMLElement[];
/**
 * The words a tile is found by when a letter is typed: `data-kp-tile-name`, else its name (`.kp-entity__name`), else its stop's text.
 * @param {HTMLElement} tile
 */
export declare function tileName(tile: HTMLElement): string;
/**
 * The next tile whose name starts with the letters typed, from the one after `from` and round again. A letter typed again and again
 * (the whole buffer one repeated letter) steps through the tiles of that letter. Pure.
 * @param {readonly string[]} names the tiles' names, lower case, in document order
 * @param {number} from the index the focus is on
 * @param {string} typed the buffer, lower case
 * @returns {number | null}
 */
export declare function letterTile(names: readonly string[], from: number, typed: string): number | null;
/**
 * Where to go from a tile: pure geometry over the tiles' boxes. Left and Right keep to the row (the tiles whose centres stand
 * within half a tile of this one's), and wrap to the next or the previous row at its end; Up and Down take the nearest row in
 * that direction and, in it, the tile nearest in the column, so a group with a short last row sends Down to its last tile rather
 * than skipping a row.
 *
 * @param {readonly { left: number, right: number, top: number, bottom: number }[]} boxes the tiles, in document order
 * @param {number} from index of the tile the focus is on
 * @param {'left' | 'right' | 'up' | 'down' | 'first' | 'last'} way
 * @returns {number | null} the index to go to; null where there is nowhere (the first row's Up, the last row's Down)
 */
export declare function nextTile(boxes: readonly {
    left: number;
    right: number;
    top: number;
    bottom: number;
}[], from: number, way: 'left' | 'right' | 'up' | 'down' | 'first' | 'last'): number | null;
/** A field, a slider, a menu or an editable area keeps its own arrows and letters. */
export declare const KEEPS_KEYS = "input:not([type=\"checkbox\"]):not([type=\"radio\"]):not([type=\"button\"]), textarea, select, [contenteditable=\"\"], [contenteditable=\"true\"], [role=\"slider\"], [role=\"menu\"], [role=\"listbox\"], [data-kp-tiles-keys-ignore]";
