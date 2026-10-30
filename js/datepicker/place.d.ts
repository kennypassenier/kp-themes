/**
 * Keep an open calendar inside the window [Kenny's note of 2026-09-13]. The
 * panel hangs from the picker's inline start, so a picker near the inline
 * end of the window — the last filter of a data table — opened its calendar
 * past the edge: measured at x=1374 of a 1280px page. When it would cross
 * that edge it hangs from the picker's inline end instead and opens toward
 * the inline start; when that is worse (a picker narrower than its calendar
 * in a window narrower than both), the side that overflows less is kept.
 * `data-kp-align="end"` says which side was taken. A panel in the top layer
 * (js/top-layer.js) is placed in window coordinates under its picker; one
 * that is not keeps hanging from the picker and only the side changes.
 *
 * @param {HTMLElement} panel an open `.kp-datepicker__panel`
 */
export declare function placeDatePanel(panel: HTMLElement): void;
/**
 * Open a calendar above every container it sits in (js/top-layer.js: a
 * card's clip-path cut every day of it away in four themes), inside the
 * window, and following its field while it is open. Both channels open
 * with it. Returns the way back down.
 *
 * @param {HTMLElement} panel an open `.kp-datepicker__panel`
 * @returns {() => void} lower
 */
export declare function raiseDatePanel(panel: HTMLElement): () => void;
/**
 * The size of the day view, to hold while the month or year grid shows, so
 * the panel does not jump under the pointer. Read as the computed sizes, in
 * each element's own box-sizing, so writing them back as minimums lands on
 * the same box whatever a register set.
 *
 * @param {HTMLElement} panel an open `.kp-datepicker__panel` showing days
 * @returns {{ inline: string, block: string, gridInline: string, gridBlock: string }}
 */
export declare function measureDateView(panel: HTMLElement): {
    inline: string;
    block: string;
    gridInline: string;
    gridBlock: string;
};
