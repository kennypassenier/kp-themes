/** The event a page can cancel to answer a history move itself. */
export declare const DIALOG_LEAVE_EVENT = "kp-dialog-guard-leave";
/**
 * Start the leave guard.
 * @param {() => HTMLElement | null} held the open guarded dialog or visible guarded region whose form changed, if any
 * @param {(box: HTMLElement, go: () => void) => void} ask asks the package's question, runs `go` on Discard
 * @param {() => HTMLElement | null} [heldOnUnload] the same for a reload or closed tab (also what survives a screen change); `held` when absent
 * @returns {() => void} detach
 */
export declare function attachDialogLeave(held: () => HTMLElement | null, ask: (box: HTMLElement, go: () => void) => void, heldOnUnload?: () => HTMLElement | null): () => void;
