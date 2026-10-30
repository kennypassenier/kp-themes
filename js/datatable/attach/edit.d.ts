export type EditDetail = import('../events.js').EditDetail;
export type EditKind = import('../events.js').EditKind;
export type TableContext = import('./context.js').TableContext;
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
export type EditFields = {
    closeEditor: () => void;
    commitEdit: (save: boolean) => Promise<boolean>;
    editing: Editing | null;
    onEditorFocusOut: (event: FocusEvent) => void;
    onEditorKey: (event: KeyboardEvent) => void;
    onEditorKeyCapture: (event: KeyboardEvent) => void;
    onWrapClick: (event: MouseEvent) => void;
    openEditor: (row: HTMLTableRowElement, column: number) => Promise<void>;
};
/** @typedef {import('../events.js').EditDetail} EditDetail */
/** @typedef {import('../events.js').EditKind} EditKind */
/** @typedef {import('./context.js').TableContext} TableContext */
/**
 * @typedef {{ row: HTMLTableRowElement, column: number, kind: EditKind, button: HTMLButtonElement, holder: HTMLElement,
 *   control: HTMLInputElement | HTMLSelectElement, error: HTMLElement, previous: string, detach: () => void, busy: boolean }} Editing
 */
/**
 * What the in-cell editing: open, commit, undo and the app's say part adds to the table's context.
 *
 * @typedef {{
 *     closeEditor: () => void;
 *     commitEdit: (save: boolean) => Promise<boolean>;
 *     editing: Editing | null;
 *     onEditorFocusOut: (event: FocusEvent) => void;
 *     onEditorKey: (event: KeyboardEvent) => void;
 *     onEditorKeyCapture: (event: KeyboardEvent) => void;
 *     onWrapClick: (event: MouseEvent) => void;
 *     openEditor: (row: HTMLTableRowElement, column: number) => Promise<void>;
 * }} EditFields
 */
/**
 * In-cell editing: open, commit, undo and the app's say.
 *
 * @param {TableContext} c
 */
export declare function installEdit(c: TableContext): void;
