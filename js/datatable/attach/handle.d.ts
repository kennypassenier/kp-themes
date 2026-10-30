export type DataTableHandle = import('../instance.js').DataTableHandle;
export type FilterValue = import('../events.js').FilterValue;
export type TableContext = import('./context.js').TableContext;
/** @typedef {import('../instance.js').DataTableHandle} DataTableHandle */
/** @typedef {import('../events.js').FilterValue} FilterValue */
/** @typedef {import('./context.js').TableContext} TableContext */
/**
 * The handle a page gets back from the table.
 *
 * @param {TableContext} c
 */
export declare function installHandle(c: TableContext): void;
