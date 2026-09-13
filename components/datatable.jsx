import { forwardRef, useEffect, useId, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { compare as compareCells, compareByOrder, filterActive, filterPills, matchesFilter } from '../js/datatable.js';
import { PAGE_SIZES, RETRY_EVENT, VIEW_EVENT } from '../js/datatable.js';
import { collator, resolveLocale } from '../js/locale.js';
import { useStrings } from '../hooks/use-strings.jsx';
import { useControllable } from '../hooks/use-controllable.js';

// DataTable, React [TH37].
//
// Same contract as js/datatable.js: the same class names, the same
// `aria-sort`, the same announced row count. The difference is where the
// rows come from — this channel is handed data and renders it, the
// framework-free one works on a table a server already wrote.
//
// Deliberately without virtualisation, in-cell editing or export (TH42):
// that is a grid, a different product.
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

/** @typedef {import('../js/datatable.js').FilterValue} FilterValue */
/** @typedef {{ key: string, label: import('react').ReactNode, kind?: 'text' | 'number' | 'date', sortable?: boolean, searchable?: boolean, filter?: 'choice' | 'range' | 'date', filterOptions?: string[], order?: string[], align?: 'start' | 'center' | 'end', width?: string, className?: string, truncate?: boolean, render?: (value: unknown, row: Record<string, unknown>, index: number) => import('react').ReactNode, compare?: (a: unknown, b: unknown) => number }} Column */
/** @typedef {{ key: string, direction: 'ascending' | 'descending' } | null} Sort */
/** @typedef {{ rows: (which?: 'view' | 'page') => Record<string, unknown>[] }} DataTableApi */

/**
 * @typedef {object} DataTableProps
 * @property {Column[]} columns
 * @property {Record<string, unknown>[]} rows
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
 * @property {number} [debounceMs]     Default 0.
 * @property {Sort} [sort]             Controlled.
 * @property {Sort} [defaultSort]
 * @property {(sort: Sort) => void} [onSortChange]
 * @property {'two' | 'three'} [sortCycle]  Default two; three adds an unsorted state.
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
 * @property {import('react').Ref<DataTableApi>} [apiRef]  `rows()` — the rows the table shows, every page of the view or this page.
 * @property {(view: { keys: string[], pageKeys: string[], rows: Record<string, unknown>[], pageRows: Record<string, unknown>[], query: string, scope: string | null, filters: Record<string, FilterValue>, sort: Sort, page: number, pageSize: number }) => void} [onViewChange]
 * @property {string} [removeGlyph]    A filter pill's remove glyph. Default ×.
 * @property {Partial<import('../js/strings.js').Strings>} [strings]
 * @property {string} [className]
 * @property {import('react').CSSProperties} [style]
 * @property {{ bar?: string, search?: string, table?: string, status?: string, pager?: string }} [classNames]
 */

/** @param {Column} column */
const labelText = (column) => (typeof column.label === 'string' ? column.label : column.key);

/**
 * @param {DataTableProps} props
 * @param {import('react').ForwardedRef<HTMLDivElement>} ref
 */
function DataTableInner(
    {
        columns,
        rows,
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
        debounceMs = 0,
        sort: sortProp,
        defaultSort = null,
        onSortChange,
        sortCycle = 'two',
        page: pageProp,
        defaultPage = 0,
        onPageChange,
        totalRows,
        selected,
        defaultSelected = [],
        onSelect,
        locale: localeProp,
        filter,
        onRowClick,
        rowClassName,
        loading = false,
        loadingContent,
        error,
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
    /** @type {import('react').RefObject<HTMLDivElement | null>} */
    const inner = useRef(null);
    useImperativeHandle(ref, () => /** @type {HTMLDivElement} */ (inner.current), []);
    const panelId = `${useId()}-filters`;
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
    const [sort, setSort] = useControllable(sortProp, defaultSort, onSortChange);
    const [page, setPage] = useControllable(pageProp, defaultPage, onPageChange);
    const [chosen, setChosen] = useControllable(selected, defaultSelected, onSelect);
    const [pageSize, setPageSize] = useState(pageSizeProp);
    useEffect(() => setPageSize(pageSizeProp), [pageSizeProp]);
    useEffect(() => setTyped(query), [query]);
    const serverMode = totalRows !== undefined;

    // The search box: debounced when asked, so a server behind it is not
    // asked once per keystroke.
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
        if (debounceMs > 0) debounce.current = window.setTimeout(commit, debounceMs);
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
        if (serverMode || sort === null) return filtered;
        const column = columns.find((c) => c.key === sort.key);
        const kind = column?.kind ?? 'text';
        const sign = sort.direction === 'ascending' ? 1 : -1;
        /** @param {string} a @param {string} b */
        const by = (a, b) => compareCells(a, b, kind, locale);
        return [...filtered].sort((a, b) => {
            if (column?.compare) return sign * column.compare(a[sort.key], b[sort.key]);
            const left = String(a[sort.key] ?? '');
            const right = String(b[sort.key] ?? '');
            // A declared order sorts by meaning, Low before Critical [gap-13].
            return sign * (column?.order ? compareByOrder(column.order, left, right, by) : by(left, right));
        });
    }, [filtered, sort, columns, locale, serverMode]);

    const total = serverMode ? totalRows : sorted.length;
    const pages = paginated ? Math.max(1, Math.ceil(total / pageSize)) : 1;
    const at = Math.min(page, pages - 1);
    const slice = useMemo(
        () => (serverMode || !paginated ? sorted : sorted.slice(at * pageSize, at * pageSize + pageSize)),
        [sorted, serverMode, paginated, at, pageSize],
    );

    const visibleKeys = slice.map((row, i) => rowKey(row, i));
    const allChecked = visibleKeys.length > 0 && visibleKeys.every((k) => chosen.includes(k));
    const someChecked = visibleKeys.some((k) => chosen.includes(k));

    // The rows the table shows, for the app that exports them [Kenny,
    // 2026-09-13]: a method, and the same view event the framework-free
    // channel fires.
    useImperativeHandle(apiRef, () => ({ rows: (which = 'view') => (which === 'page' ? [...slice] : [...sorted]) }), [slice, sorted]);
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
            page: at,
            pageSize,
        };
        onViewChange?.(view);
        inner.current?.dispatchEvent(new CustomEvent(VIEW_EVENT, { bubbles: true, detail: view }));
    }, [sorted, slice, query, scope, filters, sort, at, pageSize]);

    /** The class a column puts on its header and its cells [TH96]. @param {Column} column */
    const cellClass = (column) => `${column.truncate ? 'kp-cell-truncate' : ''} ${column.className ?? ''}`.trim() || undefined;

    /** @param {Column} column */
    const toggleSort = (column) => {
        if (column.sortable === false) return;
        const current = sort?.key === column.key ? sort.direction : null;
        if (current === 'ascending') setSort({ key: column.key, direction: 'descending' });
        else if (current === 'descending') setSort(sortCycle === 'three' ? null : { key: column.key, direction: 'ascending' });
        else setSort({ key: column.key, direction: 'ascending' });
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

    const clearAll = () => {
        clearTimeout(debounce.current);
        setTyped('');
        setQuery('');
        setFilters({});
        setPage(0);
    };
    const retry = () => {
        inner.current?.dispatchEvent(new CustomEvent(RETRY_EVENT, { bubbles: true }));
        onRetry?.();
    };

    const sizes = pageSizes.length === 0 ? [] : [...new Set([...pageSizes, pageSize])].sort((a, b) => a - b);
    const sortableColumns = columns.filter((c) => c.sortable !== false);
    const hasTopBar = searchable || searchScope || densityChoice || filterColumns.length > 0;
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
            data-density={density === 'compact' ? 'compact' : undefined}
            aria-busy={loading ? 'true' : undefined}
            {...rest}
        >
            {hasTopBar && (
                <div className={`kp-datatable__bar ${classNames.bar ?? ''}`.trim()}>
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
                            data-kp-datatable-density
                            aria-label={s.tableDensity}
                            value={density}
                            onChange={(event) => setDensity(event.target.value === 'compact' ? 'compact' : 'comfortable')}
                        >
                            <option value="comfortable">{s.tableDensityComfortable}</option>
                            <option value="compact">{s.tableDensityCompact}</option>
                        </select>
                    )}
                    {filterColumns.length > 0 && (
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
                </div>
            )}

            {filterColumns.length > 0 && (
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
                            const options =
                                column.filterOptions ??
                                [...new Set(rows.map((row) => textOf(row, column.key)).filter((v) => v !== ''))].sort((a, b) =>
                                    column.order ? compareByOrder(column.order, a, b, collator(locale).compare) : collator(locale).compare(a, b),
                                );
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
                                    <input
                                        className="kp-field__input"
                                        type={column.filter === 'range' ? 'number' : 'date'}
                                        aria-label={s.tableFilterFrom(label)}
                                        value={range.from ?? ''}
                                        onChange={(event) => setFilter(column.key, { from: event.target.value, to: range.to ?? '' })}
                                    />
                                    <input
                                        className="kp-field__input"
                                        type={column.filter === 'range' ? 'number' : 'date'}
                                        aria-label={s.tableFilterTo(label)}
                                        value={range.to ?? ''}
                                        onChange={(event) => setFilter(column.key, { from: range.from ?? '', to: event.target.value })}
                                    />
                                </div>
                            </fieldset>
                        );
                    })}
                </div>
            )}

            {filterColumns.length > 0 && (
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
                            data-kp-datatable-sort-by
                            aria-label={s.tableSortBy}
                            value={sort?.key ?? ''}
                            onChange={(event) =>
                                setSort(
                                    event.target.value === ''
                                        ? null
                                        : { key: event.target.value, direction: sort?.direction === 'descending' ? 'descending' : 'ascending' },
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
                        onClick={() => sort && setSort({ key: sort.key, direction: sort.direction === 'ascending' ? 'descending' : 'ascending' })}
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
                <table className={`kp-table ${classNames.table ?? ''}`.trim()}>
                    {caption && <caption>{caption}</caption>}
                    <thead>
                        <tr>
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
                            {columns.map((column) => {
                                const sortable = column.sortable !== false;
                                const direction = sort?.key === column.key ? sort.direction : 'none';
                                return (
                                    <th
                                        key={column.key}
                                        scope="col"
                                        className={cellClass(column)}
                                        style={{ textAlign: column.align, width: column.width }}
                                        data-kp-sort={sortable ? (column.kind ?? 'text') : undefined}
                                        // Only the sorted column carries a
                                        // direction; a stale "ascending" on a
                                        // column that is no longer the key is
                                        // worse than saying nothing.
                                        aria-sort={sortable ? direction : undefined}
                                        // The whole cell sorts; the button's
                                        // own click, from a pointer or from
                                        // Enter and Space, reaches it here.
                                        onClick={sortable ? () => toggleSort(column) : undefined}
                                    >
                                        {sortable ? (
                                            // A button, so the sort is reachable
                                            // from the keyboard [KT6]: a bare th
                                            // with onClick was mouse-only.
                                            <button type="button" className="kp-datatable__sort">
                                                {column.label}
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
                        {slice.map((row, i) => {
                            const key = rowKey(row, i);
                            return (
                                <tr
                                    key={key}
                                    data-kp-row-key={key}
                                    className={rowClassName?.(row, i)}
                                    onClick={onRowClick ? () => onRowClick(row, i) : undefined}
                                    data-kp-clickable={onRowClick ? '' : undefined}
                                >
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
                                    {columns.map((column) => (
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
                                            {column.render
                                                ? column.render(row[column.key], row, i)
                                                : /** @type {import('react').ReactNode} */ (row[column.key] ?? '')}
                                        </td>
                                    ))}
                                </tr>
                            );
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
                    {loading ? s.busy : s.tableShowing(first, last, total, serverMode ? total : rows.length)}
                </p>
                {paginated && (
                    <div className={`kp-datatable__pager ${classNames.pager ?? ''}`.trim()} data-kp-datatable-pager>
                        {sizes.length > 0 && (
                            <label className="kp-datatable__label">
                                {s.tableRowsPerPage}{' '}
                                <select
                                    className="kp-field__input kp-datatable__select kp-datatable__page-size"
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
                        <button type="button" className="kp-button kp-button--ghost" disabled={at === 0} onClick={() => setPage(at - 1)}>
                            {s.previous}
                        </button>
                        <span className="kp-datatable__page">{s.tablePage(at + 1, pages)}</span>
                        <button type="button" className="kp-button kp-button--ghost" disabled={at >= pages - 1} onClick={() => setPage(at + 1)}>
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
