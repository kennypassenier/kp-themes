export { WEEKDAYS, WEEKDAYS_EVENT, WEEKDAY_PRESETS } from './weekdays/values.js';
export { dayNumber, dayNames } from './weekdays/names.js';
export { joinWords, weekdaySummary, monthSummary } from './weekdays/summary.js';
export type WeekdaysHandle = {
    element: HTMLElement;
    /**
     * the picked days, in day order
     */
    values: () => (number | 'last')[];
    /**
     * replace the picked days (no event)
     */
    set: (values: readonly (number | string)[]) => void;
    /**
     * the picked days in words
     */
    summary: () => string;
    /**
     * whether at least `min` days are picked
     */
    valid: () => boolean;
};
/**
 * @typedef {object} WeekdaysHandle
 * @property {HTMLElement} element
 * @property {() => (number | 'last')[]} values the picked days, in day order
 * @property {(values: readonly (number | string)[]) => void} set replace the picked days (no event)
 * @property {() => string} summary the picked days in words
 * @property {() => boolean} valid whether at least `min` days are picked
 */
/**
 * The handle of an attached picker.
 * @param {Element} element
 * @returns {WeekdaysHandle | null}
 */
export declare function weekdays(element: Element): WeekdaysHandle | null;
/**
 * The days a picker holds.
 * @param {Element} element
 * @returns {(number | 'last')[]}
 */
export declare function weekdaysOf(element: Element): (number | 'last')[];
/**
 * Set the days of a picker from a script, without the event.
 * @param {Element} element @param {readonly (number | string)[]} values
 */
export declare function setWeekdays(element: Element, values: readonly (number | string)[]): void;
/**
 * Wire every weekday picker under `root`.
 * @param {ParentNode} [root]
 * @param {{ locale?: string, weekStartsOn?: number }} [options] defaults; per picker `data-kp-week-starts-on`
 * @returns {() => void} detach
 */
export declare function attachWeekdays(root?: ParentNode, options?: {
    locale?: string;
    weekStartsOn?: number;
}): () => void;
