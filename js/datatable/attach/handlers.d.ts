export type Density = import('../events.js').Density;
export type FilterValue = import('../events.js').FilterValue;
export type Sort = import('../events.js').Sort;
export type SortKey = import('../events.js').SortKey;
export type DataTableControl = import('./controller.js').DataTableControl;
/** @typedef {import('../events.js').Density} Density */
/** @typedef {import('../events.js').FilterValue} FilterValue */
/** @typedef {import('../events.js').Sort} Sort */
/** @typedef {import('../events.js').SortKey} SortKey */
/** @typedef {import('./controller.js').DataTableControl} DataTableControl */
export declare class TableHandlers {
    /** The table this part belongs to. */
    t: import("./controller.js").DataTableControl;
    /** @param {DataTableControl} t */
    constructor(t: DataTableControl);
    onSearch(): void;
    onScope(): void;
    onDensity(): void;
    /** @param {Density} next */
    setDensity(next: Density): void;
    onPanel(): void;
    onToggle(): void;
    /** @param {number | string} column @param {FilterValue | null} value */
    setFilter(column: number | string, value: FilterValue | null): void;
    clearFilters(): void;
    onClear(): void;
    onRetry(): void;
    /** @param {SortKey[]} next @param {Sort} [announced] */
    commitSorts(next: SortKey[], announced?: Sort): void;
    /** @param {Sort} next */
    setSort(next: Sort): void;
    /** @param {HTMLTableCellElement} header @param {boolean} addKey */
    toggleSort(header: HTMLTableCellElement, addKey: boolean): void;
    /** @param {MouseEvent} event */
    onHeadClick(event: MouseEvent): void;
    /** @param {KeyboardEvent} event */
    onHeadKey(event: KeyboardEvent): void;
    onSortBy(): void;
    onSortDirection(): void;
    onPageSize(): void;
    /** Keep the first row the reader was looking at on the page they land on. @param {number} next */
    setPageSize(next: number): void;
    /** @param {Iterable<number>} next */
    setHidden(next: Iterable<number>): void;
    /** @param {Event} event */
    onColumnChange(event: Event): void;
    /** @param {MouseEvent} event */
    onColumnClick(event: MouseEvent): void;
}
