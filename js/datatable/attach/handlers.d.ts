export type Density = import('../events.js').Density;
export type FilterValue = import('../events.js').FilterValue;
export type Sort = import('../events.js').Sort;
export type SortKey = import('../events.js').SortKey;
export type TableContext = import('./context.js').TableContext;
export type HandlersFields = {
    clearFilters: () => void;
    commitSorts: (next: SortKey[], announced?: Sort) => void;
    onClear: () => void;
    onColumnChange: (event: Event) => void;
    onColumnClick: (event: MouseEvent) => void;
    onDensity: () => void;
    onHeadClick: (event: MouseEvent) => void;
    onHeadKey: (event: KeyboardEvent) => void;
    onPageSize: () => void;
    onPanel: () => void;
    onRetry: () => void;
    onScope: () => void;
    onSearch: () => void;
    onSortBy: () => void;
    onSortDirection: () => void;
    onToggle: () => void;
    setDensity: (next: Density) => void;
    setFilter: (column: string | number, value: FilterValue | null) => void;
    setHidden: (next: Iterable<number>) => void;
    setPageSize: (next: number) => void;
    setSort: (next: Sort) => void;
};
/** @typedef {import('../events.js').Density} Density */
/** @typedef {import('../events.js').FilterValue} FilterValue */
/** @typedef {import('../events.js').Sort} Sort */
/** @typedef {import('../events.js').SortKey} SortKey */
/** @typedef {import('./context.js').TableContext} TableContext */
/**
 * What the the handlers of the search, scope, density, sort, page size and column controls part adds to the table's context.
 *
 * @typedef {{
 *     clearFilters: () => void;
 *     commitSorts: (next: SortKey[], announced?: Sort) => void;
 *     onClear: () => void;
 *     onColumnChange: (event: Event) => void;
 *     onColumnClick: (event: MouseEvent) => void;
 *     onDensity: () => void;
 *     onHeadClick: (event: MouseEvent) => void;
 *     onHeadKey: (event: KeyboardEvent) => void;
 *     onPageSize: () => void;
 *     onPanel: () => void;
 *     onRetry: () => void;
 *     onScope: () => void;
 *     onSearch: () => void;
 *     onSortBy: () => void;
 *     onSortDirection: () => void;
 *     onToggle: () => void;
 *     setDensity: (next: Density) => void;
 *     setFilter: (column: string | number, value: FilterValue | null) => void;
 *     setHidden: (next: Iterable<number>) => void;
 *     setPageSize: (next: number) => void;
 *     setSort: (next: Sort) => void;
 * }} HandlersFields
 */
/**
 * The handlers of the search, scope, density, sort, page size and column controls.
 *
 * @param {TableContext} c
 */
export declare function installHandlers(c: TableContext): void;
