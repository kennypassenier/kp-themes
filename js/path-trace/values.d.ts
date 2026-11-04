/** The traces this module draws. */
export declare const TRACE = "[data-kp-trace]";
/** Fired on the trace when the deciding rule is pressed: `{ rule, hop }`. */
export declare const TRACE_RULE_EVENT = "kp-trace-rule";
/** Fired on the trace when Swap is pressed or S is typed. */
export declare const TRACE_SWAP_EVENT = "kp-trace-swap";
/** Fired on the trace when Retry is pressed. */
export declare const TRACE_RETRY_EVENT = "kp-trace-retry";
/** The hops drawn as placeholders while a trace runs. */
export declare const GHOST_HOPS = 3;
/** The options the trace watches, which draw it again when they change. */
export declare const WATCHED_ATTRIBUTES: string[];
/** On the trace (or the `swapKey` option): the key that asks for a swap of source and target (a key spec, js/key-spec.js; `none` or `false` for no key). */
export declare const TRACE_SWAP_KEY_ATTRIBUTE = "data-kp-trace-swap-key";
/** The key that asks for a swap when the trace names none. */
export declare const TRACE_SWAP_KEY = "s";
