/** The mutable values the parts of this module share. */
export declare const focusState: {
    serial: number;
    /** The js/timer.js module once it has loaded: the lanes read the timer list through it. */
    timerModule: typeof import('../timer.js') | null;
};
