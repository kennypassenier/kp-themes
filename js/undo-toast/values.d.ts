/** The toast's own class. */
export declare const UNDO_TOAST = "kp-toast--undo";
/** Fired on the toast region, bubbling, when the action is committed, undone or failed: `{ toast, outcome }`. */
export declare const UNDO_TOAST_EVENT = "kp-undo-toast";
/** How long the toast says "Restored" [ms]. */
export declare const UNDO_RESTORED_MS = 1500;
/** How many toasts stand at once. */
export declare const UNDO_MAX = 3;
/** Milliseconds in a second, for the seconds the clock says. */
export declare const MS_PER_SECOND = 1000;
/** How often the seconds on the toast are written, in ms. */
export declare const CLOCK_TICK_MS = 250;
