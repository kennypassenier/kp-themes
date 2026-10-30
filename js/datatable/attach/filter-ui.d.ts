export type FilterKind = import('../events.js').FilterKind;
export type TableContext = import('./context.js').TableContext;
export type FilterUiFields = {
    addButton: HTMLButtonElement | null;
    addMenu: HTMLElement | null;
    addMode: boolean;
    addPop: HTMLElement | null;
    choiceValues: (at: number) => string[];
    datePickerFor: (input: HTMLInputElement) => HTMLElement;
    fillChoices: (set: Element, at: number, ticked: string[]) => void;
    filterColumns: number[];
    filterEditor: HTMLFormElement | null;
    panel: HTMLElement | null;
    pills: HTMLElement | null;
    toggle: HTMLButtonElement | null;
};
/** @typedef {import('../events.js').FilterKind} FilterKind */
/** @typedef {import('./context.js').TableContext} TableContext */
/**
 * What the the filter panel: its columns, pills, add menu, editor and choice lists part adds to the table's context.
 *
 * @typedef {{
 *     addButton: HTMLButtonElement | null;
 *     addMenu: HTMLElement | null;
 *     addMode: boolean;
 *     addPop: HTMLElement | null;
 *     choiceValues: (at: number) => string[];
 *     datePickerFor: (input: HTMLInputElement) => HTMLElement;
 *     fillChoices: (set: Element, at: number, ticked: string[]) => void;
 *     filterColumns: number[];
 *     filterEditor: HTMLFormElement | null;
 *     panel: HTMLElement | null;
 *     pills: HTMLElement | null;
 *     toggle: HTMLButtonElement | null;
 * }} FilterUiFields
 */
/**
 * The filter panel: its columns, pills, add menu, editor and choice lists.
 *
 * @param {TableContext} c
 */
export declare function installFilterUi(c: TableContext): void;
