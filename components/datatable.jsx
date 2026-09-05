import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { compare as compareCells } from '../js/datatable.js';
import { resolveLocale } from '../js/locale.js';
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
// Since 3.0.0 [KT6]: query, sort, page and selection are controllable —
// a table in the URL, a selection cleared after a bulk action, a server
// that sorts and pages (`totalRows` tells the table it is not looking at
// everything); the comparator collates in the page's locale rather than
// in Dutch; a header sorts from the keyboard; cells render nodes; and
// the search box, the pager and the card layout can each be off.

/** @typedef {{ key: string, label: import('react').ReactNode, kind?: 'text' | 'number' | 'date', sortable?: boolean, align?: 'start' | 'center' | 'end', width?: string, className?: string, render?: (value: unknown, row: Record<string, unknown>, index: number) => import('react').ReactNode, compare?: (a: unknown, b: unknown) => number }} Column */
/** @typedef {{ key: string, direction: 'ascending' | 'descending' } | null} Sort */

/**
 * @typedef {object} DataTableProps
 * @property {Column[]} columns
 * @property {Record<string, unknown>[]} rows
 * @property {(row: Record<string, unknown>, index: number) => string} [rowKey]
 * @property {number} [pageSize]       Default 10.
 * @property {number[]} [pageSizes]    Offer a rows-per-page selector.
 * @property {(size: number) => void} [onPageSizeChange]
 * @property {boolean} [paginated]     Default true.
 * @property {boolean} [searchable]    Default true.
 * @property {boolean} [selectable]
 * @property {boolean} [cards]         The narrow layout. Default true.
 * @property {import('react').ReactNode} [caption]
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
 * @property {boolean} [loading]
 * @property {Partial<import('../js/strings.js').Strings>} [strings]
 * @property {string} [className]
 * @property {import('react').CSSProperties} [style]
 * @property {{ bar?: string, search?: string, table?: string, status?: string, pager?: string }} [classNames]
 */

/**
 * @param {DataTableProps} props
 * @param {import('react').ForwardedRef<HTMLDivElement>} ref
 */
function DataTableInner(
    {
        columns,
        rows,
        rowKey = (_, index) => String(index),
        pageSize: pageSizeProp = 10,
        pageSizes,
        onPageSizeChange,
        paginated = true,
        searchable = true,
        selectable = false,
        cards = true,
        caption,
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
    const [locale, setLocale] = useState(() => resolveLocale(localeProp));
    useEffect(() => {
        setLocale(resolveLocale(localeProp, inner.current));
    }, [localeProp]);
    const [query, setQuery] = useControllable(queryProp, defaultQuery, onQueryChange);
    const [typed, setTyped] = useState(query);
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

    const filtered = useMemo(() => {
        if (serverMode) return rows;
        const needle = query.trim().toLowerCase();
        if (needle === '') return rows;
        return rows.filter((row) => (filter ? filter(row, needle) : Object.values(row).join(' ').toLowerCase().includes(needle)));
    }, [rows, query, filter, serverMode]);

    const sorted = useMemo(() => {
        if (serverMode || sort === null) return filtered;
        const column = columns.find((c) => c.key === sort.key);
        const kind = column?.kind ?? 'text';
        const sign = sort.direction === 'ascending' ? 1 : -1;
        return [...filtered].sort((a, b) =>
            column?.compare
                ? sign * column.compare(a[sort.key], b[sort.key])
                : sign * compareCells(String(a[sort.key] ?? ''), String(b[sort.key] ?? ''), kind, locale),
        );
    }, [filtered, sort, columns, locale, serverMode]);

    const total = serverMode ? totalRows : sorted.length;
    const pages = paginated ? Math.max(1, Math.ceil(total / pageSize)) : 1;
    const at = Math.min(page, pages - 1);
    const slice = serverMode || !paginated ? sorted : sorted.slice(at * pageSize, at * pageSize + pageSize);

    const visibleKeys = slice.map((row, i) => rowKey(row, i));
    const allChecked = visibleKeys.length > 0 && visibleKeys.every((k) => chosen.includes(k));
    const someChecked = visibleKeys.some((k) => chosen.includes(k));

    /** @param {Column} column */
    const toggleSort = (column) => {
        if (column.sortable === false) return;
        const current = sort?.key === column.key ? sort.direction : null;
        if (current === 'ascending') setSort({ key: column.key, direction: 'descending' });
        else if (current === 'descending') setSort(sortCycle === 'three' ? null : { key: column.key, direction: 'ascending' });
        else setSort({ key: column.key, direction: 'ascending' });
    };

    return (
        <div
            ref={inner}
            className={`kp-datatable ${className}`.trim()}
            style={style}
            data-kp-datatable
            data-kp-cards={cards ? '' : undefined}
            aria-busy={loading ? 'true' : undefined}
            {...rest}
        >
            {searchable && (
                <div className={`kp-datatable__bar ${classNames.bar ?? ''}`.trim()}>
                    <input
                        className={`kp-datatable__search ${classNames.search ?? ''}`.trim()}
                        type="search"
                        data-kp-datatable-search
                        placeholder={s.tableSearch}
                        aria-label={s.tableSearchLabel}
                        value={typed}
                        onChange={(event) => onSearch(event.target.value)}
                    />
                </div>
            )}

            <div className="kp-table-wrap">
                <table className={`kp-table ${classNames.table ?? ''}`.trim()}>
                    {caption && <caption>{caption}</caption>}
                    <thead>
                        <tr>
                            {selectable && (
                                <th scope="col">
                                    <input
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
                                        className={column.className}
                                        style={{ textAlign: column.align, width: column.width }}
                                        data-kp-sort={sortable ? (column.kind ?? 'text') : undefined}
                                        // Only the sorted column carries a
                                        // direction; a stale "ascending" on a
                                        // column that is no longer the key is
                                        // worse than saying nothing.
                                        aria-sort={sortable ? direction : undefined}
                                    >
                                        {sortable ? (
                                            // A button, so the sort is reachable
                                            // from the keyboard [KT6]: a bare th
                                            // with onClick was mouse-only.
                                            <button type="button" className="kp-datatable__sort" onClick={() => toggleSort(column)}>
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
                                            data-label={typeof column.label === 'string' ? column.label : column.key}
                                            className={column.className}
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

            {total === 0 && !loading && (
                <div className="kp-empty" data-kp-datatable-empty>
                    {empty ?? s.tableEmpty}
                </div>
            )}

            <div className={`kp-datatable__bar ${classNames.bar ?? ''}`.trim()}>
                <p className={`kp-datatable__status ${classNames.status ?? ''}`.trim()} data-kp-datatable-status role="status" aria-live="polite">
                    {loading ? s.busy : serverMode || total === rows.length ? s.tableRows(total) : s.tableRowsFiltered(total, rows.length)}
                </p>
                {paginated && (
                    <div className={`kp-datatable__pager ${classNames.pager ?? ''}`.trim()} data-kp-datatable-pager>
                        {pageSizes && (
                            <select
                                className="kp-datatable__page-size"
                                aria-label={s.tableRows(pageSize)}
                                value={pageSize}
                                onChange={(event) => {
                                    const next = Number(event.target.value);
                                    setPageSize(next);
                                    setPage(0);
                                    onPageSizeChange?.(next);
                                }}
                            >
                                {pageSizes.map((size) => (
                                    <option key={size} value={size}>
                                        {size}
                                    </option>
                                ))}
                            </select>
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
