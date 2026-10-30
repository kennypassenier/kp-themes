/** @typedef {import('./turns.js').Arriving} Arriving */
/** @typedef {import('./leave.js').Leaving} Leaving */
export type Arriving = import('./turns.js').Arriving;
export type Leaving = import('./leave.js').Leaving;
/** The mutable values the parts of this module share. */
export declare const motionState: {
    /** How many dialogs, boxes and folds motion watches now, for a test to read. */
    watching: number;
    arriving: Arriving[] | null;
    batch: Leaving[] | null;
};
