/** @typedef {import('./types.js').ConsoleState} ConsoleState */
export type ConsoleState = import('./types.js').ConsoleState;
/** @type {WeakMap<Element, ConsoleState>} */
export declare const STATE: WeakMap<Element, ConsoleState>;
/** @param {string} className @param {string} [tag] */
export declare const el: (className: string, tag?: string) => HTMLElement;
/** @param {Element} root @param {string} name @param {string} fallback */
export declare const attr: (root: Element, name: string, fallback: string) => string;
/** @param {HTMLElement} root @returns {ConsoleState} */
export declare function stateOf(root: HTMLElement): ConsoleState;
/** Whether a line is one the app wants confirmed. @param {HTMLElement} root @param {string} command */
export declare function needsConfirm(root: HTMLElement, command: string): boolean;
/** @param {number} ms */
export declare function elapsed(ms: number): string;
/** @param {HTMLElement} root @param {string} message */
export declare function say(root: HTMLElement, message: string): void;
