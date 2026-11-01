import { TableEditField } from './edit-field.js';
export type EditDetail = import('../events.js').EditDetail;
export type EditKind = import('../events.js').EditKind;
export type Editing = {
    row: HTMLTableRowElement;
    column: number;
    kind: EditKind;
    button: HTMLButtonElement;
    holder: HTMLElement;
    control: HTMLInputElement | HTMLSelectElement;
    error: HTMLElement;
    previous: string;
    detach: () => void;
    busy: boolean;
};
export type DataTableControl = import('./controller.js').DataTableControl;
/** @typedef {import('../events.js').EditDetail} EditDetail */
/** @typedef {import('../events.js').EditKind} EditKind */
/**
 * @typedef {{ row: HTMLTableRowElement, column: number, kind: EditKind, button: HTMLButtonElement, holder: HTMLElement,
 *   control: HTMLInputElement | HTMLSelectElement, error: HTMLElement, previous: string, detach: () => void, busy: boolean }} Editing
 */
/** @typedef {import('./controller.js').DataTableControl} DataTableControl */
export declare class TableEdit {
    /** The table this part belongs to. */
    t: import("./controller.js").DataTableControl;
    /** @type {Editing | null} */
    editing: Editing | null;
    /** @type {{ row: HTMLTableRowElement, column: number, before: string, after: string } | null} */
    lastEdit: {
        row: HTMLTableRowElement;
        column: number;
        before: string;
        after: string;
    } | null;
    /** Whether the drawn list of the select being edited was open when a key went down. */
    listWasOpen: boolean;
    /** The field, the check and the app's say. */
    field: TableEditField;
    /** @param {DataTableControl} t */
    constructor(t: DataTableControl);
    /** @param {string} text @param {{ undo?: boolean }} [options] */
    logEdit(text: string, { undo: withUndo }?: {
        undo?: boolean;
    }): void;
    /** Write a saved value into its cell, into the badge or the element that held the text. @param {HTMLTableCellElement} cell @param {string} value */
    writeCell(cell: HTMLTableCellElement, value: string): void;
    closeEditor(): void;
    /** Open the editor of cell `column` of `row`, saving the one that is open first. @param {HTMLTableRowElement} row @param {number} column */
    openEditor(row: HTMLTableRowElement, column: number): Promise<void>;
    /** @param {string} message */
    refuse(message: string): void;
    /** @param {boolean} save @returns {Promise<boolean>} whether the editor closed */
    commitEdit(save: boolean): Promise<boolean>;
    undoEdit(): Promise<void>;
    /** @param {KeyboardEvent} event */
    onEditorKeyCapture(event: KeyboardEvent): void;
    /** @param {KeyboardEvent} event */
    onEditorKey(event: KeyboardEvent): void;
    /** Saving on blur, after the click that caused it has been handled. @param {FocusEvent} event */
    onEditorFocusOut(event: FocusEvent): void;
}
