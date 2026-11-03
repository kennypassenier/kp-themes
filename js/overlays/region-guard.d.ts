/** A box that guards its form. */
export declare const REGION_GUARD = "[data-kp-region-guard]:not([data-kp-region-guard=\"off\"], dialog)";
/** Whether the region's form changed since just before its first edit. @param {Element} region */
export declare function regionChanged(region: Element): boolean;
/** The form counts as saved as it stands now: leaving asks nothing until it changes again. @param {Element} region */
export declare function markRegionSaved(region: Element): void;
/** Forget the region's edits and its Discard: the next edit starts a new count (an editor that moved to another row). @param {Element} region */
export declare function forgetRegionEdits(region: Element): void;
/** The visible guarded region whose form changed and that is not let go, if any. */
export declare function heldRegion(): HTMLElement | null;
/**
 * Run `go` at once when the region may let its form go, else ask first and run it on Discard.
 * @param {HTMLElement} region @param {() => void} go
 * @returns {boolean} whether `go` ran at once
 */
export declare function whenRegionFree(region: HTMLElement, go: () => void): boolean;
/** The leave guard's question for a held region. @param {HTMLElement} region @param {() => void} go */
export declare function regionLeave(region: HTMLElement, go: () => void): void;
/** The window listeners the region guard needs, in the capture phase. @type {[string, (event: Event) => void][]} */
export declare const REGION_LISTENERS: [string, (event: Event) => void][];
