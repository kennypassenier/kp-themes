export type FocusState = import('./constants.js').FocusState;
export type Track = import('./constants.js').Track;
/** @typedef {import('./constants.js').FocusState} FocusState */
/** @typedef {import('./constants.js').Track} Track */
/** Whether this view shows lanes: two or more tracks, and the option not off. @param {Element} root */
export declare const tracksOn: (root: Element) => boolean;
/** @param {FocusState} state @param {number} i */
export declare const stepKeyOf: (state: FocusState, i: number) => string;
/** The id a step's timer has in the timer list. @param {FocusState} state @param {number} i */
export declare const timerIdOf: (state: FocusState, i: number) => string;
/** @param {FocusState} state @param {number} i */
export declare const trackOfStep: (state: FocusState, i: number) => import("./constants.js").Track | undefined;
/** @param {FocusState} state */
export declare const activeTrack: (state: FocusState) => import("./constants.js").Track;
/**
 * Lay the tracks out of the steps: one per distinct `track`, in the order the steps name them; a step with none is in the shared
 * lane. Where each track stood is kept when the steps are laid again.
 * @param {HTMLElement} root
 */
export declare function layTracks(root: HTMLElement): void;
/** The timers of the list, now. @param {Element} root @returns {import('../timer.js').TimerState[]} */
export declare function timerStates(root: Element): import('../timer.js').TimerState[];
/** @param {import('../timer.js').TimerState | undefined} timer */
export declare const isOpen: (timer: import('../timer.js').TimerState | undefined) => boolean;
/** A step is done when it was passed and its timer, if one was started, has ended. @param {FocusState} state @param {number} i @param {import('../timer.js').TimerState[]} timers */
export declare const stepDone: (state: FocusState, i: number, timers: import('../timer.js').TimerState[]) => boolean;
