/** @typedef {import('./context.js').TableContext} TableContext */
export type TableContext = import('./context.js').TableContext;
export type LayoutSetupFields = {
    gridMode: boolean;
    gridReadout: HTMLElement | null;
    sizeLabel: HTMLLabelElement | null;
    sizeSelect: HTMLSelectElement | null;
    syncCover: () => void;
};
/**
 * What the the grid mode, the held height, the cover box and the page-size select part adds to the table's context.
 *
 * @typedef {{
 *     gridMode: boolean;
 *     gridReadout: HTMLElement | null;
 *     sizeLabel: HTMLLabelElement | null;
 *     sizeSelect: HTMLSelectElement | null;
 *     syncCover: () => void;
 * }} LayoutSetupFields
 */
/**
 * The grid mode, the held height, the cover box and the page-size select.
 *
 * @param {TableContext} c
 */
export declare function installLayoutSetup(c: TableContext): void;
