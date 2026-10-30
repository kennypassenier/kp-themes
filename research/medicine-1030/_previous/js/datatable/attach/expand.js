// Expanding and folding rows and the row keys.
import { EXPAND_EVENT, GROUP_EVENT } from '../events.js';
import { FOLDING_OUT, playArrivalBackwards, stopReversing } from '../../motion.js';
import { DETAIL, GROUP_ROW, ROW_TOGGLE } from '../selectors.js';
/** @typedef {import('./context.js').TableContext} TableContext */

/**
 * What the expanding and folding rows and the row keys part adds to the table's context.
 *
 * @typedef {{
 *     expandKeys: (keys: readonly string[]) => void;
 *     foldKeys: (keys: readonly string[]) => void;
 *     onRowKey: (event: KeyboardEvent) => void;
 *     setExpanded: (row: HTMLTableRowElement, open: boolean) => void;
 *     setFolded: (key: string, fold: boolean) => void;
 * }} ExpandFields
 */

/**
 * Expanding and folding rows and the row keys.
 *
 * @param {TableContext} c
 */
export function installExpand(c) {
    const { body, departing, detailFor, details, expandable, expanded, folded, groupOf, groups, keyOf, render, single, wrap } = c;

    // ── Expansion ──────────────────────────────────────────────────
    /** @param {HTMLTableRowElement} row @param {boolean} open */
    const setExpanded = (row, open) => {
        const key = keyOf(row);
        if (open === expanded.has(key)) return;
        // One open row at a time [J2]: the opening closes the row that
        // was open, in the same step and the same event.
        /** @type {string[]} */
        const closed = open && single ? [...expanded] : [];
        for (const other of closed) expanded.delete(other);
        if (open) expanded.add(key);
        else expanded.delete(key);
        const detail = open ? detailFor(row) : details.get(row);
        render();
        /** @type {Record<string, unknown>} */
        const said = { key, row, open, cell: detail?.cells[0] ?? null, expanded: [...expanded] };
        if (single) said.closed = closed;
        wrap.dispatchEvent(new CustomEvent(EXPAND_EVENT, { bubbles: true, detail: said }));
    };
    c.setExpanded = setExpanded;
    /** @param {readonly string[]} keys */
    const expandKeys = (keys) => {
        const want = new Set(single ? keys.slice(-1) : keys);
        for (const row of c.all) {
            const key = keyOf(row);
            if (want.has(key) !== expanded.has(key)) setExpanded(row, want.has(key));
        }
    };
    c.expandKeys = expandKeys;
    // ── Folding a group [J2] ───────────────────────────────────────
    /** @param {string} key @param {boolean} fold */
    const setFolded = (key, fold) => {
        if (fold === folded.has(key)) return;
        // A group folds as it unfolded, turned around: its rows play
        // their arrival backwards (js/motion.js) and are hidden once it
        // has played; they unfolded the theme's way and folded away at
        // once (Kenny, 2026-10-05). Unfolded meanwhile, they turn round.
        // Meanwhile they carry `data-kp-folding="out"`, so the box around
        // them glides shut as they play, the mirror of its glide open
        // (Kenny's form v21: it snapped shut once they had gone).
        const going = fold ? c.pageRows.filter((row) => groupOf(row) === key && !row.hidden) : [];
        if (fold) folded.add(key);
        else {
            folded.delete(key);
            for (const row of [...departing])
                if (groupOf(row) === key) {
                    departing.delete(row);
                    row.removeAttribute('data-kp-folding');
                    stopReversing(row);
                }
        }
        for (const row of going) {
            departing.add(row);
            row.setAttribute('data-kp-folding', FOLDING_OUT);
        }
        if (going.length)
            void Promise.all(going.map((row) => playArrivalBackwards(row))).then(() => {
                let held = false;
                for (const row of going)
                    if (departing.delete(row)) {
                        row.removeAttribute('data-kp-folding');
                        held = true;
                    }
                if (held) render();
            });
        render();
        wrap.dispatchEvent(
            new CustomEvent(GROUP_EVENT, {
                bubbles: true,
                detail: {
                    key,
                    row: groups.get(key) ?? null,
                    open: !fold,
                    members: c.all.filter((row) => groupOf(row) === key),
                    folded: [...folded],
                },
            }),
        );
    };
    c.setFolded = setFolded;
    /** @param {readonly string[]} keys */
    const foldKeys = (keys) => {
        const want = new Set(keys);
        for (const key of groups.keys()) setFolded(key, want.has(key));
        // A group not in the body now keeps the state it is given, for when its rows come.
        for (const key of [...folded]) if (!groups.has(key) && !want.has(key)) folded.delete(key);
        for (const key of want) if (!groups.has(key)) folded.add(key);
    };
    c.foldKeys = foldKeys;
    /**
     * Enter or Space on a row, or on a cell, that holds the focus itself
     * (a row given a tabindex, a cell of the keyboard grid) works it as a
     * click does: opens the row, folds the group [J2, R-KEYS]. A control
     * in the row keeps its own keys.
     * @param {KeyboardEvent} event
     */
    const onRowKey = (event) => {
        if ((event.key !== 'Enter' && event.key !== ' ') || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
        const target = /** @type {HTMLElement} */ (event.target);
        if (!target.matches('tr, td, th')) return;
        const row = /** @type {HTMLTableRowElement | null} */ (target.closest('tr'));
        if (row === null || row.parentElement !== body || row.matches(DETAIL)) return;
        if (row.matches(GROUP_ROW)) {
            const key = row.dataset.kpRowGroup ?? '';
            if (groups.get(key) !== row) return;
            event.preventDefault();
            setFolded(key, !folded.has(key));
        } else if (expandable && row.querySelector(ROW_TOGGLE) !== null) {
            event.preventDefault();
            setExpanded(row, !expanded.has(keyOf(row)));
        } else return;
        if (target.isConnected && document.activeElement !== target) target.focus({ preventScroll: true });
    };
    c.onRowKey = onRowKey;
}
