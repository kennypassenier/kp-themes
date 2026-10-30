/** The lists this module looks after. */
export declare const CLAIM = "[data-kp-checklist-claim]";
/** Fired on the list, bubbling and cancelable, when somebody takes an item, lets go or is assigned. */
export declare const CLAIM_EVENT = "kp-claim-change";
/** Fired when the filter chip changes: `{ filter }`. */
export declare const CLAIM_FILTER_EVENT = "kp-claim-filter";
/** Fired when the Retry of a failed list is pressed. */
export declare const CLAIM_RETRY_EVENT = "kp-claim-retry";
/** The filters of the chip group. */
export declare const CLAIM_FILTERS: readonly string[];
/** How long a refused row keeps its mark [ms]. */
export declare const CLAIM_REFUSED_MS = 3000;
/** How long Undo is offered after a release [ms]. */
export declare const CLAIM_UNDO_MS = 6000;
