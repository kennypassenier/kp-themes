export { SIDENAV_TOGGLE_EVENT, SIDENAV_SLIM_EVENT, SIDENAV_MODE_EVENT, SIDENAV_PREVENTED_EVENT, SIDENAV_OWNED, SIDENAV_RESIZER, SIDENAV_TAB, SIDENAV_LAUNCHER, } from './sidenav/constants.js';
export { OPTIONS } from './sidenav/options.js';
export { parseChord, sidenavOf } from './sidenav/helpers.js';
export { attachSidenavs } from './sidenav/attach.js';
export type Sidenav = import('./sidenav/helpers.js').Sidenav;
/** @typedef {import('./sidenav/helpers.js').Sidenav} Sidenav */
