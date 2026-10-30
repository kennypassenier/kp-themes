// Wires the matrices of a page: pointer, keys and the attach.
import { attachHoverCards } from '../hovercard.js';
import { MATRIX, MATRIX_CELL, MATRIX_LIGHT_EVENT, MATRIX_PICK_EVENT } from './constants.js';
import { cellGrid, placeStop } from './draw.js';
import { LIT, STOPS } from './grid-state.js';
import { markHot, setMatrixLit, setMatrixPick } from './matrix.js';

/**
 * @param {HTMLElement} el
 * @returns {() => void}
 */
function wireMatrix(el) {
    const pin = (/** @type {HTMLElement} */ cell, /** @type {string} */ source) => {
        const was = cell.getAttribute('aria-pressed') === 'true';
        if (!el.hasAttribute('data-kp-matrix-owned')) setMatrixPick(el, { row: cell.dataset.rowKey ?? '', column: cell.dataset.colKey ?? '' });
        STOPS.set(el, { r: Number(cell.dataset.r), c: Number(cell.dataset.c) });
        el.dispatchEvent(
            new CustomEvent(MATRIX_PICK_EVENT, {
                bubbles: true,
                detail: { rowKey: cell.dataset.rowKey, colKey: cell.dataset.colKey, cell, source, again: was },
            }),
        );
    };
    /** @param {Event} event */
    const onClick = (event) => {
        const target = /** @type {Element} */ (event.target);
        const head = /** @type {HTMLElement | null} */ (target.closest('button.kp-matrix__col, button.kp-matrix__row'));
        if (head && el.contains(head)) {
            const key = head.dataset.key ?? '';
            if (!el.hasAttribute('data-kp-matrix-owned')) {
                const lit = new Set(LIT.get(el) ?? []);
                if (lit.has(key)) lit.delete(key);
                else lit.add(key);
                setMatrixLit(el, [...lit]);
            }
            el.dispatchEvent(new CustomEvent(MATRIX_LIGHT_EVENT, { bubbles: true, detail: { keys: [...(LIT.get(el) ?? [])], key } }));
            return;
        }
        const cell = /** @type {HTMLElement | null} */ (target.closest(MATRIX_CELL));
        if (cell && el.contains(cell) && !cell.hasAttribute('aria-disabled')) pin(cell, 'pointer');
    };
    /** @param {KeyboardEvent} event */
    const onKey = (event) => {
        const cell = /** @type {HTMLElement | null} */ ((event.target instanceof Element ? event.target : null)?.closest(MATRIX_CELL) ?? null);
        if (!cell || !el.contains(cell)) {
            if (event.key === 'Escape' && (LIT.get(el)?.size ?? 0) > 0 && !el.hasAttribute('data-kp-matrix-owned')) {
                setMatrixLit(el, []);
                el.dispatchEvent(new CustomEvent(MATRIX_LIGHT_EVENT, { bubbles: true, detail: { keys: [], key: null } }));
            }
            return;
        }
        if (event.key === 'Escape' && (LIT.get(el)?.size ?? 0) > 0) {
            event.preventDefault();
            if (!el.hasAttribute('data-kp-matrix-owned')) setMatrixLit(el, []);
            el.dispatchEvent(new CustomEvent(MATRIX_LIGHT_EVENT, { bubbles: true, detail: { keys: [], key: null } }));
            return;
        }
        const step = /** @type {Record<string, [number, number]>} */ ({
            ArrowRight: [0, 1],
            ArrowLeft: [0, -1],
            ArrowDown: [1, 0],
            ArrowUp: [-1, 0],
        })[event.key];
        const grid = cellGrid(el, MATRIX_CELL);
        const rowsN = Math.max(grid.length, el.querySelectorAll('.kp-matrix__grid > .kp-matrix__line').length - 1);
        const colsN = Number(/** @type {HTMLElement} */ (el.querySelector('.kp-matrix__grid')).style.getPropertyValue('--kp-matrix-cols')) || 1;
        let r = Number(cell.dataset.r);
        let c = Number(cell.dataset.c);
        if (step) {
            // Wrap round, and skip the cells that cannot be pressed.
            for (let i = 0; i < rowsN * colsN; i++) {
                r = (r + step[0] + rowsN) % rowsN;
                c = (c + step[1] + colsN) % colsN;
                if (grid[r]?.[c]) break;
            }
        } else if (event.key === 'Home' || event.key === 'End') {
            const row = (grid[r] ?? []).map((x, i) => (x ? i : -1)).filter((i) => i >= 0);
            c = event.key === 'Home' ? row[0] : row[row.length - 1];
            if (event.ctrlKey) {
                const rr = grid.map((x, i) => (x ? i : -1)).filter((i) => i >= 0);
                r = event.key === 'Home' ? rr[0] : rr[rr.length - 1];
                const cc = (grid[r] ?? []).map((x, i) => (x ? i : -1)).filter((i) => i >= 0);
                c = event.key === 'Home' ? cc[0] : cc[cc.length - 1];
            }
        } else return;
        event.preventDefault();
        const to = grid[r]?.[c];
        if (!to) return;
        placeStop(el, MATRIX_CELL, { r, c });
        to.focus();
        if (el.getAttribute('data-kp-matrix-select') === 'follow') pin(to, 'keyboard');
    };
    /** @param {FocusEvent} event */
    const onFocus = (event) => {
        const cell = /** @type {HTMLElement | null} */ ((event.target instanceof Element ? event.target : null)?.closest(MATRIX_CELL) ?? null);
        if (!cell || !el.contains(cell)) return;
        const at = { r: Number(cell.dataset.r), c: Number(cell.dataset.c) };
        const now = STOPS.get(el);
        if (now?.r !== at.r || now?.c !== at.c) placeStop(el, MATRIX_CELL, at);
    };
    el.addEventListener('click', onClick);
    el.addEventListener('keydown', onKey);
    el.addEventListener('focusin', onFocus);
    if (el.querySelector(MATRIX_CELL)) {
        const lit = /** @type {NodeListOf<HTMLElement>} */ (
            el.querySelectorAll('button.kp-matrix__col[aria-pressed="true"], button.kp-matrix__row[aria-pressed="true"]')
        );
        LIT.set(el, new Set([...lit].map((b) => b.dataset.key ?? '')));
        markHot(el);
        if (!el.querySelector(`${MATRIX_CELL}[tabindex="0"]`)) placeStop(el, MATRIX_CELL, undefined);
    }
    return () => {
        el.removeEventListener('click', onClick);
        el.removeEventListener('keydown', onKey);
        el.removeEventListener('focusin', onFocus);
    };
}

/** @type {WeakMap<Element, () => void>} */
const MATRIX_WIRED = new WeakMap();

/**
 * Wire every matrix under `root`: pin, light the headers, keys.
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export function attachMatrices(root = document) {
    const doc = root instanceof Document ? root : /** @type {Element} */ (root).ownerDocument;
    attachHoverCards(doc);
    /** @type {(() => void)[]} */
    const undo = [];
    const all = /** @type {HTMLElement[]} */ ([...(root instanceof Element && root.matches(MATRIX) ? [root] : []), ...root.querySelectorAll(MATRIX)]);
    for (const el of all) {
        if (MATRIX_WIRED.has(el)) continue;
        const off = wireMatrix(el);
        MATRIX_WIRED.set(el, off);
        undo.push(() => {
            off();
            MATRIX_WIRED.delete(el);
        });
    }
    return () => undo.forEach((fn) => fn());
}
