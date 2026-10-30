export type FocusState = import('./constants.js').FocusState;
export type FocusStep = import('./constants.js').FocusStep;
export type Track = import('./constants.js').Track;
/**
 * What a step waits for and has not got yet: for a step reference that step, for a track reference the first step of it
 * that is not done. A reference nobody carries waits for nothing.
 * @param {FocusState} state @param {number} i @param {import('../timer.js').TimerState[]} timers
 * @returns {{ index: number, whole: boolean, track: Track | undefined }[]}
 */
export declare function blockersOf(state: FocusState, i: number, timers: import('../timer.js').TimerState[]): {
    index: number;
    whole: boolean;
    track: Track | undefined;
}[];
/** The short name of a step: its title, else "Pasta, step 2". @param {FocusState} state @param {number} i */
export declare function stepLabel(state: FocusState, i: number): string;
/** What the blockers are called: a step by its name, a whole track by the track's. @param {FocusState} state @param {ReturnType<typeof blockersOf>} blocks */
export declare const blockerNames: (state: FocusState, blocks: ReturnType<typeof blockersOf>) => string;
export type Lane = {
    track: Track;
    key: string;
    name: string;
    active: boolean;
    status: 'ready' | 'running' | 'paused' | 'waiting' | 'ringing' | 'finished';
    /**
     * the clock the lane shows
     */
    timer: import('../timer.js').TimerState | null;
    blocks: ReturnType<typeof blockersOf>;
};
/**
 * @typedef {object} Lane
 * @property {Track} track
 * @property {string} key
 * @property {string} name
 * @property {boolean} active
 * @property {'ready' | 'running' | 'paused' | 'waiting' | 'ringing' | 'finished'} status
 * @property {import('../timer.js').TimerState | null} timer the clock the lane shows
 * @property {ReturnType<typeof blockersOf>} blocks
 */
/**
 * Where each track stands, now.
 * @param {HTMLElement} root
 * @returns {Lane[]}
 */
export declare function laneSummaries(root: HTMLElement): Lane[];
/** Write text into a part only when it changed. @param {Element} node @param {string} selector @param {string} text */
export declare function setText(node: Element, selector: string, text: string): void;
/** @param {import('../timer.js').TimerState} timer */
export declare const clockOfTimer: (timer: import('../timer.js').TimerState) => string;
