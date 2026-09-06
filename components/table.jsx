import { forwardRef } from 'react';
import { useStrings } from '../hooks/use-strings.jsx';

// Table [TH3]. Appearance only; sorting and filtering are out of scope.
//
// The wrapper is not decoration: a wide table has to scroll inside its
// own box, or the page scrolls sideways and SC 1.4.10 is gone.
//
// Since 3.0.0 [KT6]: a column can be an object with a key, an
// alignment, a width and a renderer; a cell can be a node; rows have a
// key; the wrapper can be styled or dropped; and a ref is forwarded.
//
// Since 3.2.0: the wrapper is a named region a keyboard can reach
// [TH95] — it had no tabindex, no role and no name in every release up
// to 3.1.1, so the columns past the fold were unreachable without a
// mouse; a column can truncate to one line; and `cards` turns the rows
// into cards when the table's container is narrow [TH96], each cell
// carrying its column's name.

/** @typedef {string | { key?: string, label: import('react').ReactNode, align?: 'start' | 'center' | 'end', width?: string, className?: string, truncate?: boolean, render?: (cell: unknown, row: unknown, index: number) => import('react').ReactNode }} Column */

/**
 * @typedef {object} TableProps
 * @property {Column[]} columns
 * @property {(import('react').ReactNode[] | Record<string, unknown>)[]} rows  Arrays by position, or objects by column key.
 * @property {(row: unknown, index: number) => string | number} [rowKey]
 * @property {import('react').ReactNode} [caption]
 * @property {'top' | 'bottom'} [captionSide]
 * @property {boolean} [wrap]  The scrolling wrapper. Default true.
 * @property {string} [wrapperClassName]
 * @property {boolean} [region]  The wrapper as a keyboard-reachable region [TH95]. Default true.
 * @property {string} [regionLabel]  Its accessible name. Default: the caption, else the dictionary's `tableRegion`.
 * @property {boolean} [cards]  Rows become cards when the container is narrow [TH96]. Default false.
 * @property {Partial<import('../js/strings.js').Strings>} [strings]
 * @property {(row: unknown, index: number) => string | undefined} [rowClassName]
 * @property {string} [className]
 */

/**
 * @param {TableProps & import('react').TableHTMLAttributes<HTMLTableElement>} props
 * @param {import('react').ForwardedRef<HTMLTableElement>} ref
 */
function TableInner(
    {
        columns,
        rows,
        rowKey,
        caption,
        captionSide,
        wrap = true,
        wrapperClassName = '',
        region = true,
        regionLabel,
        cards = false,
        rowClassName,
        strings,
        className = '',
        style,
        ...rest
    },
    ref,
) {
    const s = useStrings(strings);
    /** @param {Column} c */
    const spec = (c) => (typeof c === 'string' ? { key: c, label: c } : c);
    /** The class a column puts on its header and its cells. @param {Exclude<Column, string>} col */
    const cellClass = (col) => `${col.truncate ? 'kp-cell-truncate' : ''} ${col.className ?? ''}`.trim() || undefined;
    /** The column's name, travelling with the cell so the card layout can show it. @param {Exclude<Column, string>} col @param {number} at */
    const labelOf = (col, at) => (typeof col.label === 'string' ? col.label : (col.key ?? String(at)));
    const table = (
        <table
            ref={ref}
            className={`kp-table ${className}`.trim()}
            data-kp-cards={cards ? '' : undefined}
            style={{ captionSide, ...style }}
            {...rest}
        >
            {caption && <caption>{caption}</caption>}
            <thead>
                <tr>
                    {columns.map((c, i) => {
                        const col = spec(c);
                        return (
                            <th key={col.key ?? i} scope="col" className={cellClass(col)} style={{ textAlign: col.align, width: col.width }}>
                                {col.label}
                            </th>
                        );
                    })}
                </tr>
            </thead>
            <tbody>
                {rows.map((row, i) => (
                    <tr key={rowKey ? rowKey(row, i) : i} className={rowClassName?.(row, i)}>
                        {columns.map((c, j) => {
                            const col = spec(c);
                            const cell = Array.isArray(row) ? row[j] : /** @type {Record<string, unknown>} */ (row)[col.key ?? ''];
                            return (
                                <td
                                    key={col.key ?? j}
                                    // The column's name travels with the cell:
                                    // in the card layout it is the only thing
                                    // that says what the value is [TH96].
                                    data-label={labelOf(col, j)}
                                    className={cellClass(col)}
                                    // The whole value where the pointer can
                                    // still read it, since the cell shows one
                                    // clipped line of it [TH96].
                                    title={col.truncate && typeof cell === 'string' ? cell : undefined}
                                    style={{ textAlign: col.align }}
                                >
                                    {col.render ? col.render(cell, row, i) : /** @type {import('react').ReactNode} */ (cell)}
                                </td>
                            );
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
    );
    if (!wrap) return table;
    // The scroll box is where SC 1.4.10 is kept, and until 3.2.0 it was
    // not reachable without a mouse [TH95]. The name comes from the
    // caption when there is one; the dictionary supplies the fallback, so
    // no sentence is written into this file [KT5].
    const name = regionLabel ?? (typeof caption === 'string' ? caption : s.tableRegion);
    return (
        <div
            className={`kp-table-wrap ${wrapperClassName}`.trim()}
            tabIndex={region ? 0 : undefined}
            role={region ? 'region' : undefined}
            aria-label={region ? name : undefined}
        >
            {table}
        </div>
    );
}

const Table = forwardRef(TableInner);
export default Table;
