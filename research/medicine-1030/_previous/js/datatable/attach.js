// Attaches the data tables of a page: its closure, split into parts.
import { paintRemembered } from '../remember.js';
import { datatableState } from './state.js';
import { compare } from './sort.js';
import { defaultFilter, handles } from './instance.js';
import { GRID_PAGE_ROWS, PAGE_SIZES } from './events.js';
import { TABLE } from './selectors.js';
import { installIdentity } from './attach/identity.js';
import { installControls } from './attach/controls.js';
import { installDetails } from './attach/details.js';
import { installColumns } from './attach/columns.js';
import { installModel } from './attach/model.js';
import { installBusy } from './attach/busy.js';
import { installChrome } from './attach/chrome.js';
import { installFilterUi } from './attach/filter-ui.js';
import { installSortSetup } from './attach/sort-setup.js';
import { installLayoutSetup } from './attach/layout-setup.js';
import { installReorder } from './attach/reorder.js';
import { installGroups } from './attach/groups.js';
import { installSync } from './attach/sync.js';
import { installRender } from './attach/render.js';
import { installPills } from './attach/pills.js';
import { installApply } from './attach/apply.js';
import { installServer } from './attach/server.js';
import { installHandlers } from './attach/handlers.js';
import { installExpand } from './attach/expand.js';
import { installSelection } from './attach/selection.js';
import { installEdit } from './attach/edit.js';
import { installWire } from './attach/wire.js';
import { installHandle } from './attach/handle.js';
import { installUnwire } from './attach/unwire.js';
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
export function attachDataTables(
    root = document,
    {
        locale: localeOption,
        compare: compareFn = compare,
        filter: filterFn = defaultFilter,
        debounceMs,
        sortCycle = 'three',
        multiSort = false,
        sortExternal = false,
        filterMode = 'panel',
        // The theme's own button, not the ghost: a ghost is text alone at rest
        // in eleven of the twenty-two themes, so the pager did not read as
        // buttons until hovered [Kenny's note of 2026-09-13, seen in cyberpunk].
        pagerClassName = 'kp-button',
        pageLabel,
        regions = true,
        pageSizes: pageSizesOption = PAGE_SIZES,
        removeGlyph = '×',
        detail: detailFn,
        load: loadFn,
        rowKey: rowKeyFn,
        onEdit,
        expandGlyph = '▸',
        collapseGlyph = '▾',
        gridPageRows = GRID_PAGE_ROWS,
        expandSingle = false,
        decorate,
    } = {},
) {
    /** @type {(() => void)[]} */
    const cleanups = [];
    /** @type {DataTableHandle[]} */
    const created = [];

    /** Does this table sort on several columns? `data-kp-sort-multi` wins over the `multiSort` option. @param {HTMLElement} wrap */
    const sortsSeveral = (wrap) => (wrap.dataset.kpSortMulti === undefined ? multiSort !== false : wrap.dataset.kpSortMulti !== 'false');
    /** The detach of each table this attach wired, so one table can be wired again when an option attribute changes. @type {Map<HTMLElement, () => void>} */
    const unwires = new Map();

    /**
     * Wire one table. Called once per table, and again for the same table when `data-kp-sort-multi` or `data-kp-filter-mode`
     * changes [live-options-1019]: the table is put back to its markup, wired with the new option, and given back the view it
     * had (the same handle object, so a page holding it keeps working).
     * @param {Element} element
     * @param {boolean} [again]  wiring a table again after an option changed: its detach is already in `cleanups`
     */
    const wireTable = (element, again = false) => {
        const wrap = /** @type {HTMLElement} */ (element);
        if (wrap.dataset.kpDatatableAttached !== undefined) return;
        const table = /** @type {HTMLTableElement | null} */ (wrap.querySelector('table'));
        const body = table?.tBodies[0];
        if (table === undefined || table === null || body === undefined) return;
        // The density, the columns and the sort this reader chose last time,
        // when the table asked to be remembered [Kenny, 2026-09-16]. The
        // painter writes them as the markup a server would have rendered —
        // `data-density`, `data-kp-column-hidden`, `aria-sort` — so
        // everything below goes on reading the markup and nothing else moves.
        const memory = paintRemembered(wrap, 'datatable');
        wrap.dataset.kpDatatableAttached = '';
        datatableState.instances += 1;

        const c = /** @type {TableContext} */ (
            /** @type {unknown} */ ({
                wrap,
                regions,
                cleanups,
                localeOption,
                sortExternal,
                debounceMs,
                sortCycle,
                sortsSeveral,
                multiSort,
                expandGlyph,
                collapseGlyph,
                pageSizesOption,
                table,
                body,
                expandSingle,
                decorate,
                detailFn,
                filterMode,
                pageLabel,
                pagerClassName,
                removeGlyph,
                compareFn,
                filterFn,
                rowKeyFn,
                loadFn,
                memory,
                onEdit,
                gridPageRows,
                created,
                unwires,
                wireTable,
                again,
            })
        );
        installIdentity(c);
        installControls(c);
        installDetails(c);
        installColumns(c);
        installModel(c);
        installBusy(c);
        installChrome(c);
        installFilterUi(c);
        installSortSetup(c);
        installLayoutSetup(c);
        installReorder(c);
        installGroups(c);
        installSync(c);
        installRender(c);
        installPills(c);
        installApply(c);
        installServer(c);
        installHandlers(c);
        installExpand(c);
        installSelection(c);
        installEdit(c);
        installWire(c);
        installHandle(c);
        installUnwire(c);
    };
    for (const element of root.querySelectorAll(TABLE)) wireTable(element);

    const detach = () => {
        for (const c of cleanups) c();
    };
    return Object.assign(detach, { handles: created });
}
