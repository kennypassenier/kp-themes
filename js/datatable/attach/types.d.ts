/** @typedef {import('../events.js').DataAnswer} DataAnswer */
/** @typedef {import('../events.js').DataRequest} DataRequest */
/** @typedef {import('../events.js').EditDetail} EditDetail */
/** @typedef {import('../attach.js').DataTableDecorateInfo} DataTableDecorateInfo */
/** @typedef {import('../instance.js').DataTableHandle} DataTableHandle */
export type DataAnswer = import('../events.js').DataAnswer;
export type DataRequest = import('../events.js').DataRequest;
export type EditDetail = import('../events.js').EditDetail;
export type DataTableDecorateInfo = import('../attach.js').DataTableDecorateInfo;
export type DataTableHandle = import('../instance.js').DataTableHandle;
export type DataTableSettings = {
    localeOption: string | undefined;
    compareFn: (a: string, b: string, kind: string, locale: string) => number;
    filterFn: (row: HTMLTableRowElement, query: string) => boolean;
    debounceMs: number | undefined;
    sortCycle: 'two' | 'three';
    multiSort: boolean | 'click';
    sortExternal: boolean;
    filterMode: 'panel' | 'add';
    pagerClassName: string;
    pageLabel: ((at: number, of: number) => string) | undefined;
    regions: boolean;
    pageSizesOption: readonly number[];
    removeGlyph: string;
    detailFn: ((row: HTMLTableRowElement) => string | Node | null | undefined) | undefined;
    loadFn: ((request: DataRequest) => DataAnswer | Promise<DataAnswer>) | undefined;
    rowKeyFn: ((row: Record<string, unknown>) => string) | undefined;
    onEdit: ((detail: EditDetail) => unknown) | undefined;
    expandGlyph: string;
    collapseGlyph: string;
    gridPageRows: number;
    expandSingle: boolean;
    decorate: ((part: HTMLElement, info: DataTableDecorateInfo) => void) | undefined;
};
export type DataTableCall = {
    settings: DataTableSettings;
    created: DataTableHandle[];
    controls: Map<HTMLElement, import('./controller.js').DataTableControl>;
    sortsSeveral: (wrap: HTMLElement) => boolean;
    wire: (wrap: HTMLElement) => import('./controller.js').DataTableControl | undefined;
};
/**
 * The call's options with their defaults applied; each table may still override some by attribute.
 *
 * @typedef {{
 *     localeOption: string | undefined;
 *     compareFn: (a: string, b: string, kind: string, locale: string) => number;
 *     filterFn: (row: HTMLTableRowElement, query: string) => boolean;
 *     debounceMs: number | undefined;
 *     sortCycle: 'two' | 'three';
 *     multiSort: boolean | 'click';
 *     sortExternal: boolean;
 *     filterMode: 'panel' | 'add';
 *     pagerClassName: string;
 *     pageLabel: ((at: number, of: number) => string) | undefined;
 *     regions: boolean;
 *     pageSizesOption: readonly number[];
 *     removeGlyph: string;
 *     detailFn: ((row: HTMLTableRowElement) => string | Node | null | undefined) | undefined;
 *     loadFn: ((request: DataRequest) => DataAnswer | Promise<DataAnswer>) | undefined;
 *     rowKeyFn: ((row: Record<string, unknown>) => string) | undefined;
 *     onEdit: ((detail: EditDetail) => unknown) | undefined;
 *     expandGlyph: string;
 *     collapseGlyph: string;
 *     gridPageRows: number;
 *     expandSingle: boolean;
 *     decorate: ((part: HTMLElement, info: DataTableDecorateInfo) => void) | undefined;
 * }} DataTableSettings
 */
/**
 * What one attachDataTables() call shares with its tables: the handles it hands back, its tables' controllers in the order they
 * were first wired, and how to wire a table again.
 *
 * @typedef {{
 *     settings: DataTableSettings;
 *     created: DataTableHandle[];
 *     controls: Map<HTMLElement, import('./controller.js').DataTableControl>;
 *     sortsSeveral: (wrap: HTMLElement) => boolean;
 *     wire: (wrap: HTMLElement) => import('./controller.js').DataTableControl | undefined;
 * }} DataTableCall
 */
export {};
