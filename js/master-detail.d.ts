export { MASTER_DETAIL, PANE_SELECT_EVENT, PANE_OPEN_EVENT, PANE_CLOSE_EVENT, PANE_RETRY_EVENT, PANE_WIDTHS, PANE_ASIDE_WIDTH, PANE_FOLD_AT, PANE_ASIDE_FOLD_AT, } from './master-detail/constants.js';
export { masterDetail, setPaneState, selectPane, openPane, closePane, attachMasterDetails } from './master-detail/api.js';
export type PaneState = import('./master-detail/constants.js').PaneState;
export type PaneStateOptions = import('./master-detail/constants.js').PaneStateOptions;
export type MasterDetailHandle = import('./master-detail/constants.js').MasterDetailHandle;
/** @typedef {import('./master-detail/constants.js').PaneState} PaneState */
/** @typedef {import('./master-detail/constants.js').PaneStateOptions} PaneStateOptions */
/** @typedef {import('./master-detail/constants.js').MasterDetailHandle} MasterDetailHandle */
