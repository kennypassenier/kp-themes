export type ConsoleBlock = import('./types.js').ConsoleBlock;
export type ConsoleRun = import('./types.js').ConsoleRun;
/** @typedef {import('./types.js').ConsoleBlock} ConsoleBlock */
/** @typedef {import('./types.js').ConsoleRun} ConsoleRun */
/**
 * Give a console its `run`.
 * @param {HTMLElement} root @param {ConsoleRun} run
 */
export declare function setConsoleRun(root: HTMLElement, run: ConsoleRun): void;
/**
 * Give the Tab key its completions.
 * @param {HTMLElement} root @param {(prefix: string) => string[] | Promise<string[]>} complete
 */
export declare function setConsoleComplete(root: HTMLElement, complete: (prefix: string) => string[] | Promise<string[]>): void;
/**
 * Fill the context select (the container to run in).
 * @param {HTMLElement} root @param {{ options?: { value: string, label: string }[], value?: string, state?: 'loading' | 'ready', label?: string }} context
 */
export declare function setConsoleContext(root: HTMLElement, context: {
    options?: {
        value: string;
        label: string;
    }[];
    value?: string;
    state?: 'loading' | 'ready';
    label?: string;
}): void;
/**
 * The console's state: `loading`, `error` (the host could not be reached) or `ready`.
 * @param {HTMLElement} root @param {{ state?: 'ready' | 'loading' | 'error', message?: string, hint?: string }} spec
 */
export declare function setConsole(root: HTMLElement, spec: {
    state?: 'ready' | 'loading' | 'error';
    message?: string;
    hint?: string;
}): void;
/** The blocks as they stand. @param {HTMLElement} root @returns {ConsoleBlock[]} */
export declare function consoleBlocks(root: HTMLElement): ConsoleBlock[];
/** Run a line as if it was typed (a "Run again" or a page's own button). @param {HTMLElement} root @param {string} command */
export declare function runConsoleCommand(root: HTMLElement, command: string): Promise<boolean>;
/** Clear the screen; the blocks come back for a while (Undo). @param {HTMLElement} root @param {{ undo?: boolean }} [options] */
export declare function clearConsole(root: HTMLElement, { undo }?: {
    undo?: boolean;
}): void;
/** Whether a block's tool was pressed. @param {HTMLElement} root @param {string} tool @param {ConsoleBlock} b @param {HTMLElement} button */
export declare function useTool(root: HTMLElement, tool: string, b: ConsoleBlock, button: HTMLElement): Promise<void>;
