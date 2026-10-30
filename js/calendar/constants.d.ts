/** A month heatmap: `section.kp-calendar[data-kp-calendar]`. */
export declare const CALENDAR = "[data-kp-calendar]";
/** Fired on the calendar, bubbling, when a day is picked: `detail` `{ date: 'YYYY-MM-DD', source: 'pointer' | 'keyboard' }`. */
export declare const CALENDAR_PICK_EVENT = "kp-calendar-pick";
/** Fired on the calendar, bubbling, when a person moves it to another month: `detail` `{ year, month }` (month 1-12). */
export declare const CALENDAR_MONTH_EVENT = "kp-calendar-month";
/** Fired on a calendar, bubbling, when Retry is pressed on its failed plate (every tone) [r1r2-1019]. */
export declare const CALENDAR_RETRY_EVENT = "kp-calendar-retry";
export type CalendarTone = 'ok' | 'warn' | 'bad' | 'muted' | 'future' | 'before' | 'loading' | 'none' | 'logged' | 'quiet' | 'paused';
export type CalendarDay = {
    tone: CalendarTone;
    count?: string;
    label: string;
};
export type CalendarState = 'loading' | 'ready' | 'empty' | 'error';
export type Strings = import('../strings.js').Strings;
export type CalendarDecorateInfo = {
    kind: 'day' | 'month-prev' | 'month-next' | 'today';
    host: HTMLElement;
    key?: string;
    index?: number;
    label?: string;
    value?: string;
};
export type CalendarOptions = {
    /**
     * the IANA zone that decides which day is today; else the calendar's `data-kp-time-zone`,
     * else `Europe/Brussels`
     */
    timeZone?: string;
    /**
     * the month and weekday names and the first day of the week; else the calendar's
     * `data-kp-locale`, else the nearest `lang` above it
     */
    locale?: string;
    /**
     * 0 (Sunday) to 6; else the calendar's `data-kp-week-starts-on`, else the locale's
     */
    weekStartsOn?: number;
    /**
     * the clock, `Date.now` by default
     */
    now?: () => number;
    /**
     * any of the dictionary's words, for these calendars only
     */
    strings?: Partial<Strings>;
    /**
     * called with every control a calendar
     * builds, each time it builds it, so the page can mark it
     */
    decorate?: (part: HTMLElement, info: CalendarDecorateInfo) => void;
};
/**
 * @typedef {'ok' | 'warn' | 'bad' | 'muted' | 'future' | 'before' | 'loading' | 'none' | 'logged' | 'quiet' | 'paused'} CalendarTone
 * @typedef {{ tone: CalendarTone, count?: string, label: string }} CalendarDay
 *   One day's state: its tone, a short count under the number (`7/9`), and the words a screen reader and the
 *   title say after the date (`7 of 9 services backed up; missing: …`)
 * @typedef {'loading' | 'ready' | 'empty' | 'error'} CalendarState
 * @typedef {import('../strings.js').Strings} Strings
 */
/**
 * What `decorate` is told about the control it is handed: the same shape every kp module's `decorate` takes.
 * `kind` is `month-prev`, `month-next`, `today`, or `day` (`index` its cell, 0-41, `value` its date). `host` is
 * the calendar and `key` its `data-kp-key`.
 * @typedef {{ kind: 'day' | 'month-prev' | 'month-next' | 'today', host: HTMLElement, key?: string, index?: number, label?: string, value?: string }} CalendarDecorateInfo
 */
/**
 * @typedef {object} CalendarOptions
 * @property {string} [timeZone] the IANA zone that decides which day is today; else the calendar's `data-kp-time-zone`,
 *   else `Europe/Brussels`
 * @property {string} [locale] the month and weekday names and the first day of the week; else the calendar's
 *   `data-kp-locale`, else the nearest `lang` above it
 * @property {number} [weekStartsOn] 0 (Sunday) to 6; else the calendar's `data-kp-week-starts-on`, else the locale's
 * @property {() => number} [now] the clock, `Date.now` by default
 * @property {Partial<Strings>} [strings] any of the dictionary's words, for these calendars only
 * @property {(part: HTMLElement, info: CalendarDecorateInfo) => void} [decorate] called with every control a calendar
 *   builds, each time it builds it, so the page can mark it
 */
/** One day in milliseconds. */
export declare const DAY_MS = 86400000;
/** Days in a week, weeks in a grid, and the cells that makes: every month is six rows tall. */
export declare const DAYS_PER_WEEK = 7;
export declare const GRID_WEEKS = 6;
export declare const GRID_CELLS: number;
/** Months in a year; Shift with Page Up or Page Down moves by one. */
export declare const MONTHS_PER_YEAR = 12;
/** A Sunday (4 January 2026): day `firstDay + d` of that week is the d-th weekday column. */
export declare const SUNDAY_REFERENCE: number;
