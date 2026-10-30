export { TILES_SET, TILE_ROW_MIN, TILES_KEYS, TILES_MOVE_EVENT, TILES_EXIT_EVENT, tileStop, letterTile, nextTile } from './tiles/geometry.js';
export { tileSets, evenTileSet } from './tiles/sets.js';
/**
 * Keep every tile set under `root` even: now, and whenever a tile changes
 * size or content, a grid's width changes, a fold opens or closes, or a set
 * or grid is added or removed.
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export declare function attachTileSets(root?: ParentNode): () => void;
/**
 * Make the tiles under every `[data-kp-tiles-keys]` one place in the tab order, moved with the arrow keys. Idempotent.
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export declare function attachTileKeys(root?: ParentNode): () => void;
