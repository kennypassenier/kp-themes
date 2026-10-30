export { REFRESH, REFRESH_EVENT, REFRESH_INTERVAL_EVENT, REFRESH_DEFAULT, REFRESH_CHOICES } from './auto-refresh/constants.js';
export { refreshOf, refreshDone, setRefreshInterval, setRefreshTitle, attachRefresh } from './auto-refresh/api.js';
export type RefreshHandle = import('./auto-refresh/constants.js').RefreshHandle;
/** @typedef {import('./auto-refresh/constants.js').RefreshHandle} RefreshHandle */
