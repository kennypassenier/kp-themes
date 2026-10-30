export type DataTableDecorateInfo = import('../attach.js').DataTableDecorateInfo;
export type TableContext = import('./context.js').TableContext;
export type DetailsFields = {
    builtDetails: Set<HTMLTableRowElement>;
    collectDetails: () => void;
    decoratePart: (part: HTMLElement, info: Omit<DataTableDecorateInfo, 'host' | 'key'>) => void;
    details: Map<HTMLTableRowElement, HTMLTableRowElement>;
    detailsWereHidden: Map<HTMLTableRowElement, boolean>;
    expandable: boolean;
    expanded: Set<string>;
    headRow: HTMLTableRowElement | undefined;
    insertExpandCell: (row: HTMLTableRowElement) => void;
    insertReorderCell: (row: HTMLTableRowElement) => void;
    reorderable: boolean;
    single: boolean;
};
/** @typedef {import('../attach.js').DataTableDecorateInfo} DataTableDecorateInfo */
/** @typedef {import('./context.js').TableContext} TableContext */
/**
 * What the the detail rows, the expand cell and the reorder cell part adds to the table's context.
 *
 * @typedef {{
 *     builtDetails: Set<HTMLTableRowElement>;
 *     collectDetails: () => void;
 *     decoratePart: (part: HTMLElement, info: Omit<DataTableDecorateInfo, 'host' | 'key'>) => void;
 *     details: Map<HTMLTableRowElement, HTMLTableRowElement>;
 *     detailsWereHidden: Map<HTMLTableRowElement, boolean>;
 *     expandable: boolean;
 *     expanded: Set<string>;
 *     headRow: HTMLTableRowElement | undefined;
 *     insertExpandCell: (row: HTMLTableRowElement) => void;
 *     insertReorderCell: (row: HTMLTableRowElement) => void;
 *     reorderable: boolean;
 *     single: boolean;
 * }} DetailsFields
 */
/**
 * The detail rows, the expand cell and the reorder cell.
 *
 * @param {TableContext} c
 */
export declare function installDetails(c: TableContext): void;
