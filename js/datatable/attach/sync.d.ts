export type FilterValue = import('../events.js').FilterValue;
export type GridHandle = import('../grid.js').GridHandle;
export type View = import('../events.js').View;
export type DataTableControl = import('./controller.js').DataTableControl;
/** @typedef {import('../events.js').FilterValue} FilterValue */
/** @typedef {import('../grid.js').GridHandle} GridHandle */
/** @typedef {import('../events.js').View} View */
/** @typedef {import('./controller.js').DataTableControl} DataTableControl */
export declare class TableSync {
    /** The table this part belongs to. */
    t: import("./controller.js").DataTableControl;
    /** Keys ticked in a server-backed table, which outlive the rows of one page. @type {Set<string>} */
    serverSelection: Set<string>;
    fixedAttribute: string | undefined;
    fixedCount: number;
    fixedEndCount: number;
    /**
     * A table that becomes cards says in each cell which column it is [datatable-r5-1019, B2]: a cell the markup
     * gave no `data-label` takes its header's words, so a server that renders plain rows still gets cards. A label
     * the markup wrote stays; a cell under a header with no words (the selection box, the actions) gets none and
     * spans the card. Read again on every render, for rows that came later; detach takes the derived ones away.
     * @type {Set<HTMLTableCellElement>}
     */
    derivedLabels: Set<HTMLTableCellElement>;
    cardsWanted: boolean;
    /** @type {GridHandle | null} */
    grid: GridHandle | null;
    /** @param {DataTableControl} t */
    constructor(t: DataTableControl);
    /** A detail row, made ready to show: its class, its id and its span. @param {HTMLTableRowElement} row */
    detailFor(row: HTMLTableRowElement): HTMLTableRowElement | undefined;
    /** The filters under the column ids instead of the numbers [wish-1028]. @returns {Record<string, FilterValue>} */
    byField(): Record<string, FilterValue>;
    /**
     * A column asked for by number, or by its id (`data-kp-field`, else its text); -1 when the id names none [wish-1028].
     * @param {number | string} column
     */
    columnAt(column: number | string): number;
    /** @returns {View} */
    view(): View;
    selectedRows(): HTMLTableRowElement[];
    /** The header box reads the rows on this page, which are the rows it acts on [gap-13]. */
    syncSelectAll(): void;
    syncActions(): void;
    /** Skeleton rows for a first load with no loading slot of the consumer's, as #states shows it. */
    syncSkeleton(): void;
    syncStateParts(): void;
    syncCardSort(): void;
    syncSortMarks(): void;
    syncColumns(): void;
    /** The column menu's list, built once: a box per column that may be hidden, then "Show all columns". @param {HTMLElement} list */
    buildColumnList(list: HTMLElement): void;
    syncFixed(): void;
    labelCells(): void;
}
