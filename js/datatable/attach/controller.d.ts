import { Controller } from '../../controller.js';
import { TableIdentity } from './identity.js';
import { TableControls } from './controls.js';
import { TableDetails } from './details.js';
import { TableColumns } from './columns.js';
import { TableModel } from './model.js';
import { TableBusy } from './busy.js';
import { TableChrome } from './chrome.js';
import { TableFilterUi } from './filter-ui.js';
import { TableSortSetup } from './sort-setup.js';
import { TableLayoutSetup } from './layout-setup.js';
import { TableReorder } from './reorder.js';
import { TableGroups } from './groups.js';
import { TableSync } from './sync.js';
import { TableRender } from './render.js';
import { TablePills } from './pills.js';
import { TableFilterEditor } from './filter-editor.js';
import { TableApply } from './apply.js';
import { TableServer } from './server.js';
import { TableHandlers } from './handlers.js';
import { TableExpand } from './expand.js';
import { TableSelection } from './selection.js';
import { TableEdit } from './edit.js';
import { TableWrapClick } from './wrap-click.js';
import { TableWire } from './wire.js';
import { TableHandle } from './handle.js';
import { TableUnwire } from './unwire.js';
export type DataTableHandle = import('../instance.js').DataTableHandle;
export type Memory = import('../../remember.js').Memory;
export type DataTableCall = import('./types.js').DataTableCall;
export declare class DataTableControl extends Controller {
    /** The data table's wrapper. */
    wrap: HTMLElement;
    table: HTMLTableElement;
    body: HTMLTableSectionElement;
    /** The attachDataTables() call that wired this table: its handles, its tables and how to wire one again. */
    call: import("./types.js").DataTableCall;
    /** The call's options with their defaults. */
    settings: import("./types.js").DataTableSettings;
    /** What this table remembers; painted when it is wired. @type {Memory | null} */
    memory: Memory | null;
    /** The methods handed out as listeners and callbacks, bound once, so the same function can be removed again. @type {Map<Function, Function>} */
    boundFns: Map<Function, Function>;
    /** @type {TableIdentity} */ identity: TableIdentity;
    /** @type {TableControls} */ controls: TableControls;
    /** @type {TableDetails} */ details: TableDetails;
    /** @type {TableColumns} */ columns: TableColumns;
    /** @type {TableModel} */ model: TableModel;
    /** @type {TableBusy} */ busy: TableBusy;
    /** @type {TableChrome} */ chrome: TableChrome;
    /** @type {TableFilterUi} */ filterUi: TableFilterUi;
    /** @type {TableSortSetup} */ sortSetup: TableSortSetup;
    /** @type {TableLayoutSetup} */ layoutSetup: TableLayoutSetup;
    /** @type {TableReorder} */ reorder: TableReorder;
    /** @type {TableGroups} */ groups: TableGroups;
    /** @type {TableSync} */ sync: TableSync;
    /** @type {TableRender} */ render: TableRender;
    /** @type {TablePills} */ pills: TablePills;
    /** @type {TableFilterEditor} */ filterEditing: TableFilterEditor;
    /** @type {TableApply} */ apply: TableApply;
    /** @type {TableServer} */ server: TableServer;
    /** @type {TableHandlers} */ handlers: TableHandlers;
    /** @type {TableExpand} */ expand: TableExpand;
    /** @type {TableSelection} */ selection: TableSelection;
    /** @type {TableEdit} */ edit: TableEdit;
    /** @type {TableWrapClick} */ wrapClick: TableWrapClick;
    /** @type {TableWire} */ wire: TableWire;
    /** @type {TableHandle} */ handle: TableHandle;
    /** @type {TableUnwire} */ unwire: TableUnwire;
    /** @param {HTMLElement} host @param {Record<string, unknown>} [options] */
    constructor(host: HTMLElement, options?: Record<string, unknown>);
    connect(): void;
    /** Make the parts, each wiring its share of the table, in the order the table is built in. */
    makeParts(): void;
    /**
     * The method `fn` of `part` bound to it, the same function every time for this table, so a listener added with it can be
     * removed with it.
     * @template {(...args: any[]) => any} F
     * @param {object} part
     * @param {F} fn
     * @returns {F}
     */
    bound<F extends (...args: any[]) => any>(part: object, fn: F): F;
    /**
     * Take this table away and wire it again, for a changed option [live-options-1019]: the page's handle leaves the call's list,
     * and the new table's handle is what comes back.
     * @param {DataTableHandle} old
     * @returns {DataTableHandle | undefined}
     */
    rewire(old: DataTableHandle): DataTableHandle | undefined;
}
