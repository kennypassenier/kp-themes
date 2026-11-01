/** @typedef {import('./controller.js').DataTableControl} DataTableControl */
export type DataTableControl = import('./controller.js').DataTableControl;
export declare class TableColumnTracks {
    /** The table this part belongs to. */
    t: import("./controller.js").DataTableControl;
    /** Whether the widths are written now. */
    held: boolean;
    /** The width of the table's wrapper when they were written [px]; a different width means the room changed and they are let go. */
    heldWidth: number;
    /** Lets the columns go when the room changes. */
    watch: ResizeObserver;
    /** @param {DataTableControl} t */
    constructor(t: DataTableControl);
    /** Hold the columns where they stand, before rows leave or come back. A table with no group row has nothing to fold. */
    hold(): void;
    /** Let the columns size themselves again. */
    release(): void;
}
