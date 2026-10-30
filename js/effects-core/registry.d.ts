/** Elements this module has started, so a second attach does not start them again [AR34]. */
export declare const started: WeakSet<WeakKey>;
/** Fields whose caret listeners are already bound, so a second attach adds none [G16]. */
export declare const carets: WeakSet<WeakKey>;
/**
 * The documents whose arrival overlay is on screen, each with the headline
 * reveals held until it has gone [scope-86]. Kept per document rather than
 * per attach: a second attach on the same page (js/auto.js over React, the
 * `DecipherText` wrapper) sees the arrival as already seen, but its
 * headline must still wait for the overlay the first attach put up.
 *
 * @type {WeakMap<Document, Set<() => void>>}
 */
export declare const arrivalsOnScreen: WeakMap<Document, Set<() => void>>;
/** The unknown hook values reported on this page, `hook=value`, for the diagnostics [AR44]. */
export declare const unknownReported: Set<any>;
/** What has been reported as unknown on this page, for js/diagnostics.js. */
export declare function unknownEffects(): any[];
