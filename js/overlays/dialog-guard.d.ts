/** A dialog that guards its form. */
export declare const DIALOG_GUARD = "dialog[data-kp-dialog-guard]:not([data-kp-dialog-guard=\"off\"])";
/** Whether the guarded dialog's form changed since just before its first edit. @param {HTMLDialogElement} dialog */
export declare function dialogChanged(dialog: HTMLDialogElement): boolean;
/** The form counts as saved as it stands now: a close asks nothing until it changes again. @param {HTMLDialogElement} dialog */
export declare function markDialogSaved(dialog: HTMLDialogElement): void;
/** Forget the dialog's edits and its Discard: the next edit starts a new count (a beside drawer that moved to another row). @param {HTMLDialogElement} dialog */
export declare function forgetDialogEdits(dialog: HTMLDialogElement): void;
/**
 * Run `go` at once when the dialog may let its form go, else ask first and run it on Discard.
 * @param {HTMLDialogElement} dialog @param {() => void} go @param {{ value?: string, from?: Element | null }} [options]
 * @returns {boolean} whether `go` ran at once
 */
export declare function whenDialogFree(dialog: HTMLDialogElement, go: () => void, { value, from }?: {
    value?: string;
    from?: Element | null;
}): boolean;
/** Close the dialog the guarded way: a page's own Cancel or ✕. @param {HTMLDialogElement} dialog @param {string} [value] @param {Element | null} [from] */
export declare function requestDialogClose(dialog: HTMLDialogElement, value?: string, from?: Element | null): boolean;
/** The changed open guarded dialogs as units of the page-wide leave check (js/overlays/page-guard.js). @returns {import('./guard-question.js').GuardUnit[]} */
export declare function dialogUnits(): import('./guard-question.js').GuardUnit[];
/**
 * Start the guard for every `data-kp-dialog-guard` dialog on the page (window listeners, in the capture phase, once
 * however often it is called). attachDialogs() calls it; a page that opens its dialogs itself calls it once.
 * @returns {() => void} detach
 */
export declare function attachDialogGuards(): () => void;
