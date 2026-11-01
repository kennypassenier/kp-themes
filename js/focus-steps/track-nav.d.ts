/**
 * Go to a track: its own place, its own step. The event tells the page.
 * @param {HTMLElement} root @param {string} key @param {'tap' | 'key' | 'script' | 'attention' | 'auto'} reason
 * @returns {boolean} whether it moved
 */
export declare function switchTrack(root: HTMLElement, key: string, reason: 'tap' | 'key' | 'script' | 'attention' | 'auto'): boolean;
/** Go to the next or previous track. @param {HTMLElement} root @param {1 | -1} by @param {'key' | 'tap'} [reason] */
export declare function stepTrack(root: HTMLElement, by: 1 | -1, reason?: 'key' | 'tap'): boolean;
/**
 * The tracks changed under the lanes (a timer, a step passed): read them again, ask for the person where a track can go on, draw
 * the lanes, and draw the step again when its lock lifted or fell.
 * @param {HTMLElement} root
 */
export declare function recompute(root: HTMLElement): void;
/** The step's timer button and the waiting plate follow the clock. @param {HTMLElement} root @param {import('../timer.js').TimerState[]} timers */
export declare function paintLive(root: HTMLElement, timers: import('../timer.js').TimerState[]): void;
/**
 * A step timer ended: its track asks for the person.
 * @param {HTMLElement} root @param {number} i the step @param {import('../timer.js').TimerState} timer
 */
export declare function timerEnded(root: HTMLElement, i: number, timer: import('../timer.js').TimerState): void;
/** Lay the tracks, find where the person is, and bring in the timer list the lanes read. @param {HTMLElement} root @param {number} start */
export declare function startTracks(root: HTMLElement, start: number): void;
