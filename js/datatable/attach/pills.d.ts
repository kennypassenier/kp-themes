export type FilterKind = import('../events.js').FilterKind;
export type FilterValue = import('../events.js').FilterValue;
export type Strings = import('../../strings/types.js').Strings;
export type TableContext = import('./context.js').TableContext;
export type PillsFields = {
    closeFilterEditor: (focus?: boolean) => void;
    onAddMenuClick: (event: MouseEvent) => void;
    onAddMenuKey: (event: KeyboardEvent) => void;
    onAddToggle: (event: Event) => void;
    onEditorClick: (event: MouseEvent) => void;
    onEditorKeydown: (event: KeyboardEvent) => void;
    onEditorSubmit: (event: SubmitEvent) => void;
    onPillsClick: (event: MouseEvent) => void;
    openFilterEditor: (at: number, returnTo: number | null) => void;
    renderPills: () => void;
};
/** @typedef {import('../events.js').FilterKind} FilterKind */
/** @typedef {import('../events.js').FilterValue} FilterValue */
/** @typedef {import('../../strings/types.js').Strings} Strings */
/** @typedef {import('./context.js').TableContext} TableContext */
/**
 * What the the filter pills, the add menu and the filter editor part adds to the table's context.
 *
 * @typedef {{
 *     closeFilterEditor: (focus?: boolean) => void;
 *     onAddMenuClick: (event: MouseEvent) => void;
 *     onAddMenuKey: (event: KeyboardEvent) => void;
 *     onAddToggle: (event: Event) => void;
 *     onEditorClick: (event: MouseEvent) => void;
 *     onEditorKeydown: (event: KeyboardEvent) => void;
 *     onEditorSubmit: (event: SubmitEvent) => void;
 *     onPillsClick: (event: MouseEvent) => void;
 *     openFilterEditor: (at: number, returnTo: number | null) => void;
 *     renderPills: () => void;
 * }} PillsFields
 */
/**
 * The filter pills, the add menu and the filter editor.
 *
 * @param {TableContext} c
 */
export declare function installPills(c: TableContext): void;
