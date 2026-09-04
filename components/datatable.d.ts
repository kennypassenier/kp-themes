export type Column = {
    key: string;
    label: string;
    kind?: 'text' | 'number' | 'date';
};
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
export default function DataTable({ columns, rows, rowKey, pageSize, selectable, cards, caption, empty, onSelect, className, }: {
    columns: Column[];
    rows: Record<string, string>[];
    rowKey?: (row: Record<string, string>, index: number) => string;
    pageSize?: number;
    selectable?: boolean;
    cards?: boolean;
    caption?: string;
    empty?: string;
    onSelect?: (keys: string[]) => void;
    className?: string;
}): import("react").JSX.Element;
