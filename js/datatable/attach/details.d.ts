export type DataTableDecorateInfo = import('../attach.js').DataTableDecorateInfo;
export type DataTableControl = import('./controller.js').DataTableControl;
/** @typedef {import('../attach.js').DataTableDecorateInfo} DataTableDecorateInfo */
/** @typedef {import('./controller.js').DataTableControl} DataTableControl */
export declare class TableDetails {
    /** The table this part belongs to. */
    t: import("./controller.js").DataTableControl;
    headRow: HTMLTableRowElement | undefined;
    /** Each row's detail row. @type {Map<HTMLTableRowElement, HTMLTableRowElement>} */
    details: Map<HTMLTableRowElement, HTMLTableRowElement>;
    /** Detail rows as the markup had them, for detach. @type {Map<HTMLTableRowElement, boolean>} */
    detailsWereHidden: Map<HTMLTableRowElement, boolean>;
    /** @type {Set<HTMLTableRowElement>} */
    builtDetails: Set<HTMLTableRowElement>;
    expandable: boolean;
    /** One row open at a time [J2]: opening one closes the one that was open. */
    single: boolean;
    /** Rows open for their details, by key. @type {Set<string>} */
    expanded: Set<string>;
    reorderable: boolean;
    /** @param {DataTableControl} t */
    constructor(t: DataTableControl);
    collectDetails(): void;
    /** The consumer's mark on a control this table built [J2, R-DRIVE]. @param {HTMLElement} part @param {Omit<DataTableDecorateInfo, 'host' | 'key'>} info */
    decoratePart(part: HTMLElement, info: Omit<DataTableDecorateInfo, 'host' | 'key'>): void;
    /** The handle's cell, first in the row (before the expand toggle). @param {HTMLTableRowElement} row */
    insertReorderCell(row: HTMLTableRowElement): void;
    /** The toggle's cell, first in the row, so the row's cells line up with the headers. @param {HTMLTableRowElement} row */
    insertExpandCell(row: HTMLTableRowElement): void;
}
