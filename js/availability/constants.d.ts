/** The grids this module looks after. */
export declare const AVAILABILITY = "[data-kp-availability]";
/** Fired when a person's answers change: `{ person, keys, answer, previous, answers, settle }`. */
export declare const AVAILABILITY_EVENT = "kp-availability-change";
/** Fired by "Choose these dates": `{ keys }`. */
export declare const AVAILABILITY_CHOOSE_EVENT = "kp-availability-choose";
/** Fired when the organiser switches the columns between periods and days: `{ unit }`. */
export declare const AVAILABILITY_UNIT_EVENT = "kp-availability-unit";
/** Fired by the Retry of a grid that could not be read. */
export declare const AVAILABILITY_RETRY_EVENT = "kp-availability-retry";
/** The answers a cell can hold, in the order a press cycles them. */
export declare const AVAILABILITY_ANSWERS: readonly string[];
/** How long a refused cell keeps its mark [ms]. */
export declare const AVAILABILITY_REFUSED_MS = 3000;
/** How long Undo is offered after a stroke [ms]. */
export declare const AVAILABILITY_UNDO_MS = 6000;
