export type DataTableControl = import('./controller.js').DataTableControl;
/** @typedef {import('./controller.js').DataTableControl} DataTableControl */
export declare class TableExpand {
    /** The table this part belongs to. */
    t: import("./controller.js").DataTableControl;
    /** @param {DataTableControl} t */
    constructor(t: DataTableControl);
    /** @param {HTMLTableRowElement} row @param {boolean} open */
    setExpanded(row: HTMLTableRowElement, open: boolean): void;
    /** @param {readonly string[]} keys */
    expandKeys(keys: readonly string[]): void;
    /** The rows of a folding group play their arrival backwards, then are hidden by a render. @param {HTMLTableRowElement[]} going */
    foldAway(going: HTMLTableRowElement[]): void;
    /** @param {string} key @param {boolean} fold */
    setFolded(key: string, fold: boolean): void;
    /** @param {readonly string[]} keys */
    foldKeys(keys: readonly string[]): void;
    /**
     * Enter or Space on a row, or on a cell, that holds the focus itself
     * (a row given a tabindex, a cell of the keyboard grid) works it as a
     * click does: opens the row, folds the group [J2, R-KEYS]. A control
     * in the row keeps its own keys.
     * @param {KeyboardEvent} event
     */
    onRowKey(event: KeyboardEvent): void;
}
