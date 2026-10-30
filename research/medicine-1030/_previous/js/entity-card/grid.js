// The grid of cards: its data, its states and the attach.
import { getStrings } from '../strings.js';
import { openBusyCard } from '../busy-card.js';
import { statePlate } from '../state-plate.js';
import { ENTITY_GRID, ENTITY_GRID_RETRY_EVENT, ENTITY_NEW_EVENT } from './constants.js';
import { DRAWN, made } from './helpers.js';
import { redraw, setEntity } from './set.js';
/** @typedef {import('./types.js').EntityData} EntityData */
/** @typedef {import('./types.js').EntityEmptyOptions} EntityEmptyOptions */

/**
 * Draw a grid's cards from a list; a card whose key is already there changes in place, a gone key leaves, order follows the list.
 * @param {HTMLElement} grid
 * @param {readonly EntityData[]} list
 * @param {EntityEmptyOptions} [empty] how the plate reads when the list is empty (see `setEntityGridState`)
 */
export function setEntityGrid(grid, list, empty = {}) {
    grid.setAttribute('data-kp-entity-grid', '');
    grid.removeAttribute('data-kp-state');
    clearGridState(grid);
    const doc = grid.ownerDocument;
    // One card with a trend gives every card the row (`data-kp-entity-trend="auto"`), so the cards stay level.
    grid.toggleAttribute(
        'data-kp-entity-trended',
        list.some((d) => Array.isArray(d.trend)),
    );
    /** @type {Map<string, HTMLElement>} */
    const have = new Map();
    for (const card of /** @type {HTMLElement[]} */ ([...grid.querySelectorAll(':scope > .kp-card--entity')])) {
        const k = card.getAttribute('data-kp-entity-key');
        if (k && list.some((d) => d.key === k)) have.set(k, card);
        else card.remove();
    }
    if (list.length === 0) {
        setEntityGridState(grid, 'empty', empty);
        return;
    }
    let at = 0;
    for (const data of list) {
        let card = have.get(data.key);
        if (!card) {
            card = doc.createElement('article');
            card.setAttribute('role', 'listitem');
        }
        // In its place first, so the grid's options reach it; a card already in its place is not moved (a card under the pointer stays put).
        if (grid.children[at] !== card) grid.insertBefore(card, grid.children[at] ?? null);
        setEntity(card, data);
        at += 1;
    }
    grid.setAttribute('role', 'list');
}

/** @type {WeakMap<Element, import('../busy-card.js').BusyCard>} */
const BUSY = new WeakMap();

/** @param {HTMLElement} grid */
function clearGridState(grid) {
    BUSY.get(grid)?.remove();
    BUSY.delete(grid);
    for (const el of grid.querySelectorAll(':scope > .kp-stateplate, :scope > .kp-card--ghost')) el.remove();
    grid.removeAttribute('aria-busy');
}

/**
 * Put the whole grid in a state: `loading` (skeleton cards, as many as `options.count` or the cards it had, 6 at first, and the
 * busy card over them), `empty` ("No stacks yet" with its action) or `error` (the failed plate with Retry); a tile grid says "apps".
 * @param {HTMLElement} grid
 * @param {'loading' | 'empty' | 'error'} state
 * @param {{ count?: number, words?: string } & EntityEmptyOptions} [options] `words` is the busy card's line. The empty plate's action: `action: 'none'`
 * (or `data-kp-entity-empty-action="none"` on the grid) leaves it out, `actionLabel` words it, and `onAction` runs instead of the
 * `kp-entity-new` event
 */
