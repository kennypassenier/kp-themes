/** How long the undo stays offered before the action is committed. An operational knob. */
export declare const UNDO_MS = 6000;
/** Fired when an optimistic action commits — the undo window closed [TH26]. */
export declare const COMMIT_EVENT = "kp-action-commit";
/** Fired when it is undone instead. */
export declare const UNDO_EVENT = "kp-action-undo";
/**
 * Attach the patterns under `root`.
 *
 * @param {ParentNode} root
 * @returns {() => void} detach
 */
export declare function attachPatterns(root?: ParentNode): () => void;
