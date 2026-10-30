import { Controller } from '../controller.js';
export type CalendarDay = import('./constants.js').CalendarDay;
export type CalendarState = import('./constants.js').CalendarState;
export type CalendarTone = import('./constants.js').CalendarTone;
/** A month heatmap. */
export declare class CalendarController extends Controller {
    el: HTMLElement;
    year: number;
    month: number;
    /** @type {string | null} */
    selected: string | null;
    /** @type {string | null} */
    focus: string | null;
    /** Every day's state by `YYYY-MM-DD`. @type {Record<string, CalendarDay>} */
    days: Record<string, CalendarDay>;
    /** @type {CalendarState} */
    state: CalendarState;
    timeZone: string;
    firstDay: number;
    /** The clock. @type {() => number} */
    now: () => number;
    strings: import("../strings/types.js").Strings;
    /** @type {string[]} */
    months: string[];
    /** @type {import('./constants.js').CalendarOptions['decorate']} */
    decorate: import('./constants.js').CalendarOptions['decorate'];
    /** The month the grid last drew, so only a change replays the arrival. */
    shownMonth: string;
    title: HTMLElement;
    stateLine: HTMLElement;
    grid: HTMLTableElement;
    /** @type {{ td: HTMLTableCellElement, button: HTMLButtonElement, num: HTMLElement, count: HTMLElement, pad: HTMLElement }[]} */
    cells: {
        td: HTMLTableCellElement;
        button: HTMLButtonElement;
        num: HTMLElement;
        count: HTMLElement;
        pad: HTMLElement;
    }[];
    legend: HTMLElement;
    /** @type {HTMLElement | undefined} */
    busyText: HTMLElement | undefined;
    /**
     * @param {HTMLElement} host the calendar
     * @param {import('./constants.js').CalendarOptions} [options]
     */
    constructor(host: HTMLElement, options?: import('./constants.js').CalendarOptions);
    connect(): void;
    /** The legend follows its option: `hide` takes the calm legend away, anything else puts it back. */
    watchOptions(): void;
    /** Move by whole months and say so. @param {number} months */
    step(months: number): void;
    onToday(): void;
    /** The day button an event came from. @param {Event} event */
    dayOf(event: Event): HTMLButtonElement | null;
    /** @param {MouseEvent} event */
    onDay(event: MouseEvent): void;
    /** @param {KeyboardEvent} event */
    onKey(event: KeyboardEvent): void;
    /** @param {number} year @param {number} month @param {boolean} announce */
    showMonth(year: number, month: number, announce: boolean): void;
    /** @param {string} iso */
    buttonFor(iso: string): HTMLButtonElement | null;
    /** @param {string} iso */
    moveFocus(iso: string): void;
    /** @param {string} iso @param {'pointer' | 'keyboard'} source */
    pick(iso: string, source: 'pointer' | 'keyboard'): void;
    /** @param {Record<string, CalendarDay>} days */
    setDays(days: Record<string, CalendarDay>): void;
    /** @param {CalendarState} state @param {string} words */
    setState(state: CalendarState, words: string): void;
    /** @param {string | null} iso */
    select(iso: string | null): void;
    /** @param {{ tone: CalendarTone, label: string }[]} entries */
    setLegend(entries: {
        tone: CalendarTone;
        label: string;
    }[]): void;
}
