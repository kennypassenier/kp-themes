export type WeekEvent = import('./types.js').WeekEvent;
export type WeekState = import('./types.js').WeekState;
/** @typedef {import('./types.js').WeekEvent} WeekEvent */
/** @typedef {import('./types.js').WeekState} WeekState */
/**
 * The items of the range. Repaints in place, by id: a pill that is still there
 * keeps its node, its focus and its place in the tab order, so a live update
 * never moves a reader. A week that was loading is ready from here on.
 * @param {Element} el
 * @param {WeekEvent[]} events
 */
export declare function setWeekEvents(el: Element, events: WeekEvent[]): void;
/**
 * The agenda as a whole: `loading` (the data table's busy panel over the empty days), `ready`,
 * `empty` or `error`: the package's state plate over the whole agenda (`words` its heading, in the page's words; `text` its
 * sentence; `art` a picture over the heading), an error with a Retry that fires `kp-week-retry` [state-plates-1019].
 * @param {Element} el
 * @param {WeekState} state
 * @param {string} [words]
 * @param {{ text?: string, art?: Node | string | null }} [plate]
 */
export declare function setWeekState(el: Element, state: WeekState, words?: string, { text, art }?: {
    text?: string;
    art?: Node | string | null;
}): void;
/**
 * Move the range to start on `iso` (`YYYY-MM-DD`); no event, the page asked.
 * The items stay until the page gives the new ones.
 * @param {Element} el
 * @param {string} iso
 */
export declare function setWeekStart(el: Element, iso: string): void;
/**
 * The legend under the agenda: a swatch and its words per series, in the
 * order given; none hides it.
 * @param {Element} el
 * @param {{ series: 1 | 2 | 3 | 4 | 5, label: string }[]} entries
 */
export declare function setWeekLegend(el: Element, entries: {
    series: 1 | 2 | 3 | 4 | 5;
    label: string;
}[]): void;
