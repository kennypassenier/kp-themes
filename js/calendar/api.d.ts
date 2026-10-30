/**
 * Every day's state, by `YYYY-MM-DD` (the whole history: a month change
 * needs no new call). Repaints in place; the focus and the selection stay,
 * so a live update never moves a reader. A calendar that was loading is
 * ready from here on.
 * @param {Element} el
 * @param {Record<string, import('./constants.js').CalendarDay>} days
 */
export declare function setCalendarDays(el: Element, days: Record<string, import('./constants.js').CalendarDay>): void;
/**
 * The calendar as a whole: `loading` (every day pulses at its final size),
 * `ready`, `empty` or `error` (no pulse; `words` under the month, an error's
 * after a dot in the destructive colour). The days say `words` too.
 * @param {Element} el
 * @param {import('./constants.js').CalendarState} state
 * @param {string} [words]
 */
export declare function setCalendarState(el: Element, state: import('./constants.js').CalendarState, words?: string): void;
/**
 * Select a day (or none, with null) and show its month; no event, the page
 * asked.
 * @param {Element} el
 * @param {string | null} iso `YYYY-MM-DD`
 */
export declare function calendarSelect(el: Element, iso: string | null): void;
/**
 * Show a month; no event, the page asked.
 * @param {Element} el
 * @param {{ year: number, month: number }} at month 1-12
 */
export declare function calendarMonth(el: Element, { year, month }: {
    year: number;
    month: number;
}): void;
/**
 * The legend under the grid: a swatch and its words per tone, in the order
 * given; none hides it.
 * @param {Element} el
 * @param {{ tone: import('./constants.js').CalendarTone, label: string }[]} entries
 */
export declare function setCalendarLegend(el: Element, entries: {
    tone: import('./constants.js').CalendarTone;
    label: string;
}[]): void;
/**
 * A sentence under the grid, for the page's own words (a calm calendar's "trends count the days that were logged"); an empty
 * text hides it.
 * @param {Element} el
 * @param {string} text
 */
export declare function setCalendarCaption(el: Element, text: string): void;
/**
 * Build every month heatmap under `root`: the month's title between ‹ Prev
 * and Next ›, Today, a line for the state, a six-week grid (one tab stop, the
 * keys of a date grid) and the legend. Today is the day in `timeZone`. Per
 * calendar: `data-kp-calendar-month="YYYY-MM"` (the month shown first, else
 * today's), `data-kp-calendar-selected="YYYY-MM-DD"`, `data-kp-time-zone`,
 * `data-kp-locale`, `data-kp-week-starts-on`, `data-kp-heading-level` (the
 * title's, 2 by default) and `data-kp-key` (handed to `decorate`).
 * Only the calendars below `root` are wired, not `root` itself.
 * @param {ParentNode} [root]
 * @param {import('./constants.js').CalendarOptions} [options]
 * @returns {() => void} detach: the listeners taken away; the calendars keep what they show
 */
export declare function attachCalendars(root?: ParentNode, options?: import('./constants.js').CalendarOptions): () => void;
