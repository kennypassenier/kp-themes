export type WeekEvent = import('./types.js').WeekEvent;
export type WeekModel = import('./types.js').WeekModel;
/** @typedef {import('./types.js').WeekEvent} WeekEvent */
/** @typedef {import('./types.js').WeekModel} WeekModel */
/** Two digits. @param {number} n */
export declare const two: (n: number) => string;
/**
 * @template {keyof HTMLElementTagNameMap} K
 * @param {Document} doc
 * @param {K} tag
 * @param {string} [className]
 * @param {string} [text]
 * @returns {HTMLElementTagNameMap[K]}
 */
export declare const make: <K extends keyof HTMLElementTagNameMap>(doc: Document, tag: K, className?: string, text?: string) => HTMLElementTagNameMap[K];
/** @param {number | string} when @returns {number} */
export declare const toMs: (when: number | string) => number;
/** @param {Element} host @returns {string | undefined} */
export declare const keyOf: (host: Element) => string | undefined;
/** @param {WeekModel} c @param {string} iso */
export declare const dayName: (c: WeekModel, iso: string, style?: 'short' | 'long') => string;
/** `17/10` for the head, `17/10/2026` for a name. @param {string} iso @param {boolean} [year] */
export declare const dm: (iso: string, year?: boolean) => string;
/** @param {WeekModel} c @param {WeekEvent} e @param {string} hhmm @param {string} iso */
export declare function nameOf(c: WeekModel, e: WeekEvent, hhmm: string, iso: string): string;
/** The time of day of a moment: `{ hhmm, at }`, `at` a share of the day (0 to 1). @param {WeekModel} c @param {number} ms */
export declare function timeOfDay(c: WeekModel, ms: number): {
    hhmm: string;
    at: number;
};
