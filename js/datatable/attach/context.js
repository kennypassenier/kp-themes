// The context the parts of one wired data table share.
/** @typedef {import('./identity.js').IdentityFields} IdentityFields */
/** @typedef {import('./controls.js').ControlsFields} ControlsFields */
/** @typedef {import('./details.js').DetailsFields} DetailsFields */
/** @typedef {import('./columns.js').ColumnsFields} ColumnsFields */
/** @typedef {import('./model.js').ModelFields} ModelFields */
/** @typedef {import('./busy.js').BusyFields} BusyFields */
/** @typedef {import('./chrome.js').ChromeFields} ChromeFields */
/** @typedef {import('./filter-ui.js').FilterUiFields} FilterUiFields */
/** @typedef {import('./sort-setup.js').SortSetupFields} SortSetupFields */
/** @typedef {import('./layout-setup.js').LayoutSetupFields} LayoutSetupFields */
/** @typedef {import('./reorder.js').ReorderFields} ReorderFields */
/** @typedef {import('./groups.js').GroupsFields} GroupsFields */
/** @typedef {import('./sync.js').SyncFields} SyncFields */
/** @typedef {import('./render.js').RenderFields} RenderFields */
/** @typedef {import('./pills.js').PillsFields} PillsFields */
/** @typedef {import('./apply.js').ApplyFields} ApplyFields */
/** @typedef {import('./server.js').ServerFields} ServerFields */
/** @typedef {import('./handlers.js').HandlersFields} HandlersFields */
/** @typedef {import('./expand.js').ExpandFields} ExpandFields */
/** @typedef {import('./selection.js').SelectionFields} SelectionFields */
/** @typedef {import('./edit.js').EditFields} EditFields */
/** @typedef {import('./wire.js').WireFields} WireFields */
/** @typedef {import('../events.js').DataAnswer} DataAnswer */
/** @typedef {import('../events.js').DataRequest} DataRequest */
/** @typedef {import('../attach.js').DataTableDecorateInfo} DataTableDecorateInfo */
/** @typedef {import('../instance.js').DataTableHandle} DataTableHandle */
/** @typedef {import('../events.js').EditDetail} EditDetail */
/** @typedef {import('../../remember.js').Memory} Memory */

/**
 * What exists before any part runs: the arguments, the guards' bindings and what the enclosing function holds.
 *
 * @typedef {{
 *     again: boolean | undefined;
 *     body: HTMLTableSectionElement;
 *     cleanups: (() => void)[];
 *     collapseGlyph: string;
 *     compareFn: (a: string, b: string, kind: string, locale: string) => number;
 *     created: DataTableHandle[];
 *     debounceMs: number | undefined;
 *     decorate: ((part: HTMLElement, info: DataTableDecorateInfo) => void) | undefined;
 *     detailFn: ((row: HTMLTableRowElement) => string | Node | null | undefined) | undefined;
 *     expandGlyph: string;
 *     expandSingle: boolean;
 *     filterFn: (row: HTMLTableRowElement, query: string) => boolean;
 *     filterMode: 'panel' | 'add';
 *     gridPageRows: number;
 *     loadFn: ((request: DataRequest) => DataAnswer | Promise<DataAnswer>) | undefined;
 *     localeOption: string | undefined;
 *     memory: Memory | null;
 *     multiSort: boolean | 'click';
 *     onEdit: ((detail: EditDetail) => unknown) | undefined;
 *     pageLabel: ((at: number, of: number) => string) | undefined;
 *     pageSizesOption: readonly number[];
 *     pagerClassName: string;
 *     regions: boolean;
 *     removeGlyph: string;
 *     rowKeyFn: ((row: Record<string, unknown>) => string) | undefined;
 *     sortCycle: 'two' | 'three';
 *     sortExternal: boolean;
 *     sortsSeveral: (wrap: HTMLElement) => boolean;
 *     table: HTMLTableElement;
 *     unwires: Map<HTMLElement, () => void>;
 *     wireTable: (element: Element, again?: boolean) => void;
 *     wrap: HTMLElement;
 * }} BaseFields
 */

/**
 * What the parts of one wired data table share: its elements, its view state and the functions that draw and change it.
 *
 * @typedef {BaseFields &
 *     IdentityFields &
 *     ControlsFields &
 *     DetailsFields &
 *     ColumnsFields &
 *     ModelFields &
 *     BusyFields &
 *     ChromeFields &
 *     FilterUiFields &
 *     SortSetupFields &
 *     LayoutSetupFields &
 *     ReorderFields &
 *     GroupsFields &
 *     SyncFields &
 *     RenderFields &
 *     PillsFields &
 *     ApplyFields &
 *     ServerFields &
 *     HandlersFields &
 *     ExpandFields &
 *     SelectionFields &
 *     EditFields &
 *     WireFields} TableContext
 */

export {};
