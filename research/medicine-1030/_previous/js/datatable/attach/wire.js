// Registers the table's listeners and applies its initial state.
import { attachSelect, drawsSelect } from '../../combobox.js';
import { DATE_EVENT } from '../../datepicker.js';
import { splitList } from '../filter.js';
import { getStrings } from '../../strings.js';
import { attachGrid } from '../grid.js';
/** @typedef {import('./context.js').TableContext} TableContext */

/**
 * What the registers the table's listeners and applies its initial state part adds to the table's context.
 *
 * @typedef {{
 *     initialSorts: { column: number; direction: 'ascending' | 'descending'; }[];
 *     resize: ResizeObserver | null;
 *     resizeFrame: number;
 * }} WireFields
 */

/**
 * Registers the table's listeners and applies its initial state.
 *
 * @param {TableContext} c
 */
export function installWire(c) {
    const {
        applyFilter,
        body,
        cellText,
        cleanups,
        densitySelect,
        filterColumns,
        filterKinds,
        filters,
        fixedCount,
        fixedEndCount,
        gridMode,
        gridPageRows,
        headers,
        labelOf,
        multi,
        onAddMenuClick,
        onAddMenuKey,
        onAddToggle,
        onBodyChange,
        onBodyFocusIn,
        onBodyFocusOut,
        onColumnChange,
        onColumnClick,
        onDensity,
        onEditorClick,
        onEditorFocusOut,
        onEditorKey,
        onEditorKeyCapture,
        onEditorKeydown,
        onEditorSubmit,
        onHeadClick,
        onHeadKey,
        onPageSize,
        onPanel,
        onPillsClick,
        onRowKey,
        onScope,
        onSearch,
        onSelectAll,
        onSortBy,
        onSortDirection,
        onToggle,
        onWrapClick,
        pillsList,
        render,
        renderPills,
        request,
        scopeSelect,
        search,
        selectAll,
        serverMode,
        syncColumns,
        syncFixed,
        table,
        wrap,
        writeControls,
    } = c;

    // The table's own selects wear the package's drawn list, as every
    // .kp-field__input select does since Kenny's form of 2026-09-13 — here
    // as well as in auto.js, because two of them are built by this attach
    // after auto.js has passed, and a consumer may attach only the tables.
    for (const control of [scopeSelect, densitySelect, c.sortBy, c.sizeSelect]) {
        if (control === null || control.dataset.kpSelectAttached !== undefined || !drawsSelect(control)) continue;
        cleanups.push(attachSelect(control));
    }
    search?.addEventListener('input', onSearch);
    scopeSelect?.addEventListener('change', onScope);
    densitySelect?.addEventListener('change', onDensity);
    c.panel?.addEventListener('input', onPanel);
    c.panel?.addEventListener('change', onPanel);
    c.panel?.addEventListener(DATE_EVENT, onPanel);
    c.toggle?.addEventListener('click', onToggle);
    c.addPop?.addEventListener('toggle', onAddToggle);
    c.addMenu?.addEventListener('click', onAddMenuClick);
    c.addMenu?.addEventListener('keydown', onAddMenuKey);
    c.filterEditor?.addEventListener('submit', onEditorSubmit);
    c.filterEditor?.addEventListener('click', onEditorClick);
    c.filterEditor?.addEventListener('keydown', onEditorKeydown);
    pillsList.addEventListener('click', onPillsClick);
    c.sortBy?.addEventListener('change', onSortBy);
    c.sortDirection?.addEventListener('click', onSortDirection);
    c.sizeSelect?.addEventListener('change', onPageSize);
    c.columnList?.addEventListener('change', onColumnChange);
    c.columnList?.addEventListener('click', onColumnClick);
    wrap.addEventListener('click', onWrapClick);
    wrap.addEventListener('keydown', onEditorKeyCapture, { capture: true });
    wrap.addEventListener('keydown', onEditorKey);
    wrap.addEventListener('focusout', onEditorFocusOut);
    table.tHead?.addEventListener('click', onHeadClick);
    table.tHead?.addEventListener('keydown', onHeadKey);
    body.addEventListener('change', onBodyChange);
    body.addEventListener('keydown', onRowKey);
    body.addEventListener('focusin', onBodyFocusIn);
    body.addEventListener('focusout', onBodyFocusOut);
    selectAll?.addEventListener('change', onSelectAll);
    c.query = search?.value ?? '';
    // Headers the server rendered already sorted keep their sort, in the
    // order `data-kp-sort-priority` gives, else the order they stand in.
    const initialSorts = headers
        .map((header, at) => ({ header, at }))
        .filter(({ header }) => ['ascending', 'descending'].includes(header.getAttribute('aria-sort') ?? ''))
        .sort((a, b) => (Number(a.header.dataset.kpSortPriority) || a.at + 1000) - (Number(b.header.dataset.kpSortPriority) || b.at + 1000))
        .map(({ header, at }) => ({ column: at, direction: /** @type {'ascending' | 'descending'} */ (header.getAttribute('aria-sort')) }))
        .slice(0, multi ? undefined : 1);
    c.initialSorts = initialSorts;
    c.sorts = initialSorts.map((key) => ({ ...key }));
    c.openingSort = JSON.stringify(initialSorts);
    // A filter the markup declared as already set: `data-kp-filter-value`,
    // a list for a choice, "from,to" for a range or a date.
    for (const at of filterColumns) {
        const declared = headers[at]?.dataset.kpFilterValue;
        if (declared === undefined) continue;
        const kind = filterKinds[at];
        if (kind === 'choice') filters.set(at, splitList(declared));
        else {
            const [from = '', to = ''] = declared.split(',').map((part) => part.trim());
            filters.set(at, { from, to });
        }
    }
    if (gridMode) {
        c.grid = attachGrid(table, {
            pageRows: gridPageRows,
            onMove: ({ row, rows, column, cell }) => {
                if (c.gridReadout === null) return;
                const at = cell.cellIndex;
                const text =
                    cell.parentElement?.parentElement?.tagName === 'THEAD'
                        ? labelOf(at)
                        : cellText(/** @type {HTMLTableRowElement} */ (cell.parentElement), at);
                void column;
                c.gridReadout.textContent = getStrings().tableGridPosition(row, rows, labelOf(at), text);
            },
        });
    }
    writeControls();
    renderPills();
    syncColumns();
    if (serverMode) {
        if (c.all.length > 0 && Number.isFinite(c.total)) {
            c.state = 'ready';
            render();
        } else request();
    } else applyFilter();
    c.resizeFrame = 0;
    const resize =
        (fixedCount > 0 || fixedEndCount > 0) && typeof ResizeObserver !== 'undefined'
            ? new ResizeObserver(() => {
                  cancelAnimationFrame(c.resizeFrame);
                  c.resizeFrame = requestAnimationFrame(syncFixed);
              })
            : null;
    c.resize = resize;
    resize?.observe(table);
}
