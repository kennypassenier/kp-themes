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
/** On the console: the key that jumps to the prompt from anywhere (a key spec, js/key-spec.js, or the older `:` spelling; `none` or `false` for no key). */
export declare const CONSOLE_FOCUS_KEY_ATTRIBUTE = "data-kp-console-focus-key";
/** The key that jumps to the prompt when the console names none. */
export declare const CONSOLE_FOCUS_KEY = ":";
