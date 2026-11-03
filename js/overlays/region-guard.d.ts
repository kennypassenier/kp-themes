/** A box that guards its form. */
export declare const REGION_GUARD = "[data-kp-region-guard]:not([data-kp-region-guard=\"off\"], dialog)";
/** Whether the region's form changed since just before its first edit. @param {Element} region */
export declare function regionChanged(region: Element): boolean;
/**
 * The form counts as saved as it stands now: leaving asks nothing until it changes again. With `field`, only that field is
 * saved (an autosave): the region is changed while any field differs from what it held when last saved.
 * @param {Element} region @param {Element} [field]
 */
export declare function markRegionSaved(region: Element, field?: Element): undefined;
/** Name the async save that runs before a leave question; returns the way to remove it. @param {Element} region @param {() => Promise<unknown>} flush */
export declare function setRegionFlush(region: Element, flush: () => Promise<unknown>): () => undefined;
/** Forget the region's edits and its Discard: the next edit starts a new count (an editor that moved to another row). @param {Element} region */
export declare function forgetRegionEdits(region: Element): void;
/**
 * Everything a leave would lose here, as units: the visible changed guarded regions, and the registered editors.
 * @param {{ reload?: boolean }} [options] `reload`: also the editors that survive a screen change
 */
export declare function regionUnits(options?: {
    reload?: boolean;
}): import("./guard-question.js").GuardUnit[];
/** The first guarded region or editor that holds unsaved work, if any. @param {{ reload?: boolean }} [options] */
export declare function heldRegion(options?: {
    reload?: boolean;
}): HTMLElement;
/**
 * Run `go` at once when the region may let its form go, else save it (its flush hook), ask if it is still unsaved, and run it
 * on Discard.
 * @param {HTMLElement} region @param {() => void} go
 * @returns {boolean} whether `go` ran at once
 */
export declare function whenRegionFree(region: HTMLElement, go: () => void): boolean;
/** The leave guard's question (Back): once for every changed region and editor. @param {HTMLElement} _box @param {() => void} go */
export declare function regionLeave(_box: HTMLElement, go: () => void): void;
/** The window listeners the region guard needs, in the capture phase. @type {[string, (event: Event) => void][]} */
export declare const REGION_LISTENERS: [string, (event: Event) => void][];
