export type DataTableControl = import('./controller.js').DataTableControl;
/** @typedef {import('./controller.js').DataTableControl} DataTableControl */
export declare class TableUnwire {
    /** The table this part belongs to. */
    t: import("./controller.js").DataTableControl;
    /** @param {DataTableControl} t */
    constructor(t: DataTableControl);
    /** Undo everything: DataTableControl.destroy() runs this last. */
    unwire(): void;
    /** The listeners TableWire added, removed with the same bound functions; the filter editor and the add menu close on the way. */
    removeListeners(): void;
    /**
     * Put back what the server rendered: order, visibility, the sort marks, the pager, the empty state, the focusability, and every
     * part this attach added. First the rows and their details.
     */
    restoreRows(): void;
    /** Group rows [J2]: their toggles out, their span and visibility back, the ids taken back. */
    restoreGroups(): void;
    /**
     * The body goes back to the order it came in with one write [perf-1026]: the order is worked out on a list, as the appends would
     * have left it, and the rows go in together. A table the page took out of the document gets the same order: its markup after
     * detach is what it was before attach.
     */
    restoreOrder(): void;
    /** The headers' sort marks, visibility, sort and focusability as the markup had them. */
    restoreHeaders(): void;
    /** The pager emptied, the slots as they were, the busy count and layer gone. */
    restoreSlots(): void;
    /** The parts this table added out, its undo steps run, and the wrapper's own attributes back. */
    restoreWrap(): void;
}
