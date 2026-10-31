export type FilterValue = import('../events.js').FilterValue;
export type DataTableControl = import('./controller.js').DataTableControl;
/** @typedef {import('../events.js').FilterValue} FilterValue */
/** @typedef {import('./controller.js').DataTableControl} DataTableControl */
export declare class TableApply {
    /** The table this part belongs to. */
    t: import("./controller.js").DataTableControl;
    /** True while writeControls sets a date picker, whose change event must not be read back. */
    writing: boolean;
    /** @param {DataTableControl} t */
    constructor(t: DataTableControl);
    /** Write the filter state into the panel's controls, so a pill or the handle and the panel agree. */
    writeControls(): void;
    /**
     * The panel's choice lists, read again from the rows. At attach they
     * hold the rows the markup had; a page that writes its rows afterwards
     * (and calls refresh) would otherwise keep an empty list for good.
     */
    refreshChoices(): void;
    /** Read the panel's controls into the filter state. */
    readControls(): void;
    /** @param {HTMLTableRowElement} a @param {HTMLTableRowElement} b */
    compareRows(a: HTMLTableRowElement, b: HTMLTableRowElement): number;
    applySorts(): void;
    /** @param {{ keepPage?: boolean }} [options] */
    applyFilter({ keepPage }?: {
        keepPage?: boolean;
    }): void;
}
