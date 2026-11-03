export type GuardUnit = {
    /**
     * the box or editor; the question opens next to the focused one, else the first
     */
    el: HTMLElement;
    /**
     * saves it now; afterwards the unit says whether that worked
     */
    flush?: () => Promise<unknown>;
    /**
     * Discard was chosen: do not hold this unit again
     */
    release: () => void;
};
/** Whether a question is on screen. */
export declare function questionOpen(): boolean;
/** Runs every unit's save; a save that fails is logged and the question asks. @param {GuardUnit[]} units */
export declare function flushUnits(units: GuardUnit[]): Promise<unknown[]>;
/**
 * Run `go` at once when no unit holds unsaved work; else let the units save themselves (when any can), and ask once if
 * something is still unsaved. Discard releases every unit and runs `go`.
 * @param {() => GuardUnit[]} units the units that hold unsaved work right now
 * @param {() => void} go
 * @returns {boolean} whether `go` ran at once
 */
export declare function leaveUnits(units: () => GuardUnit[], go: () => void): boolean;