export function setEntityGridState(grid, state, options = {}) {
    const doc = grid.ownerDocument;
    const s = getStrings();
    const had = grid.querySelectorAll(':scope > .kp-card--entity').length;
    const tiles = grid.getAttribute('data-kp-entity-kind') === 'tile';
    clearGridState(grid);
    grid.setAttribute('data-kp-state', state);
    for (const card of grid.querySelectorAll(':scope > .kp-card--entity')) card.remove();
    if (state === 'loading') {
        grid.setAttribute('aria-busy', 'true');
        for (let i = 0; i < (options.count ?? (had || 6)); i++) {
            const ghost = /** @type {HTMLElement} */ (made(doc, 'article', 'kp-card--ghost'));
            // In the grid first, so the grid's options (the kind of card) reach it.
            grid.append(ghost);
            setEntity(ghost, { key: `loading-${i}`, name: '', status: 'loading' });
            ghost.classList.add('kp-card--ghost');
        }
        BUSY.set(
            grid,
            openBusyCard(grid, {
                words: options.words ?? (tiles ? s.entityTileLoading : s.entityLoading),
                area: () => [grid],
                className: 'kp-entity__busy',
                arrive: true,
            }),
        );
        return;
    }
    const plate =
        state === 'error'
            ? statePlate(doc, {
                  kind: 'error',
                  title: options.title ?? (tiles ? s.entityTileGridFailed : s.entityGridFailed),
                  text: options.message ?? s.entityGridFailedText,
                  actionLabel: s.entityRetry,
                  onAction: () => grid.dispatchEvent(new CustomEvent(ENTITY_GRID_RETRY_EVENT, { bubbles: true })),
              })
            : statePlate(doc, {
                  kind: 'empty',
                  title: options.title ?? (tiles ? s.entityTileGridEmpty : s.entityGridEmpty),
                  ...(options.message ? { text: options.message } : {}),
                  ...((options.action ?? grid.getAttribute('data-kp-entity-empty-action')) === 'none'
                      ? {}
                      : {
                            actionLabel: options.actionLabel ?? (tiles ? s.entityTileNew : s.entityNew),
                            onAction: options.onAction ?? (() => grid.dispatchEvent(new CustomEvent(ENTITY_NEW_EVENT, { bubbles: true }))),
                        }),
              });
    grid.append(plate);
}

/**
 * Give every grid its options (the least card width) and keep the cards in step with them: a changed attribute draws every card again.
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export function attachEntityCards(root = document) {
    const grids = /** @type {HTMLElement[]} */ ([
        ...(root instanceof HTMLElement && root.matches(ENTITY_GRID) ? [root] : []),
        ...root.querySelectorAll(ENTITY_GRID),
    ]);
    /** @type {(() => void)[]} */
    const undo = [];
    for (const grid of grids) {
        const apply = () => {
            const min = grid.getAttribute('data-kp-entity-min');
            if (min) grid.style.setProperty('--kp-entity-min', min);
            else grid.style.removeProperty('--kp-entity-min');
        };
        apply();
        let lastWidth = grid.clientWidth;
        const refit = () => {
            if (grid.clientWidth === lastWidth) return;
            lastWidth = grid.clientWidth;
            delete grid.dataset.kpEntityFit;
            const cards = /** @type {HTMLElement[]} */ ([...grid.querySelectorAll(':scope > .kp-card--entity')]);
            for (const card of cards) delete card.dataset.kpFlagsFit;
            redraw(cards, ['flags', 'actions']);
        };
        const fold = () => grid.toggleAttribute('data-kp-entity-narrow', grid.clientWidth > 0 && grid.clientWidth < 480);
        fold();
        const resize =
            typeof ResizeObserver === 'function'
                ? new ResizeObserver(() => {
                      fold();
                      refit();
                  })
                : null;
        resize?.observe(grid);
        undo.push(() => resize?.disconnect());
        const watch = new MutationObserver(() => {
            apply();
            delete grid.dataset.kpEntityFit;
            for (const card of /** @type {HTMLElement[]} */ ([...grid.querySelectorAll(':scope > .kp-card--entity')])) {
                const was = DRAWN.get(card);
                if (!was) continue;
                was.drawn = {};
                setEntity(card, was.data);
            }
        });
        watch.observe(grid, {
            attributes: true,
            attributeFilter: [
                'data-kp-entity-meters',
                'data-kp-entity-flags-max',
                'data-kp-entity-inline',
                'data-kp-entity-link',
                'data-kp-selectable',
                'data-kp-entity-mark',
                'data-kp-entity-min',
                'data-kp-entity-narrow',
                'data-kp-entity-kind',
                'data-kp-entity-trend',
                'data-kp-entity-star',
                'data-kp-entity-star-key',
            ],
        });
        undo.push(() => watch.disconnect());
        // The fold is read once more now that the cards listen for it.
        fold();
    }
    return () => undo.forEach((u) => u());
}
