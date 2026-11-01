import { getStrings } from '../../strings.js';
export type EditDetail = import('../events.js').EditDetail;
export type EditKind = import('../events.js').EditKind;
export type DataTableControl = import('./controller.js').DataTableControl;
/** @typedef {import('../events.js').EditDetail} EditDetail */
/** @typedef {import('../events.js').EditKind} EditKind */
/** @typedef {import('./controller.js').DataTableControl} DataTableControl */
export declare class TableEditField {
    /** The table this part belongs to. */
    t: import("./controller.js").DataTableControl;
    /** @param {DataTableControl} t */
    constructor(t: DataTableControl);
    /**
     * The editor's field, put in `holder`: a select of the column's values, a number or text input, or the package's date picker.
     * @param {EditKind} kind @param {number} column @param {string} previous @param {HTMLElement} holder
     * @returns {HTMLInputElement | HTMLSelectElement}
     */
    editField(kind: EditKind, column: number, previous: string, holder: HTMLElement): HTMLInputElement | HTMLSelectElement;
    /**
     * Wire the field once it is in the cell: the drawn list of a select, the date picker with the cell's date.
     * @param {EditKind} kind @param {HTMLInputElement | HTMLSelectElement} control @param {HTMLElement} holder @param {string} previous
     * @returns {() => void} what takes that wiring away
     */
    startField(kind: EditKind, control: HTMLInputElement | HTMLSelectElement, holder: HTMLElement, previous: string): () => void;
    /**
     * Tell the app about a change and wait for its answer: null when it
     * accepts, the message when it refuses.
     *
     * @param {HTMLTableRowElement} row @param {number} column @param {string} value @param {string} previous @param {boolean} isUndo
     * @returns {Promise<string | null>}
     */
    askApp(row: HTMLTableRowElement, column: number, value: string, previous: string, isUndo: boolean): Promise<string | null>;
    /**
     * Why a value cannot be saved: a required cell left empty, or a number that is not one; null when it can.
     * @param {EditKind} kind @param {number} column @param {string} value @param {ReturnType<typeof getStrings>} s
     */
    checkValue(kind: EditKind, column: number, value: string, s: ReturnType<typeof getStrings>): string | null;
}
