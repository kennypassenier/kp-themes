// Wires the heat grids of a page: pointer, keys and the attach.
import { attachHoverCards } from '../hovercard.js';
import { HEAT, HEAT_CELL, HEAT_PAGE_EVENT, HEAT_PICK_EVENT, HEAT_ROW_EVENT } from './constants.js';
import { cellGrid, placeStop } from './draw.js';
import { LIT, STOPS } from './grid-state.js';
import { syncCalmLegend } from './legend.js';
import { PAGING, heatOffset, setHeatPaging } from './paging.js';
import { setHeatPick, setHeatRows } from './pick.js';

/**
 * @param {HTMLElement} el
 * @returns {() => void}
 */
function wireHeat(el) {
    /** @param {Event} event */
    const onClick = (event) => {
        const target = /** @type {Element} */ (event.target);
        const label = /** @type {HTMLElement | null} */ (target.closest('.kp-heat__label-button'));
        if (label && el.contains(label)) {
            const key = label.dataset.key ?? '';
            const keys = new Set(LIT.get(el) ?? []);
            const pressed = !keys.has(key);
            if (!el.hasAttribute('data-kp-heat-owned')) {
                if (pressed) keys.add(key);
                else keys.delete(key);
                setHeatRows(el, [...keys]);
            }
            el.dispatchEvent(new CustomEvent(HEAT_ROW_EVENT, { bubbles: true, detail: { key, pressed, keys: [...keys] } }));
            return;
        }
        const cell = /** @type {HTMLElement | null} */ (target.closest(HEAT_CELL));
        if (!cell || !el.contains(cell) || cell.hasAttribute('aria-disabled')) return;
        STOPS.set(el, { r: Number(cell.dataset.r), c: Number(cell.dataset.c) });
        const key = cell.dataset.colKey ?? '';
        const already = el.getAttribute('data-kp-heat-picked') === key;
        if (!el.hasAttribute('data-kp-heat-owned')) setHeatPick(el, already ? null : key);
        el.dispatchEvent(
            new CustomEvent(HEAT_PICK_EVENT, { bubbles: true, detail: { rowKey: cell.dataset.rowKey, colKey: key, cell, picked: !already } }),
        );
    };
    /** @param {KeyboardEvent} event */
    const onKey = (event) => {
        const cell = /** @type {HTMLElement | null} */ ((event.target instanceof Element ? event.target : null)?.closest(HEAT_CELL) ?? null);
        if (!cell || !el.contains(cell)) return;
        const grid = cellGrid(el, HEAT_CELL);
        let r = Number(cell.dataset.r);
        let c = Number(cell.dataset.c);
        const rowsN = grid.length;
        const colsN = (grid[r] ?? []).length;
        const key = event.key;
        let askLatest = false;
        if (key === 'ArrowRight') c = Math.min(colsN - 1, c + 1);
        else if (key === 'ArrowLeft') c = Math.max(0, c - 1);
        else if (key === 'ArrowDown') r = Math.min(rowsN - 1, r + 1);
        else if (key === 'ArrowUp') r = Math.max(0, r - 1);
        else if (key === 'Home' || key === 'End') {
            c = key === 'Home' ? 0 : colsN - 1;
            if (event.ctrlKey) r = key === 'Home' ? 0 : rowsN - 1;
            // The key towards the newest column asks the page for the newest columns too [kpadopt3].
            const latest = el.getAttribute('data-kp-heat-latest');
            askLatest = latest !== null && key === (latest === 'start' ? 'Home' : 'End');
        } else if (key === 'PageUp' || key === 'PageDown') {
            event.preventDefault();
            const earlier = key === 'PageUp';
            /** @type {{ direction: string, offset?: number }} */
            const detail = { direction: earlier ? 'earlier' : 'later' };
            // A grid with a paging bar pages by it, so the keys and the buttons agree [wish-1120].
            if (PAGING.has(el)) {
                const bound = PAGING.get(el) ?? {};
                const next = heatOffset(el) + (earlier ? 1 : -1);
                if ((bound.max !== undefined && next > bound.max) || next < (bound.min ?? 0)) return;
                detail.offset = next;
                if (!el.hasAttribute('data-kp-heat-owned')) setHeatPaging(el, { offset: next });
            }
            el.dispatchEvent(new CustomEvent(HEAT_PAGE_EVENT, { bubbles: true, detail }));
            return;
        } else if (key === 'Escape') {
            if (el.getAttribute('data-kp-heat-picked') == null) return;
            event.preventDefault();
            if (!el.hasAttribute('data-kp-heat-owned')) setHeatPick(el, null);
            el.dispatchEvent(
                new CustomEvent(HEAT_PICK_EVENT, { bubbles: true, detail: { rowKey: cell.dataset.rowKey, colKey: null, cell, picked: false } }),
            );
            return;
        } else return;
        event.preventDefault();
        const to = grid[r]?.[c];
        if (!to) return;
        STOPS.set(el, { r, c });
        placeStop(el, HEAT_CELL, { r, c });
        to.focus();
        // Asked once the focus stands on the edge: a page that redraws the grid keeps it there.
        if (askLatest) el.dispatchEvent(new CustomEvent(HEAT_PAGE_EVENT, { bubbles: true, detail: { direction: 'latest' } }));
    };
    /** @param {FocusEvent} event */
    const onFocus = (event) => {
        const cell = /** @type {HTMLElement | null} */ ((event.target instanceof Element ? event.target : null)?.closest(HEAT_CELL) ?? null);
        if (!cell || !el.contains(cell)) return;
        const at = { r: Number(cell.dataset.r), c: Number(cell.dataset.c) };
        const now = STOPS.get(el);
        if (now?.r !== at.r || now?.c !== at.c) placeStop(el, HEAT_CELL, at);
    };
    el.addEventListener('click', onClick);
    el.addEventListener('keydown', onKey);
    el.addEventListener('focusin', onFocus);
    // A calm grid draws its legend, and follows the options that decide it, also when the page only flips an attribute.
    syncCalmLegend(el);
    const legendWatch = new MutationObserver(() => syncCalmLegend(el));
    legendWatch.observe(el, { attributes: true, attributeFilter: ['data-kp-tones', 'data-kp-legend'] });
    // Markup written by hand gets its tab stop and its pressed labels.
    if (el.querySelector(HEAT_CELL)) {
        const pressed = /** @type {NodeListOf<HTMLElement>} */ (el.querySelectorAll('.kp-heat__label-button[aria-pressed="true"]'));
        LIT.set(el, new Set([...pressed].map((b) => b.dataset.key ?? '')));
        if (!el.querySelector(`${HEAT_CELL}[tabindex="0"]`)) placeStop(el, HEAT_CELL, undefined);
    }
    return () => {
        el.removeEventListener('click', onClick);
        el.removeEventListener('keydown', onKey);
        el.removeEventListener('focusin', onFocus);
        legendWatch.disconnect();
    };
}

/** @type {WeakMap<Element, () => void>} */
const WIRED = new WeakMap();

/**
 * Wire every heat grid under `root`: pick, row labels, keys.
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export function attachHeats(root = document) {
    const doc = root instanceof Document ? root : /** @type {Element} */ (root).ownerDocument;
    attachHoverCards(doc);
    /** @type {(() => void)[]} */
    const undo = [];
    const all = /** @type {HTMLElement[]} */ ([...(root instanceof Element && root.matches(HEAT) ? [root] : []), ...root.querySelectorAll(HEAT)]);
    for (const el of all) {
        if (WIRED.has(el)) continue;
        const off = wireHeat(el);
        WIRED.set(el, off);
        undo.push(() => {
            off();
            WIRED.delete(el);
        });
    }
    return () => undo.forEach((fn) => fn());
}
