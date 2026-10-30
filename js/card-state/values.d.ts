/** The cards this module looks after. */
export declare const CARD_STATE = ".kp-card[data-kp-state]";
/** The four states, in the order a read goes through them. */
export declare const CARD_STATES: readonly ['loading', 'empty', 'error', 'ready'];
/** Fired on the card, bubbling, when its state changed after attach: `{ card, state, previous }`. */
export declare const CARD_STATE_EVENT = "kp-card-state";
/** Fired on the card, bubbling, when its Try again is pressed: `{ card }`. */
export declare const CARD_RETRY_EVENT = "kp-card-retry";
