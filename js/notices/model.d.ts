export type Notice = import('../notices.js').Notice;
/** @typedef {import('../notices.js').Notice} Notice */
/**
 * A time given as ISO or epoch ms, as epoch ms; null when there is none or it does not parse.
 * @param {number | string | null | undefined} v
 * @returns {number | null}
 */
export declare const toMs: (v: number | string | null | undefined) => number | null;
/**
 * The notices in display order: worst first then newest (`severity`), or newest first (`time`).
 * @param {Notice[]} items
 * @param {'severity' | 'time'} by
 */
export declare function orderNotices(items: Notice[], by: 'severity' | 'time'): import("../notices.js").Notice[];
/**
 * The panel's share of an ordered list: the newest `max` of each severity.
 * @param {Notice[]} ordered
 * @param {string | null} given the `data-kp-panel-max` attribute
 */
export declare function panelSlice(ordered: Notice[], given: string | null): import("../notices.js").Notice[];
