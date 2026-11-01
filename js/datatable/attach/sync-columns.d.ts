export type DataTableControl = import('./controller.js').DataTableControl;
/** @typedef {import('./controller.js').DataTableControl} DataTableControl */
export declare class TableSyncColumns {
    /** The table this part belongs to. */
    t: import("./controller.js").DataTableControl;
    /** @param {DataTableControl} t */
    constructor(t: DataTableControl);
    syncColumns(): void;
    /** The column menu's list, built once: a box per column that may be hidden, then "Show all columns". @param {HTMLElement} list */
    buildColumnList(list: HTMLElement): void;
}
