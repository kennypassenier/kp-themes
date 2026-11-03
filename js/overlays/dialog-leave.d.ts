/** The event a page can cancel to answer a history move itself. */
export declare const DIALOG_LEAVE_EVENT = "kp-dialog-guard-leave";
/**
 * Start the leave guard.
 * @param {() => HTMLElement | null} held the open guarded dialog or visible guarded region whose form changed, if any
 * @param {(box: HTMLElement, go: () => void) => void} ask asks the package's question, runs `go` on Discard
 * @returns {() => void} detach
 */
export declare function attachDialogLeave(held: () => HTMLElement | null, ask: (box: HTMLElement, go: () => void) => void): () => void;
