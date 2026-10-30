export type TableContext = import('./attach/context.js').TableContext;
export type Compare = import('./sort.js').Compare;
export type DataAnswer = import('./events.js').DataAnswer;
export type DataRequest = import('./events.js').DataRequest;
export type DataTableHandle = import('./instance.js').DataTableHandle;
export type EditDetail = import('./events.js').EditDetail;
export type Filter = import('./sort.js').Filter;
export type DataTableOptions = {
    locale?: string;
    compare?: Compare;
    filter?: Filter;
    /**
     * Default 0, and 300 for a server-backed table.
     */
    debounceMs?: number;
    /**
     * What a plain header press does after descending: 'three' (default) removes the sort again (aria-sort none, the rows in their own order), 'two' turns back to ascending. Per table `data-kp-sort-cycle`.
     */
    sortCycle?: 'two' | 'three';
    /**
     * Shift + click adds a sort key; 'click': a plain click adds it and Shift + click sorts on the column alone. Default false; per table `data-kp-sort-multi` (`="click"`).
     */
    multiSort?: boolean | 'click';
    /**
     * The page sorts: the table draws and announces the sort, the rows keep the order the page renders [kpadopt4]. Default false; per table `data-kp-sort-external`.
     */
    sortExternal?: boolean;
    /**
     * How the header-declared filters are set: a panel of every filter, or "+ Add filter" with one pill per filter. Default panel; per table `data-kp-filter-mode`.
     */
    filterMode?: 'panel' | 'add';
    pagerClassName?: string;
    pageLabel?: (at: number, of: number) => string;
    regions?: boolean;
    pageSizes?: readonly number[];
    removeGlyph?: string;
    /**
     * A row's detail, built when it first opens.
     */
    detail?: (row: HTMLTableRowElement) => Node | string | null | undefined;
    /**
     * The rows of a `data-kp-server` table.
     */
    load?: (request: DataRequest) => Promise<DataAnswer> | DataAnswer;
    /**
     * The key of a row `load` answered as an object. Default the field `data-kp-row-key-field` names, else the key column's `data-kp-field`, else `key`, else `id`.
     */
    rowKey?: (row: Record<string, unknown>) => string;
    /**
     * Hears an edit before it is saved; a string or false (or a promise of one) refuses it.
     */
    onEdit?: (detail: EditDetail) => unknown;
    /**
     * Default ▸.
     */
    expandGlyph?: string;
    /**
     * Default ▾.
     */
    collapseGlyph?: string;
    /**
     * Default 5.
     */
    gridPageRows?: number;
    /**
     * Opening a row closes the one that was open. Default false; per table `data-kp-expand-single`.
     */
    expandSingle?: boolean;
    /**
     * Called with every row toggle, group toggle, "+ Add filter",
     * "Clear the search and filters" button, search box and reorder handle the table builds, each time it builds one, so the consumer can mark it (homelab's Live view marks what it can press) [J2, R-DRIVE].
     */
    decorate?: (part: HTMLElement, info: DataTableDecorateInfo) => void;
};
export type DataTableDecorateInfo = {
    kind: 'row-toggle' | 'row-group-toggle' | 'add-filter' | 'clear-filters' | 'search' | 'reorder-handle';
    host: HTMLElement;
    key?: string;
    index?: number;
    label?: string;
    value?: string;
};
/** @typedef {import('./attach/context.js').TableContext} TableContext */
/** @typedef {import('./sort.js').Compare} Compare */
/** @typedef {import('./events.js').DataAnswer} DataAnswer */
/** @typedef {import('./events.js').DataRequest} DataRequest */
/** @typedef {import('./instance.js').DataTableHandle} DataTableHandle */
/** @typedef {import('./events.js').EditDetail} EditDetail */
/** @typedef {import('./sort.js').Filter} Filter */
/**
 * @typedef {object} DataTableOptions
 * @property {string} [locale]
 * @property {Compare} [compare]
 * @property {Filter} [filter]
 * @property {number} [debounceMs]  Default 0, and 300 for a server-backed table.
 * @property {'two' | 'three'} [sortCycle]  What a plain header press does after descending: 'three' (default) removes the sort again (aria-sort none, the rows in their own order), 'two' turns back to ascending. Per table `data-kp-sort-cycle`.
 * @property {boolean | 'click'} [multiSort]  Shift + click adds a sort key; 'click': a plain click adds it and Shift + click sorts on the column alone. Default false; per table `data-kp-sort-multi` (`="click"`).
 * @property {boolean} [sortExternal]  The page sorts: the table draws and announces the sort, the rows keep the order the page renders [kpadopt4]. Default false; per table `data-kp-sort-external`.
 * @property {'panel' | 'add'} [filterMode]  How the header-declared filters are set: a panel of every filter, or "+ Add filter" with one pill per filter. Default panel; per table `data-kp-filter-mode`.
 * @property {string} [pagerClassName]
 * @property {(at: number, of: number) => string} [pageLabel]
 * @property {boolean} [regions]
 * @property {readonly number[]} [pageSizes]
 * @property {string} [removeGlyph]
 * @property {(row: HTMLTableRowElement) => Node | string | null | undefined} [detail]  A row's detail, built when it first opens.
 * @property {(request: DataRequest) => Promise<DataAnswer> | DataAnswer} [load]  The rows of a `data-kp-server` table.
 * @property {(row: Record<string, unknown>) => string} [rowKey]  The key of a row `load` answered as an object. Default the field `data-kp-row-key-field` names, else the key column's `data-kp-field`, else `key`, else `id`.
 * @property {(detail: EditDetail) => unknown} [onEdit]  Hears an edit before it is saved; a string or false (or a promise of one) refuses it.
 * @property {string} [expandGlyph]   Default ▸.
 * @property {string} [collapseGlyph] Default ▾.
 * @property {number} [gridPageRows]  Default 5.
 * @property {boolean} [expandSingle]  Opening a row closes the one that was open. Default false; per table `data-kp-expand-single`.
 * @property {(part: HTMLElement, info: DataTableDecorateInfo) => void} [decorate]  Called with every row toggle, group toggle, "+ Add filter",
 *   "Clear the search and filters" button, search box and reorder handle the table builds, each time it builds one, so the consumer can mark it (homelab's Live view marks what it can press) [J2, R-DRIVE].
 */
