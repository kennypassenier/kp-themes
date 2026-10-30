// The handlers of the search, scope, density, sort, page size and column controls.
import { filterActive } from '../filter.js';
import { COLUMNS_EVENT, RETRY_EVENT, SORT_EVENT } from '../events.js';
import { nextSorts } from '../sort.js';
/** @typedef {import('../events.js').Density} Density */
/** @typedef {import('../events.js').FilterValue} FilterValue */
/** @typedef {import('../events.js').Sort} Sort */
/** @typedef {import('../events.js').SortKey} SortKey */
/** @typedef {import('./context.js').TableContext} TableContext */

/**
 * What the the handlers of the search, scope, density, sort, page size and column controls part adds to the table's context.
 *
 * @typedef {{
 *     clearFilters: () => void;
 *     commitSorts: (next: SortKey[], announced?: Sort) => void;
 *     onClear: () => void;
 *     onColumnChange: (event: Event) => void;
 *     onColumnClick: (event: MouseEvent) => void;
 *     onDensity: () => void;
 *     onHeadClick: (event: MouseEvent) => void;
 *     onHeadKey: (event: KeyboardEvent) => void;
 *     onPageSize: () => void;
 *     onPanel: () => void;
 *     onRetry: () => void;
 *     onScope: () => void;
 *     onSearch: () => void;
 *     onSortBy: () => void;
 *     onSortDirection: () => void;
 *     onToggle: () => void;
 *     setDensity: (next: Density) => void;
 *     setFilter: (column: string | number, value: FilterValue | null) => void;
 *     setHidden: (next: Iterable<number>) => void;
 *     setPageSize: (next: number) => void;
 *     setSort: (next: Sort) => void;
 * }} HandlersFields
 */

/**
 * The handlers of the search, scope, density, sort, page size and column controls.
 *
 * @param {TableContext} c
 */
