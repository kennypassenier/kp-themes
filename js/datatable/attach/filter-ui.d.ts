export type FilterKind = import('../events.js').FilterKind;
export type DataTableControl = import('./controller.js').DataTableControl;
/** @typedef {import('../events.js').FilterKind} FilterKind */
/** @typedef {import('./controller.js').DataTableControl} DataTableControl */
export declare class TableFilterUi {
    /** The table this part belongs to. */
    t: import("./controller.js").DataTableControl;
    filterColumns: number[];
    /** @type {HTMLElement | null} */
    panel: HTMLElement | null;
    /** @type {HTMLButtonElement | null} */
    toggle: HTMLButtonElement | null;
    /** @type {HTMLElement | null} */
    pills: HTMLElement | null;
    addMode: boolean;
    /** `data-kp-filter-ui="none"`: the filters work, the page draws them [datatable-r5-1019, O22]. */
    bareFilters: boolean;
    /** The add-filter mode's button, its menu, the list in the menu and the editor [#filter-add]. */
    /** @type {HTMLButtonElement | null} */
    addButton: HTMLButtonElement | null;
    /** @type {HTMLElement | null} */
    addPop: HTMLElement | null;
    /** @type {HTMLElement | null} */
    addMenu: HTMLElement | null;
    /** @type {HTMLFormElement | null} */
    filterEditor: HTMLFormElement | null;
    /** @param {DataTableControl} t */
    constructor(t: DataTableControl);
    /** The row of pills that shows the filters set: the page's, or one made here. */
    findPills(): void;
    /** The panel mode: the panel of every filter, and the toggle that opens it. */
    buildPanel(): void;
    /** The panel's toggle: the page's, or one made here, in the top bar. @param {HTMLElement} panel */
    takeToggle(panel: HTMLElement): HTMLButtonElement;
    /** One filter column's fieldset in the panel: a choice list, or a range of two bounds. @param {number} at */
    panelField(at: number): HTMLElement;
    /**
     * A range filter's two bounds: numbers, or the package's own date pickers. A date bound is the package's own date picker, not a
     * bare date input, so it wears every theme's picker (scope-58, Kenny's second nostromo pass). The picker holds ISO in
     * data-kp-date-value whatever the field shows.
     * @param {number} at @param {FilterKind} kind
     */
    rangeField(at: number, kind: FilterKind): HTMLElement;
    /** The add-filter mode [#filter-add]: its button (the page's or one made here), its menu and the filter editor. */
    buildAddMode(): void;
    /**
     * The editor's frame is the package's own, not a .kp-card or a .kp-popover: both carry a clip-path in some registers, which cut
     * off the calendar a date bound opens (measured on the mock, 2026-09-13). The calendar itself goes to the top layer.
     */
    makeFilterEditor(): void;
    /** The add-filter button: one made here, or the page's, whose attributes and words the detach gives back. */
    takeAddButton(): HTMLButtonElement;
    /**
     * A choice filter's values: the header's `data-kp-filter-options`, else
     * every value the rows hold, in the column's declared order or the
     * locale's. The add-filter editor asks when it opens and the filter
     * panel asks again on refresh(), so rows written after the attach are
     * in both.
     *
     * @param {number} at
     */
    choiceValues(at: number): string[];
    /**
     * Put a panel fieldset's boxes in step with the choice values: one box
     * per value the rows hold now, ticked where `ticked` has it, and a
     * ticked value no row holds any more stays, so it can still be
     * unticked. Nothing is rebuilt while the list already matches, so a
     * focused box keeps its focus.
     *
     * @param {Element} set @param {number} at @param {string[]} ticked
     */
    fillChoices(set: Element, at: number, ticked: string[]): void;
    /**
     * The package's date picker around a text field: the markup the
     * standalone picker has, class for class and string for string — a
     * plain button with the glyph, named by aria-label and title
     * [Kenny's note of 2026-09-13 — it was a ghost button reading
     * "Calendar"]. The caller attaches it.
     *
     * @param {HTMLInputElement} input
     */
    datePickerFor(input: HTMLInputElement): HTMLElement;
}
