// Row preparation and the drag and keyboard reorder of rows.
import { EDIT_CELL, EDIT_VALUE, REORDER_HANDLE, ROW_TOGGLE, SELECT_ROW } from '../selectors.js';
import { getStrings } from '../../strings.js';
import { REORDER_EVENT } from '../events.js';
/** @typedef {import('./context.js').TableContext} TableContext */

/**
 * What the row preparation and the drag and keyboard reorder of rows part adds to the table's context.
 *
 * @typedef {{
 *     labelRow: (row: HTMLTableRowElement) => void;
 *     prepareRow: (row: HTMLTableRowElement) => void;
 *     prepared: Set<HTMLTableRowElement>;
 *     unprepareRow: (row: HTMLTableRowElement) => void;
 * }} ReorderFields
 */

/**
 * Row preparation and the drag and keyboard reorder of rows.
 *
 * @param {TableContext} c
 */
export function installReorder(c) {
    const {
        body,
        cellText,
        details,
        editKinds,
        expanded,
        externalSort,
        filters,
        glyphs,
        insertExpandCell,
        insertReorderCell,
        keyColumn,
        keyOf,
        labelOf,
        make,
        pager,
        rendered,
        reorderable,
        serverMode,
        single,
        themeBox,
        undo,
        wrap,
    } = c;

    // ── Preparing a row: the parts a feature puts into its cells ───
    /** Rows that had their cells wrapped or added, for detach. @type {Set<HTMLTableRowElement>} */
    const prepared = new Set();
    c.prepared = prepared;
    /** @param {HTMLTableRowElement} row */
    const prepareRow = (row) => {
        themeBox(row.querySelector(SELECT_ROW));
        if (prepared.has(row)) return;
        prepared.add(row);
        insertExpandCell(row);
        insertReorderCell(row);
        editKinds.forEach((kind, at) => {
            const cell = row.cells[at];
            if (kind === null || cell === undefined || cell.querySelector(EDIT_CELL) !== null) return;
            const button = /** @type {HTMLButtonElement} */ (make('button', 'kp-datatable__edit'));
            button.type = 'button';
            button.dataset.kpEditCell = '';
            const value = make('span');
            value.dataset.kpEditValue = '';
            value.append(...cell.childNodes);
            button.append(value);
            cell.append(button);
        });
        if (c.hiddenColumns.size > 0)
            for (const at of c.hiddenColumns) if (row.cells[at]) /** @type {HTMLTableCellElement} */ (row.cells[at]).hidden = true;
    };
    c.prepareRow = prepareRow;
    /** Take back what prepareRow put in a row. @param {HTMLTableRowElement} row */
    const unprepareRow = (row) => {
        row.querySelector('[data-kp-expand-cell]')?.remove();
        row.querySelector('[data-kp-reorder-cell]')?.remove();
        for (const button of row.querySelectorAll(EDIT_CELL)) {
            const value = button.querySelector(EDIT_VALUE);
            if (value !== null) button.replaceWith(...value.childNodes);
        }
        for (const cell of row.cells) cell.hidden = false;
    };
    c.unprepareRow = unprepareRow;
    /** Name the parts that depend on the row's current value and state. @param {HTMLTableRowElement} row */
    const labelRow = (row) => {
        const s = getStrings();
        const key = keyOf(row);
        const toggleButton = /** @type {HTMLButtonElement | null} */ (row.querySelector(ROW_TOGGLE));
        if (toggleButton !== null) {
            const open = expanded.has(key);
            toggleButton.setAttribute('aria-label', s.tableRowDetails(key));
            toggleButton.setAttribute('aria-expanded', String(open));
            toggleButton.textContent = open ? glyphs.collapse : glyphs.expand;
            const detail = details.has(row) || open ? c.detailFor(row) : undefined;
            if (detail !== undefined) toggleButton.setAttribute('aria-controls', detail.id);
            else toggleButton.removeAttribute('aria-controls');
        }
        for (const button of row.querySelectorAll(EDIT_CELL)) {
            const cell = /** @type {HTMLTableCellElement} */ (button.closest('td, th'));
            button.setAttribute('aria-label', s.tableEdit(labelOf(cell.cellIndex), key, cellText(row, cell.cellIndex)));
        }
        const grip = row.querySelector(REORDER_HANDLE);
        if (grip !== null) {
            const can = canReorder();
            grip.setAttribute('aria-label', s.tableReorderRow(reorderName(row)));
            if (can) {
                grip.removeAttribute('aria-disabled');
                grip.removeAttribute('title');
            } else {
                grip.setAttribute('aria-disabled', 'true');
                grip.setAttribute('title', s.tableReorderOff);
            }
        }
    };
    c.labelRow = labelRow;
    // ── Row reorder [wish-1120, homelab 93] ─────────────────────────
    // The order is the table's own while no sort, filter or search is on and the rows come from the page (not a server): the
    // handle, Alt+Up and Alt+Down move a row in the rendered order and `kp-datatable-reorder` carries the new order of the
    // keys. With a sort or filter on, the handles are off with the reason in their title.
    const canReorder = () =>
        reorderable && !serverMode && !externalSort && c.sorts.length === 0 && filters.size === 0 && c.query.trim() === '' && c.groups.size === 0;
    /** @param {HTMLTableRowElement} row */
    const reorderName = (row) => (keyColumn >= 0 ? cellText(row, keyColumn) : '') || keyOf(row);
    /** A polite line only a screen reader hears: where the row went. @type {HTMLElement | null} */
    let reorderLive = null;
    /**
     * Put a row at a place in the order (0 is the first) and say so.
     * @param {HTMLTableRowElement} row @param {number} to
     * @returns {boolean} whether the row moved
     */
    const moveRow = (row, to) => {
        if (!canReorder()) return false;
        const from = c.all.indexOf(row);
        const target = Math.max(0, Math.min(c.all.length - 1, to));
        if (from < 0 || from === target) return false;
        c.all.splice(from, 1);
        c.all.splice(target, 0, row);
        rendered.splice(0, rendered.length, ...c.all, ...rendered.filter((r) => !c.all.includes(r)));
        c.shownRows = [...c.all];
        if (pager !== null) c.page = Math.floor(target / c.size);
        c.render();
        // The focus follows the row, not the place: losing it after every move is what makes keyboard reordering unusable.
        /** @type {HTMLElement | null} */ (row.querySelector(REORDER_HANDLE))?.focus({ preventScroll: true });
        if (reorderLive === null) {
            reorderLive = make('span', 'kp-sr-only');
            reorderLive.setAttribute('role', 'status');
            reorderLive.setAttribute('aria-live', 'polite');
            wrap.append(reorderLive);
            undo.push(() => reorderLive?.remove());
        }
        reorderLive.textContent = getStrings().reorderMoved(reorderName(row), target + 1, c.all.length);
        wrap.dispatchEvent(new CustomEvent(REORDER_EVENT, { bubbles: true, detail: { order: c.all.map(keyOf), key: keyOf(row), from, to: target } }));
        return true;
    };
    /** Alt+Up and Alt+Down on a row's handle, or on the row itself. @param {KeyboardEvent} event */
    const onReorderKey = (event) => {
        if (!reorderable || !event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
        if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
        const target = /** @type {HTMLElement} */ (event.target);
        if (target.matches('input, textarea, select, [contenteditable]')) return;
        const row = /** @type {HTMLTableRowElement | null} */ (target.closest('tr'));
        if (row === null || row.parentElement !== body || !c.all.includes(row)) return;
        event.preventDefault();
        moveRow(row, c.all.indexOf(row) + (event.key === 'ArrowUp' ? -1 : 1));
    };
    /** Drag by the handle: the row follows the pointer over its neighbours. @param {PointerEvent} event */
    const onReorderPointer = (event) => {
        if (event.button !== 0) return;
        const handle = /** @type {HTMLElement | null} */ (/** @type {HTMLElement} */ (event.target).closest(REORDER_HANDLE));
        const row = /** @type {HTMLTableRowElement | null} */ (handle?.closest('tr') ?? null);
        if (handle === null || row === null || !canReorder()) return;
        event.preventDefault();
        handle.focus({ preventScroll: true });
        row.dataset.kpDragging = '';
        const id = event.pointerId;
        /** @param {PointerEvent} move */
        const onMove = (move) => {
            if (move.pointerId !== id) return;
            const over = c.pageRows.find((r) => {
                const box = r.getBoundingClientRect();
                return move.clientY >= box.top && move.clientY <= box.bottom;
            });
            if (over !== undefined && over !== row) moveRow(row, c.all.indexOf(over));
        };
        /** @param {PointerEvent} up */
        const onUp = (up) => {
            if (up.pointerId !== id) return;
            delete row.dataset.kpDragging;
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerup', onUp);
            window.removeEventListener('pointercancel', onUp);
        };
        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onUp);
        window.addEventListener('pointercancel', onUp);
    };
    if (reorderable) {
        body.addEventListener('keydown', onReorderKey);
        body.addEventListener('pointerdown', onReorderPointer);
        undo.push(() => {
            body.removeEventListener('keydown', onReorderKey);
            body.removeEventListener('pointerdown', onReorderPointer);
        });
    }
    for (const row of c.all) {
        if (row.dataset.kpExpanded !== undefined) expanded.add(keyOf(row));
        prepareRow(row);
    }
    // One open row at a time: of several marked open, the last stays.
    if (single && expanded.size > 1) {
        const last = /** @type {string} */ ([...expanded][expanded.size - 1]);
        expanded.clear();
        expanded.add(last);
    }
}
