import { blockersOf } from './blockers.js';
export type FocusState = import('./constants.js').FocusState;
export type Lane = import('./blockers.js').Lane;
export type Track = import('./constants.js').Track;
export type TrackAlert = import('./constants.js').TrackAlert;
/** @typedef {import('./constants.js').FocusState} FocusState */
/** @typedef {import('./blockers.js').Lane} Lane */
/** @typedef {import('./constants.js').Track} Track */
/** @typedef {import('./constants.js').TrackAlert} TrackAlert */
/** The band above the step: the tracks asking for the person, worst first, each with the button that goes there. @param {HTMLElement} root */
export declare function renderBand(root: HTMLElement): void;
/**
 * A track asks for the person: it goes on the band and the page hears it.
 * @param {HTMLElement} root @param {Track} track @param {TrackAlert} alert
 */
export declare function raiseAlert(root: HTMLElement, track: Track, alert: TrackAlert): void;
/** A track's alert is answered: the person went there, stepped on, or said got it. @param {HTMLElement} root @param {string} key */
export declare function clearAlert(root: HTMLElement, key: string): void;
/** The words of a waiting step: what it waits for, and for a timer how long. @param {FocusState} state @param {ReturnType<typeof blockersOf>} blocks @param {import('../timer.js').TimerState[]} timers @param {number} index the waiting step */
export declare function waitLine(state: FocusState, blocks: ReturnType<typeof blockersOf>, timers: import('../timer.js').TimerState[], index: number): string;
/** The lane that could use the person next: one whose timer ended, else one that is ready. @param {Lane[]} lanes */
export declare const suggestion: (lanes: Lane[]) => import("./blockers.js").Lane | undefined;
