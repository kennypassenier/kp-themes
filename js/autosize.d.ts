export { AUTOSIZE, AUTOSIZE_EVENT, AUTOSIZE_MAX_LINES, AUTOSIZE_MIN_LINES, AUTOSIZE_STATES } from './autosize/constants.js';
export { lineHeightOf, fitTextarea, cssAutosizeSupported } from './autosize/fit.js';
export { autosize, refreshAutosize, setAutosizeState, attachAutosize } from './autosize/api.js';
export type FitOptions = import('./autosize/constants.js').FitOptions;
export type AutosizeOptions = import('./autosize/constants.js').AutosizeOptions;
export type AutosizeHandle = import('./autosize/constants.js').AutosizeHandle;
/** @typedef {import('./autosize/constants.js').FitOptions} FitOptions */
/** @typedef {import('./autosize/constants.js').AutosizeOptions} AutosizeOptions */
/** @typedef {import('./autosize/constants.js').AutosizeHandle} AutosizeHandle */
