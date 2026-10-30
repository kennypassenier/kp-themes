export type StatusState = import('./state.js').StatusState;
/** @typedef {import('./state.js').StatusState} StatusState */
/** @param {Element} list @param {string} text */
export declare function sayText(list: Element, text: string): void;
/**
 * The list's status region, made on first need (right after the list).
 * @param {Element} list
 * @returns {HTMLElement}
 */
export declare function regionOf(list: Element): HTMLElement;
/**
 * Say something through the list's region; a burst in one tick is one message.
 * @param {Element} list
 * @param {{ label: string, state: StatusState, detail: string }} entry
 */
export declare function say(list: Element, entry: {
    label: string;
    state: StatusState;
    detail: string;
}): void;
