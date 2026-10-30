// The grid mode: fixed columns, the scrolled marker and the grid attachment.
import { shown } from './filter.js';
import { DETAIL, EDITOR_WRAP, GROUP_ROW, SKELETON_ROW } from './selectors.js';
import { GRID_PAGE_ROWS } from './events.js';

/**
 * Keep the leading columns of a table in place while its box scrolls
 * sideways [Kenny, 2026-09-13, #sticky]. Measures the header cells and
 * writes, on every cell of the first `count` columns, `data-kp-fixed`
 * (`last` on the one that draws the hairline) and the offset it sticks at
 * as `--kp-datatable-fixed-start`; the stylesheet does the sticking. Call
 * it again after the columns change; both channels do.
 *
 * @param {HTMLTableElement} table
 * @param {number} count how many leading columns stay; 0 takes the marks away
 * @param {number} [endCount] how many trailing columns stay at the end edge (`data-kp-fixed-end`); 0 takes the marks away
 */
export function syncFixedColumns(table, count, endCount = 0) {
    const head = table.tHead?.rows[0];
    /** @type {Map<number, number>} */
    const starts = new Map();
    let last = -1;
    if (head !== undefined && count > 0) {
        let offset = 0;
        for (const cell of head.cells) {
            if (cell.cellIndex >= count) break;
            if (!shown(cell)) continue;
            starts.set(cell.cellIndex, offset);
            offset += cell.getBoundingClientRect().width;
            last = cell.cellIndex;
        }
    }
    // The end columns count from the last cell of the header, and stick at the end edge [datatable-r5-1019, O22].
    /** @type {Map<number, number>} */
    const ends = new Map();
    let first = -1;
    if (head !== undefined && endCount > 0) {
        let offset = 0;
        let taken = 0;
        for (let at = head.cells.length - 1; at >= 0 && taken < endCount; at--) {
            const cell = head.cells[at];
            if (!shown(cell)) continue;
            if (starts.has(cell.cellIndex)) break;
            ends.set(cell.cellIndex, offset);
            offset += cell.getBoundingClientRect().width;
            first = cell.cellIndex;
            taken += 1;
        }
    }
    for (const row of table.rows) {
        const whole = row.matches(DETAIL);
        for (const cell of row.cells) {
            const start = whole ? undefined : starts.get(cell.cellIndex);
            if (start === undefined) {
                if (cell.dataset.kpFixed !== undefined) {
                    delete cell.dataset.kpFixed;
                    cell.style.removeProperty('--kp-datatable-fixed-start');
                }
            } else {
                cell.dataset.kpFixed = cell.cellIndex === last ? 'last' : '';
                cell.style.setProperty('--kp-datatable-fixed-start', `${Math.round(start * 100) / 100}px`);
            }
            const end = whole ? undefined : ends.get(cell.cellIndex);
            if (end === undefined) {
                if (cell.dataset.kpFixedEnd !== undefined) {
                    delete cell.dataset.kpFixedEnd;
                    cell.style.removeProperty('--kp-datatable-fixed-end');
                }
            } else {
                cell.dataset.kpFixedEnd = cell.cellIndex === first ? 'first' : '';
                cell.style.setProperty('--kp-datatable-fixed-end', `${Math.round(end * 100) / 100}px`);
            }
        }
    }
}
/**
 * Mark a data table while its scroll box is scrolled away from the top
 * [scope-90]: `data-kp-scrolled` on `element` while `box.scrollTop` is
 * above 0, removed at the top. The stylesheet draws the sticky header's
 * reach (`fix-32`) only under it, so a caption right above the header is
 * not painted over at rest. One decision per frame, on a passive listener.
 * Both channels use this one.
 *
 * @param {HTMLElement} element the `.kp-datatable`
 * @param {HTMLElement} box its `.kp-table-wrap`, the box that scrolls
 * @returns {() => void} detach, which removes the attribute
 */
export function watchScrolled(element, box) {
    const view = box.ownerDocument.defaultView;
    let frame = 0;
    const decide = () => {
        frame = 0;
        element.toggleAttribute('data-kp-scrolled', box.scrollTop > 0);
    };
    const onScroll = () => {
        if (frame === 0 && view !== null) frame = view.requestAnimationFrame(decide);
    };
    decide();
    box.addEventListener('scroll', onScroll, { passive: true });
    return () => {
        box.removeEventListener('scroll', onScroll);
        if (frame !== 0) view?.cancelAnimationFrame(frame);
        element.removeAttribute('data-kp-scrolled');
    };
}
/**
 * @typedef {object} GridHandle
 * @property {() => void} sync  re-read the rows and cells after they changed; keeps one cell in the tab order
 * @property {(row: number, column: number) => void} focus  move to a cell, by row index in the table and column
 * @property {() => void} detach
 */

/**
 * A roving focus grid over a table [Kenny, 2026-09-13, #keyboard; APG grid].
 *
 * Tab enters on one cell and leaves with the next Tab; inside, the arrow
 * keys move a cell at a time, Home and End go to the start and end of the
 * row, Ctrl + Home and Ctrl + End to the first and last cell, and Page Up
 * and Page Down `pageRows` rows. A cell that holds exactly one control — a
 * sort button, a checkbox, an edit button — hands the focus to that
 * control, so Enter and Space do what the control does. Hidden rows and
 * columns are stepped over, and keys pressed inside an open editor belong
 * to the editor. Both channels use this one.
 *
 * @param {HTMLTableElement} table
 * @param {{ pageRows?: number, onMove?: (position: { row: number, rows: number, column: number, cell: HTMLTableCellElement }) => void }} [options]
 * @returns {GridHandle}
 */
