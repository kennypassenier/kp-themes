export type Column = {
    key: string;
    label: import('react').ReactNode;
    kind?: 'text' | 'number' | 'date';
    sortable?: boolean;
    align?: 'start' | 'center' | 'end';
    width?: string;
    className?: string;
    render?: (value: unknown, row: Record<string, unknown>, index: number) => import('react').ReactNode;
    compare?: (a: unknown, b: unknown) => number;
};
export type Sort = {
    key: string;
    direction: 'ascending' | 'descending';
} | null;
export type DataTableProps = {
    columns: Column[];
    rows: Record<string, unknown>[];
    rowKey?: (row: Record<string, unknown>, index: number) => string;
    /**
     * Default 10.
     */
    pageSize?: number;
    /**
     * Offer a rows-per-page selector.
     */
    pageSizes?: number[];
    onPageSizeChange?: (size: number) => void;
    /**
     * Default true.
     */
    paginated?: boolean;
    /**
     * Default true.
     */
    searchable?: boolean;
    selectable?: boolean;
    /**
     * The narrow layout. Default true.
     */
    cards?: boolean;
    caption?: import('react').ReactNode;
    empty?: import('react').ReactNode;
    /**
     * Controlled.
     */
    query?: string;
    defaultQuery?: string;
    onQueryChange?: (query: string) => void;
    /**
     * Default 0.
     */
    debounceMs?: number;
    /**
     * Controlled.
     */
    sort?: Sort;
    defaultSort?: Sort;
    onSortChange?: (sort: Sort) => void;
    /**
     * Default two; three adds an unsorted state.
     */
    sortCycle?: 'two' | 'three';
    /**
     * Controlled, 0-based.
     */
    page?: number;
    defaultPage?: number;
    onPageChange?: (page: number) => void;
    /**
     * Server mode: the rows given are one page of this many; the table neither filters nor sorts nor slices them.
     */
    totalRows?: number;
    /**
     * Controlled.
     */
    selected?: string[];
    defaultSelected?: string[];
    onSelect?: (keys: string[]) => void;
    /**
     * Default: the nearest lang, else the browser's.
     */
    locale?: string;
    filter?: (row: Record<string, unknown>, query: string) => boolean;
    onRowClick?: (row: Record<string, unknown>, index: number) => void;
    rowClassName?: (row: Record<string, unknown>, index: number) => string | undefined;
    loading?: boolean;
    strings?: Partial<import('../js/strings.js').Strings>;
    className?: string;
    style?: import('react').CSSProperties;
    classNames?: {
        bar?: string;
        search?: string;
        table?: string;
        status?: string;
        pager?: string;
    };
};
declare const DataTable: import("react").ForwardRefExoticComponent<DataTableProps & import("react").RefAttributes<HTMLDivElement>>;
export default DataTable;