export function installHandlers(c) {
    const {
        addOnClick,
        applyFilter,
        applySorts,
        closeFilterEditor,
        columnAt,
        columnIds,
        controlColumn,
        cycleName,
        debounce,
        densitySelect,
        filterKinds,
        filters,
        headers,
        locked,
        memory,
        multi,
        readControls,
        render,
        renderPills,
        request,
        scopeSelect,
        search,
        serverMode,
        syncColumns,
        wrap,
        writeControls,
    } = c;

    const onSearch = () => {
        c.query = search?.value ?? '';
        clearTimeout(c.pending);
        if (debounce > 0) c.pending = window.setTimeout(() => applyFilter(), debounce);
        else applyFilter();
    };
    c.onSearch = onSearch;
    const onScope = () => {
        c.scope = scopeSelect === null || scopeSelect.value === '' ? null : Number(scopeSelect.value);
        applyFilter();
    };
    c.onScope = onScope;
    const onDensity = () => {
        if (densitySelect === null) return;
        setDensity(densitySelect.value === 'compact' ? 'compact' : 'comfortable');
    };
    c.onDensity = onDensity;
    /** @param {Density} next */
    const setDensity = (next) => {
        if (next === 'compact') wrap.setAttribute('data-density', 'compact');
        else wrap.removeAttribute('data-density');
        if (densitySelect !== null) densitySelect.value = next;
        memory?.write('density', next);
        render();
    };
    c.setDensity = setDensity;
    const onPanel = () => {
        // A picker set by writeControls announces it; that is not a person's change.
        if (c.writing) return;
        const before = JSON.stringify([...filters]);
        readControls();
        // A change event after the input event that already applied it.
        if (JSON.stringify([...filters]) === before) return;
        renderPills();
        applyFilter();
    };
    c.onPanel = onPanel;
    const onToggle = () => {
        if (c.panel === null || c.toggle === null) return;
        c.panel.hidden = !c.panel.hidden;
        c.toggle.setAttribute('aria-expanded', String(!c.panel.hidden));
    };
    c.onToggle = onToggle;
    /** @param {number | string} column @param {FilterValue | null} value */
    const setFilter = (column, value) => {
        const at = columnAt(column);
        const kind = filterKinds[at];
        if (!kind) return;
        if (value === null || !filterActive(kind, value)) filters.delete(at);
        else filters.set(at, value);
        writeControls();
        renderPills();
        applyFilter();
    };
    c.setFilter = setFilter;
    const clearFilters = () => {
        closeFilterEditor(false);
        filters.clear();
        writeControls();
        renderPills();
        applyFilter();
    };
    c.clearFilters = clearFilters;
    const onClear = () => {
        c.query = '';
        if (search !== null) search.value = '';
        closeFilterEditor(false);
        filters.clear();
        writeControls();
        renderPills();
        applyFilter();
        search?.focus();
    };
    c.onClear = onClear;
    const onRetry = () => {
        wrap.dispatchEvent(new CustomEvent(RETRY_EVENT, { bubbles: true }));
        if (serverMode) request();
    };
    c.onRetry = onRetry;
    /** @param {SortKey[]} next @param {Sort} [announced] */
    const commitSorts = (next, announced) => {
        c.sorts = next.filter((key) => headers[key.column] !== undefined);
        memory?.write(
            'sort',
            c.sorts.map((key) => ({ column: columnIds[key.column], direction: key.direction })),
        );
        wrap.dispatchEvent(new CustomEvent(SORT_EVENT, { bubbles: true, detail: announced === undefined ? (c.sorts[0] ?? null) : announced }));
        // A new sort starts at the first page, as the approved mock does:
        // the rows the reader was looking at are somewhere else now.
        c.page = 0;
        if (serverMode) {
            request();
            return;
        }
        applySorts();
        render();
    };
    c.commitSorts = commitSorts;
    /** @param {Sort} next */
    const setSort = (next) => {
        if (next === null || next.direction === 'none') commitSorts([], next);
        else commitSorts([{ column: next.column, direction: next.direction }], next);
    };
    c.setSort = setSort;
    /** @param {HTMLTableCellElement} header @param {boolean} addKey */
    const toggleSort = (header, addKey) => {
        const at = headers.indexOf(header);
        if (at === -1) return;
        // A column that cannot be sorted now (aria-disabled) keeps the sort as it is [kpadopt4].
        if (header.getAttribute('aria-disabled') === 'true') return;
        const next = nextSorts(c.sorts, at, { add: multi && (addOnClick ? !addKey : addKey), cycle: cycleName });
        if (next.length === 0) commitSorts([], { column: at, direction: 'none' });
        else commitSorts(next);
    };
    /** @param {MouseEvent} event */
    const onHeadClick = (event) => {
        const header = /** @type {HTMLTableCellElement | null} */ (/** @type {HTMLElement} */ (event.target).closest('th[data-kp-sort]'));
        if (header !== null) toggleSort(header, event.shiftKey);
    };
    c.onHeadClick = onHeadClick;
    // From the keyboard too [KT6]: a header the first version made
    // clickable was reachable by nobody who could not click. The
    // consumer may put a <button> inside the header; a bare header is
    // made focusable here. Shift + Enter adds the column as a key.
    /** @param {KeyboardEvent} event */
    const onHeadKey = (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        const header = /** @type {HTMLTableCellElement | null} */ (/** @type {HTMLElement} */ (event.target).closest('th[data-kp-sort]'));
        if (header === null) return;
        event.preventDefault();
        toggleSort(header, event.shiftKey);
    };
    c.onHeadKey = onHeadKey;
    for (const header of headers) {
        if (header.dataset.kpSort !== undefined && header.querySelector('button, a') === null && !header.hasAttribute('tabindex'))
            header.tabIndex = 0;
    }
    const onSortBy = () => {
        if (c.sortBy === null) return;
        if (c.sortBy.value === '') setSort(null);
        else setSort({ column: Number(c.sortBy.value), direction: c.sorts[0]?.direction === 'descending' ? 'descending' : 'ascending' });
    };
    c.onSortBy = onSortBy;
    const onSortDirection = () => {
        const first = c.sorts[0];
        if (first === undefined) return;
        setSort({ column: first.column, direction: first.direction === 'ascending' ? 'descending' : 'ascending' });
    };
    c.onSortDirection = onSortDirection;
    const onPageSize = () => {
        if (c.sizeSelect === null) return;
        setPageSize(Number(c.sizeSelect.value));
    };
    c.onPageSize = onPageSize;
    /** Keep the first row the reader was looking at on the page they land on. @param {number} next */
    const setPageSize = (next) => {
        if (!(next > 0)) return;
        const first = c.page * c.size;
        c.size = next;
        if (c.sizeSelect !== null) c.sizeSelect.value = String(next);
        c.page = Math.floor(first / c.size);
        if (serverMode) request();
        else render();
    };
    c.setPageSize = setPageSize;
    // ── Columns ────────────────────────────────────────────────────
    /** @param {Iterable<number>} next */
    const setHidden = (next) => {
        c.hiddenColumns = new Set([...next].filter((at) => headers[at] !== undefined && !locked[at] && !controlColumn(at)));
        memory?.write(
            'columns',
            [...c.hiddenColumns].sort((a, b) => a - b).map((at) => columnIds[at]),
        );
        syncColumns();
        wrap.dispatchEvent(new CustomEvent(COLUMNS_EVENT, { bubbles: true, detail: { hidden: [...c.hiddenColumns].sort((a, b) => a - b) } }));
        render();
    };
    c.setHidden = setHidden;
    /** @param {Event} event */
    const onColumnChange = (event) => {
        const box = /** @type {HTMLInputElement} */ (event.target);
        if (box.dataset.kpDatatableColumn === undefined) return;
        const at = Number(box.value);
        const next = new Set(c.hiddenColumns);
        if (box.checked) next.delete(at);
        else next.add(at);
        setHidden(next);
    };
    c.onColumnChange = onColumnChange;
    /** @param {MouseEvent} event */
    const onColumnClick = (event) => {
        if (/** @type {HTMLElement} */ (event.target).closest('[data-kp-datatable-columns-reset]') !== null) setHidden([]);
    };
    c.onColumnClick = onColumnClick;
}