export function attachGrid(table, { pageRows = GRID_PAGE_ROWS, onMove } = {}) {
    const roleWas = table.getAttribute('role');
    table.setAttribute('role', 'grid');
    let at = { row: -1, column: 0 };
    /** Elements given a tabindex here, with the value they had. @type {Map<HTMLElement, string | null>} */
    const touched = new Map();

    const rows = () => [...table.rows].filter((row) => shown(row) && !row.matches(SKELETON_ROW) && row.cells.length > 0);
    /** @param {HTMLTableRowElement} row */
    const cellsOf = (row) => [...row.cells].filter(shown);
    /** The one control a cell hands its focus to, or the cell. @param {HTMLTableCellElement} cell */
    const targetOf = (cell) => {
        const controls = [...cell.querySelectorAll('button, a[href], input, select, textarea, [tabindex]')].filter(
            (control) => control.closest(EDITOR_WRAP) === null && shown(control),
        );
        return /** @type {HTMLElement} */ (controls.length === 1 ? controls[0] : cell);
    };
    /** @param {HTMLElement} element @param {number} value */
    const setTab = (element, value) => {
        if (!touched.has(element)) touched.set(element, element.getAttribute('tabindex'));
        if (element.tabIndex !== value || !element.hasAttribute('tabindex')) element.tabIndex = value;
    };

    /** @returns {[HTMLTableRowElement[], number, number]} */
    const clamp = () => {
        const list = rows();
        const header = list.findIndex((row) => row.parentElement?.tagName !== 'THEAD');
        const row = at.row < 0 ? Math.max(header, 0) : Math.max(0, Math.min(list.length - 1, at.row));
        const cells = list[row] === undefined ? [] : cellsOf(list[row]);
        return [list, row, Math.max(0, Math.min(cells.length - 1, at.column))];
    };

    const sync = () => {
        const [list, row, column] = clamp();
        for (const tr of table.rows) {
            for (const cell of tr.cells) {
                setTab(cell, -1);
                for (const control of cell.querySelectorAll('button, a[href], input, select, textarea')) {
                    if (control.closest(EDITOR_WRAP) === null) setTab(/** @type {HTMLElement} */ (control), -1);
                }
            }
        }
        const current = list[row] === undefined ? undefined : cellsOf(list[row])[column];
        if (current !== undefined) setTab(targetOf(current), 0);
    };

    /** @param {number} row @param {number} column @param {boolean} [take] */
    const move = (row, column, take = true) => {
        const list = rows();
        if (list.length === 0) return;
        const r = Math.max(0, Math.min(list.length - 1, row));
        const cells = cellsOf(/** @type {HTMLTableRowElement} */ (list[r]));
        const c = Math.max(0, Math.min(cells.length - 1, column));
        at = { row: r, column: c };
        sync();
        const cell = cells[c];
        if (cell === undefined) return;
        if (take) targetOf(cell).focus();
        const header = list.filter((tr) => tr.parentElement?.tagName === 'THEAD').length;
        // A detail row and a group's heading row are not rows of data.
        const bodyRows = list.filter((tr) => tr.parentElement?.tagName !== 'THEAD' && !tr.matches(DETAIL) && !tr.matches(GROUP_ROW)).length;
        const bodyIndex = r < header ? 0 : list.slice(header, r + 1).filter((tr) => !tr.matches(DETAIL) && !tr.matches(GROUP_ROW)).length;
        onMove?.({ row: bodyIndex, rows: bodyRows, column: c, cell });
    };

    /** @param {KeyboardEvent} event */
    const onKey = (event) => {
        const target = /** @type {HTMLElement} */ (event.target);
        if (target.closest(EDITOR_WRAP) !== null || event.altKey || event.metaKey) return;
        const [, row, column] = clamp();
        const ctrl = event.ctrlKey;
        /** @type {Record<string, [number, number]>} */
        const moves = {
            ArrowUp: [row - 1, column],
            ArrowDown: [row + 1, column],
            ArrowLeft: [row, column - 1],
            ArrowRight: [row, column + 1],
            Home: ctrl ? [0, 0] : [row, 0],
            End: ctrl ? [rows().length - 1, Number.MAX_SAFE_INTEGER] : [row, Number.MAX_SAFE_INTEGER],
            PageUp: [row - pageRows, column],
            PageDown: [row + pageRows, column],
        };
        const next = moves[event.key];
        if (next === undefined) return;
        // A text field keeps its own left, right, Home and End.
        if (target.matches('input:not([type="checkbox"]):not([type="radio"]), textarea, select') && !event.key.startsWith('Page')) return;
        event.preventDefault();
        move(next[0], next[1]);
    };
    /** @param {FocusEvent} event */
    const onFocusIn = (event) => {
        const target = /** @type {HTMLElement} */ (event.target);
        if (target.closest(EDITOR_WRAP) !== null) return;
        const cell = /** @type {HTMLTableCellElement | null} */ (target.closest('td, th'));
        const tr = /** @type {HTMLTableRowElement | null} */ (cell?.parentElement ?? null);
        if (cell === null || tr === null || cell.closest('table') !== table) return;
        const list = rows();
        const r = list.indexOf(tr);
        const c = cellsOf(tr).indexOf(cell);
        if (r === -1 || c === -1) return;
        move(r, c, false);
    };

    table.addEventListener('keydown', onKey);
    table.addEventListener('focusin', onFocusIn);
    sync();
    return {
        sync,
        focus: (row, column) => move(row, column),
        detach: () => {
            table.removeEventListener('keydown', onKey);
            table.removeEventListener('focusin', onFocusIn);
            for (const [element, was] of touched) {
                if (was === null) element.removeAttribute('tabindex');
                else element.setAttribute('tabindex', was);
            }
            if (roleWas === null) table.removeAttribute('role');
            else table.setAttribute('role', roleWas);
        },
    };
}
