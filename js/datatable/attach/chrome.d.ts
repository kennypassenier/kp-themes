export type DataTableControl = import('./controller.js').DataTableControl;
/** @typedef {import('./controller.js').DataTableControl} DataTableControl */
export declare class TableChrome {
    /** The table this part belongs to. */
    t: import("./controller.js").DataTableControl;
    maxHeight: string | undefined;
    scrollBox: HTMLElement | null;
    /** The direct child of the wrapper that holds the table: generated parts go before it. */
    tableBlock: Element;
    /** @type {HTMLElement | null} */
    topBar: HTMLElement | null;
    /** The bar under the table, where the status is, for the lines a feature adds. */
    bottomBar: HTMLElement | null;
    /** @param {DataTableControl} t */
    constructor(t: DataTableControl);
    /**
     * Name a control the page left without a label, for as long as the table is wired.
     * @param {HTMLInputElement | HTMLSelectElement | null} control
     * @param {string} name
     */
    nameUnlabelled(control: HTMLInputElement | HTMLSelectElement | null, name: string): void;
    /** The "In" choice: every column, then one per searchable column, unless the markup wrote its options. */
    fillScope(): void;
    /** The density choice: comfortable and compact, unless the markup wrote its options. */
    fillDensity(): void;
    /** @param {Element | null} box */
    themeBox(box: Element | null): void;
    /** The bar a generated control goes in: the top bar, made when the markup has none. */
    ensureTopBar(): HTMLElement;
    /** @param {HTMLElement} line */
    putUnder(line: HTMLElement): void;
}
