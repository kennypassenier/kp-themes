/** The wrapper attribute that turns the keeping on. */
export declare const KEEP_FOCUSED_ROW = "data-kp-keep-focused-row";
export type DataTableControl = import('./controller.js').DataTableControl;
export type KeepMemo = {
    row: HTMLTableRowElement;
    element: HTMLElement;
    key: string;
    at: number;
    cell: number;
};
/** @typedef {import('./controller.js').DataTableControl} DataTableControl */
/** @typedef {{ row: HTMLTableRowElement, element: HTMLElement, key: string, at: number, cell: number }} KeepMemo */
export declare class TableKeepFocus {
    /** The table this part belongs to. */
    t: import("./controller.js").DataTableControl;
    /** The row and control that hold the focus now, while the table keeps them. @type {KeepMemo | null} */
    memo: KeepMemo | null;
    /** @param {DataTableControl} t */
    constructor(t: DataTableControl);
    /** Whether this table keeps the focused row, read now. */
    wanted(): boolean;
    /** Note the row the focus went into, when it is one of the table's rows and has a key. @param {FocusEvent} event */
    onFocusIn(event: FocusEvent): void;
    /**
     * The reader moving the focus on forgets the row; a row the page took out keeps it. Checked after the event, because an engine
     * that fires focusout while it removes the row fires it with the row still in the page.
     * @param {FocusEvent} event
     */
    onFocusOut(event: FocusEvent): void;
    /**
     * Before the rows are read again: put the focused row back in the place of its fresh copy. Returns the control to give the
     * focus back to, the neighbour's slot when the row left the data, or null when there is nothing to keep.
     * @returns {{ element: HTMLElement } | { neighbour: { at: number, cell: number } } | null}
     */
    restore(): {
        element: HTMLElement;
    } | {
        neighbour: {
            at: number;
            cell: number;
        };
    } | null;
    /** @returns {null} */
    forget(): null;
    /**
     * The focused row left the data: the focus goes to the same cell of the row now in its place on the page (the last row when
     * it was the last), so it stays in the table instead of falling to <body>.
     * @param {{ at: number, cell: number }} slot
     */
    focusNeighbour(slot: {
        at: number;
        cell: number;
    }): void;
}
