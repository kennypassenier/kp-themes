// Movable grid layout, framework-free [TH56].
//
// The dashboard a reader arranges themselves: tiles that move and resize
// on a coarse grid, and a layout that can be handed back to the consumer
// to store. It is the most impressive thing in this round to look at and
// the one where "impressive" and "usable" pull hardest against each other.
//
// So: **every gesture has a keyboard equivalent, and the keyboard one is
// the one that is tested.** Arrows move a tile, Shift+arrows resize it,
// and the tile says where it is and how big it is in words. A drag-only
// dashboard is a dashboard some people simply cannot arrange.
//
//   <div class="kp-grid" data-kp-grid data-kp-columns="6">
//     <div class="kp-grid__tile" data-kp-tile="cpu" data-x="0" data-y="0"
//          data-w="2" data-h="1" tabindex="0" role="group"
//          aria-label="CPU">…</div>
//   </div>
//
// The position lives in data attributes rather than in inline styles,
// because the consumer stores the numbers and the stylesheet turns them
// into a grid area. Reading a layout back out of a style string is how a
// dashboard loses someone's arrangement.

import { getStrings } from './strings.js';
const GRID = '[data-kp-grid]';
const TILE = '[data-kp-tile]';

/** Fired when a tile moves or resizes. A contract value [TH26]: the detail is the whole layout. */
export const LAYOUT_EVENT = 'kp-grid-layout';

/** Columns when the grid does not say. An operational knob. */
export const COLUMNS = 6;

/**
 * @param {HTMLElement} grid
 * @returns {{ id: string, x: number, y: number, w: number, h: number }[]}
 */
export function layoutOf(grid) {
    return [...grid.querySelectorAll(TILE)].map((element) => {
        const tile = /** @type {HTMLElement} */ (element);
        return {
            id: tile.dataset.kpTile ?? '',
            x: Number(tile.dataset.x ?? 0),
            y: Number(tile.dataset.y ?? 0),
            w: Number(tile.dataset.w ?? 1),
            h: Number(tile.dataset.h ?? 1),
        };
    });
}

/**
 * @param {ParentNode} root
 * @returns {() => void} detach
 */
export function attachGrids(root = document) {
    /** @type {(() => void)[]} */
    const cleanups = [];

    for (const element of root.querySelectorAll(GRID)) {
        const grid = /** @type {HTMLElement} */ (element);
        if (grid.dataset.kpGridAttached !== undefined) continue;
        grid.dataset.kpGridAttached = '';
        const columns = Number.parseInt(grid.dataset.kpColumns ?? '', 10) || COLUMNS;
        grid.style.setProperty('--kp-grid-columns', String(columns));

        /** @param {HTMLElement} tile */
        const place = (tile) => {
            const x = Number(tile.dataset.x ?? 0);
            const y = Number(tile.dataset.y ?? 0);
            const w = Number(tile.dataset.w ?? 1);
            const h = Number(tile.dataset.h ?? 1);
            tile.style.gridColumn = `${x + 1} / span ${w}`;
            tile.style.gridRow = `${y + 1} / span ${h}`;
            // Said in words, because a tile that only announces itself by
            // moving is a tile nobody without sight can arrange.
            const s = getStrings();
            const name = tile.dataset.kpLabel ?? tile.dataset.kpTile ?? s.tileFallbackName;
            tile.setAttribute('aria-label', s.tileLabel(name, x + 1, y + 1, w, h));
        };

        const announce = () => grid.dispatchEvent(new CustomEvent(LAYOUT_EVENT, { bubbles: true, detail: { layout: layoutOf(grid) } }));

        /** @param {KeyboardEvent} event */
        const onKey = (event) => {
            const tile = /** @type {HTMLElement | null} */ (/** @type {HTMLElement} */ (event.target).closest(TILE));
            if (tile === null) return;
            const x = Number(tile.dataset.x ?? 0);
            const y = Number(tile.dataset.y ?? 0);
            const w = Number(tile.dataset.w ?? 1);
            const h = Number(tile.dataset.h ?? 1);

            /** @param {number} nx @param {number} ny @param {number} nw @param {number} nh */
            const set = (nx, ny, nw, nh) => {
                // Clamped to the grid rather than allowed off the edge: a
                // tile in column nine of a six-column grid is a tile
                // nobody can see and nobody can get back.
                const width = Math.max(1, Math.min(nw, columns));
                tile.dataset.w = String(width);
                tile.dataset.h = String(Math.max(1, nh));
                tile.dataset.x = String(Math.max(0, Math.min(nx, columns - width)));
                tile.dataset.y = String(Math.max(0, ny));
                place(tile);
                announce();
                event.preventDefault();
            };

            if (event.shiftKey) {
                switch (event.key) {
                    case 'ArrowRight':
                        return set(x, y, w + 1, h);
                    case 'ArrowLeft':
                        return set(x, y, w - 1, h);
                    case 'ArrowDown':
                        return set(x, y, w, h + 1);
                    case 'ArrowUp':
                        return set(x, y, w, h - 1);
                    default:
                        return;
                }
            }
            switch (event.key) {
                case 'ArrowRight':
                    return set(x + 1, y, w, h);
                case 'ArrowLeft':
                    return set(x - 1, y, w, h);
                case 'ArrowDown':
                    return set(x, y + 1, w, h);
                case 'ArrowUp':
                    return set(x, y - 1, w, h);
                default:
                    return;
            }
        };

        for (const tile of grid.querySelectorAll(TILE)) place(/** @type {HTMLElement} */ (tile));
        grid.addEventListener('keydown', onKey);

        cleanups.push(() => {
            grid.removeEventListener('keydown', onKey);
            delete grid.dataset.kpGridAttached;
        });
    }

    return () => {
        for (const c of cleanups) c();
    };
}

if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => attachGrids());
    else attachGrids();
}
