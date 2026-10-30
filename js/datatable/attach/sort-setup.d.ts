export type TableContext = import('./context.js').TableContext;
export type SortSetupFields = {
    choosable: number[];
    columnCount: HTMLElement | null;
    columnList: HTMLElement | null;
    editLog: HTMLElement | null;
    hiddenColumns: Set<number>;
    locked: boolean[];
    openingSort: string | null;
    sortBy: HTMLSelectElement | null;
    sortDirection: HTMLButtonElement | null;
    sortSummary: HTMLElement | null;
};
/** @typedef {import('./context.js').TableContext} TableContext */
/**
 * What the the sort and column controls and the remembered columns part adds to the table's context.
 *
 * @typedef {{
 *     choosable: number[];
 *     columnCount: HTMLElement | null;
 *     columnList: HTMLElement | null;
 *     editLog: HTMLElement | null;
 *     hiddenColumns: Set<number>;
 *     locked: boolean[];
 *     openingSort: string | null;
 *     sortBy: HTMLSelectElement | null;
 *     sortDirection: HTMLButtonElement | null;
 *     sortSummary: HTMLElement | null;
 * }} SortSetupFields
 */
/**
 * The sort and column controls and the remembered columns.
 *
 * @param {TableContext} c
 */
export declare function installSortSetup(c: TableContext): void;
