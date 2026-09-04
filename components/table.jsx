// Table [TH3]. Appearance only; sorting and filtering are out of scope.
//
// The wrapper is not decoration: a wide table has to scroll inside its
// own box, or the page scrolls sideways and SC 1.4.10 is gone.

/**
 * @param {{ columns: string[], rows: (string|number)[][], caption?: string, className?: string }} props
 */
export default function Table({ columns, rows, caption, className = '' }) {
    return (
        <div className="kp-table-wrap">
            <table className={`kp-table ${className}`.trim()}>
                {caption && <caption>{caption}</caption>}
                <thead>
                    <tr>
                        {columns.map((c) => (
                            <th key={c} scope="col">
                                {c}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, i) => (
                        <tr key={i}>
                            {row.map((cell, j) => (
                                <td key={j}>{cell}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
