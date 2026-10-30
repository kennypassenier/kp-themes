export type Strings = import('../../strings/types.js').Strings;
export type TableContext = import('./context.js').TableContext;
export type GroupsFields = {
    arrange: (rows: HTMLTableRowElement[]) => HTMLTableRowElement[];
    blockOrder: string[];
    collectGroups: () => void;
    departing: Set<HTMLTableRowElement>;
    folded: Set<string>;
    givenIds: Set<HTMLTableRowElement>;
    groupOf: (row: HTMLTableRowElement) => string | null;
    groups: Map<string, HTMLTableRowElement>;
    isFolded: (row: HTMLTableRowElement) => boolean;
    layoutAtAttach: HTMLTableRowElement[] | null;
    placeGroups: () => void;
    preparedGroups: Map<HTMLTableRowElement, {
        span: string | null;
        hidden: boolean;
    }>;
    syncGroups: (s: Strings) => void;
    visibleColumns: () => number;
};
/** @typedef {import('../../strings/types.js').Strings} Strings */
/** @typedef {import('./context.js').TableContext} TableContext */
/**
 * What the row groups: collecting, folding, placing and syncing them part adds to the table's context.
 *
 * @typedef {{
 *     arrange: (rows: HTMLTableRowElement[]) => HTMLTableRowElement[];
 *     blockOrder: string[];
 *     collectGroups: () => void;
 *     departing: Set<HTMLTableRowElement>;
 *     folded: Set<string>;
 *     givenIds: Set<HTMLTableRowElement>;
 *     groupOf: (row: HTMLTableRowElement) => string | null;
 *     groups: Map<string, HTMLTableRowElement>;
 *     isFolded: (row: HTMLTableRowElement) => boolean;
 *     layoutAtAttach: HTMLTableRowElement[] | null;
 *     placeGroups: () => void;
 *     preparedGroups: Map<HTMLTableRowElement, { span: string | null; hidden: boolean; }>;
 *     syncGroups: (s: Strings) => void;
 *     visibleColumns: () => number;
 * }} GroupsFields
 */
/**
 * Row groups: collecting, folding, placing and syncing them.
 *
 * @param {TableContext} c
 */
export declare function installGroups(c: TableContext): void;
