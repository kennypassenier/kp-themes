export type DataTableControl = import('./controller.js').DataTableControl;
/** @typedef {import('./controller.js').DataTableControl} DataTableControl */
export declare class TableReorder {
    /** The table this part belongs to. */
    t: import("./controller.js").DataTableControl;
    /** Rows that had their cells wrapped or added, for detach. @type {Set<HTMLTableRowElement>} */
    prepared: Set<HTMLTableRowElement>;
    /** A polite line only a screen reader hears: where the row went. @type {HTMLElement | null} */
    reorderLive: HTMLElement | null;
    /** @param {DataTableControl} t */
    constructor(t: DataTableControl);
    /** @param {HTMLTableRowElement} row */
    prepareRow(row: HTMLTableRowElement): void;
    /** Take back what prepareRow put in a row. @param {HTMLTableRowElement} row */
    unprepareRow(row: HTMLTableRowElement): void;
    /** Name the parts that depend on the row's current value and state. @param {HTMLTableRowElement} row */
    labelRow(row: HTMLTableRowElement): void;
    canReorder(): boolean;
    /** @param {HTMLTableRowElement} row */
    reorderName(row: HTMLTableRowElement): string;
    /**
     * Put a row at a place in the order (0 is the first) and say so.
     * @param {HTMLTableRowElement} row @param {number} to
     * @returns {boolean} whether the row moved
     */
    moveRow(row: HTMLTableRowElement, to: number): boolean;
    /** Alt+Up and Alt+Down on a row's handle, or on the row itself. @param {KeyboardEvent} event */
    onReorderKey(event: KeyboardEvent): void;
    /** Drag by the handle: the row follows the pointer over its neighbours. @param {PointerEvent} event */
    onReorderPointer(event: PointerEvent): void;
}
