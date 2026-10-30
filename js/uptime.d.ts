export { UPTIME, UPTIME_PICK_EVENT, UPTIME_OPEN_EVENT, UPTIME_RETRY_EVENT, UPTIME_STATES, UPTIME_COUNT } from './uptime/constants.js';
export { uptimeFigures, uptimePercent, uptimeFit } from './uptime/figures.js';
export { setUptime } from './uptime/draw.js';
export { attachUptimes } from './uptime/attach.js';
export type UptimePeriod = import('./uptime/types.js').UptimePeriod;
export type UptimeSpec = import('./uptime/types.js').UptimeSpec;
export type UptimeFigures = import('./uptime/types.js').UptimeFigures;
/** @typedef {import('./uptime/types.js').UptimePeriod} UptimePeriod */
/** @typedef {import('./uptime/types.js').UptimeSpec} UptimeSpec */
/** @typedef {import('./uptime/types.js').UptimeFigures} UptimeFigures */
