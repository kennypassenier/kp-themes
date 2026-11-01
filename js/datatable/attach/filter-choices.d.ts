export type DataTableControl = import('./controller.js').DataTableControl;
/** @typedef {import('./controller.js').DataTableControl} DataTableControl */
export declare class TableFilterChoices {
    /** The table this part belongs to. */
    t: import("./controller.js").DataTableControl;
    /** @param {DataTableControl} t */
    constructor(t: DataTableControl);
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
