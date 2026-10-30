export type EditKind = import('../events.js').EditKind;
export type FilterKind = import('../events.js').FilterKind;
export type TableContext = import('./context.js').TableContext;
export type ColumnsFields = {
    cellText: (row: HTMLTableRowElement, at: number) => string;
    cellValue: (row: HTMLTableRowElement, at: number) => string;
    choiceText: (row: HTMLTableRowElement, at: number) => string;
    columnIds: string[];
    controlColumn: (at: number) => boolean;
    editKinds: (EditKind | null)[];
    filterKinds: (FilterKind | null)[];
    headerSort: (string | null)[];
    headerTab: (string | null)[];
    headers: HTMLTableCellElement[];
    headersWereHidden: (boolean | 'until-found')[];
    keyColumn: number;
    keyOf: (row: HTMLTableRowElement) => string;
    labelOf: (at: number) => string;
    orders: (string[] | null)[];
};
/** @typedef {import('../events.js').EditKind} EditKind */
/** @typedef {import('../events.js').FilterKind} FilterKind */
/** @typedef {import('./context.js').TableContext} TableContext */
/**
 * What the the columns: headers, labels, kinds and how a cell reads part adds to the table's context.
 *
 * @typedef {{
 *     cellText: (row: HTMLTableRowElement, at: number) => string;
 *     cellValue: (row: HTMLTableRowElement, at: number) => string;
 *     choiceText: (row: HTMLTableRowElement, at: number) => string;
 *     columnIds: string[];
 *     controlColumn: (at: number) => boolean;
 *     editKinds: (EditKind | null)[];
 *     filterKinds: (FilterKind | null)[];
 *     headerSort: (string | null)[];
 *     headerTab: (string | null)[];
 *     headers: HTMLTableCellElement[];
 *     headersWereHidden: (boolean | 'until-found')[];
 *     keyColumn: number;
 *     keyOf: (row: HTMLTableRowElement) => string;
 *     labelOf: (at: number) => string;
 *     orders: (string[] | null)[];
 * }} ColumnsFields
 */
/**
 * The columns: headers, labels, kinds and how a cell reads.
 *
 * @param {TableContext} c
 */
export declare function installColumns(c: TableContext): void;
