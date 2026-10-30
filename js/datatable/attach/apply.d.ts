export type FilterValue = import('../events.js').FilterValue;
export type TableContext = import('./context.js').TableContext;
export type ApplyFields = {
    applyFilter: (arg0?: {
        keepPage?: boolean | undefined;
    }) => void;
    applySorts: () => void;
    readControls: () => void;
    refreshChoices: () => void;
    writeControls: () => void;
    writing: boolean;
};
/** @typedef {import('../events.js').FilterValue} FilterValue */
/** @typedef {import('./context.js').TableContext} TableContext */
/**
 * What the writes the controls from the state, reads them back, and applies sorts and filters part adds to the table's context.
 *
 * @typedef {{
 *     applyFilter: (arg0?: { keepPage?: boolean | undefined; }) => void;
 *     applySorts: () => void;
 *     readControls: () => void;
 *     refreshChoices: () => void;
 *     writeControls: () => void;
 *     writing: boolean;
 * }} ApplyFields
 */
/**
 * Writes the controls from the state, reads them back, and applies sorts and filters.
 *
 * @param {TableContext} c
 */
export declare function installApply(c: TableContext): void;
