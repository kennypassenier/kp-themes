import { forwardRef, useCallback, useEffect, useId, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { compare as compareCells, compareByOrder, filterActive, filterPills, matchesFilter, nextSorts } from '../js/datatable.js';
import { filterPillLabel, readFilterBounds } from '../js/datatable.js';
import { attachGrid, syncFixedColumns, EDIT_EVENT, PAGE_SIZES, RETRY_EVENT, SERVER_DEBOUNCE_MS, VIEW_EVENT } from '../js/datatable.js';
import { collator, formatDate, resolveLocale } from '../js/locale.js';
import { DatePicker } from './flow.jsx';
import { useDrawnSelect } from './field.jsx';
import { useStrings } from '../hooks/use-strings.jsx';
import { useControllable } from '../hooks/use-controllable.js';

// DataTable, React [TH37].
//
// Same contract as js/datatable.js: the same class names, the same
// `aria-sort`, the same announced row count. The difference is where the
// rows come from — this channel is handed data and renders it, the
// framework-free one works on a table a server already wrote.
//
// Deliberately without virtualisation or export: `apiRef.rows()` hands an
// app the rows the table shows, which is all an export needs.
//
// Since 3.2.0: the scroll wrapper is a named region a keyboard can
// reach [TH95], and the card layout is driven by the width of the
// table's own container rather than by the viewport's [TH96, AR24].
//
// Since 3.0.0 [KT6]: query, sort, page and selection are controllable —
// a table in the URL, a selection cleared after a bulk action, a server
// that sorts and pages (`totalRows` tells the table it is not looking at
// everything); the comparator collates in the page's locale rather than
// in Dutch; a header sorts from the keyboard; cells render nodes; and
// the search box, the pager and the card layout can each be off.
//
// Round eight [gap-13, Kenny 2026-09-13]: the same features as the
// framework-free channel, as props — the "In" choice, per-column filters
// with pills, a sort order per column, density, a page-size choice (25 by
// default), an action bar for a selection, a sticky header under a max
// height, loading and failed states, the card layout's sort control, and
// the rows the table shows through `apiRef` and the view event.
//
// The seven of Kenny's form of 2026-09-13 ("Alle zeven, nu"), as props,
// each off until asked for: `multiSort`, `columnMenu`, `renderDetail`,
// `fixedColumns`, `load`, a column's `edit` with `onCellEdit`, and `grid`.
// The press logic of a sort, the fixed columns' offsets and the keyboard
// grid are the framework-free channel's own functions, so the two cannot
// disagree on what a key or a press does.

/** @typedef {import('../js/datatable.js').FilterValue} FilterValue */

/**
 * One bound of a date filter: the package's own date picker, so the filter
 * wears every theme's picker instead of the browser's date input (scope-58,
 * Kenny's second nostromo pass, 2026-09-13). The filter holds ISO; the
 * picker is left to hold what the person typed, and is drawn afresh only
 * when the bound changes from outside — a pill removed, the filters cleared.
 *
 * @param {{ label: string, iso: string, locale: string, onIso: (iso: string) => void, strings?: Partial<import('../js/strings.js').Strings> }} props
 */
function DateBound({ label, iso, locale, onIso, strings }) {
    const reported = useRef(iso);
    const [generation, setGeneration] = useState(0);
    useEffect(() => {
        if (iso === reported.current) return;
        reported.current = iso;
        setGeneration((n) => n + 1);
    }, [iso]);
    return (
        <DatePicker
            key={generation}
            label={label}
            hideLabel
            locale={locale}
            strings={strings}
            defaultValue={iso === '' ? '' : formatDate(new Date(`${iso}T00:00:00`), locale)}
            onChange={(next) => {
                const value = next ?? '';
                reported.current = value;
                onIso(value);
            }}
        />
    );
}

/**
 * The add-filter mode's editor for one column [Kenny, 2026-09-14, #filter-add]:
 * the package's checkboxes for a choice, two package fields for a number
 * range, two package date pickers for dates. Drawn afresh for each column it
 * opens on, holding what the filter holds, and read on Apply the way the
 * framework-free channel reads its own: from the fields themselves.
 *
 * @param {{ id: string, column: Column, kind: 'choice' | 'range' | 'date', value: FilterValue | undefined, choices: string[], locale: string,
 *   error: { message: string, bound?: 'from' | 'to' } | null, s: import('../js/strings.js').Strings,
 *   strings?: Partial<import('../js/strings.js').Strings>, onApply: (form: HTMLFormElement) => void, onCancel: () => void }} props
 */
function FilterEditor({ id, column, kind, value, choices, locale, error, s, strings, onApply, onCancel }) {
    const label = labelText(column);
    const range = /** @type {{ from?: string, to?: string }} */ (value !== undefined && !Array.isArray(value) ? value : {});
    const errorId = `${id}-error`;
    return (
        <form
            className="kp-datatable__filter-editor"
            id={id}
            data-kp-datatable-filter-editor
            data-kp-filter-column={column.key}
            aria-label={s.tableFilterEditor(label)}
            noValidate
            onSubmit={(event) => {
                event.preventDefault();
                onApply(event.currentTarget);
            }}
            onKeyDown={(event) => {
                const target = /** @type {HTMLElement} */ (event.target);
                // Escape inside an open calendar closes the calendar, not the editor.
                if (event.key !== 'Escape' || event.defaultPrevented || target.closest('[data-kp-date-panel]') !== null) return;
                if (target.getAttribute('aria-expanded') === 'true') return;
                event.preventDefault();
                onCancel();
            }}
        >
            <p className="kp-datatable__filter-editor-title">{column.label}</p>
            {kind === 'choice' ? (
                <fieldset className="kp-fieldset">
                    <legend className="kp-sr-only">{s.tableFilterChoicesLegend(label)}</legend>
                    <div className="kp-datatable__filter-editor-choices">
                        {choices.map((choice) => (
                            <label key={choice} className="kp-field__option">
                                <input
                                    className="kp-field__check"
                                    type="checkbox"
                                    name="values"
                                    value={choice}
                                    defaultChecked={Array.isArray(value) && value.includes(choice)}
                                />{' '}
                                {choice}
                            </label>
                        ))}
                    </div>
                </fieldset>
            ) : (
                <div className="kp-datatable__filter-editor-pair">
                    {
                        /** @type {const} */ (['from', 'to']).map((bound) => {
                            const invalid = error?.bound === bound ? 'true' : undefined;
                            return kind === 'date' ? (
                                <DatePicker
                                    key={bound}
                                    label={s.tableFilterBound(kind, bound, label)}
                                    locale={locale}
                                    strings={strings}
                                    defaultValue={range[bound] ? formatDate(new Date(`${range[bound]}T00:00:00`), locale) : ''}
                                    inputProps={{
                                        'data-kp-filter-bound': bound,
                                        autoComplete: 'off',
                                        'aria-describedby': errorId,
                                        'aria-invalid': invalid,
                                    }}
                                />
                            ) : (
                                <div key={bound} className="kp-field">
                                    <label className="kp-field__label" htmlFor={`${id}-${bound}`}>
                                        {s.tableFilterBound(kind, bound, label)}
                                    </label>
                                    <input
                                        className="kp-field__input"
                                        id={`${id}-${bound}`}
                                        type="text"
                                        inputMode="decimal"
                                        autoComplete="off"
                                        data-kp-filter-bound={bound}
                                        aria-describedby={errorId}
                                        aria-invalid={invalid}
                                        defaultValue={range[bound] ?? ''}
                                    />
                                </div>
                            );
                        })
                    }
                </div>
            )}
            <p className="kp-field__error" id={errorId} data-kp-filter-error role="alert" hidden={error === null}>
                {error?.message}
            </p>
            <div className="kp-datatable__filter-editor-actions">
                <button type="submit" className="kp-button kp-button--primary kp-button--sm">
                    {s.tableFilterApply}
                </button>
                <button type="button" className="kp-button kp-button--ghost kp-button--sm" data-kp-filter-cancel onClick={onCancel}>
                    {s.tableFilterCancel}
                </button>
            </div>
        </form>
    );
}

/**
 * The drawn select an edited cell shows [#inline-edit]: the package's field
 * with the drawn list laid over it, and the editor's own ref beside it.
 *
 * @param {{ options: string[], defaultValue: string, control: import('react').MutableRefObject<HTMLSelectElement | HTMLInputElement | null>, label: string, describedBy: string, invalid: boolean }} props
 */
function EditSelect({ options, defaultValue, control, label, describedBy, invalid }) {
    const drawn = useDrawnSelect();
    const setRef = useCallback(
        (/** @type {HTMLSelectElement | null} */ node) => {
            control.current = node;
            drawn(node);
        },
        [drawn, control],
    );
    return (
        <select
            className="kp-field__input"
            data-kp-datatable-editor
            aria-label={label}
            aria-describedby={describedBy}
            aria-invalid={invalid ? 'true' : undefined}
            defaultValue={defaultValue}
            ref={setRef}
        >
            {options.map((option) => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
        </select>
    );
}

/**
 * @typedef {{ key: string, label: import('react').ReactNode, kind?: 'text' | 'number' | 'date', sortable?: boolean, searchable?: boolean,
 *   filter?: 'choice' | 'range' | 'date', filterOptions?: string[], order?: string[], align?: 'start' | 'center' | 'end', width?: string,
 *   className?: string, truncate?: boolean, render?: (value: unknown, row: Record<string, unknown>, index: number) => import('react').ReactNode,
 *   compare?: (a: unknown, b: unknown) => number, locked?: boolean, edit?: 'text' | 'number' | 'select' | 'date', editOptions?: string[],
 *   editRequired?: boolean, editMin?: string, editMax?: string }} Column
 *   `locked` keeps a column in the column menu's list, always shown (default: the first column). `edit` makes its values editable in their cells.
 */
/** @typedef {{ key: string, direction: 'ascending' | 'descending' } | null} Sort */
/** One key of a sort on several columns. @typedef {{ key: string, direction: 'ascending' | 'descending' }} SortKey */
/**
 * `editFilter(key)` opens a column's filter editor in the add-filter mode, and `editFilter(null)` closes it; in the panel mode it opens or closes the panel.
 * @typedef {{ rows: (which?: 'view' | 'page') => Record<string, unknown>[], reload: () => void, editFilter: (key: string | null) => void }} DataTableApi
 */
/**
 * What `load` is asked for: the page the reader is on, with the search, the sort and the filters that chose it.
 * @typedef {{ query: string, scope: string | null, sort: Sort, sorts: SortKey[], filters: Record<string, FilterValue>, page: number, pageSize: number, signal: AbortSignal }} DataRequest
 */
/** @typedef {{ rows: Record<string, unknown>[], total: number }} DataAnswer */
/**
 * An edit about to be saved. Return a string (or false) to refuse it, or a promise of either; anything else accepts it, and the
 * app then updates `rows`.
 * @typedef {{ row: Record<string, unknown>, rowKey: string, key: string, label: string, value: string, previous: string, undo: boolean }} CellEdit
 */

/**
 * @typedef {object} DataTableProps
 * @property {Column[]} columns
 * @property {Record<string, unknown>[]} [rows]  Required unless `load` supplies them.
 * @property {(row: Record<string, unknown>, index: number) => string} [rowKey]
 * @property {number} [pageSize]       Default 25.
 * @property {number[]} [pageSizes]    The rows-per-page choice. Default 10, 25, 50, 100; an empty list offers none.
 * @property {(size: number) => void} [onPageSizeChange]
 * @property {boolean} [paginated]     Default true.
 * @property {boolean} [searchable]    Default true.
 * @property {boolean} [searchScope]  Offer the "In" choice beside the search box. Default false.
 * @property {string | null} [scope]   Controlled: the column key the search is limited to, or null for all.
 * @property {string | null} [defaultScope]
 * @property {(scope: string | null) => void} [onScopeChange]
 * @property {Record<string, FilterValue>} [filters]  Controlled, by column key.
 * @property {Record<string, FilterValue>} [defaultFilters]
 * @property {(filters: Record<string, FilterValue>) => void} [onFiltersChange]
 * @property {'panel' | 'add'} [filterMode]  How the column filters are set: a panel of every filter, or "+ Add filter" with one pill per filter that reopens its editor. Default panel.
 * @property {boolean} [filtersOpen]  Controlled: the filter panel.
 * @property {boolean} [defaultFiltersOpen]  Default false.
 * @property {(open: boolean) => void} [onFiltersOpenChange]
 * @property {'comfortable' | 'compact'} [density]  Controlled.
 * @property {'comfortable' | 'compact'} [defaultDensity]
 * @property {(density: 'comfortable' | 'compact') => void} [onDensityChange]
 * @property {boolean} [densityChoice] Offer the density choice. Default false.
 * @property {boolean} [selectable]
 * @property {(selected: string[], clear: () => void) => import('react').ReactNode} [actions]  The action bar a selection shows.
 * @property {boolean} [cards]         The narrow layout. Default true.
 * @property {string} [maxHeight]      A max height for the scroll box; the header stays while it scrolls.
 * @property {import('react').ReactNode} [caption]
 * @property {boolean} [region]        The scroll wrapper as a keyboard-reachable region [TH95]. Default true.
 * @property {string} [regionLabel]    Its accessible name. Default: the caption, else the dictionary's `tableRegion`.
 * @property {import('react').ReactNode} [empty]
 * @property {string} [query]          Controlled.
 * @property {string} [defaultQuery]
 * @property {(query: string) => void} [onQueryChange]
 * @property {number} [debounceMs]     Default 0, and 300 with `load`.
 * @property {Sort} [sort]             Controlled: a sort on one column.
 * @property {Sort} [defaultSort]
 * @property {(sort: Sort) => void} [onSortChange]  Hears the first key of every sort.
 * @property {boolean} [multiSort]     Shift + click (or Shift + Enter) adds a sort key. Default false.
 * @property {SortKey[]} [sorts]       Controlled: every key, the first first.
 * @property {SortKey[]} [defaultSorts]
 * @property {(sorts: SortKey[]) => void} [onSortsChange]
 * @property {'two' | 'three'} [sortCycle]  Default two; three adds an unsorted state.
 * @property {boolean} [columnMenu]    A menu of columns to show or hide; a `locked` column stays. Default false.
 * @property {string[]} [hiddenColumns]  Controlled, by column key.
 * @property {string[]} [defaultHiddenColumns]
 * @property {(keys: string[]) => void} [onHiddenColumnsChange]
 * @property {(row: Record<string, unknown>, index: number) => import('react').ReactNode} [renderDetail]  A row's detail; each row gets a button that opens it.
 * @property {(row: Record<string, unknown>, index: number) => boolean} [rowExpandable]  Default every row.
 * @property {string[]} [expanded]     Controlled: the open rows, by key.
 * @property {string[]} [defaultExpanded]
 * @property {(keys: string[]) => void} [onExpandedChange]
 * @property {string} [expandGlyph]    Default ▸.
 * @property {string} [collapseGlyph]  Default ▾.
 * @property {boolean | number} [fixedColumns]  The leading columns that stay while the box scrolls sideways: true for through the first column, or a count.
 * @property {(request: DataRequest) => Promise<DataAnswer> | DataAnswer} [load]  The rows come from here: asked again on every search, sort, filter and page, and an answer that arrives after a newer request is thrown away.
 * @property {(edit: CellEdit) => unknown} [onCellEdit]  Hears an edit before it is saved.
 * @property {boolean} [grid]          Moving through cells with the arrow keys, as an ARIA grid. Default false.
 * @property {number} [gridPageRows]   Rows Page Up and Page Down move. Default 5.
 * @property {number} [page]           Controlled, 0-based.
 * @property {number} [defaultPage]
 * @property {(page: number) => void} [onPageChange]
 * @property {number} [totalRows]      Server mode: the rows given are one page of this many; the table neither filters nor sorts nor slices them.
 * @property {string[]} [selected]     Controlled.
 * @property {string[]} [defaultSelected]
 * @property {(keys: string[]) => void} [onSelect]
 * @property {string} [locale]         Default: the nearest lang, else the browser's.
 * @property {(row: Record<string, unknown>, query: string) => boolean} [filter]
 * @property {(row: Record<string, unknown>, index: number) => void} [onRowClick]
 * @property {(row: Record<string, unknown>, index: number) => string | undefined} [rowClassName]
 * @property {boolean} [loading]       With no rows, the loading slot shows; with rows, they stay, dimmed.
 * @property {import('react').ReactNode} [loadingContent]  What the loading slot shows. Default: three skeleton lines.
 * @property {boolean | import('react').ReactNode} [error]  The failed state: true for the dictionary's text, or the text itself.
 * @property {() => void} [onRetry]   The failed state's way out; the `kp-datatable-retry` event fires as well.
 * @property {import('react').Ref<DataTableApi>} [apiRef]  `rows()` — the rows the table shows, every page of the view or this page; `reload()` asks `load` again.
 * @property {(view: { keys: string[], pageKeys: string[], rows: Record<string, unknown>[], pageRows: Record<string, unknown>[], query: string, scope: string | null, filters: Record<string, FilterValue>, sort: Sort, sorts: SortKey[], hidden: string[], expanded: string[], page: number, pageSize: number }) => void} [onViewChange]
 * @property {string} [removeGlyph]    A filter pill's remove glyph. Default ×.
 * @property {Partial<import('../js/strings.js').Strings>} [strings]
 * @property {string} [className]
 * @property {import('react').CSSProperties} [style]
 * @property {{ bar?: string, search?: string, table?: string, status?: string, pager?: string, pagerButton?: string }} [classNames]  `pagerButton` replaces the pager buttons' classes, `kp-button` by default.
 */

/** @param {Column} column */
const labelText = (column) => (typeof column.label === 'string' ? column.label : column.key);
/** @param {Sort} sort @returns {SortKey[]} */
const keysOf = (sort) => (sort === null ? [] : [{ key: sort.key, direction: sort.direction }]);
/** @type {Record<string, unknown>[]} */
const NO_ROWS = [];

/**
 * @param {DataTableProps} props
 * @param {import('react').ForwardedRef<HTMLDivElement>} ref
 */
function DataTableInner(
    {
        columns,
        rows: rowsProp = NO_ROWS,
        rowKey = (_, index) => String(index),
        pageSize: pageSizeProp = 25,
        pageSizes = [...PAGE_SIZES],
        onPageSizeChange,
        paginated = true,
        searchable = true,
        searchScope = false,
        scope: scopeProp,
        defaultScope = null,
        onScopeChange,
        filters: filtersProp,
        defaultFilters = {},
        onFiltersChange,
        filterMode = 'panel',
        filtersOpen: filtersOpenProp,
        defaultFiltersOpen = false,
        onFiltersOpenChange,
        density: densityProp,
        defaultDensity = 'comfortable',
        onDensityChange,
        densityChoice = false,
        selectable = false,
        actions,
        cards = true,
        maxHeight,
        caption,
        region = true,
        regionLabel,
        empty,
        query: queryProp,
        defaultQuery = '',
        onQueryChange,
        debounceMs,
        sort: sortProp,
        defaultSort = null,
        onSortChange,
        multiSort = false,
        sorts: sortsProp,
        defaultSorts,
        onSortsChange,
        sortCycle = 'two',
        columnMenu = false,
        hiddenColumns: hiddenProp,
        defaultHiddenColumns = [],
        onHiddenColumnsChange,
        renderDetail,
        rowExpandable,
        expanded: expandedProp,
        defaultExpanded = [],
        onExpandedChange,
        expandGlyph = '▸',
        collapseGlyph = '▾',
        fixedColumns = false,
        load,
        onCellEdit,
        grid = false,
        gridPageRows = 5,
        page: pageProp,
        defaultPage = 0,
        onPageChange,
        totalRows: totalRowsProp,
        selected,
        defaultSelected = [],
        onSelect,
        locale: localeProp,
        filter,
        onRowClick,
        rowClassName,
        loading: loadingProp = false,
        loadingContent,
        error: errorProp,
        onRetry,
        apiRef,
        onViewChange,
        removeGlyph = '×',
        strings,
        className = '',
        style,
        classNames = {},
        ...rest
    },
    ref,
) {
    const s = useStrings(strings);
    // The table's own selects wear the package's drawn list, as every
    // .kp-field__input select does since Kenny's form of 2026-09-13.
    const scopeSelectRef = useDrawnSelect();
    const densitySelectRef = useDrawnSelect();
    const sortBySelectRef = useDrawnSelect();
    const pageSizeSelectRef = useDrawnSelect();
    /** @type {import('react').RefObject<HTMLDivElement | null>} */
    const inner = useRef(null);
    /** @type {import('react').RefObject<HTMLTableElement | null>} */
    const tableRef = useRef(null);
    useImperativeHandle(ref, () => /** @type {HTMLDivElement} */ (inner.current), []);
    const baseId = useId().replace(/[^a-zA-Z0-9_-]/g, '');
    const panelId = `${baseId}-filters`;
    const [locale, setLocale] = useState(() => resolveLocale(localeProp));
    useEffect(() => {
        setLocale(resolveLocale(localeProp, inner.current));
    }, [localeProp]);
    const [query, setQuery] = useControllable(queryProp, defaultQuery, onQueryChange);
    const [typed, setTyped] = useState(query);
    const [scope, setScope] = useControllable(scopeProp, defaultScope, onScopeChange);
    const [filters, setFilters] = useControllable(filtersProp, defaultFilters, onFiltersChange);
    const [filtersOpen, setFiltersOpen] = useControllable(filtersOpenProp, defaultFiltersOpen, onFiltersOpenChange);
    const [density, setDensity] = useControllable(densityProp, defaultDensity, onDensityChange);
    const [sortList, setSortList] = useControllable(
        sortsProp ?? (sortProp === undefined ? undefined : keysOf(sortProp)),
        defaultSorts ?? keysOf(defaultSort),
        undefined,
    );
    const sort = /** @type {Sort} */ (sortList[0] ?? null);
    /** @param {SortKey[]} next */
    const setSorts = (next) => {
        // A new sort starts at the first page, as the approved mock does: the
        // rows the reader was looking at are somewhere else now.
        setPage(0);
        setSortList(next);
        onSortsChange?.(next);
        onSortChange?.(next[0] ?? null);
    };
    const [page, setPage] = useControllable(pageProp, defaultPage, onPageChange);
    const [chosen, setChosen] = useControllable(selected, defaultSelected, onSelect);
    const lockedKey = (/** @type {Column} */ column, /** @type {number} */ index) => column.locked ?? index === 0;
    const [hiddenList, setHiddenList] = useControllable(
        hiddenProp,
        defaultHiddenColumns.filter((key) => columns.some((c, i) => c.key === key && !lockedKey(c, i))),
        undefined,
    );
    /** @param {string[]} next */
    const setHidden = (next) => {
        const ordered = columns.filter((c, i) => next.includes(c.key) && !lockedKey(c, i)).map((c) => c.key);
        setHiddenList(ordered);
        onHiddenColumnsChange?.(ordered);
    };
    const [expandedList, setExpandedList] = useControllable(expandedProp, defaultExpanded, onExpandedChange);
    const [pageSize, setPageSize] = useState(pageSizeProp);
    useEffect(() => setPageSize(pageSizeProp), [pageSizeProp]);
    useEffect(() => setTyped(query), [query]);

    // ── Rows from a server (#async) ────────────────────────────────────
    const [served, setServed] = useState(/** @type {DataAnswer} */ ({ rows: [], total: 0 }));
    const [loadState, setLoadState] = useState(/** @type {'ready' | 'loading' | 'failed'} */ (load ? 'loading' : 'ready'));
    const [reloads, setReloads] = useState(0);
    const loadRef = useRef(load);
    loadRef.current = load;
    const latest = useRef(0);
    const controller = useRef(/** @type {AbortController | null} */ (null));
    const sortsKey = JSON.stringify(sortList);
    const filtersKey = JSON.stringify(filters);
    const loading = load ? loadState === 'loading' : loadingProp;
    const error = load && loadState === 'failed' ? true : errorProp;
    const rows = load ? served.rows : rowsProp;
    const totalRows = load ? served.total : totalRowsProp;
    const serverMode = totalRows !== undefined;
    useEffect(() => {
        const ask = loadRef.current;
        if (ask === undefined) return;
        latest.current += 1;
        const id = latest.current;
        controller.current?.abort();
        const current = new AbortController();
        controller.current = current;
        setLoadState('loading');
        Promise.resolve()
            .then(() =>
                ask({
                    query,
                    scope,
                    sort: /** @type {Sort} */ (JSON.parse(sortsKey)[0] ?? null),
                    sorts: JSON.parse(sortsKey),
                    filters: JSON.parse(filtersKey),
                    page,
                    pageSize,
                    signal: current.signal,
                }),
            )
            .then(
                (answer) => {
                    // An answer to a request that is no longer the newest is thrown away.
                    if (id !== latest.current) return;
                    setServed({ rows: [...answer.rows], total: Number(answer.total) || 0 });
                    setLoadState('ready');
                },
                () => {
                    if (id !== latest.current) return;
                    setLoadState('failed');
                },
            );
    }, [query, scope, sortsKey, filtersKey, page, pageSize, reloads]);
    useEffect(() => () => controller.current?.abort(), []);

    // The search box: debounced when asked, so a server behind it is not
    // asked once per keystroke.
    const wait = debounceMs ?? (load ? SERVER_DEBOUNCE_MS : 0);
    const debounce = useRef(0);
    useEffect(() => () => clearTimeout(debounce.current), []);
    /** @param {string} next */
    const onSearch = (next) => {
        setTyped(next);
        clearTimeout(debounce.current);
        const commit = () => {
            setQuery(next);
            setPage(0);
        };
        if (wait > 0) debounce.current = window.setTimeout(commit, wait);
        else commit();
    };

    const filterColumns = columns.filter((column) => column.filter !== undefined);
    /** @param {Record<string, unknown>} row @param {string} key */
    const textOf = (row, key) => String(row[key] ?? '').trim();

    const filtered = useMemo(() => {
        if (serverMode) return rows;
        const needle = query.trim().toLowerCase();
        return rows.filter((row) => {
            if (needle !== '') {
                const hit =
                    scope !== null
                        ? textOf(row, scope).toLowerCase().includes(needle)
                        : filter
                          ? filter(row, needle)
                          : Object.values(row).join(' ').toLowerCase().includes(needle);
                if (!hit) return false;
            }
            for (const column of columns) {
                if (column.filter === undefined) continue;
                if (!matchesFilter(column.filter, filters[column.key], textOf(row, column.key), locale)) return false;
            }
            return true;
        });
    }, [rows, query, scope, filters, filter, serverMode, columns, locale]);

    const sorted = useMemo(() => {
        if (serverMode || sortList.length === 0) return filtered;
        return [...filtered].sort((a, b) => {
            for (const key of sortList) {
                const column = columns.find((c) => c.key === key.key);
                const kind = column?.kind ?? 'text';
                /** @param {string} x @param {string} y */
                const by = (x, y) => compareCells(x, y, kind, locale);
                const left = String(a[key.key] ?? '');
                const right = String(b[key.key] ?? '');
                // A declared order sorts by meaning, Low before Critical [gap-13].
                const c = column?.compare
                    ? column.compare(a[key.key], b[key.key])
                    : column?.order
                      ? compareByOrder(column.order, left, right, by)
                      : by(left, right);
                if (c !== 0) return key.direction === 'ascending' ? c : -c;
            }
            return 0;
        });
    }, [filtered, sortList, columns, locale, serverMode]);

    const total = serverMode ? (totalRows ?? 0) : sorted.length;
    const pages = paginated ? Math.max(1, Math.ceil(total / pageSize)) : 1;
    const at = Math.min(page, pages - 1);
    const slice = useMemo(
        () => (serverMode || !paginated ? sorted : sorted.slice(at * pageSize, at * pageSize + pageSize)),
        [sorted, serverMode, paginated, at, pageSize],
    );

    const visibleKeys = slice.map((row, i) => rowKey(row, i));
    const allChecked = visibleKeys.length > 0 && visibleKeys.every((k) => chosen.includes(k));
    const someChecked = visibleKeys.some((k) => chosen.includes(k));

    const shownColumns = columns.filter((column) => !hiddenList.includes(column.key));
    const expandable = renderDetail !== undefined;
    const controlCount = (selectable ? 1 : 0) + (expandable ? 1 : 0);
    const span = shownColumns.length + controlCount;

    // The rows the table shows, for the app that exports them [Kenny,
    // 2026-09-13]: a method, and the same view event the framework-free
    // channel fires.
    /** The latest editFilter, so the handle need not be rebuilt for it. @type {import('react').MutableRefObject<(key: string | null) => void>} */
    const editFilterRef = useRef((/** @type {string | null} */ key) => void key);
    useImperativeHandle(
        apiRef,
        () => ({
            rows: (which = 'view') => (which === 'page' ? [...slice] : [...sorted]),
            reload: () => setReloads((n) => n + 1),
            editFilter: (key) => editFilterRef.current(key),
        }),
        [slice, sorted],
    );
    useEffect(() => {
        const view = {
            keys: sorted.map((row, i) => rowKey(row, i)),
            pageKeys: slice.map((row, i) => rowKey(row, i)),
            rows: sorted,
            pageRows: slice,
            query,
            scope,
            filters,
            sort,
            sorts: sortList,
            hidden: hiddenList,
            expanded: expandedList,
            page: at,
            pageSize,
        };
        onViewChange?.(view);
        inner.current?.dispatchEvent(new CustomEvent(VIEW_EVENT, { bubbles: true, detail: view }));
    }, [sorted, slice, query, scope, filters, sortsKey, hiddenList, expandedList, at, pageSize]);

    // ── A first column that stays (#sticky) ────────────────────────────
    const fixedCount = fixedColumns === true ? controlCount + 1 : typeof fixedColumns === 'number' ? fixedColumns : 0;
    useLayoutEffect(() => {
        if (tableRef.current !== null && fixedCount > 0) syncFixedColumns(tableRef.current, fixedCount);
    });
    useEffect(() => {
        const table = tableRef.current;
        if (table === null || fixedCount === 0 || typeof ResizeObserver === 'undefined') return undefined;
        let frame = 0;
        const observer = new ResizeObserver(() => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => syncFixedColumns(table, fixedCount));
        });
        observer.observe(table);
        return () => {
            observer.disconnect();
            cancelAnimationFrame(frame);
        };
    }, [fixedCount]);

    // ── The keyboard grid (#keyboard) ──────────────────────────────────
    const [readout, setReadout] = useState(/** @type {string | null} */ (null));
    const gridHandle = useRef(/** @type {import('../js/datatable.js').GridHandle | null} */ (null));
    const columnsRef = useRef(shownColumns);
    columnsRef.current = shownColumns;
    const controlCountRef = useRef(controlCount);
    controlCountRef.current = controlCount;
    useEffect(() => {
        const table = tableRef.current;
        if (!grid || table === null) return undefined;
        const handle = attachGrid(table, {
            pageRows: gridPageRows,
            onMove: ({ row, rows: count, cell }) => {
                const column = columnsRef.current[cell.cellIndex - controlCountRef.current];
                const label = column === undefined ? '' : labelText(column);
                const text = row === 0 ? label : ((cell.querySelector('[data-kp-edit-value]') ?? cell).textContent ?? '').trim();
                setReadout(s.tableGridPosition(row, count, label, text));
            },
        });
        gridHandle.current = handle;
        return () => {
            handle.detach();
            gridHandle.current = null;
        };
    }, [grid]);
    useEffect(() => {
        gridHandle.current?.sync();
    });

    // ── Editing a value in its cell (#inline-edit) ─────────────────────
    const [editing, setEditing] = useState(/** @type {{ rowKey: string, key: string } | null} */ (null));
    const [editError, setEditError] = useState(/** @type {string | null} */ (null));
    const [editLog, setEditLog] = useState(/** @type {{ text: string, undo: boolean } | null} */ (null));
    const [lastEdit, setLastEdit] = useState(
        /** @type {{ row: Record<string, unknown>, rowKey: string, key: string, before: string, after: string } | null} */ (null),
    );
    const control = useRef(/** @type {HTMLSelectElement | HTMLInputElement | null} */ (null));
    const dateValue = useRef(/** @type {string | null} */ (null));
    const listWasOpen = useRef(false);
    const busy = useRef(false);
    const editingRef = useRef(editing);
    editingRef.current = editing;
    const focusAfter = useRef(/** @type {{ rowKey: string, key: string, editor: boolean } | null} */ (null));
    useEffect(() => {
        const target = focusAfter.current;
        if (target === null || inner.current === null) return;
        focusAfter.current = null;
        const row = [...inner.current.querySelectorAll('tbody tr')].find((tr) => /** @type {HTMLElement} */ (tr).dataset.kpRowKey === target.rowKey);
        const selector = target.editor ? '[data-kp-datatable-editor]' : `[data-kp-edit-cell][data-kp-column-key="${CSS.escape(target.key)}"]`;
        /** @type {HTMLElement | null | undefined} */ (row?.querySelector(selector))?.focus();
    });
    const editable = columns.some((column) => column.edit !== undefined);

    /**
     * Tell the app, and wait for its answer: null when it accepts, the message when it refuses.
     * @param {Record<string, unknown>} row @param {string} key @param {string} value @param {string} previous @param {boolean} undo
     * @returns {Promise<string | null>}
     */
    const askApp = async (row, key, value, previous, undo) => {
        const column = columns.find((c) => c.key === key);
        const label = column === undefined ? key : labelText(column);
        const index = sorted.indexOf(row);
        const edit = { row, rowKey: rowKey(row, index), key, label, value, previous, undo };
        /** @type {string | null} */
        let refused = null;
        /** @type {Promise<unknown>[]} */
        const waits = [];
        const event = new CustomEvent(EDIT_EVENT, {
            bubbles: true,
            cancelable: true,
            detail: {
                ...edit,
                reject: (/** @type {string | undefined} */ message) => {
                    refused = message ?? s.tableEditInvalid;
                },
                waitUntil: (/** @type {Promise<unknown>} */ promise) => {
                    waits.push(promise);
                },
            },
        });
        inner.current?.dispatchEvent(event);
        if (event.defaultPrevented && refused === null) refused = s.tableEditInvalid;
        if (onCellEdit !== undefined) waits.push(Promise.resolve().then(() => onCellEdit(edit)));
        if (refused === null && waits.length > 0) {
            try {
                for (const answer of await Promise.all(waits)) {
                    if (typeof answer === 'string') refused = answer;
                    else if (answer === false) refused = s.tableEditInvalid;
                }
            } catch (failure) {
                refused = failure instanceof Error && failure.message !== '' ? failure.message : s.tableEditInvalid;
            }
        }
        return refused;
    };

    /** @param {Record<string, unknown>} row @param {Column} column */
    const openEdit = async (row, column) => {
        if (editingRef.current !== null && !(await commitEdit(true))) return;
        const key = rowKey(row, sorted.indexOf(row));
        dateValue.current = null;
        setEditError(null);
        setEditing({ rowKey: key, key: column.key });
        setEditLog({ text: s.tableEditing(labelText(column), key), undo: false });
        focusAfter.current = { rowKey: key, key: column.key, editor: true };
    };

    /** @param {boolean} save @returns {Promise<boolean>} */
    const commitEdit = async (save) => {
        const current = editingRef.current;
        if (current === null) return true;
        if (busy.current) return false;
        const column = columns.find((c) => c.key === current.key);
        const row = rows.find((r, i) => rowKey(r, i) === current.rowKey) ?? sorted.find((r, i) => rowKey(r, i) === current.rowKey);
        if (column === undefined || row === undefined) {
            setEditing(null);
            return true;
        }
        const back = { rowKey: current.rowKey, key: current.key, editor: false };
        if (!save) {
            setEditing(null);
            setEditLog({ text: s.tableEditCancelled, undo: false });
            focusAfter.current = back;
            return true;
        }
        const previous = String(row[column.key] ?? '');
        const value = (
            column.edit === 'date' ? (dateValue.current ?? control.current?.value ?? previous) : (control.current?.value ?? previous)
        ).trim();
        const refuse = (/** @type {string} */ message) => {
            setEditError(message);
            focusAfter.current = { ...back, editor: true };
        };
        if (value === '' && column.editRequired) {
            refuse(s.tableEditRequired);
            return false;
        }
        if (column.edit === 'number' && value !== '' && Number.isNaN(Number(value))) {
            refuse(s.tableEditInvalid);
            return false;
        }
        if (value === previous) {
            setEditing(null);
            focusAfter.current = back;
            return true;
        }
        busy.current = true;
        const refused = await askApp(row, column.key, value, previous, false);
        busy.current = false;
        if (editingRef.current !== current) return true;
        if (refused !== null) {
            refuse(refused);
            return false;
        }
        setEditing(null);
        setEditError(null);
        setLastEdit({ row, rowKey: current.rowKey, key: column.key, before: previous, after: value });
        setEditLog({ text: s.tableEdited(current.rowKey, labelText(column), previous, value), undo: true });
        focusAfter.current = back;
        return true;
    };

    const undoEdit = async () => {
        if (lastEdit === null) return;
        const column = columns.find((c) => c.key === lastEdit.key);
        const refused = await askApp(lastEdit.row, lastEdit.key, lastEdit.before, lastEdit.after, true);
        if (refused !== null) {
            setEditLog({ text: refused, undo: false });
            return;
        }
        setEditLog({
            text: s.tableEditUndone(lastEdit.rowKey, column === undefined ? lastEdit.key : labelText(column), lastEdit.before),
            undo: false,
        });
        focusAfter.current = { rowKey: lastEdit.rowKey, key: lastEdit.key, editor: false };
        setLastEdit(null);
    };

    /** The editor a cell shows while it is edited. @param {Record<string, unknown>} row @param {Column} column @param {string} key */
    const editorFor = (row, column, key) => {
        const previous = String(row[column.key] ?? '');
        const label = s.tableEditField(labelText(column), key);
        const errorId = `${baseId}-edit-error`;
        const invalid = editError !== null;
        return (
            <div
                className="kp-datatable__editor"
                data-kp-datatable-editor-wrap
                data-density="compact"
                onKeyDownCapture={(event) => {
                    const target = /** @type {HTMLElement} */ (event.target);
                    if (target.matches('select[data-kp-datatable-editor]')) listWasOpen.current = target.getAttribute('aria-expanded') === 'true';
                }}
                onKeyDown={(event) => {
                    const target = /** @type {HTMLElement} */ (event.target);
                    if (!target.matches('[data-kp-datatable-editor]')) return;
                    const isSelect = target instanceof HTMLSelectElement;
                    if (event.key === 'Enter') {
                        event.preventDefault();
                        // Enter on a closed drawn list only opened it; Enter on an open
                        // list took the highlighted option, and that is the save.
                        if (!isSelect || listWasOpen.current) void commitEdit(true);
                    } else if (event.key === 'Escape') {
                        const panelOpen = event.currentTarget.querySelector('[data-kp-date-panel]') !== null;
                        if ((isSelect && listWasOpen.current) || panelOpen || event.defaultPrevented) return;
                        event.preventDefault();
                        void commitEdit(false);
                    }
                }}
                onBlur={(event) => {
                    const holder = event.currentTarget;
                    if (holder.contains(/** @type {Node | null} */ (event.relatedTarget))) return;
                    const current = editingRef.current;
                    setTimeout(() => {
                        if (editingRef.current !== current || busy.current || holder.contains(document.activeElement)) return;
                        void commitEdit(true);
                    }, 0);
                }}
            >
                {column.edit === 'select' ? (
                    <EditSelect
                        options={(() => {
                            const declared = column.editOptions ?? [...new Set(rows.map((r) => String(r[column.key] ?? '')).filter((v) => v !== ''))];
                            return declared.includes(previous) ? declared : [previous, ...declared];
                        })()}
                        defaultValue={previous}
                        control={control}
                        label={label}
                        describedBy={errorId}
                        invalid={invalid}
                    />
                ) : column.edit === 'date' ? (
                    <DatePicker
                        label={label}
                        hideLabel
                        locale={locale}
                        strings={strings}
                        defaultValue={previous === '' ? '' : formatDate(new Date(`${previous}T00:00:00`), locale)}
                        onChange={(iso) => {
                            dateValue.current = iso ?? '';
                        }}
                        inputProps={{ 'data-kp-datatable-editor': '', 'aria-describedby': errorId, 'aria-invalid': invalid ? 'true' : undefined }}
                    />
                ) : (
                    <input
                        className="kp-field__input"
                        type={column.edit === 'number' ? 'number' : 'text'}
                        min={column.editMin}
                        max={column.editMax}
                        data-kp-datatable-editor
                        aria-label={label}
                        aria-describedby={errorId}
                        aria-required={column.editRequired ? 'true' : undefined}
                        aria-invalid={invalid ? 'true' : undefined}
                        defaultValue={previous}
                        ref={(node) => {
                            control.current = node;
                        }}
                    />
                )}
                <p className="kp-field__error" id={errorId} hidden={editError === null}>
                    {editError}
                </p>
            </div>
        );
    };

    /** The class a column puts on its header and its cells [TH96]. @param {Column} column */
    const cellClass = (column) => `${column.truncate ? 'kp-cell-truncate' : ''} ${column.className ?? ''}`.trim() || undefined;

    /** @param {Column} column @param {boolean} add */
    const toggleSort = (column, add) => {
        if (column.sortable === false) return;
        const keys = sortList.map((key) => ({ column: key.key, direction: key.direction }));
        setSorts(
            nextSorts(keys, column.key, { add: multiSort && add, cycle: sortCycle }).map((key) => ({ key: key.column, direction: key.direction })),
        );
    };

    /** @param {string} key @param {FilterValue | null} value */
    const setFilter = (key, value) => {
        const column = columns.find((c) => c.key === key);
        /** @type {Record<string, FilterValue>} */
        const next = { ...filters };
        if (value === null || column?.filter === undefined || !filterActive(column.filter, value)) delete next[key];
        else next[key] = value;
        setFilters(next);
        setPage(0);
    };
    const pills = filterColumns.flatMap((column) =>
        filterPills(/** @type {'choice' | 'range' | 'date'} */ (column.filter), labelText(column), filters[column.key], s).map((pill) => ({
            ...pill,
            key: column.key,
        })),
    );
    const pillList = useRef(/** @type {HTMLUListElement | null} */ (null));
    const toggleRef = useRef(/** @type {HTMLButtonElement | null} */ (null));

    // ── The add-filter mode (#filter-add) ──────────────────────────────
    const addMode = filterMode === 'add';
    const addPopId = `${baseId}-add-filter`;
    const editorId = `${baseId}-filter-editor`;
    const addButtonRef = useRef(/** @type {HTMLButtonElement | null} */ (null));
    const addPop = useRef(/** @type {HTMLDivElement | null} */ (null));
    const addMenuRef = useRef(/** @type {HTMLUListElement | null} */ (null));
    const [addOpen, setAddOpen] = useState(false);
    const [editingFilter, setEditingFilter] = useState(/** @type {string | null} */ (null));
    const [filterError, setFilterError] = useState(/** @type {{ message: string, bound?: 'from' | 'to' } | null} */ (null));
    /** Where the focus goes after the editor opens or closes: the editor, a pill, or the add button. */
    const filterFocus = useRef(/** @type {{ to: 'editor' | 'pill' | 'add' | 'remove' | 'error', key?: string } | null} */ (null));
    const editorReturn = useRef(/** @type {string | null} */ (null));
    /** One pill per filter, in the order the filters were added. */
    const addPills = addMode
        ? Object.keys(filters).flatMap((key) => {
              const column = filterColumns.find((c) => c.key === key);
              if (column?.filter === undefined) return [];
              const label = filterPillLabel(column.filter, labelText(column), filters[key], s);
              return label === null ? [] : [{ key, label }];
          })
        : [];
    /** @param {Column} column */
    const choicesOf = (column) =>
        column.filterOptions ??
        [...new Set(rows.map((row) => textOf(row, column.key)).filter((v) => v !== ''))].sort((a, b) =>
            column.order ? compareByOrder(column.order, a, b, collator(locale).compare) : collator(locale).compare(a, b),
        );
    /** @param {string} key @param {string | null} returnTo */
    const openFilterEditor = (key, returnTo) => {
        editorReturn.current = returnTo;
        setFilterError(null);
        setEditingFilter(key);
        filterFocus.current = { to: 'editor' };
    };
    /** @param {boolean} [focus] */
    const closeFilterEditor = (focus = true) => {
        const back = editorReturn.current;
        editorReturn.current = null;
        setEditingFilter(null);
        setFilterError(null);
        if (focus) filterFocus.current = back === null ? { to: 'add' } : { to: 'pill', key: back };
    };
    /** @param {HTMLFormElement} form */
    const applyFilterEditor = (form) => {
        const key = editingFilter;
        const column = filterColumns.find((c) => c.key === key);
        if (key === null || column?.filter === undefined) return;
        /** @type {FilterValue | null} */
        let next = null;
        if (column.filter === 'choice') {
            const values = [...form.querySelectorAll('input[name="values"]:checked')].map((box) => /** @type {HTMLInputElement} */ (box).value);
            next = values.length > 0 ? values : null;
        } else {
            const label = labelText(column);
            const read = (/** @type {'from' | 'to'} */ bound) => {
                const input = /** @type {HTMLInputElement} */ (form.querySelector(`[data-kp-filter-bound="${bound}"]`));
                return {
                    text: input.value,
                    iso: input.dataset.kpDateValue,
                    label: bound === 'from' ? s.tableFilterFrom(label) : s.tableFilterTo(label),
                };
            };
            const result = readFilterBounds(column.filter, { from: read('from'), to: read('to') }, s);
            if (result.error !== undefined) {
                setFilterError({ message: result.error, bound: result.bound });
                filterFocus.current = { to: 'error', key: result.bound };
                return;
            }
            next = result.value;
        }
        // A filter just applied returns the focus to its own pill.
        if (next !== null) editorReturn.current = key;
        setFilter(key, next);
        closeFilterEditor(true);
    };
    useEffect(() => {
        const target = filterFocus.current;
        const root = inner.current;
        if (target === null || root === null) return;
        filterFocus.current = null;
        /** @type {HTMLElement | null} */
        let element = null;
        if (target.to === 'editor') element = root.querySelector('[data-kp-datatable-filter-editor] input');
        else if (target.to === 'error') element = root.querySelector(`[data-kp-datatable-filter-editor] [data-kp-filter-bound="${target.key}"]`);
        else if (target.to === 'pill') element = root.querySelector(`[data-kp-filter-pill="${CSS.escape(target.key ?? '')}"]`);
        else if (target.to === 'remove') element = root.querySelector('[data-kp-datatable-pills] .kp-tag__remove');
        (element ?? addButtonRef.current)?.focus();
    });
    useEffect(() => {
        const popover = addPop.current;
        if (popover === null) return undefined;
        /** @param {Event} event */
        const onToggle = (event) => {
            const open = /** @type {ToggleEvent} */ (event).newState === 'open';
            setAddOpen(open);
            if (open) /** @type {HTMLElement | null} */ (addMenuRef.current?.querySelector('.kp-menu__item') ?? null)?.focus();
        };
        popover.addEventListener('toggle', onToggle);
        return () => popover.removeEventListener('toggle', onToggle);
    }, [addMode, filterColumns.length > 0]);
    editFilterRef.current = (key) => {
        if (!addMode) {
            setFiltersOpen(key !== null);
            return;
        }
        if (key === null) closeFilterEditor(false);
        else if (filterColumns.some((c) => c.key === key)) openFilterEditor(key, filters[key] === undefined ? null : key);
    };

    const clearAll = () => {
        setEditingFilter(null);
        clearTimeout(debounce.current);
        setTyped('');
        setQuery('');
        setFilters({});
        setPage(0);
    };
    const retry = () => {
        inner.current?.dispatchEvent(new CustomEvent(RETRY_EVENT, { bubbles: true }));
        onRetry?.();
        if (load) setReloads((n) => n + 1);
    };

    // ── The column menu (#columns) ─────────────────────────────────────
    const columnsPopId = `${baseId}-columns`;
    const [columnsOpen, setColumnsOpen] = useState(false);
    const columnsPop = useRef(/** @type {HTMLDivElement | null} */ (null));
    useEffect(() => {
        const popover = columnsPop.current;
        if (popover === null) return undefined;
        /** @param {Event} event */
        const onToggle = (event) => setColumnsOpen(/** @type {ToggleEvent} */ (event).newState === 'open');
        popover.addEventListener('toggle', onToggle);
        return () => popover.removeEventListener('toggle', onToggle);
    }, [columnMenu]);

    /** @param {string} key */
    const toggleExpanded = (key) => {
        setExpandedList(expandedList.includes(key) ? expandedList.filter((k) => k !== key) : [...expandedList, key]);
    };

    const sizes = pageSizes.length === 0 ? [] : [...new Set([...pageSizes, pageSize])].sort((a, b) => a - b);
    const sortableColumns = columns.filter((c) => c.sortable !== false);
    const hasTopBar = searchable || searchScope || densityChoice || filterColumns.length > 0 || multiSort || columnMenu;
    const filtering = query.trim() !== '' || pills.length > 0;
    const first = total === 0 ? 0 : at * pageSize + 1;
    const last = serverMode || !paginated ? (serverMode ? at * pageSize + slice.length : total) : at * pageSize + slice.length;

    return (
        <div
            ref={inner}
            className={`kp-datatable ${className}`.trim()}
            style={maxHeight === undefined ? style : { ...style, ...{ '--kp-datatable-max-height': maxHeight } }}
            data-kp-datatable
            data-kp-cards={cards ? '' : undefined}
            data-kp-max-height={maxHeight}
            data-kp-sort-multi={multiSort ? '' : undefined}
            data-kp-fixed-columns={fixedCount > 0 ? String(fixedCount) : undefined}
            data-kp-grid={grid ? '' : undefined}
            data-density={density === 'compact' ? 'compact' : undefined}
            aria-busy={loading ? 'true' : undefined}
            {...rest}
        >
            {hasTopBar && (
                <div className={`kp-datatable__bar ${classNames.bar ?? ''}`.trim()}>
                    {multiSort && (
                        <p className="kp-datatable__status kp-datatable__sort-summary" data-kp-datatable-sort-summary aria-live="polite">
                            {sortList.length === 0
                                ? s.tableNotSorted
                                : s.tableSortedBy(
                                      sortList.map((key) => {
                                          const column = columns.find((c) => c.key === key.key);
                                          return s.tableSortKey(
                                              column === undefined ? key.key : labelText(column),
                                              key.direction,
                                              column?.order ? 'order' : (column?.kind ?? 'text'),
                                          );
                                      }),
                                  )}
                        </p>
                    )}
                    {searchable && (
                        <input
                            className={`kp-datatable__search ${classNames.search ?? ''}`.trim()}
                            type="search"
                            data-kp-datatable-search
                            placeholder={s.tableSearch}
                            aria-label={s.tableSearchLabel}
                            value={typed}
                            onChange={(event) => onSearch(event.target.value)}
                        />
                    )}
                    {searchable && searchScope && (
                        <select
                            className="kp-field__input kp-datatable__select"
                            ref={scopeSelectRef}
                            data-kp-datatable-scope
                            aria-label={s.tableSearchScope}
                            value={scope ?? ''}
                            onChange={(event) => {
                                setScope(event.target.value === '' ? null : event.target.value);
                                setPage(0);
                            }}
                        >
                            <option value="">{s.tableSearchAllColumns}</option>
                            {columns
                                .filter((c) => c.searchable !== false)
                                .map((c) => (
                                    <option key={c.key} value={c.key}>
                                        {labelText(c)}
                                    </option>
                                ))}
                        </select>
                    )}
                    {densityChoice && (
                        <select
                            className="kp-field__input kp-datatable__select"
                            ref={densitySelectRef}
                            data-kp-datatable-density
                            aria-label={s.tableDensity}
                            value={density}
                            onChange={(event) => setDensity(event.target.value === 'compact' ? 'compact' : 'comfortable')}
                        >
                            <option value="comfortable">{s.tableDensityComfortable}</option>
                            <option value="compact">{s.tableDensityCompact}</option>
                        </select>
                    )}
                    {filterColumns.length > 0 && addMode && (
                        <>
                            <button
                                ref={addButtonRef}
                                type="button"
                                className="kp-button kp-datatable__add-filter"
                                data-kp-datatable-add-filter
                                aria-haspopup="true"
                                aria-expanded={addOpen}
                                aria-controls={addPopId}
                                popoverTarget={addPopId}
                                style={{ anchorName: `--${addPopId}` }}
                            >
                                {s.tableAddFilter(addPills.length)}
                            </button>
                            <div
                                ref={addPop}
                                className="kp-popover kp-datatable__add-menu"
                                id={addPopId}
                                popover="auto"
                                data-kp-datatable-add-menu
                                style={{ positionAnchor: `--${addPopId}` }}
                            >
                                <ul
                                    ref={addMenuRef}
                                    className="kp-menu"
                                    aria-label={s.tableAddFilterMenu}
                                    onKeyDown={(event) => {
                                        const items = /** @type {HTMLElement[]} */ ([...event.currentTarget.querySelectorAll('.kp-menu__item')]);
                                        const at = items.indexOf(/** @type {HTMLElement} */ (document.activeElement));
                                        /** @type {Record<string, number>} */
                                        const moves = { ArrowDown: at + 1, ArrowUp: at - 1, Home: 0, End: items.length - 1 };
                                        const to = moves[event.key];
                                        if (to === undefined || items.length === 0) return;
                                        event.preventDefault();
                                        items[(to + items.length) % items.length]?.focus();
                                    }}
                                >
                                    {filterColumns.map((column) => {
                                        const on = filters[column.key] !== undefined;
                                        const label = labelText(column);
                                        return (
                                            <li key={column.key}>
                                                <button
                                                    type="button"
                                                    className="kp-menu__item kp-datatable__add-item"
                                                    data-kp-filter-column={column.key}
                                                    data-kp-filter-marked={on ? '' : undefined}
                                                    aria-label={on ? s.tableAddFilterItemActive(label) : s.tableAddFilterItem(label)}
                                                    onClick={() => {
                                                        if (addPop.current?.matches(':popover-open')) addPop.current.hidePopover();
                                                        openFilterEditor(column.key, on ? column.key : null);
                                                    }}
                                                >
                                                    {column.label}
                                                    {on && (
                                                        <>
                                                            {' '}
                                                            <span className="kp-badge" aria-hidden="true">
                                                                {s.tableFilterMarked}
                                                            </span>
                                                        </>
                                                    )}
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </>
                    )}
                    {filterColumns.length > 0 && !addMode && (
                        <button
                            ref={toggleRef}
                            type="button"
                            className="kp-button kp-button--ghost kp-datatable__filter-toggle"
                            data-kp-datatable-filter-toggle
                            aria-expanded={filtersOpen}
                            aria-controls={panelId}
                            onClick={() => setFiltersOpen(!filtersOpen)}
                        >
                            {s.tableFilters(pills.length)}
                        </button>
                    )}
                    {columnMenu && (
                        <>
                            <button
                                type="button"
                                className="kp-button kp-button--ghost kp-datatable__columns-toggle"
                                data-kp-datatable-columns-toggle
                                aria-haspopup="true"
                                aria-expanded={columnsOpen}
                                aria-controls={columnsPopId}
                                popoverTarget={columnsPopId}
                                style={{ anchorName: `--${columnsPopId}` }}
                            >
                                {s.tableColumns}
                            </button>
                            <div
                                ref={columnsPop}
                                className="kp-popover kp-datatable__columns"
                                id={columnsPopId}
                                popover="auto"
                                data-kp-datatable-columns
                                style={{ positionAnchor: `--${columnsPopId}` }}
                            >
                                <ul className="kp-menu" aria-label={s.tableColumnsLabel}>
                                    {columns.map((column, index) => {
                                        const locked = lockedKey(column, index);
                                        return (
                                            <li key={column.key}>
                                                <label className="kp-menu__item kp-datatable__column-option">
                                                    <input
                                                        className="kp-field__check"
                                                        type="checkbox"
                                                        data-kp-datatable-column
                                                        value={column.key}
                                                        checked={!hiddenList.includes(column.key)}
                                                        disabled={locked}
                                                        onChange={(event) =>
                                                            setHidden(
                                                                event.target.checked
                                                                    ? hiddenList.filter((key) => key !== column.key)
                                                                    : [...hiddenList, column.key],
                                                            )
                                                        }
                                                    />{' '}
                                                    {locked ? s.tableColumnLocked(labelText(column)) : column.label}
                                                </label>
                                            </li>
                                        );
                                    })}
                                    <li role="separator" className="kp-menu__separator" />
                                    <li>
                                        <button type="button" className="kp-menu__item" data-kp-datatable-columns-reset onClick={() => setHidden([])}>
                                            {s.tableShowAllColumns}
                                        </button>
                                    </li>
                                </ul>
                            </div>
                            <span className="kp-datatable__status kp-datatable__columns-count" data-kp-datatable-columns-count>
                                {s.tableColumnsShown(shownColumns.length, columns.length)}
                            </span>
                        </>
                    )}
                </div>
            )}

            {addMode &&
                editingFilter !== null &&
                (() => {
                    const column = filterColumns.find((c) => c.key === editingFilter);
                    if (column?.filter === undefined) return null;
                    return (
                        <FilterEditor
                            key={column.key}
                            id={editorId}
                            column={column}
                            kind={column.filter}
                            value={filters[column.key]}
                            choices={column.filter === 'choice' ? choicesOf(column) : []}
                            locale={locale}
                            error={filterError}
                            s={s}
                            strings={strings}
                            onApply={applyFilterEditor}
                            onCancel={() => closeFilterEditor(true)}
                        />
                    );
                })()}

            {filterColumns.length > 0 && addMode && (
                <div className="kp-datatable__pills" data-kp-datatable-pills hidden={addPills.length === 0}>
                    <ul ref={pillList} className="kp-tag-list" aria-label={s.tableActiveFilters}>
                        {addPills.map((pill) => (
                            <li key={pill.key} className="kp-tag">
                                <button
                                    type="button"
                                    className="kp-datatable__pill-edit"
                                    data-kp-filter-pill={pill.key}
                                    aria-label={s.tableEditFilter(pill.label)}
                                    aria-expanded={editingFilter === pill.key}
                                    aria-controls={editorId}
                                    onClick={() => {
                                        if (editingFilter === pill.key) closeFilterEditor(true);
                                        else openFilterEditor(pill.key, pill.key);
                                    }}
                                >
                                    {pill.label}
                                </button>
                                <button
                                    type="button"
                                    className="kp-tag__remove"
                                    data-kp-filter-unpill={pill.key}
                                    aria-label={s.tableRemoveFilter(pill.label)}
                                    onClick={() => {
                                        if (editingFilter === pill.key) closeFilterEditor(false);
                                        setFilter(pill.key, null);
                                        filterFocus.current = { to: 'remove' };
                                    }}
                                >
                                    {removeGlyph}
                                </button>
                            </li>
                        ))}
                    </ul>
                    <button
                        type="button"
                        className="kp-button kp-button--ghost kp-button--sm kp-datatable__clear-filters"
                        hidden={addPills.length < 2}
                        onClick={() => {
                            closeFilterEditor(false);
                            setFilters({});
                            setPage(0);
                            filterFocus.current = { to: 'add' };
                        }}
                    >
                        {s.tableFilterClearAll}
                    </button>
                </div>
            )}

            {filterColumns.length > 0 && !addMode && (
                <div
                    className="kp-datatable__filters"
                    id={panelId}
                    role="group"
                    aria-label={s.tableFiltersLabel}
                    data-kp-datatable-filters
                    hidden={!filtersOpen}
                >
                    {filterColumns.map((column) => {
                        const label = labelText(column);
                        const value = filters[column.key];
                        if (column.filter === 'choice') {
                            const ticked = Array.isArray(value) ? value : [];
                            // The values the rows hold now, and a ticked one no row holds any
                            // more, so it can still be unticked (the framework-free panel's
                            // fillChoices does the same).
                            const options = [...choicesOf(column)];
                            for (const option of ticked) if (!options.includes(option)) options.push(option);
                            return (
                                <fieldset key={column.key} className="kp-fieldset kp-datatable__filter">
                                    <legend className="kp-field__label">{column.label}</legend>
                                    {options.map((option) => (
                                        <label key={option} className="kp-field__option">
                                            <input
                                                className="kp-field__check"
                                                type="checkbox"
                                                value={option}
                                                checked={ticked.includes(option)}
                                                onChange={(event) =>
                                                    setFilter(
                                                        column.key,
                                                        event.target.checked ? [...ticked, option] : ticked.filter((v) => v !== option),
                                                    )
                                                }
                                            />{' '}
                                            {option}
                                        </label>
                                    ))}
                                </fieldset>
                            );
                        }
                        const range = /** @type {{ from?: string, to?: string }} */ (value !== undefined && !Array.isArray(value) ? value : {});
                        return (
                            <fieldset key={column.key} className="kp-fieldset kp-datatable__filter">
                                <legend className="kp-field__label">{column.label}</legend>
                                <div className="kp-datatable__range">
                                    {column.filter === 'date' ? (
                                        <>
                                            <DateBound
                                                label={s.tableFilterFrom(label)}
                                                iso={range.from ?? ''}
                                                locale={locale}
                                                strings={strings}
                                                onIso={(iso) => setFilter(column.key, { from: iso, to: range.to ?? '' })}
                                            />
                                            <DateBound
                                                label={s.tableFilterTo(label)}
                                                iso={range.to ?? ''}
                                                locale={locale}
                                                strings={strings}
                                                onIso={(iso) => setFilter(column.key, { from: range.from ?? '', to: iso })}
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <input
                                                className="kp-field__input"
                                                type="number"
                                                aria-label={s.tableFilterFrom(label)}
                                                value={range.from ?? ''}
                                                onChange={(event) => setFilter(column.key, { from: event.target.value, to: range.to ?? '' })}
                                            />
                                            <input
                                                className="kp-field__input"
                                                type="number"
                                                aria-label={s.tableFilterTo(label)}
                                                value={range.to ?? ''}
                                                onChange={(event) => setFilter(column.key, { from: range.from ?? '', to: event.target.value })}
                                            />
                                        </>
                                    )}
                                </div>
                            </fieldset>
                        );
                    })}
                </div>
            )}

            {filterColumns.length > 0 && !addMode && (
                <div className="kp-datatable__pills" data-kp-datatable-pills hidden={pills.length === 0}>
                    <ul ref={pillList} className="kp-tag-list" aria-label={s.tableActiveFilters}>
                        {pills.map((pill) => (
                            <li key={pill.label} className="kp-tag">
                                {pill.label}
                                <button
                                    type="button"
                                    className="kp-tag__remove"
                                    aria-label={s.tableRemoveFilter(pill.label)}
                                    onClick={() => {
                                        setFilter(pill.key, pill.without ?? null);
                                        toggleRef.current?.focus();
                                    }}
                                >
                                    {removeGlyph}
                                </button>
                            </li>
                        ))}
                    </ul>
                    <button
                        type="button"
                        className="kp-button kp-button--ghost kp-datatable__clear-filters"
                        onClick={() => {
                            setFilters({});
                            setPage(0);
                            toggleRef.current?.focus();
                        }}
                    >
                        {s.tableClearFilters}
                    </button>
                </div>
            )}

            {actions && selectable && (
                <div className="kp-datatable__actions" data-kp-datatable-actions hidden={chosen.length === 0}>
                    <span data-kp-datatable-selected-count>{s.tableSelected(chosen.length)}</span>
                    {actions(chosen, () => setChosen([]))}
                </div>
            )}

            {cards && sortableColumns.length > 0 && (
                <div className="kp-datatable__card-sort" data-kp-datatable-card-sort>
                    <label className="kp-datatable__label">
                        {s.tableSortBy}{' '}
                        <select
                            className="kp-field__input kp-datatable__select"
                            ref={sortBySelectRef}
                            data-kp-datatable-sort-by
                            aria-label={s.tableSortBy}
                            value={sort?.key ?? ''}
                            onChange={(event) =>
                                setSorts(
                                    event.target.value === ''
                                        ? []
                                        : [{ key: event.target.value, direction: sort?.direction === 'descending' ? 'descending' : 'ascending' }],
                                )
                            }
                        >
                            <option value="">{s.tableSortNone}</option>
                            {sortableColumns.map((c) => (
                                <option key={c.key} value={c.key}>
                                    {labelText(c)}
                                </option>
                            ))}
                        </select>
                    </label>
                    <button
                        type="button"
                        className="kp-button kp-button--ghost"
                        data-kp-datatable-sort-direction
                        disabled={sort === null}
                        onClick={() => sort && setSorts([{ key: sort.key, direction: sort.direction === 'ascending' ? 'descending' : 'ascending' }])}
                    >
                        {sort?.direction === 'descending' ? s.tableSortDescending : s.tableSortAscending}
                    </button>
                </div>
            )}

            {loading && rows.length === 0 && (
                <div className="kp-datatable__loading" data-kp-datatable-loading>
                    {loadingContent ?? (
                        <>
                            <span className="kp-skeleton" />
                            <span className="kp-skeleton" />
                            <span className="kp-skeleton" />
                        </>
                    )}
                </div>
            )}

            {error !== undefined && error !== false && error !== null && (
                <div className="kp-alert kp-alert--destructive" role="alert" data-kp-datatable-failed>
                    <p>{error === true ? s.tableFailed : error}</p>
                    <button type="button" className="kp-button" data-kp-datatable-retry onClick={retry}>
                        {s.tableRetry}
                    </button>
                </div>
            )}

            {/* The scroll box a keyboard can reach and a reader can be
                told the name of [TH95]. Same three attributes, the same
                order of names and the same dictionary fallback as
                js/tables.js gives the framework-free channel. */}
            <div
                className="kp-table-wrap"
                tabIndex={region ? 0 : undefined}
                role={region ? 'region' : undefined}
                aria-label={region ? (regionLabel ?? (typeof caption === 'string' ? caption : s.tableRegion)) : undefined}
            >
                <table ref={tableRef} className={`kp-table ${classNames.table ?? ''}`.trim()}>
                    {caption && <caption>{caption}</caption>}
                    <thead>
                        <tr>
                            {expandable && (
                                <th scope="col" data-kp-expand-column>
                                    <span className="kp-sr-only">{s.tableDetailsColumn}</span>
                                </th>
                            )}
                            {selectable && (
                                <th scope="col">
                                    <input
                                        className="kp-field__check"
                                        type="checkbox"
                                        data-kp-select-all
                                        aria-label={s.tableSelectAll}
                                        checked={allChecked}
                                        // The honest third state: a header box
                                        // reading "checked" while three of ten
                                        // rows are selected is a lie.
                                        ref={(node) => {
                                            if (node) node.indeterminate = someChecked && !allChecked;
                                        }}
                                        onChange={(event) => {
                                            setChosen(
                                                event.target.checked
                                                    ? [...new Set([...chosen, ...visibleKeys])]
                                                    : chosen.filter((k) => !visibleKeys.includes(k)),
                                            );
                                        }}
                                    />
                                </th>
                            )}
                            {shownColumns.map((column) => {
                                const sortable = column.sortable !== false;
                                const index = sortList.findIndex((key) => key.key === column.key);
                                const direction = sortList[index]?.direction ?? 'none';
                                return (
                                    <th
                                        key={column.key}
                                        scope="col"
                                        className={cellClass(column)}
                                        style={{ textAlign: column.align, width: column.width }}
                                        data-kp-sort={sortable ? (column.kind ?? 'text') : undefined}
                                        // Each sorted column carries its direction,
                                        // every other sortable one 'none'; a stale
                                        // "ascending" on a column that is no longer a
                                        // key is worse than saying nothing.
                                        aria-sort={sortable ? direction : undefined}
                                        // The whole cell sorts; the button's
                                        // own click, from a pointer or from
                                        // Enter and Space, reaches it here.
                                        onClick={sortable ? (event) => toggleSort(column, event.shiftKey) : undefined}
                                        // Shift + Enter adds the column as a key: a
                                        // click from the keyboard does not say Shift.
                                        onKeyDown={
                                            sortable && multiSort
                                                ? (event) => {
                                                      if ((event.key !== 'Enter' && event.key !== ' ') || !event.shiftKey) return;
                                                      event.preventDefault();
                                                      toggleSort(column, true);
                                                  }
                                                : undefined
                                        }
                                    >
                                        {sortable ? (
                                            // A button, so the sort is reachable
                                            // from the keyboard [KT6]: a bare th
                                            // with onClick was mouse-only.
                                            <button type="button" className="kp-datatable__sort">
                                                {column.label}
                                                {sortList.length > 1 && index !== -1 && (
                                                    <span className="kp-datatable__sort-order" aria-hidden="true">
                                                        {index + 1}
                                                    </span>
                                                )}
                                            </button>
                                        ) : (
                                            column.label
                                        )}
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {slice.flatMap((row, i) => {
                            const key = rowKey(row, i);
                            const open = expandable && expandedList.includes(key);
                            const detailId = `${baseId}-detail-${i}`;
                            const canExpand = expandable && (rowExpandable?.(row, i) ?? true);
                            const main = (
                                <tr
                                    key={key}
                                    data-kp-row-key={key}
                                    className={rowClassName?.(row, i)}
                                    onClick={onRowClick ? () => onRowClick(row, i) : undefined}
                                    data-kp-clickable={onRowClick ? '' : undefined}
                                >
                                    {expandable && (
                                        <td data-label="" data-kp-expand-cell>
                                            {canExpand && (
                                                <button
                                                    type="button"
                                                    className="kp-button kp-button--ghost kp-button--sm kp-datatable__expand"
                                                    data-kp-row-toggle
                                                    aria-expanded={open}
                                                    aria-controls={open ? detailId : undefined}
                                                    aria-label={s.tableRowDetails(key)}
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        toggleExpanded(key);
                                                    }}
                                                >
                                                    {open ? collapseGlyph : expandGlyph}
                                                </button>
                                            )}
                                        </td>
                                    )}
                                    {selectable && (
                                        <td data-label="">
                                            <input
                                                className="kp-field__check"
                                                type="checkbox"
                                                data-kp-select-row
                                                aria-label={s.tableSelectRow(key)}
                                                checked={chosen.includes(key)}
                                                onClick={(event) => event.stopPropagation()}
                                                onChange={(event) =>
                                                    setChosen(event.target.checked ? [...chosen, key] : chosen.filter((k) => k !== key))
                                                }
                                            />
                                        </td>
                                    )}
                                    {shownColumns.map((column) => {
                                        const isEditing = editing !== null && editing.rowKey === key && editing.key === column.key;
                                        const content = column.render
                                            ? column.render(row[column.key], row, i)
                                            : /** @type {import('react').ReactNode} */ (row[column.key] ?? '');
                                        return (
                                            // The column name travels with the
                                            // cell so the narrow layout can show
                                            // it: a value with no question
                                            // attached is not information.
                                            <td
                                                key={column.key}
                                                data-label={labelText(column)}
                                                className={cellClass(column)}
                                                // The whole value where the
                                                // pointer can read it, since a
                                                // truncated cell shows one
                                                // clipped line of it [TH96].
                                                title={
                                                    column.truncate && typeof row[column.key] === 'string'
                                                        ? /** @type {string} */ (row[column.key])
                                                        : undefined
                                                }
                                                style={{ textAlign: column.align }}
                                            >
                                                {column.edit === undefined ? (
                                                    content
                                                ) : isEditing ? (
                                                    editorFor(row, column, key)
                                                ) : (
                                                    <button
                                                        type="button"
                                                        className="kp-datatable__edit"
                                                        data-kp-edit-cell
                                                        data-kp-column-key={column.key}
                                                        aria-label={s.tableEdit(labelText(column), key, String(row[column.key] ?? ''))}
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            void openEdit(row, column);
                                                        }}
                                                    >
                                                        <span data-kp-edit-value>{content}</span>
                                                    </button>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                            if (!open || renderDetail === undefined) return [main];
                            return [
                                main,
                                <tr key={`${key}-detail`} id={detailId} className="kp-datatable__detail" data-kp-row-detail>
                                    <td colSpan={span}>{renderDetail(row, i)}</td>
                                </tr>,
                            ];
                        })}
                    </tbody>
                </table>
            </div>

            {total === 0 && !loading && !error && (
                <div className="kp-empty" data-kp-datatable-empty>
                    {empty ?? s.tableEmpty}
                    {filtering && (
                        <button type="button" className="kp-button kp-button--secondary" data-kp-datatable-clear onClick={clearAll}>
                            {s.tableClearSearch}
                        </button>
                    )}
                </div>
            )}

            <div className={`kp-datatable__bar ${classNames.bar ?? ''}`.trim()}>
                <p className={`kp-datatable__status ${classNames.status ?? ''}`.trim()} data-kp-datatable-status role="status" aria-live="polite">
                    {loading && rows.length > 0 && (
                        // Refreshing: the old rows stay, dimmed, and a spinner says it is working [#states].
                        <span className="kp-spinner" aria-hidden="true" />
                    )}
                    {loading ? s.busy : s.tableShowing(first, last, total, serverMode ? total : rows.length)}
                </p>
                {editable && (
                    <p className="kp-datatable__status kp-datatable__edit-log" data-kp-datatable-edit-log role="status" aria-live="polite">
                        {editLog?.text}
                        {editLog?.undo && (
                            <>
                                {' '}
                                <button
                                    type="button"
                                    className="kp-button kp-button--ghost kp-button--sm"
                                    data-kp-datatable-undo
                                    onClick={() => void undoEdit()}
                                >
                                    {s.undo}
                                </button>
                            </>
                        )}
                    </p>
                )}
                {grid && (
                    <p className="kp-datatable__status kp-datatable__grid-readout" data-kp-datatable-grid-readout aria-live="polite">
                        {readout ?? s.tableGridStart}
                    </p>
                )}
                {paginated && (
                    <div className={`kp-datatable__pager ${classNames.pager ?? ''}`.trim()} data-kp-datatable-pager>
                        {sizes.length > 0 && (
                            <label className="kp-datatable__label">
                                {s.tableRowsPerPage}{' '}
                                <select
                                    className="kp-field__input kp-datatable__select kp-datatable__page-size"
                                    ref={pageSizeSelectRef}
                                    data-kp-datatable-page-size
                                    aria-label={s.tableRowsPerPage}
                                    value={pageSize}
                                    onChange={(event) => {
                                        const next = Number(event.target.value);
                                        // The first row the reader was
                                        // looking at stays on the page they
                                        // land on.
                                        const firstRow = at * pageSize;
                                        setPageSize(next);
                                        setPage(Math.floor(firstRow / next));
                                        onPageSizeChange?.(next);
                                    }}
                                >
                                    {sizes.map((size) => (
                                        <option key={size} value={size}>
                                            {size}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        )}
                        {/* The theme's own button, not the ghost, which is text
                            alone at rest in eleven themes; Previous says it points
                            back, and cyberpunk turns its notch that way [Kenny's
                            note of 2026-09-13]. */}
                        <button
                            type="button"
                            className={classNames.pagerButton ?? 'kp-button'}
                            data-kp-direction="back"
                            disabled={at === 0}
                            onClick={() => setPage(at - 1)}
                        >
                            {s.previous}
                        </button>
                        <span className="kp-datatable__page">{s.tablePage(at + 1, pages)}</span>
                        <button
                            type="button"
                            className={classNames.pagerButton ?? 'kp-button'}
                            disabled={at >= pages - 1}
                            onClick={() => setPage(at + 1)}
                        >
                            {s.next}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

const DataTable = forwardRef(DataTableInner);
export default DataTable;
