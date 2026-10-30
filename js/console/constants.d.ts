/** The consoles this module looks after. */
export declare const CONSOLE = "[data-kp-console]";
/** Fired before a command goes to the app, cancelable: `{ command, context }`. */
export declare const CONSOLE_RUN_EVENT = "kp-console-run";
/** Fired when a block is made or changes: `{ block }`. */
export declare const CONSOLE_BLOCK_EVENT = "kp-console-block";
/** Fired by the Retry of a console that could not reach its host. */
export declare const CONSOLE_RETRY_EVENT = "kp-console-retry";
/** The states a block can be in. */
export declare const CONSOLE_STATES: readonly string[];
/** The default number of recalled lines. */
export declare const CONSOLE_HISTORY = 50;
/** The most output bytes kept per block. */
export declare const CONSOLE_MAX_BYTES = 262144;
