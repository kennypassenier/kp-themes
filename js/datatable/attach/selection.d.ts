export type FocusMemo = {
    element: HTMLElement;
    selector: string;
    key: string | null;
    group: string | null;
};
export type DataTableControl = import('./controller.js').DataTableControl;
/** @typedef {{ element: HTMLElement, selector: string, key: string | null, group: string | null }} FocusMemo */
/** @typedef {import('./controller.js').DataTableControl} DataTableControl */
export declare class TableSelection {
    /** The table this part belongs to. */
    t: import("./controller.js").DataTableControl;
    /** @type {FocusMemo | null} */
    focusMemo: FocusMemo | null;
    /** @param {DataTableControl} t */
    constructor(t: DataTableControl);
    /** @param {HTMLElement} element @returns {FocusMemo | null} */
    toggleMemo(element: HTMLElement): FocusMemo | null;
    /** @param {FocusEvent} event */
    onBodyFocusIn(event: FocusEvent): void;
    /** Focus that moved on, while the toggle is still in the page, is the reader's choice: forget it. @param {FocusEvent} event */
    onBodyFocusOut(event: FocusEvent): void;
    announceSelection(): void;
    /** @param {Event} event */
    onBodyChange(event: Event): void;
    onSelectAll(): void;
    /** @param {readonly string[]} keys */
    select(keys: readonly string[]): void;
    onClearSelection(): void;
}
