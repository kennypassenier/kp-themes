export type DataTableHandle = import('../instance.js').DataTableHandle;
export type FilterValue = import('../events.js').FilterValue;
export type View = import('../events.js').View;
export type DataTableControl = import('./controller.js').DataTableControl;
/** @typedef {import('../instance.js').DataTableHandle} DataTableHandle */
/** @typedef {import('../events.js').FilterValue} FilterValue */
/** @typedef {import('../events.js').View} View */
/** @typedef {import('./controller.js').DataTableControl} DataTableControl */
/**
 * Rows the page added, removed or held are the table's rows at once, without a call to refresh(): the count, the pager and the
 * pages follow the body [b3b4-1019; homelab gap 34, kyu gap 28]. The table's own sort and page moves put the same rows back in
 * another order, which changes nothing here.
 * @param {DataTableControl} t
 */
export declare function watchRows(t: DataTableControl): void;
/** Wire the table again after an option attribute changed, and give the page's handle the view it had. @param {DataTableControl} t */
export declare function wireAgain(t: DataTableControl): void;
