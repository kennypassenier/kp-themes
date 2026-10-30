/**
 * A countdown clock: the time left is the end moment minus now, so nothing drifts.
 * @param {{ seconds: number, now?: () => number, onEnd?: () => void, onChange?: (state: import('./constants.js').CountdownState) => void }} options
 * @returns {import('./constants.js').CountdownClock}
 */
export declare function countdownClock({ seconds, now, onEnd, onChange }: {
    seconds: number;
    now?: () => number;
    onEnd?: () => void;
    onChange?: (state: import('./constants.js').CountdownState) => void;
}): import('./constants.js').CountdownClock;
