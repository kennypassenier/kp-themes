export { CONSOLE, CONSOLE_RUN_EVENT, CONSOLE_BLOCK_EVENT, CONSOLE_RETRY_EVENT, CONSOLE_STATES, CONSOLE_HISTORY, CONSOLE_MAX_BYTES, } from './console/constants.js';
export { setConsoleRun, setConsoleComplete, setConsoleContext, setConsole, consoleBlocks, runConsoleCommand, clearConsole } from './console/api.js';
export { attachConsoles } from './console/attach.js';
export type ConsoleChange = import('./console/types.js').ConsoleChange;
export type ConsoleJob = import('./console/types.js').ConsoleJob;
export type ConsoleRun = import('./console/types.js').ConsoleRun;
export type ConsoleBlock = import('./console/types.js').ConsoleBlock;
export type ConsoleState = import('./console/types.js').ConsoleState;
/** @typedef {import('./console/types.js').ConsoleChange} ConsoleChange */
/** @typedef {import('./console/types.js').ConsoleJob} ConsoleJob */
/** @typedef {import('./console/types.js').ConsoleRun} ConsoleRun */
/** @typedef {import('./console/types.js').ConsoleBlock} ConsoleBlock */
/** @typedef {import('./console/types.js').ConsoleState} ConsoleState */
