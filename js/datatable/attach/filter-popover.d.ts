/** @typedef {import('./controller.js').DataTableControl} DataTableControl */
export type DataTableControl = import('./controller.js').DataTableControl;
export declare class FilterPopover {
    /** The table this part belongs to. */
    t: import("./controller.js").DataTableControl;
    panel: HTMLElement;
    toggle: HTMLElement;
    onPointer: (event: PointerEvent) => void;
    onKey: (event: KeyboardEvent) => void;
    /** @param {DataTableControl} t @param {HTMLElement} panel @param {HTMLElement} toggle */
    constructor(t: DataTableControl, panel: HTMLElement, toggle: HTMLElement);
    /** Whether a table asked for the popover: the default, `data-kp-filters="inline"` is the old panel. @param {DataTableControl} t */
    static wanted(t: DataTableControl): boolean;
    /** Make the panel a popover anchored to the toggle; the detach puts the page's markup back. */
    dress(): void;
    get isOpen(): boolean;
    /** @param {boolean} open @param {boolean} [focus]  move the focus in (a reader's press), not for a panel that opens with the page */
    setOpen(open: boolean, focus?: boolean): void;
    /** @param {boolean} focus */
    open(focus: boolean): void;
    /** @param {boolean} giveFocusBack */
    close(giveFocusBack: boolean): void;
    /** Light dismiss: a press anywhere but the panel, its button or its calendar. @param {PointerEvent} event */
    closeOnOutside(event: PointerEvent): void;
    /** @param {KeyboardEvent} event */
    closeOnEscape(event: KeyboardEvent): void;
    /** Stop listening to the page. */
    release(): void;
}
