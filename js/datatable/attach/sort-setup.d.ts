export type DataTableControl = import('./controller.js').DataTableControl;
/** @typedef {import('./controller.js').DataTableControl} DataTableControl */
export declare class TableSortSetup {
    /** The table this part belongs to. */
    t: import("./controller.js").DataTableControl;
    sortable: number[];
    /** @type {HTMLSelectElement | null} */
    sortBy: HTMLSelectElement | null;
    /** @type {HTMLButtonElement | null} */
    sortDirection: HTMLButtonElement | null;
    /** @type {HTMLElement | null} */
    sortSummary: HTMLElement | null;
    /** The opening sort, as a key, once it is known; the way back to it is shown only when the sort differs [fix-83]. @type {string | null} */
    openingSort: string | null;
    locked: boolean[];
    /** @type {Set<number>} */
    hiddenColumns: Set<number>;
    choosable: number[];
    /** @type {HTMLElement | null} */
    columnList: HTMLElement | null;
    /** @type {HTMLElement | null} */
    columnCount: HTMLElement | null;
    editable: boolean;
    /** @type {HTMLElement | null} */
    editLog: HTMLElement | null;
    /** @param {DataTableControl} t */
    constructor(t: DataTableControl);
    /** The card layout's sort control: a column choice and a direction button. */
    makeCardSort(): void;
    /** The multi-sort summary (#multi-sort): the page's, or a line of its own with the way back to the opening sort. */
    findSortSummary(): void;
    /** The column menu (#columns): a button in the top bar, its menu of columns and the count of those shown. */
    makeColumnMenu(): void;
    /** The edit log (#inline-edit): what was edited, under the table. */
    makeEditLog(): void;
}
