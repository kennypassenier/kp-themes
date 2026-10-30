export { RANGE, RANGE_EVENT, RANGE_PRESETS, presetMs, rangeMoment, parseTime, rangeFaults } from './range/values.js';
export type RangeValue = import('./range/core.js').RangeValue;
/** @typedef {import('./range/core.js').RangeValue} RangeValue */
/**
 * The window a picker holds, as ISO strings.
 * @param {Element} el
 * @returns {{ preset: string | null, start: string, end: string } | null}
 */
export declare function rangeOf(el: Element): {
    preset: string | null;
    start: string;
    end: string;
} | null;
/**
 * Set a picker's window from a script, without the event: a preset's key, or a start and an end (Date, ISO or ms).
 * @param {Element} el @param {{ preset?: string, start?: Date | string | number, end?: Date | string | number }} next
 */
export declare function setRange(el: Element, next: {
    preset?: string;
    start?: Date | string | number;
    end?: Date | string | number;
}): void;
/**
 * Wire every range picker under `root`.
 * @param {ParentNode} [root]
 * @param {{ now?: () => number }} [options]
 * @returns {() => void} detach
 */
export declare function attachRanges(root?: ParentNode, options?: {
    now?: () => number;
}): () => void;
