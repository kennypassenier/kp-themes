export type Column = string | {
    key?: string;
    label: import('react').ReactNode;
    align?: 'start' | 'center' | 'end';
    width?: string;
    className?: string;
    render?: (cell: unknown, row: unknown, index: number) => import('react').ReactNode;
};
export type TableProps = {
    columns: Column[];
    /**
     * Arrays by position, or objects by column key.
     */
    rows: (import('react').ReactNode[] | Record<string, unknown>)[];
    rowKey?: (row: unknown, index: number) => string | number;
    caption?: import('react').ReactNode;
    captionSide?: 'top' | 'bottom';
    /**
     * The scrolling wrapper. Default true.
     */
    wrap?: boolean;
    wrapperClassName?: string;
    rowClassName?: (row: unknown, index: number) => string | undefined;
    className?: string;
};
declare const Table: import("react").ForwardRefExoticComponent<TableProps & import("react").TableHTMLAttributes<HTMLTableElement> & import("react").RefAttributes<HTMLTableElement>>;
export default Table;
