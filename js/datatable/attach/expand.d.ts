export type TableContext = import('./context.js').TableContext;
export type ExpandFields = {
    expandKeys: (keys: readonly string[]) => void;
    foldKeys: (keys: readonly string[]) => void;
    onRowKey: (event: KeyboardEvent) => void;
    setExpanded: (row: HTMLTableRowElement, open: boolean) => void;
    setFolded: (key: string, fold: boolean) => void;
};
/** @typedef {import('./context.js').TableContext} TableContext */
/**
 * What the expanding and folding rows and the row keys part adds to the table's context.
 *
 * @typedef {{
 *     expandKeys: (keys: readonly string[]) => void;
 *     foldKeys: (keys: readonly string[]) => void;
 *     onRowKey: (event: KeyboardEvent) => void;
 *     setExpanded: (row: HTMLTableRowElement, open: boolean) => void;
 *     setFolded: (key: string, fold: boolean) => void;
 * }} ExpandFields
 */
/**
 * Expanding and folding rows and the row keys.
 *
 * @param {TableContext} c
 */
export declare function installExpand(c: TableContext): void;
