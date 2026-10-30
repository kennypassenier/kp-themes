export { DATED, DATED_EVENT, DATED_RETRY_EVENT, DATED_STATES } from './dated-options/constants.js';
export { datedAge, orderDated } from './dated-options/time.js';
export { datedOptions, setDatedOptions, setDatedState, datedValue, attachDatedOptions } from './dated-options/api.js';
export type DatedOption = import('./dated-options/constants.js').DatedOption;
export type DatedState = import('./dated-options/constants.js').DatedState;
export type DatedStateOptions = import('./dated-options/constants.js').DatedStateOptions;
export type DatedHandle = import('./dated-options/constants.js').DatedHandle;
/** @typedef {import('./dated-options/constants.js').DatedOption} DatedOption */
/** @typedef {import('./dated-options/constants.js').DatedState} DatedState */
/** @typedef {import('./dated-options/constants.js').DatedStateOptions} DatedStateOptions */
/** @typedef {import('./dated-options/constants.js').DatedHandle} DatedHandle */
