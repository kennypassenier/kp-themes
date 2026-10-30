export { OPENER, KEYS_SLOT, RUN_EVENT, OPEN_EVENT } from './palette/constants.js';
export { isMac, MATCHERS } from './palette/keys.js';
export { closeOnOutsidePress } from './palette/outside.js';
export { palette } from './palette/api.js';
export { attachPalettes } from './palette/attach.js';
export type Matcher = import('./palette/types.js').Matcher;
export type PaletteHandle = import('./palette/types.js').PaletteHandle;
/** @typedef {import('./palette/types.js').Matcher} Matcher */
/** @typedef {import('./palette/types.js').PaletteHandle} PaletteHandle */
