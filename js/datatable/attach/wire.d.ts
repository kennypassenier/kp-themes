export type DataTableControl = import('./controller.js').DataTableControl;
export declare class TableWire {
    /** The table this part belongs to. */
    t: import("./controller.js").DataTableControl;
    /** The sort the table opened with. */
    initialSorts: {
        column: number;
        direction: 'ascending' | 'descending';
    }[];
    /** The frame a resize queued to put the fixed columns in place again. */
    resizeFrame: number;
    /** Keeps the fixed columns in place when the table changes size, when it has any. */
    resize: ResizeObserver | null;
    /** @param {DataTableControl} t */
    constructor(t: DataTableControl);
    /**
     * The table's own selects wear the package's drawn list, as every .kp-field__input select does since Kenny's form of 2026-09-13
     * — here as well as in auto.js, because two of them are built by this attach after auto.js has passed, and a consumer may attach
     * only the tables.
     */
    drawSelects(): void;
    /** The listeners of the table and its chrome; TableUnwire removes them again, with the same bound functions. */
    addListeners(): void;
    /**
     * Headers the server rendered already sorted keep their sort, in the order `data-kp-sort-priority` gives, else the order they
     * stand in.
     */
    openingSorts(): {
        column: number;
        direction: 'ascending' | 'descending';
    }[];
    readDeclaredFilters(): void;
    /** The keyboard grid, with its readout of where the focus is. */
    wireGrid(): void;
    /** The controls, the pills and the columns as the state says, then the rows: the server's, or filtered here. */
    firstDraw(): void;
    /** @returns {ResizeObserver | null} */
    watchResize(): ResizeObserver | null;
}