/**
 * What `decorate` is told about the control it is handed: the same shape every kp module's `decorate` takes.
 * `kind` is `row-toggle` (a row's expand button; `value` is the row key) or `row-group-toggle` (a group row's fold button;
 * `value` is the group key); and, since wish-1120 (homelab 66), `add-filter` (the "+ Add filter" button), `clear-filters` ("Clear the
 * search and filters") and `search` (the search box) and `reorder-handle` (a row's drag handle, `value` is the row key).
 * `host` is the data table's wrapper and `key` its `data-kp-key`.
 * @typedef {{ kind: 'row-toggle' | 'row-group-toggle' | 'add-filter' | 'clear-filters' | 'search' | 'reorder-handle', host: HTMLElement, key?: string, index?: number, label?: string, value?: string }} DataTableDecorateInfo
 */
/**
 * Attach every data table under `root`.
 *
 * @param {ParentNode} root
 * @param {DataTableOptions} [options]
 *   Defaults, each also settable per table: `data-kp-locale`, `data-kp-debounce`, `data-kp-sort-cycle`, `data-kp-page-size`,
 *   `data-kp-page-sizes` (`none` for no choice). `regions` upgrades the scroll wrapper to a named region [TH95]; off leaves the
 *   wrapper untouched.
 * @returns {(() => void) & { handles: DataTableHandle[] }} detach
 */
export declare function attachDataTables(root?: ParentNode, { locale: localeOption, compare: compareFn, filter: filterFn, debounceMs, sortCycle, multiSort, sortExternal, filterMode, pagerClassName, pageLabel, regions, pageSizes: pageSizesOption, removeGlyph, detail: detailFn, load: loadFn, rowKey: rowKeyFn, onEdit, expandGlyph, collapseGlyph, gridPageRows, expandSingle, decorate, }?: DataTableOptions): (() => void) & {
    handles: DataTableHandle[];
};
