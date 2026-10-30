export type ConsoleBlock = import('./types.js').ConsoleBlock;
export type ConsoleChange = import('./types.js').ConsoleChange;
/** @typedef {import('./types.js').ConsoleBlock} ConsoleBlock */
/** @typedef {import('./types.js').ConsoleChange} ConsoleChange */
/** Keep the clock of running blocks ticking and the status words fresh. @param {HTMLElement} root */
export declare function startTicker(root: HTMLElement): void;
/** After a change in the body: stay with the newest block when the reader is following. @param {HTMLElement} root @param {boolean} [force] */
export declare function follow(root: HTMLElement, force?: boolean): void;
/** @param {HTMLElement} root @param {string} id @param {ConsoleChange} change */
export declare function applyChange(root: HTMLElement, id: string, change: ConsoleChange): void;
/** Run one command through the app's `run`. @param {HTMLElement} root @param {string} command @param {{ again?: boolean }} [options] @returns {Promise<boolean>} */
export declare function runCommand(root: HTMLElement, command: string, { again }?: {
    again?: boolean;
}): Promise<boolean>;
/** The line was submitted. @param {HTMLElement} root */
export declare function submit(root: HTMLElement): Promise<void>;
