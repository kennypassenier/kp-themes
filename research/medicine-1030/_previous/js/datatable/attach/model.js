// The table's view state: rows, page, query, scope, filters, sorts and busy flags.
import { DETAIL, GROUP_ROW, HELD_ROW, SKELETON_ROW } from '../selectors.js';
/** @typedef {import('../events.js').FilterValue} FilterValue */
/** @typedef {import('../events.js').SortKey} SortKey */
/** @typedef {import('../events.js').State} State */
/** @typedef {import('./context.js').TableContext} TableContext */

/**
 * What the the table's view state: rows, page, query, scope, filters, sorts and busy flags part adds to the table's context.
 *
 * @typedef {{
 *     all: HTMLTableRowElement[];
 *     busyClock: HTMLElement | null;
 *     busyOverlay: boolean;
 *     busySince: number | null;
 *     busyText: string | null;
 *     busyTimer: ReturnType<typeof setTimeout> | null;
 *     failReason: string | null;
 *     filters: Map<number, FilterValue>;
 *     holdRows: () => void;
 *     isRow: (row: HTMLTableRowElement) => boolean;
 *     overlayClock: HTMLElement | null;
 *     overlayLayer: HTMLElement | null;
 *     page: number;
 *     pageRows: HTMLTableRowElement[];
 *     query: string;
 *     rendered: HTMLTableRowElement[];
 *     scope: number | null;
 *     shownRows: HTMLTableRowElement[];
 *     sorts: SortKey[];
 *     state: State;
 * }} ModelFields
 */

/**
 * The table's view state: rows, page, query, scope, filters, sorts and busy flags.
 *
 * @param {TableContext} c
 */
export function installModel(c) {
    const { body, wrap } = c;

    /** Every row as it was rendered. Sorting reorders this array, never the DOM's idea of it. */
    const isRow = (/** @type {HTMLTableRowElement} */ row) =>
        !row.matches(DETAIL) && !row.matches(SKELETON_ROW) && !row.matches(GROUP_ROW) && !row.matches(HELD_ROW);
    c.isRow = isRow;
    /** A held row stays hidden whatever the table does; the page lifts it with the attribute [b3b4-1019]. */
    const holdRows = () => {
        for (const row of body.querySelectorAll(`:scope > ${HELD_ROW}`)) /** @type {HTMLElement} */ (row).hidden = true;
    };
    c.holdRows = holdRows;
    holdRows();
    c.all = /** @type {HTMLTableRowElement[]} */ ([...body.rows].filter(isRow));
    /** The order the server rendered, so detach can put it back. */
    const rendered = [...c.all];
    c.rendered = rendered;
    /** @type {HTMLTableRowElement[]} */
    c.shownRows = [...c.all];
    /** @type {HTMLTableRowElement[]} */
    c.pageRows = [...c.all];
    c.page = 0;
    c.query = '';
    /** @type {number | null} */
    c.scope = null;
    /** @type {Map<number, FilterValue>} */
    const filters = new Map();
    c.filters = filters;
    /** @type {SortKey[]} */
    c.sorts = [];
    /** @type {State} */
    c.state = /** @type {State} */ (['loading', 'failed'].includes(wrap.dataset.kpState ?? '') ? wrap.dataset.kpState : 'ready');
    /** The consumer's own words for the status line while it loads (busy(), fix-80); null is the dictionary's busy word. @type {string | null} */
    c.busyText = null;
    /** Why the table failed, in the app's words (fail(), fix-85); null is the dictionary's. @type {string | null} */
    c.failReason = null;
    /** When the load began, for a count the table keeps itself (busy({ since }), fix-84); null is no count. @type {number | null} */
    c.busySince = null;
    /** The timer that moves that count, only while a counting table loads. @type {ReturnType<typeof setInterval> | null} */
    c.busyTimer = null;
    /** The element the count is written into, so the tick touches nothing else. @type {HTMLElement | null} */
    c.busyClock = null;
    /** A large spinner over the rows while it loads, for a table long or slow enough that the status line is out of sight (busy({ overlay }) or data-kp-busy-overlay). */
    c.busyOverlay = wrap.hasAttribute('data-kp-busy-overlay');
    /** That layer, while it shows. @type {HTMLElement | null} */
    c.overlayLayer = null;
    /** Its copy of the count, moved by the same tick. @type {HTMLElement | null} */
    c.overlayClock = null;
}
