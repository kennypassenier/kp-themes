export type Timer = import('./types.js').Timer;
export type TimerState = import('./types.js').TimerState;
/** @typedef {import('./types.js').Timer} Timer */
/** @typedef {import('./types.js').TimerState} TimerState */
/** @param {Timer} timer @param {number} ms */
export declare const clockOf: (timer: Timer, ms: number) => string;
/** @param {Timer} timer */
export declare const leftOf: (timer: Timer) => number;
/** @param {Timer} timer @returns {TimerState} */
export declare const stateOf: (timer: Timer) => TimerState;
/** @param {Element} list @returns {TimerState[]} */
export declare function getTimers(list: Element): TimerState[];
/** @param {string} className @param {string} [tag] */
export declare const el: (className: string, tag?: string) => HTMLElement;
/** @param {Element} list @param {string} name @returns {HTMLElement} */
export declare function part(list: Element, name: string): HTMLElement;
/** @param {Element} list @param {string} message @param {'live' | 'alert'} [where] */
export declare function say(list: Element, message: string, where?: 'live' | 'alert'): void;
/** @param {Element} list */
export declare const listOf: (list: Element) => Map<string, import("./types.js").Timer>;
