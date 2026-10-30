/** @typedef {import('./types.js').Timer} Timer */
export type Timer = import('./types.js').Timer;
/** Per list: its timers, in the order they were started. @type {WeakMap<Element, Map<string, Timer>>} */
export declare const LISTS: WeakMap<Element, Map<string, Timer>>;
/** Per list: its ticker. @type {WeakMap<Element, ReturnType<typeof setInterval>>} */
export declare const TICKERS: WeakMap<Element, ReturnType<typeof setInterval>>;
/** Starter presses already handled, when two attached roots hear the same one. @type {WeakSet<Event>} */
export declare const HANDLED: WeakSet<Event>;
/** The mutable values the parts of this module share. */
export declare const timerState: {
    /** @type {AudioContext | null} */
    audio: AudioContext | null;
    serial: number;
};
