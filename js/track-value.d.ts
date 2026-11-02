/** What a tracked control holds now. */
export declare const TRACK_VALUE = "data-kp-track-value";
/** The same in words, for the list of changes. */
export declare const TRACK_TEXT = "data-kp-track-text";
/** The saved value the bar compares with. */
export declare const TRACK_DEFAULT = "data-kp-track-default";
/** The saved value in words, written with it when the control gives words. */
export declare const TRACK_DEFAULT_TEXT = "data-kp-track-default-text";
/** Any tracked control. */
export declare const TRACKED = "[data-kp-track-value]";
/** Fired (bubbling) on a tracked control after a person changed it: `{ value, text }`. */
export declare const TRACK_EVENT = "kp-track-change";
/** Fired on a tracked control when its value is written back from outside (Discard, Revert, Undo, a kept draft): `{ value }`. */
export declare const TRACK_WRITE_EVENT = "kp-track-write";
/** Whether an element is a tracked control. @param {Element} el */
export declare const isTracked: (el: Element) => boolean;
/** What a tracked control holds now ('' when it says nothing yet). @param {Element} el */
export declare const readTrackValue: (el: Element) => string;
/** What a tracked control's value reads as in words. @param {Element} el */
export declare const readTrackText: (el: Element) => string;
/**
 * The outermost tracked control around a node (itself included), or null: a control inside another counts with the outer one.
 * @param {Element} node
 * @returns {HTMLElement | null}
 */
export declare function outerTracked(node: Element): HTMLElement | null;
/**
 * Say what a control holds. With `announce` (the default) `kp-track-change` bubbles from it, as a person's change; without it
 * the attributes move silently (the page set the control, nothing was changed by a person). `initial` also writes the saved
 * value, unless the markup already holds one.
 * @param {HTMLElement} el
 * @param {string} value
 * @param {{ text?: string, announce?: boolean, initial?: boolean }} [options]
 */
export declare function setTrackValue(el: HTMLElement, value: string, { text, announce, initial }?: {
    text?: string;
    announce?: boolean;
    initial?: boolean;
}): void;
/**
 * Write a value back into a tracked control from outside: the attribute moves and `kp-track-write` asks the control to show it.
 * A control that does not listen keeps its look; that is the page's to wire (onTrackWrite).
 * @param {HTMLElement} el
 * @param {string} value
 */
export declare function writeTrackValue(el: HTMLElement, value: string): void;
/**
 * Listen for a value written back into a control (Discard, Revert, Undo). The handler repaints the control from the value and
 * may call setTrackValue(el, value, { text, announce: false }) to give the words back.
 * @param {HTMLElement} el
 * @param {(value: string) => void} handler
 * @returns {() => void} detach
 */
export declare function onTrackWrite(el: HTMLElement, handler: (value: string) => void): () => void;
