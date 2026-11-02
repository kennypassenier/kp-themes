export { DAYLINE, DAYLINE_CHANGE_EVENT, DAYLINE_DROP_EVENT, DAYLINE_OPEN_EVENT, DAYLINE_RETRY_EVENT } from './dayline/constants.js';
export type DaylineItem = import('./dayline/constants.js').DaylineItem;
export type DaylineState = import('./dayline/constants.js').DaylineState;
/** @typedef {import('./dayline/constants.js').DaylineItem} DaylineItem */
/** @typedef {import('./dayline/constants.js').DaylineState} DaylineState */
/**
 * Wire every day timeline under `root` (the root itself included). Idempotent.
 * @param {ParentNode} [root]
 * @param {{ now?: () => number }} [options] `now`, the clock in epoch milliseconds (`Date.now` by default)
 * @returns {() => void} detach
 */
export declare function attachDaylines(root?: ParentNode, options?: {
    now?: () => number;
}): () => void;
/**
 * Give a day timeline its items (wired first when it is not yet).
 * @param {Element} el
 * @param {readonly DaylineItem[]} items
 * @param {{ allDay?: readonly DaylineItem[] }} [options] the all-day strip's items
 */
export declare function setDaylineItems(el: Element, items: readonly DaylineItem[], { allDay }?: {
    allDay?: readonly DaylineItem[];
}): void;
/**
 * The day as a whole: `loading` (the busy card over the hours), `ready`, `empty` (the plate, `title` its heading) or `error` (the
 * plate with Try again, `title` and `text` the words).
 * @param {Element} el
 * @param {DaylineState} state
 * @param {string} [title]
 * @param {{ text?: string }} [options]
 */
export declare function setDaylineState(el: Element, state: DaylineState, title?: string, { text }?: {
    text?: string;
}): void;
