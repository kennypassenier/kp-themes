export type FilterValue = import('../js/datatable.js').FilterValue;
export type Column = {
    key: string;
    label: import('react').ReactNode;
    kind?: 'text' | 'number' | 'date';
    sortable?: boolean;
    searchable?: boolean;
    filter?: 'choice' | 'range' | 'date';
    filterOptions?: string[];
    order?: string[];
    align?: 'start' | 'center' | 'end';
    width?: string;
    className?: string;
    truncate?: boolean;
    render?: (value: unknown, row: Record<string, unknown>, index: number) => import('react').ReactNode;
    compare?: (a: unknown, b: unknown) => number;
};
export type Sort = {
    key: string;
    direction: 'ascending' | 'descending';
} | null;
export type DataTableApi = {
    rows: (which?: 'view' | 'page') => Record<string, unknown>[];
};
export type DataTableProps = {
    columns: Column[];
    rows: Record<string, unknown>[];
    rowKey?: (row: Record<string, unknown>, index: number) => string;
    /**
     * Default 25.
     */
    pageSize?: number;
    /**
     * The rows-per-page choice. Default 10, 25, 50, 100; an empty list offers none.
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
    /**
     * Offer the "In" choice beside the search box. Default false.
     */
    searchScope?: boolean;
    /**
     * Controlled: the column key the search is limited to, or null for all.
     */
    scope?: string | null;
    defaultScope?: string | null;
    onScopeChange?: (scope: string | null) => void;
    /**
     * Controlled, by column key.
     */
    filters?: Record<string, FilterValue>;
    defaultFilters?: Record<string, FilterValue>;
    onFiltersChange?: (filters: Record<string, FilterValue>) => void;
    /**
     * Controlled: the filter panel.
     */
    filtersOpen?: boolean;
    /**
     * Default false.
     */
    defaultFiltersOpen?: boolean;
    onFiltersOpenChange?: (open: boolean) => void;
    /**
     * Controlled.
     */
    density?: 'comfortable' | 'compact';
    defaultDensity?: 'comfortable' | 'compact';
    onDensityChange?: (density: 'comfortable' | 'compact') => void;
    /**
     * Offer the density choice. Default false.
     */
    densityChoice?: boolean;
    selectable?: boolean;
    /**
     * The action bar a selection shows.
     */
    actions?: (selected: string[], clear: () => void) => import('react').ReactNode;
    /**
     * The narrow layout. Default true.
     */
    cards?: boolean;
    /**
     * A max height for the scroll box; the header stays while it scrolls.
     */
    maxHeight?: string;
    caption?: import('react').ReactNode;
    /**
     * The scroll wrapper as a keyboard-reachable region [TH95]. Default true.
     */
    region?: boolean;
    /**
     * Its accessible name. Default: the caption, else the dictionary's `tableRegion`.
     */
    regionLabel?: string;
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
    /**
     * With no rows, the loading slot shows; with rows, they stay, dimmed.
     */
    loading?: boolean;
    /**
     * What the loading slot shows. Default: three skeleton lines.
     */
    loadingContent?: import('react').ReactNode;
    /**
     * The failed state: true for the dictionary's text, or the text itself.
     */
    error?: boolean | import('react').ReactNode;
    /**
     * The failed state's way out; the `kp-datatable-retry` event fires as well.
     */
    onRetry?: () => void;
    /**
     * `rows()` — the rows the table shows, every page of the view or this page.
     */
    apiRef?: import('react').Ref<DataTableApi>;
    onViewChange?: (view: {
        keys: string[];
        pageKeys: string[];
        rows: Record<string, unknown>[];
        pageRows: Record<string, unknown>[];
        query: string;
        scope: string | null;
        filters: Record<string, FilterValue>;
        sort: Sort;
        page: number;
        pageSize: number;
    }) => void;
    /**
     * A filter pill's remove glyph. Default ×.
     */
    removeGlyph?: string;
    strings?: Partial<import('../js/strings.js').Strings>;
    className?: string;
    style?: import('react').CSSProperties;
    /**
     * `pagerButton` replaces the pager buttons' classes, `kp-button` by default.
     */
    classNames?: {
        bar?: string;
        search?: string;
        table?: string;
        status?: string;
        pager?: string;
        pagerButton?: string;
    };
};
declare const DataTable: import("react").ForwardRefExoticComponent<DataTableProps & import("react").RefAttributes<HTMLDivElement>>;
export default DataTable;
