// Syncs the table's parts with its state: selection, sort marks, columns, fixed columns and card labels.
import { CHECK_CLASS, DETAIL, GROUP_ROW, SELECTED_COUNT, SELECT_ROW, SKELETON_ROW, SORT_RESET } from '../selectors.js';
import { getStrings } from '../../strings.js';
import { syncFixedColumns } from '../grid.js';
/** @typedef {import('../events.js').FilterValue} FilterValue */
/** @typedef {import('../grid.js').GridHandle} GridHandle */
/** @typedef {import('../events.js').View} View */
/** @typedef {import('./context.js').TableContext} TableContext */

/**
 * What the syncs the table's parts with its state: selection, sort marks, columns, fixed columns and card labels part adds to the table's context.
 *
 * @typedef {{
 *     byField: () => Record<string, FilterValue>;
 *     columnAt: (column: string | number) => number;
 *     detailFor: (row: HTMLTableRowElement) => HTMLTableRowElement | undefined;
 *     fixedCount: number;
 *     fixedEndCount: number;
 *     grid: GridHandle | null;
 *     labelCells: () => void;
 *     selectedRows: () => HTMLTableRowElement[];
 *     serverSelection: Set<string>;
 *     syncActions: () => void;
 *     syncCardSort: () => void;
 *     syncColumns: () => void;
 *     syncFixed: () => void;
 *     syncSelectAll: () => void;
 *     syncSortMarks: () => void;
 *     syncStateParts: () => void;
 *     view: () => View;
 * }} SyncFields
 */

/**
 * Syncs the table's parts with its state: selection, sort marks, columns, fixed columns and card labels.
 *
 * @param {TableContext} c
 */
