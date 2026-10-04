// Tiles of one height across a board [scope-143; port spec H].
//
// `.kp-tiles` makes every tile of ONE grid as tall as its tallest, in CSS
// alone. A board of several grids (groups of tiles, each under its own
// heading, a fold, a column) needs the tiles of all of them to share one
// height, or the groups drift apart as soon as one tile wraps a line. Mark
// the board, and the grids under it are one set:
//
//   <div class="board" data-kp-tiles-set="apps">
//       <details open><summary>Media</summary><ul class="kp-tiles">…</ul></details>
//       <ul class="kp-tiles">…</ul>
//   </div>
//
// A `.kp-tiles` inside an element with `data-kp-tiles-set`, or carrying it
// itself, belongs to that set; two branches of the page that carry the same
// non-empty name are one set. attachTileSets(root) measures the natural
// height of every visible tile in a set (not in a closed `<details>`, not
// hidden), the tallest wins, and every grid in the set gets it as
// `--kp-tile-row-min`, the floor of its rows. It runs in one animation frame
// after a tile's size or content changes, a grid's width changes, a fold
// opens or closes or a set gains or loses a grid; it writes only when the
// height changed, so a refresh that redraws the same tiles writes nothing,
// and its own write never wakes it again. A skeleton tile counts as a tile.
//
// Nothing runs on import; attachTileSets(root) returns a detach.

/** The marker of a board whose grids share one tile height. */
export const TILES_SET = '[data-kp-tiles-set]';

/** The variable a set writes on each of its grids: the floor of a row. */
export const TILE_ROW_MIN = '--kp-tile-row-min';

/** @param {Element} tile */
const visible = (tile) => {
    if (tile instanceof HTMLElement && tile.hidden) return false;
    const fold = tile.closest('details:not([open])');
    if (fold && !tile.closest('summary')) return false;
    return tile.getClientRects().length > 0;
};

/**
 * The sets under `root`, each with its grids: by name where the marker has
 * one, else by the marked element.
 * @param {ParentNode} root
 * @returns {Map<unknown, HTMLElement[]>}
 */
export function tileSets(root) {
    /** @type {Map<unknown, HTMLElement[]>} */
    const sets = new Map();
    const scope = /** @type {ParentNode} */ (root);
    const grids = [...(scope instanceof Element && scope.matches('.kp-tiles') ? [scope] : []), ...scope.querySelectorAll('.kp-tiles')];
    for (const grid of grids) {
        const mark = grid.closest(TILES_SET);
        if (!mark || !(grid instanceof HTMLElement)) continue;
        const name = mark.getAttribute('data-kp-tiles-set');
        const key = name ? `name:${name}` : mark;
        const list = sets.get(key) ?? [];
        list.push(grid);
        sets.set(key, list);
    }
    return sets;
}

/**
 * Even one set: every grid's rows at least as tall as the set's tallest
 * visible tile. Each tile is read at its natural height while the grids
 * carry `data-kp-tiles-measuring` (the stylesheet lets their rows size to
 * content for that one synchronous step), and the floor is written only
 * where it changed.
 * @param {HTMLElement[]} grids
 * @returns {number} the floor, in px (0 for a set with no visible tile)
 */
export function evenTileSet(grids) {
    const tiles = grids.flatMap((grid) => [...grid.children].filter(visible));
    let tallest = 0;
    if (tiles.length) {
        for (const grid of grids) grid.setAttribute('data-kp-tiles-measuring', '');
        for (const tile of tiles) tallest = Math.max(tallest, tile.getBoundingClientRect().height);
        for (const grid of grids) grid.removeAttribute('data-kp-tiles-measuring');
    }
    const value = tallest > 0 ? `${Math.round(tallest * 100) / 100}px` : '';
    for (const grid of grids) {
        if (grid.style.getPropertyValue(TILE_ROW_MIN) === value) continue;
        if (value) grid.style.setProperty(TILE_ROW_MIN, value);
        else grid.style.removeProperty(TILE_ROW_MIN);
    }
    return tallest;
}

/**
 * Keep every tile set under `root` even: now, and whenever a tile changes
 * size or content, a grid's width changes, a fold opens or closes, or a set
 * or grid is added or removed.
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export function attachTileSets(root = document) {
    const doc = root instanceof Document ? root : (root.ownerDocument ?? document);
    const view = doc.defaultView;
    const evenAll = () => {
        for (const grids of tileSets(root).values()) evenTileSet(grids);
    };
    if (!view || typeof view.ResizeObserver !== 'function') {
        evenAll();
        return () => {};
    }
    /** @type {Set<Element>} */
    const observed = new Set();
    let queued = 0;
    const run = () => {
        queued = 0;
        const sets = tileSets(root);
        /** @type {Set<Element>} */
        const now = new Set();
        for (const grids of sets.values())
            for (const grid of grids) {
                now.add(grid);
                for (const tile of grid.children) now.add(tile);
            }
        for (const el of observed) if (!now.has(el)) sizes.unobserve(el);
        for (const el of now) if (!observed.has(el)) sizes.observe(el);
        observed.clear();
        for (const el of now) observed.add(el);
        for (const grids of sets.values()) evenTileSet(grids);
    };
    const queue = () => {
        if (!queued) queued = view.requestAnimationFrame(run);
    };
    const sizes = new view.ResizeObserver(queue);
    /** @param {Node} node */
    const inSet = (node) => {
        const el = node instanceof view.Element ? node : node.parentElement;
        return el !== null && (el.closest(TILES_SET) !== null || el.querySelector(TILES_SET) !== null);
    };
    const changes = new view.MutationObserver((records) => {
        const grid = `.kp-tiles, ${TILES_SET}`;
        const leaves = (/** @type {Node} */ n) => n instanceof view.Element && (n.matches(grid) || n.querySelector(grid) !== null);
        if (records.some((r) => inSet(r.target) || [...r.removedNodes].some(leaves))) queue();
    });
    changes.observe(root instanceof Document ? root.documentElement : /** @type {Node} */ (root), {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
        attributeFilter: ['hidden', 'open', 'class', 'data-kp-tiles-set'],
    });
    // A fold's `toggle` does not bubble; caught on the way down.
    const target = /** @type {EventTarget} */ (/** @type {unknown} */ (root));
    target.addEventListener('toggle', queue, true);
    doc.fonts?.addEventListener?.('loadingdone', queue);
    run();
    return () => {
        changes.disconnect();
        sizes.disconnect();
        target.removeEventListener('toggle', queue, true);
        doc.fonts?.removeEventListener?.('loadingdone', queue);
        if (queued) view.cancelAnimationFrame(queued);
    };
}
