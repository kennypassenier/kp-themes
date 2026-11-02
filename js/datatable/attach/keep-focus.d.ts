/** The wrapper attribute that turns the keeping on. */
export declare const KEEP_FOCUSED_ROW = "data-kp-keep-focused-row";
export type DataTableControl = import('./controller.js').DataTableControl;
export type KeepMemo = {
    row: HTMLTableRowElement;
    element: HTMLElement;
    key: string;
    twin: number;
    detail: boolean;
    at: number;
    cell: number;
};
/** @typedef {import('./controller.js').DataTableControl} DataTableControl */
/**
 * What the focus was in: the row (the owner row, when the focus was in an expanded detail row), its key, which of the rows
 * that share the key it was (`twin`), the visible slot it had on the page and the cell the control sat in.
 * @typedef {{ row: HTMLTableRowElement, element: HTMLElement, key: string, twin: number, detail: boolean, at: number, cell: number }} KeepMemo
 */
export declare class TableKeepFocus {
    /** The table this part belongs to. */
    t: import("./controller.js").DataTableControl;
    /** The row and control that hold the focus now, while the table keeps them. @type {KeepMemo | null} */
    memo: KeepMemo | null;
    /** @param {DataTableControl} t */
    constructor(t: DataTableControl);
    /** Whether this table keeps the focused row, read now. */
    wanted(): boolean;
    /** The row the focus is in, or for a focus in an expanded detail row, the row that owns the detail. @param {Element | null} from */
    ownerOf(from: Element | null): {
        row: HTMLTableRowElement | null;
        detail: boolean;
    };
    /** The rows of the body that carry `key`, in body order. @param {string} key */
    twins(key: string): HTMLTableRowElement[];
    /** Where a row stands among the rows the page shows now. @param {HTMLTableRowElement} row */
    slotOf(row: HTMLTableRowElement): number;
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
     * @returns {{ element: HTMLElement } | { neighbour: { at: number, cell: number, key: string } } | null}
     */
    restore(): {
        element: HTMLElement;
    } | {
        neighbour: {
            at: number;
            cell: number;
            key: string;
        };
    } | null;
    /** @returns {null} */
    forget(): null;
    /**
     * The focused row left the data: the focus goes to the same cell of the row now in its place on the page (the last row when
     * it was the last), so it stays in the table instead of falling to <body>.
     * @param {{ at: number, cell: number, key: string }} slot `key` is set when the row is still in the data and only its detail went
     */
    focusNeighbour(slot: {
        at: number;
        cell: number;
        key: string;
    }): void;
}
