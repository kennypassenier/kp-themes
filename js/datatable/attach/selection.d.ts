export type TableContext = import('./context.js').TableContext;
export type FocusMemo = {
    element: HTMLElement;
    selector: string;
    key: string | null;
    group: string | null;
};
export type SelectionFields = {
    focusMemo: FocusMemo | null;
    onBodyChange: (event: Event) => void;
    onBodyFocusIn: (event: FocusEvent) => void;
    onBodyFocusOut: (event: FocusEvent) => void;
    onClearSelection: () => void;
    onSelectAll: () => void;
    select: (keys: readonly string[]) => void;
    toggleMemo: (element: HTMLElement) => FocusMemo | null;
};
/** @typedef {import('./context.js').TableContext} TableContext */
/**
 * The row toggle or group toggle that holds the focus, by key, so a
 * refresh after the consumer replaced its row can give the focus to
 * the new row's toggle [R-LIVE].
 * @typedef {{ element: HTMLElement, selector: string, key: string | null, group: string | null }} FocusMemo
 */
/**
 * What the row selection: focus memory, announcements and the select-all part adds to the table's context.
 *
 * @typedef {{
 *     focusMemo: FocusMemo | null;
 *     onBodyChange: (event: Event) => void;
 *     onBodyFocusIn: (event: FocusEvent) => void;
 *     onBodyFocusOut: (event: FocusEvent) => void;
 *     onClearSelection: () => void;
 *     onSelectAll: () => void;
 *     select: (keys: readonly string[]) => void;
 *     toggleMemo: (element: HTMLElement) => FocusMemo | null;
 * }} SelectionFields
 */
/**
 * Row selection: focus memory, announcements and the select-all.
 *
 * @param {TableContext} c
 */
export declare function installSelection(c: TableContext): void;
