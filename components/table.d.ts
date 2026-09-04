/**
 * @param {{ columns: string[], rows: (string|number)[][], caption?: string, className?: string }} props
 */
export default function Table({ columns, rows, caption, className }: {
    columns: string[];
    rows: (string | number)[][];
    caption?: string;
    className?: string;
}): import("react").JSX.Element;