export function installSync(c) {
    const {
        actions,
        body,
        builtDetails,
        busyWas,
        choosable,
        columnIds,
        controlColumn,
        detailFn,
        details,
        detailsWereHidden,
        expandable,
        expanded,
        filters,
        folded,
        headers,
        headersWereHidden,
        id,
        keyColumn,
        keyOf,
        labelOf,
        loadingSlot,
        locked,
        make,
        orders,
        selectAll,
        serverMode,
        syncCover,
        table,
        undo,
        visibleColumns,
        wrap,
    } = c;

    /** A detail row, made ready to show: its class, its id and its span. @param {HTMLTableRowElement} row */
    const detailFor = (row) => {
        let detail = details.get(row);
        if (detail === undefined && expandable) {
            const hasMarkup = [...detailsWereHidden.keys()].length > 0;
            if (detailFn === undefined && hasMarkup) return undefined;
            detail = /** @type {HTMLTableRowElement} */ (make('tr'));
            detail.dataset.kpRowDetail = '';
            detail.hidden = true;
            const cell = make('td');
            detail.append(cell);
            details.set(row, detail);
            builtDetails.add(detail);
            if (detailFn !== undefined) {
                const content = detailFn(row);
                if (typeof content === 'string') cell.textContent = content;
                else if (content !== null && content !== undefined) cell.append(content);
            }
        }
        if (detail === undefined) return undefined;
        if (!detail.classList.contains('kp-datatable__detail')) {
            detail.classList.add('kp-datatable__detail');
            const node = detail;
            if (!builtDetails.has(detail)) undo.push(() => node.classList.remove('kp-datatable__detail'));
        }
        if (detail.id === '') {
            detail.id = `${id}-detail-${keyOf(row) || row.rowIndex}`;
            const node = detail;
            if (!builtDetails.has(detail)) undo.push(() => node.removeAttribute('id'));
        }
        const cell = detail.cells[0];
        if (cell !== undefined) cell.colSpan = visibleColumns();
        return detail;
    };
    c.detailFor = detailFor;
    /** The filters under the column ids instead of the numbers [wish-1028]. @returns {Record<string, FilterValue>} */
    const byField = () => Object.fromEntries([...filters].map(([at, value]) => [columnIds[at], value]));
    c.byField = byField;
    /**
     * A column asked for by number, or by its id (`data-kp-field`, else its text); -1 when the id names none [wish-1028].
     * @param {number | string} column
     */
    const columnAt = (column) => (typeof column === 'string' ? columnIds.indexOf(column) : column);
    c.columnAt = columnAt;
    /** @returns {View} */
    const view = () => ({
        shown: serverMode ? c.total || 0 : c.shownRows.length,
        total: serverMode ? c.total || 0 : c.all.length,
        page: c.page,
        pageNumber: c.page + 1,
        pages: Math.max(1, Math.ceil((serverMode ? c.total || 0 : c.shownRows.length) / c.size)),
        pageSize: c.size,
        query: c.query,
        scope: c.scope,
        filters: Object.fromEntries(filters),
        filtersByField: byField(),
        sort: c.sorts[0] ?? null,
        sorts: c.sorts.map((key) => ({ ...key })),
        hidden: [...c.hiddenColumns].sort((a, b) => a - b),
        expanded: [...expanded],
        density: wrap.getAttribute('data-density') === 'compact' ? 'compact' : 'comfortable',
        state: c.state,
        keys: c.shownRows.map(keyOf),
        pageKeys: c.pageRows.map(keyOf),
        folded: [...folded],
    });
    c.view = view;
    /** Keys ticked in a server-backed table, which outlive the rows of one page. @type {Set<string>} */
    const serverSelection = new Set();
    c.serverSelection = serverSelection;
    const selectedRows = () =>
        c.all.filter((row) => {
            const box = /** @type {HTMLInputElement | null} */ (row.querySelector(SELECT_ROW));
            return box !== null && box.checked;
        });
    c.selectedRows = selectedRows;
    /** The header box reads the rows on this page, which are the rows it acts on [gap-13]. */
    const syncSelectAll = () => {
        if (selectAll === null) return;
        const boxes = c.pageRows.map((row) => /** @type {HTMLInputElement | null} */ (row.querySelector(SELECT_ROW))).filter((b) => b !== null);
        const checked = boxes.filter((b) => b.checked).length;
        selectAll.checked = boxes.length > 0 && checked === boxes.length;
        // Indeterminate is the honest third state: a header box that
        // reads "checked" while three of ten rows are selected lies.
        selectAll.indeterminate = checked > 0 && checked < boxes.length;
    };
    c.syncSelectAll = syncSelectAll;
    const syncActions = () => {
        if (actions === null) return;
        const count = serverMode ? serverSelection.size : selectedRows().length;
        actions.hidden = count === 0;
        const counter = actions.querySelector(SELECTED_COUNT);
        if (counter !== null) counter.textContent = getStrings().tableSelected(count);
    };
    c.syncActions = syncActions;
    /** Skeleton rows for a first load with no loading slot of the consumer's, as #states shows it. */
    const syncSkeleton = () => {
        const want = c.state === 'loading' && c.all.length === 0 && loadingSlot === null;
        const have = [...body.querySelectorAll(`:scope > ${SKELETON_ROW}`)];
        if (!want) {
            for (const row of have) row.remove();
            return;
        }
        if (have.length > 0) return;
        for (let i = 0; i < 3; i += 1) {
            const row = make('tr');
            row.dataset.kpSkeletonRow = '';
            row.setAttribute('aria-hidden', 'true');
            headers.forEach((_, at) => {
                const cell = make('td');
                if (c.hiddenColumns.has(at)) cell.hidden = true;
                if (!controlColumn(at)) cell.append(make('span', 'kp-skeleton'));
                row.append(cell);
            });
            body.append(row);
        }
    };
    const syncStateParts = () => {
        if (c.state === 'loading') wrap.setAttribute('aria-busy', 'true');
        else if (busyWas === null) wrap.removeAttribute('aria-busy');
        else wrap.setAttribute('aria-busy', busyWas);
        wrap.dataset.kpState = c.state;
        // A skeleton on a first load, the old rows dimmed on a refresh:
        // the stylesheet dims, this only decides whether there is
        // anything to dim.
        if (loadingSlot !== null) loadingSlot.hidden = !(c.state === 'loading' && c.all.length === 0);
        if (c.failedSlot !== null) c.failedSlot.hidden = c.state !== 'failed';
        syncCover();
        syncSkeleton();
    };
    c.syncStateParts = syncStateParts;
    const syncCardSort = () => {
        if (c.sortBy === null || c.sortDirection === null) return;
        const s = getStrings();
        const first = c.sorts[0];
        c.sortBy.value = first === undefined ? '' : String(first.column);
        c.sortDirection.textContent = first?.direction === 'descending' ? s.tableSortDescending : s.tableSortAscending;
        c.sortDirection.disabled = c.sortBy.value === '';
    };
    c.syncCardSort = syncCardSort;
    // aria-sort on each sorted column and 'none' on every other sortable
    // header: a stale "ascending" on a column that is no longer a key is
    // worse than saying nothing. With more than one key each sorted header
    // carries its place, the number the mock drew [#multi-sort].
    const syncSortMarks = () => {
        const s = getStrings();
        headers.forEach((header, at) => {
            header.querySelector(':scope .kp-datatable__sort-order')?.remove();
            if (header.dataset.kpSort === undefined) return;
            const index = c.sorts.findIndex((key) => key.column === at);
            const key = c.sorts[index];
            header.setAttribute('aria-sort', key === undefined ? 'none' : key.direction);
            if (key === undefined || c.sorts.length < 2) return;
            const mark = make('span', 'kp-datatable__sort-order');
            mark.setAttribute('aria-hidden', 'true');
            mark.textContent = String(index + 1);
            (header.querySelector('button') ?? header).append(mark);
        });
        if (c.openingSort !== null) {
            const atOpening = JSON.stringify(c.sorts) === c.openingSort;
            for (const back of wrap.querySelectorAll(SORT_RESET)) back.toggleAttribute('data-kp-datatable-at-opening', atOpening);
        }
        if (c.sortSummary !== null) {
            c.sortSummary.textContent =
                c.sorts.length === 0
                    ? s.tableNotSorted
                    : s.tableSortedBy(
                          c.sorts.map((key) =>
                              s.tableSortKey(
                                  labelOf(key.column),
                                  key.direction,
                                  orders[key.column] ? 'order' : (headers[key.column]?.dataset.kpSort ?? 'text'),
                              ),
                          ),
                      );
            // One line: the whole of it on hover when it is cut [fix-83].
            c.sortSummary.title = c.sortSummary.textContent ?? '';
        }
    };
    c.syncSortMarks = syncSortMarks;
    const syncColumns = () => {
        headers.forEach((header, at) => {
            header.hidden = c.hiddenColumns.has(at) || (headersWereHidden[at] ?? false);
        });
        for (const row of body.rows) {
            if (row.matches(DETAIL) || row.matches(GROUP_ROW)) continue;
            headers.forEach((_, at) => {
                const cell = row.cells[at];
                if (cell !== undefined) cell.hidden = c.hiddenColumns.has(at);
            });
        }
        if (c.columnList !== null && c.columnList.childElementCount > 0) {
            // Built once and then only ticked, so a box keeps its focus and
            // its identity while the reader goes down the list.
            for (const box of c.columnList.querySelectorAll('[data-kp-datatable-column]')) {
                const input = /** @type {HTMLInputElement} */ (box);
                input.checked = !c.hiddenColumns.has(Number(input.value));
            }
        } else if (c.columnList !== null) {
            const s = getStrings();
            for (const at of choosable) {
                const item = make('li');
                const label = /** @type {HTMLLabelElement} */ (make('label', 'kp-menu__item kp-datatable__column-option'));
                const box = /** @type {HTMLInputElement} */ (make('input', CHECK_CLASS));
                box.type = 'checkbox';
                box.value = String(at);
                box.dataset.kpDatatableColumn = '';
                box.checked = !c.hiddenColumns.has(at);
                box.disabled = locked[at] ?? false;
                label.append(box, ` ${locked[at] ? s.tableColumnLocked(labelOf(at)) : labelOf(at)}`);
                item.append(label);
                c.columnList.append(item);
            }
            const separator = make('li', 'kp-menu__separator');
            separator.setAttribute('role', 'separator');
            const resetItem = make('li');
            const reset = /** @type {HTMLButtonElement} */ (make('button', 'kp-menu__item'));
            reset.type = 'button';
            reset.dataset.kpDatatableColumnsReset = '';
            reset.textContent = s.tableShowAllColumns;
            resetItem.append(reset);
            c.columnList.append(separator, resetItem);
        }
        if (c.columnCount !== null)
            c.columnCount.textContent = getStrings().tableColumnsShown(
                choosable.length - [...c.hiddenColumns].filter((at) => choosable.includes(at)).length,
                choosable.length,
            );
    };
    c.syncColumns = syncColumns;
    const fixedAttribute = wrap.dataset.kpFixedColumns;
    const fixedCount = fixedAttribute === undefined ? 0 : Number.parseInt(fixedAttribute, 10) || keyColumn + 1;
    c.fixedCount = fixedCount;
    const fixedEndCount = Math.max(0, Number.parseInt(wrap.dataset.kpFixedEnd ?? '', 10) || (wrap.dataset.kpFixedEnd === undefined ? 0 : 1));
    c.fixedEndCount = fixedEndCount;
    const syncFixed = () => {
        if (fixedCount > 0 || fixedEndCount > 0) syncFixedColumns(table, fixedCount, fixedEndCount);
    };
    c.syncFixed = syncFixed;
    /**
     * A table that becomes cards says in each cell which column it is [datatable-r5-1019, B2]: a cell the markup
     * gave no `data-label` takes its header's words, so a server that renders plain rows still gets cards. A label
     * the markup wrote stays; a cell under a header with no words (the selection box, the actions) gets none and
     * spans the card. Read again on every render, for rows that came later; detach takes the derived ones away.
     * @type {Set<HTMLTableCellElement>}
     */
    const derivedLabels = new Set();
    const cardsWanted = wrap.hasAttribute('data-kp-cards') || table.hasAttribute('data-kp-cards');
    const labelCells = () => {
        if (!cardsWanted) return;
        for (const row of c.all) {
            if (row.matches(DETAIL) || row.matches(GROUP_ROW) || row.matches(SKELETON_ROW)) continue;
            for (const cell of row.cells) {
                if (cell.hasAttribute('data-label')) continue;
                const words = labelOf(cell.cellIndex);
                if (words === '') continue;
                cell.setAttribute('data-label', words);
                derivedLabels.add(cell);
            }
        }
    };
    c.labelCells = labelCells;
    undo.push(() => {
        for (const cell of derivedLabels) cell.removeAttribute('data-label');
        derivedLabels.clear();
    });
    /** @type {GridHandle | null} */
    c.grid = null;
}
