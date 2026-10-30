/** The lists this module looks after. */
export declare const STEPLIST_SELECTOR = ".kp-steplist";
/** The attribute that names a step, for setStep(). */
export declare const STEP_ID_ATTRIBUTE = "data-kp-step-id";
/** Fired on the list, bubbling, when a step changed state after attach: `{ item, id, state, previous }`. */
export declare const STEPLIST_EVENT = "kp-steplist-step";
/** The states a step can be in. */
export declare const STEP_STATES: readonly ['pending', 'running', 'done', 'failed', 'skipped', 'current'];
/** How long a status region made just now waits before it speaks, in ms: one put in the page and written in the same breath is often not read. */
export declare const FRESH_REGION_DELAY = 100;
