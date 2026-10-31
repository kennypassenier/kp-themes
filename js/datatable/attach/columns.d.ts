export type EditKind = import('../events.js').EditKind;
export type FilterKind = import('../events.js').FilterKind;
export type DataTableControl = import('./controller.js').DataTableControl;
/** @typedef {import('../events.js').EditKind} EditKind */
/** @typedef {import('../events.js').FilterKind} FilterKind */
/** @typedef {import('./controller.js').DataTableControl} DataTableControl */
export declare class TableColumns {
    /** The table this part belongs to. */
    t: import("./controller.js").DataTableControl;
    headers: HTMLTableCellElement[];
    headerSort: (string | null)[];
    headerTab: (string | null)[];
    headersWereHidden: ("until-found" | boolean)[];
    /** The column names, read once: the sort order a header shows later is not part of its name. */
    labels: string[];
    /** What a remembered column or sort key is stored under: never the index, which the control columns shift. */
    columnIds: string[];
    orders: (string[] | null)[];
    filterKinds: (import("../events.js").FilterKind | null)[];
    editKinds: (import("../events.js").EditKind | null)[];
    /** The column that names a row: the first that is not a column of controls. */
    keyColumn: number;
    /** @param {DataTableControl} t */
    constructor(t: DataTableControl);
    /** @param {number} at */
    labelOf(at: number): string;
    /** A column of controls — the selection boxes, the expand buttons — rather than of values. @param {number} at */
    controlColumn(at: number): boolean;
    /** @param {HTMLTableRowElement} row @param {number} at */
    cellText(row: HTMLTableRowElement, at: number): string;
    /**
     * What a cell sorts and range-filters by: its `data-kp-sort-value` [kpadopt2-grids] when it has one (a
     * bar cell shows "62%" and sorts by 62; a size shows "1.4 GB" and sorts by its bytes), else what it shows.
     * Search and choice filters keep reading the shown text.
     * @param {HTMLTableRowElement} row @param {number} at
     */
    cellValue(row: HTMLTableRowElement, at: number): string;
    /**
     * What a choice filter reads of a cell: its `data-kp-filter-value` [kpadopt3] when it has one (a status cell shows a
     * dot, a word and a time, and is listed and matched as "running"), else what it shows. Search keeps the shown text.
     * On a header the same attribute is the filter the page opens with (read below, from `headers`).
     * @param {HTMLTableRowElement} row @param {number} at
     */
    choiceText(row: HTMLTableRowElement, at: number): string;
    /** @param {HTMLTableRowElement} row */
    keyOf(row: HTMLTableRowElement): string;
}
