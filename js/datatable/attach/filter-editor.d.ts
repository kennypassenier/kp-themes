export type FilterKind = import('../events.js').FilterKind;
export type FilterValue = import('../events.js').FilterValue;
export type Strings = import('../../strings/types.js').Strings;
export type DataTableControl = import('./controller.js').DataTableControl;
export type Bounds = {
    from?: string;
    to?: string;
} | undefined;
export declare class TableFilterEditor {
    /** The table this part belongs to. */
    t: import("./controller.js").DataTableControl;
    /** The column whose editor is open. @type {number | null} */
    editingFilter: number | null;
    /** The pill the focus returns to when the editor closes; null for the add button. @type {number | null} */
    editorReturn: number | null;
    /** Takes away the date pickers of the open editor. */
    detachEditorPickers: () => void;
    /** @param {DataTableControl} t */
    constructor(t: DataTableControl);
    /** Open column `at`'s editor, with the filter it has. @param {number} at @param {number | null} returnTo the pill the focus goes back to */
    openFilterEditor(at: number, returnTo: number | null): void;
    /**
     * A choice filter's boxes, one per value, ticked as the filter is.
     * @param {number} at @param {FilterValue | undefined} current @param {Strings} s @param {string} label
     */
    choicesField(at: number, current: FilterValue | undefined, s: Strings, label: string): HTMLElement;
    /**
     * A range or date filter's two bounds: number fields, or the package's date pickers with the label on the row above the field.
     * @param {'range' | 'date'} kind @param {Bounds} range @param {Strings} s @param {string} label
     */
    boundsField(kind: 'range' | 'date', range: Bounds, s: Strings, label: string): HTMLElement;
    /** The editor's error line and its Apply and Cancel. @param {Strings} s */
    editorFoot(s: Strings): HTMLElement[];
    /** Wire the editor's date pickers and give them the filter's dates. @param {HTMLFormElement} form @param {Bounds} range */
    startPickers(form: HTMLFormElement, range: Bounds): void;
    /** @param {boolean} [focus] hand the focus back to the pill, or to the add button */
    closeFilterEditor(focus?: boolean): void;
    /** @param {SubmitEvent} event */
    onEditorSubmit(event: SubmitEvent): void;
    /**
     * Read the editor's two bounds; a bound that does not read is marked, said and focused.
     * @param {HTMLFormElement} form @param {number} at @param {'range' | 'date'} kind
     * @returns {{ refused: true } | { refused: false, value: FilterValue | null }}
     */
    readBounds(form: HTMLFormElement, at: number, kind: 'range' | 'date'): {
        refused: true;
    } | {
        refused: false;
        value: FilterValue | null;
    };
    /** @param {MouseEvent} event */
    onEditorClick(event: MouseEvent): void;
    /** @param {KeyboardEvent} event */
    onEditorKeydown(event: KeyboardEvent): void;
}
