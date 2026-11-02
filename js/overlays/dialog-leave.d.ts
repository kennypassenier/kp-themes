/** The event a page can cancel to answer a history move itself. */
export declare const DIALOG_LEAVE_EVENT = "kp-dialog-guard-leave";
/**
 * Start the leave guard.
 * @param {() => HTMLDialogElement | null} held the open guarded dialog whose form changed, if any
 * @param {(dialog: HTMLDialogElement, go: () => void) => void} ask asks the package's question, runs `go` on Discard
 * @returns {() => void} detach
 */
export declare function attachDialogLeave(held: () => HTMLDialogElement | null, ask: (dialog: HTMLDialogElement, go: () => void) => void): () => void;
