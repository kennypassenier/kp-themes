import { forwardRef } from 'react';

// Table [TH3]. Appearance only; sorting and filtering are out of scope.
//
// The wrapper is not decoration: a wide table has to scroll inside its
// own box, or the page scrolls sideways and SC 1.4.10 is gone.
//
// Since 3.0.0 [KT6]: a column can be an object with a key, an
// alignment, a width and a renderer; a cell can be a node; rows have a
// key; the wrapper can be styled or dropped; and a ref is forwarded.

/** @typedef {string | { key?: string, label: import('react').ReactNode, align?: 'start' | 'center' | 'end', width?: string, className?: string, render?: (cell: unknown, row: unknown, index: number) => import('react').ReactNode }} Column */

/**
 * @typedef {object} TableProps
 * @property {Column[]} columns
 * @property {(import('react').ReactNode[] | Record<string, unknown>)[]} rows  Arrays by position, or objects by column key.
 * @property {(row: unknown, index: number) => string | number} [rowKey]
 * @property {import('react').ReactNode} [caption]
 * @property {'top' | 'bottom'} [captionSide]
 * @property {boolean} [wrap]  The scrolling wrapper. Default true.
 * @property {string} [wrapperClassName]
 * @property {(row: unknown, index: number) => string | undefined} [rowClassName]
 * @property {string} [className]
 */

/**
 * @param {TableProps & import('react').TableHTMLAttributes<HTMLTableElement>} props
 * @param {import('react').ForwardedRef<HTMLTableElement>} ref
 */
function TableInner(
    { columns, rows, rowKey, caption, captionSide, wrap = true, wrapperClassName = '', rowClassName, className = '', style, ...rest },
    ref,
) {
    /** @param {Column} c */
    const spec = (c) => (typeof c === 'string' ? { key: c, label: c } : c);
    const table = (
        <table ref={ref} className={`kp-table ${className}`.trim()} style={{ captionSide, ...style }} {...rest}>
            {caption && <caption>{caption}</caption>}
            <thead>
                <tr>
                    {columns.map((c, i) => {
                        const col = spec(c);
                        return (
                            <th key={col.key ?? i} scope="col" className={col.className} style={{ textAlign: col.align, width: col.width }}>
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
                                <td key={col.key ?? j} className={col.className} style={{ textAlign: col.align }}>
                                    {col.render ? col.render(cell, row, i) : /** @type {import('react').ReactNode} */ (cell)}
                                </td>
                            );
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
    );
    return wrap ? <div className={`kp-table-wrap ${wrapperClassName}`.trim()}>{table}</div> : table;
}

const Table = forwardRef(TableInner);
export default Table;
