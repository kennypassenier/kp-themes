import { useMemo, useState } from 'react';

// DataTable, React [TH37].
//
// Same contract as js/datatable.js: the same class names, the same
// `aria-sort`, the same announced row count. The difference is where the
// rows come from — this channel is handed data and renders it, the
// framework-free one works on a table a server already wrote.
//
// Deliberately without virtualisation, in-cell editing or export (TH42):
// that is a grid, a different product.

/**
 * @typedef {{ key: string, label: string, kind?: 'text' | 'number' | 'date' }} Column
 */

/**
 * A number column sorted as text puts 100 before 20 — the most common
 * data-table bug there is, and the reason a column declares its kind
 * rather than the code guessing from the first row.
 *
 * @param {string} a @param {string} b @param {string} kind
 */
function compare(a, b, kind) {
    if (kind === 'number') {
        const left = Number.parseFloat(a.replace(/\./g, '').replace(',', '.'));
        const right = Number.parseFloat(b.replace(/\./g, '').replace(',', '.'));
        if (Number.isNaN(left) || Number.isNaN(right)) return a.localeCompare(b, 'nl');
        return left - right;
    }
    if (kind === 'date') {
        const left = Date.parse(a);
        const right = Date.parse(b);
        if (Number.isNaN(left) || Number.isNaN(right)) return a.localeCompare(b, 'nl');
        return left - right;
    }
    return a.localeCompare(b, 'nl', { numeric: true, sensitivity: 'base' });
}

/**
 * @param {{
 *   columns: Column[],
 *   rows: Record<string, string>[],
 *   rowKey?: (row: Record<string, string>, index: number) => string,
 *   pageSize?: number,
 *   selectable?: boolean,
 *   cards?: boolean,
 *   caption?: string,
 *   empty?: string,
 *   onSelect?: (keys: string[]) => void,
 *   className?: string,
 * }} props
 */
export default function DataTable({
    columns,
    rows,
    rowKey = (_, index) => String(index),
    pageSize = 10,
    selectable = false,
    cards = true,
    caption,
    empty = 'Niets gevonden.',
    onSelect,
    className = '',
}) {
    const [query, setQuery] = useState('');
    const [sort, setSort] = useState(/** @type {{ key: string, direction: 'ascending' | 'descending' } | null} */ (null));
    const [page, setPage] = useState(0);
    const [chosen, setChosen] = useState(/** @type {string[]} */ ([]));

    const filtered = useMemo(() => {
        const needle = query.trim().toLowerCase();
        if (needle === '') return rows;
        return rows.filter((row) => Object.values(row).join(' ').toLowerCase().includes(needle));
    }, [rows, query]);

    const sorted = useMemo(() => {
        if (sort === null) return filtered;
        const kind = columns.find((c) => c.key === sort.key)?.kind ?? 'text';
        const sign = sort.direction === 'ascending' ? 1 : -1;
        return [...filtered].sort((a, b) => sign * compare(a[sort.key] ?? '', b[sort.key] ?? '', kind));
    }, [filtered, sort, columns]);

    const pages = Math.max(1, Math.ceil(sorted.length / pageSize));
    const at = Math.min(page, pages - 1);
    const slice = sorted.slice(at * pageSize, at * pageSize + pageSize);

    const visibleKeys = slice.map((row, i) => rowKey(row, i));
    const allChecked = visibleKeys.length > 0 && visibleKeys.every((k) => chosen.includes(k));
    const someChecked = visibleKeys.some((k) => chosen.includes(k));

    /** @param {string[]} next */
    const choose = (next) => {
        setChosen(next);
        onSelect?.(next);
    };

    return (
        <div className={`kp-datatable ${className}`.trim()} data-kp-datatable data-kp-cards={cards ? '' : undefined}>
            <div className="kp-datatable__bar">
                <input
                    className="kp-datatable__search"
                    type="search"
                    data-kp-datatable-search
                    placeholder="Zoeken…"
                    aria-label="Zoeken in de tabel"
                    value={query}
                    onChange={(event) => {
                        setQuery(event.target.value);
                        setPage(0);
                    }}
                />
            </div>

            <div className="kp-table-wrap">
                <table className="kp-table">
                    {caption && <caption>{caption}</caption>}
                    <thead>
                        <tr>
                            {selectable && (
                                <th scope="col">
                                    <input
                                        type="checkbox"
                                        data-kp-select-all
                                        aria-label="Alle zichtbare rijen selecteren"
                                        checked={allChecked}
                                        // The honest third state: a header box
                                        // reading "checked" while three of ten
                                        // rows are selected is a lie.
                                        ref={(node) => {
                                            if (node) node.indeterminate = someChecked && !allChecked;
                                        }}
                                        onChange={(event) => {
                                            const next = event.target.checked
                                                ? [...new Set([...chosen, ...visibleKeys])]
                                                : chosen.filter((k) => !visibleKeys.includes(k));
                                            choose(next);
                                        }}
                                    />
                                </th>
                            )}
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    scope="col"
                                    data-kp-sort={column.kind ?? 'text'}
                                    // Only the sorted column carries a
                                    // direction; a stale "ascending" on a
                                    // column that is no longer the key is
                                    // worse than saying nothing.
                                    aria-sort={sort?.key === column.key ? sort.direction : 'none'}
                                    onClick={() =>
                                        setSort((current) =>
                                            current?.key === column.key
                                                ? { key: column.key, direction: current.direction === 'ascending' ? 'descending' : 'ascending' }
                                                : { key: column.key, direction: 'ascending' },
                                        )
                                    }
                                >
                                    {column.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {slice.map((row, i) => {
                            const key = rowKey(row, i);
                            return (
                                <tr key={key} data-kp-row-key={key}>
                                    {selectable && (
                                        <td data-label="">
                                            <input
                                                type="checkbox"
                                                data-kp-select-row
                                                aria-label={`Rij ${key} selecteren`}
                                                checked={chosen.includes(key)}
                                                onChange={(event) =>
                                                    choose(event.target.checked ? [...chosen, key] : chosen.filter((k) => k !== key))
                                                }
                                            />
                                        </td>
                                    )}
                                    {columns.map((column) => (
                                        // The column name travels with the
                                        // cell so the narrow layout can show
                                        // it: a value with no question
                                        // attached is not information.
                                        <td key={column.key} data-label={column.label}>
                                            {row[column.key]}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {sorted.length === 0 && (
                <div className="kp-empty" data-kp-datatable-empty>
                    {empty}
                </div>
            )}

            <div className="kp-datatable__bar">
                <p className="kp-datatable__status" data-kp-datatable-status role="status" aria-live="polite">
                    {sorted.length === rows.length ? `${rows.length} rijen` : `${sorted.length} van ${rows.length} rijen`}
                </p>
                <div className="kp-datatable__pager" data-kp-datatable-pager>
                    <button type="button" className="kp-button kp-button--ghost" disabled={at === 0} onClick={() => setPage(at - 1)}>
                        Vorige
                    </button>
                    <span className="kp-datatable__page">
                        {at + 1} / {pages}
                    </span>
                    <button type="button" className="kp-button kp-button--ghost" disabled={at >= pages - 1} onClick={() => setPage(at + 1)}>
                        Volgende
                    </button>
                </div>
            </div>
        </div>
    );
}
