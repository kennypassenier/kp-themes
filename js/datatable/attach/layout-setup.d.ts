/** @typedef {import('./controller.js').DataTableControl} DataTableControl */
export type DataTableControl = import('./controller.js').DataTableControl;
export declare class TableLayoutSetup {
    /** The table this part belongs to. */
    t: import("./controller.js").DataTableControl;
    gridMode: boolean;
    /** @type {HTMLElement | null} */
    gridReadout: HTMLElement | null;
    heldHeight: number;
    coverBox: HTMLElement;
    coverSizes: ResizeObserver | null;
    /** @type {HTMLLabelElement | null} */
    sizeLabel: HTMLLabelElement | null;
    /** @type {HTMLSelectElement | null} */
    sizeSelect: HTMLSelectElement | null;
    /** @param {DataTableControl} t */
    constructor(t: DataTableControl);
    /** The grid's position line (#keyboard), under the table. */
    makeGridReadout(): void;
    /** A failed slot for any table that wrote none, else the page's slot dressed as the package's failed plate. */
    ensureFailedSlot(): void;
    /** The empty plate: the package's for a table that wrote no slot, else the page's slot dressed as one. */
    ensureEmptySlot(): void;
    /** The empty slot as a plate: hidden while the table is not ready, with a heading, and the page's bare words as its body text. */
    dressEmptySlot(): void;
    /** A failed slot a page wrote gets the plate's heading: its reason element, else the dictionary's words [states-check-1019]. */
    titleFailedSlot(): void;
    /** The page-size choice, beside the pager. */
    makeSizeSelect(): void;
    syncCover(): void;
}
