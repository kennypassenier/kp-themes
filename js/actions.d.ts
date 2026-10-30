export { ROW_ACTIONS, ACTION_LIST, ROW_KEYS, ROW_OPEN_EVENT } from './actions/values.js';
export { rowRoles, mergeRoles } from './actions/roles.js';
export { fitActionColumns } from './actions/fit.js';
export { setRowBusy } from './actions/busy.js';
export { removeRow } from './actions/remove.js';
/**
 * Keep every list's and table's row buttons on shared columns under `root`:
 * fitted now, and again, once per frame, when a row's buttons change, the
 * theme changes or a font arrives (a table's widths are measured).
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export declare function attachActionColumns(root?: ParentNode): () => void;
/**
 * Let the keyboard walk the rows of every list marked `data-kp-row-keys`
 * under `root`: j or ↓ to the next row, k or ↑ to the one before, Home and End to the first and the last, Enter on a row fires
 * `kp-row-open`. Never while typing in a field or with a modifier held, and a button in a row
 * keeps Enter for itself. One row of the list is in the tab order (the
 * last one focused), so Tab reaches the list once.
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export declare function attachRowKeys(root?: ParentNode): () => void;
