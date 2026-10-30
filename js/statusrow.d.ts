export { STATUS_LIST, STATUS_ID_ATTRIBUTE, STATUS_EVENT, STATUS_RETRY_EVENT, STATUS_RESUME_EVENT, STATUS_PAUSE_EVENT, STATUS_UNDO_EVENT, STATUS_STATES, CALM_STATUS_STATES, } from './statusrow/state.js';
export { buildStatusList, settleToday, setStatus, countStatus, setTodayState } from './statusrow/list.js';
export type StatusState = import('./statusrow/state.js').StatusState;
export type StatusRow = import('./statusrow/state.js').StatusRow;
/** @typedef {import('./statusrow/state.js').StatusState} StatusState */
/** @typedef {import('./statusrow/state.js').StatusRow} StatusRow */
/**
 * Sync every `.kp-statuslist` under `root`, follow `data-state` changes later
 * and turn a press on a Retry into `kp-status-retry`. A list rendered after
 * this ran is attached by calling it on that subtree.
 *
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export declare function attachStatusLists(root?: ParentNode): () => void;
