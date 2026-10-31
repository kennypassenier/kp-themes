import { FocusStepsInput } from './input.js';
/** One focus-steps view; its state stays in the per-view registry (stateOf) the setters read before and after attach. */
export declare class FocusStepsControl extends FocusStepsInput {
    connect(): void;
    /** The view lets go of the speech, the screen and its marks. */
    release(): void;
    /** s, u and n take the same as yesterday, the usual answer and Not today; T and Shift T walk the tracks. */
    registerKeys(): void;
    /** An option changed at run time: draw what it touches. @param {string[]} names */
    onOptions(names: string[]): void;
    /** The timers of the steps: the lanes read them by their ids, an end asks for the person, and the lanes follow the clock. */
    watchTimers(): void;
    /** @param {Event} event */
    onTimer(event: Event): void;
    /** @param {MouseEvent} event */
    onClick(event: MouseEvent): void;
    /**
     * Parallel tracks: a lane, the button that goes to a track, and "Got it" on the band.
     * @param {HTMLButtonElement} button
     * @returns {boolean} whether the press was a track's
     */
    trackButton(button: HTMLButtonElement): boolean;
    /** The plates' Retry and actions, the resume offer, Next, Back and Read aloud. @param {HTMLButtonElement} button */
    flowButton(button: HTMLButtonElement): void;
}
