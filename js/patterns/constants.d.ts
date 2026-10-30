/** @typedef {import('./types.js').ActionDetail} ActionDetail */
export type ActionDetail = import('./types.js').ActionDetail;
export declare const COPY = "[data-kp-copy]";
export declare const UNDO = "[data-kp-undo-action]";
/** A secret field [kpadopt4]: `.kp-secret[data-kp-secret]`. */
export declare const SECRET = "[data-kp-secret]";
/** How long a shown secret stays before it hides again, in seconds. Per element as `data-kp-secret-ttl` (0: until hidden). */
export declare const SECRET_TTL = 30;
/** The mask's length, in characters. Per element as `data-kp-secret-mask`. */
export declare const SECRET_MASK = 12;
/** Fired on the field, bubbling, when the clipboard was emptied after a copy (`data-kp-secret-clear`) or left alone: `{ cleared, reason }`. */
export declare const SECRET_CLIPBOARD_EVENT = "kp-secret-clipboard";
/** Fired on the field, bubbling, when a secret is shown or hidden: `{ shown, reason }`, reason `press` | `hold` | `timer` | `away` | `call`. */
export declare const SECRET_EVENT = "kp-secret";
/** Fired on the field, bubbling and cancelable, when it needs the value: `{ respond(value), fail(reason), purpose }`; call preventDefault() to answer. */
export declare const SECRET_REQUEST_EVENT = "kp-secret-request";
/** How long the undo stays offered before the action is committed. An operational knob; per element as `data-kp-undo-ms`. */
export declare const UNDO_MS = 6000;
/** How long "copied" stays on the button. Per element as `data-kp-copied-ms`. */
export declare const COPIED_MS = 1500;
/** Fired on the row when an optimistic action commits — the undo window closed [TH26]. Detail: ActionDetail. */
export declare const COMMIT_EVENT = "kp-action-commit";
/** Fired on the row when it is undone instead. Detail: ActionDetail. */
export declare const UNDO_EVENT = "kp-action-undo";
/** How long after a Copy the clipboard is emptied again, in ms [wish-1120, homelab 108]. */
export declare const CLEAR_AFTER_MS = 30000;
/**
 * The clear delay of a field in ms: its attribute (a number of seconds, or a number with ms, s, min or h; 0, off, never,
 * false: none) or the option's value. 0 means never.
 * @param {string | undefined} attribute
 * @param {number | false} fallback
 */
export declare function clearDelay(attribute: string | undefined, fallback: number | false): number;
/** Fired on the copy button after a successful copy: `{ text }`. */
export declare const COPY_EVENT = "kp-copy";
/** Fired on the copy button when the clipboard refused: `{ text, error }`. */
export declare const COPY_FAILED_EVENT = "kp-copy-failed";
