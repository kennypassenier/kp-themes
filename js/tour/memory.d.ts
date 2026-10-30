/** The slot a tour's memory is kept under. */
export declare const TOUR_SLOT = "done";
/**
 * The tour's memory, through js/remember.js: component `tour`, the tour's
 * name as the element's name. A tour has no element of its own, so a
 * stand-in answers to the name; it is never in a document, so two tours of
 * one name never refuse each other.
 * @param {string} name
 * @param {Storage | null} [storage]
 */
export declare function tourMemory(name: string, storage?: Storage | null): import("../remember.js").Memory | null;
/**
 * The storage key a finished tour writes, as js/remember.js composes it:
 * `kp-remember:tour:<name>:done` with the default prefix.
 * @param {string} name
 * @returns {string}
 */
export declare const tourMemoryKey: (name: string) => string;
/**
 * Whether the tour of this name was taken before (finished or skipped).
 * @param {string} name
 * @param {{ storage?: Storage | null }} [options]
 * @returns {boolean}
 */
export declare const tourRemembered: (name: string, { storage }?: {
    storage?: Storage | null;
}) => boolean;
/**
 * Forget that the tour of this name was taken, so it starts by itself again.
 * @param {string} name
 * @param {{ storage?: Storage | null }} [options]
 */
export declare const forgetTour: (name: string, { storage }?: {
    storage?: Storage | null;
}) => void | undefined;
