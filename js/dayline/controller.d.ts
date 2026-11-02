import { Controller } from '../controller.js';
import { KeyWalk } from './move.js';
export type DaylineItem = import('./constants.js').DaylineItem;
export type Placed = import('./constants.js').Placed;
export type DaylineState = import('./constants.js').DaylineState;
/** @typedef {import('./constants.js').DaylineItem} DaylineItem */
/** @typedef {import('./constants.js').Placed} Placed */
/** @typedef {import('./constants.js').DaylineState} DaylineState */
export declare class DaylineControl extends Controller {
    parts: {
        allDay: HTMLDivElement;
        allDayName: HTMLParagraphElement;
        allDayList: HTMLUListElement;
        grid: HTMLDivElement;
        scroll: HTMLDivElement;
        plate: HTMLDivElement;
        frame: HTMLDivElement;
        now: HTMLDivElement;
        nowLabel: HTMLSpanElement;
        drop: HTMLDivElement;
        status: HTMLSpanElement;
    };
    /** @type {DaylineItem[]} */
    items: DaylineItem[];
    /** The all-day strip's items; null while the page gave none (the strip then takes no room). @type {DaylineItem[] | null} */
    allDay: DaylineItem[] | null;
    /** @type {Map<string, Placed>} */
    placed: Map<string, Placed>;
    /** The state and what its card and plate draw on. @type {import('./states.js').StateParts} */
    st: import('./states.js').StateParts;
    /** Whether the person has scrolled or worked in the box: from then on it is never scrolled for them. */
    touched: boolean;
    clock: () => number;
    walk: KeyWalk;
    /** @param {HTMLElement} host @param {{ now?: () => number }} [options] */
    constructor(host: HTMLElement, options?: {
        now?: () => number;
    });
    connect(): void;
    /** The grid as the markup asks for it now. */
    grid(): {
        startHour: number;
        step: number;
        hours: number;
        perHour: number;
        rowsTotal: number;
        total: number;
    };
    /** How long a finger holds a block or a source still before it lifts [ms]. */
    holdMs(): number;
    /** @param {number} row */
    clockOfRow(row: number): string;
    /** What a move needs from this day. @returns {import('./move.js').MoveHost} */
    mover(): import('./move.js').MoveHost;
    /** @param {readonly DaylineItem[]} items @param {readonly DaylineItem[] | undefined} allDay */
    setItems(items: readonly DaylineItem[], allDay: readonly DaylineItem[] | undefined): void;
    /** @param {DaylineState} state @param {string} words @param {string} text */
    setState(state: DaylineState, words: string, text: string): void;
    /** Draw the grid, the blocks, the strip and the now line; the focused handle keeps the focus. */
    draw(): void;
    paintStates(): void;
    /** The clock's minute of the day, from the frozen attribute or the clock. */
    nowClock(): number;
    paintNow(): void;
    /** Until the person works in it, the box is scrolled so the now line stands a quarter from the top (or the first item does). */
    reveal(): void;
    /** Stand a block on a row (a step of a move) and, when asked, say where. @param {Placed} p @param {number} row @param {boolean} say */
    show(p: Placed, row: number, say: boolean): void;
    /** A finished move: the item takes its new start, the lanes are laid again, the event fires. @param {Placed} p @param {number} row @param {'pointer' | 'keyboard'} source */
    commit(p: Placed, row: number, source: 'pointer' | 'keyboard'): void;
    /** @param {Placed} p */
    putBack(p: Placed): void;
    /** A press on an item's body. @param {MouseEvent} event */
    open(event: MouseEvent): void;
    /** Write a sentence to the status line, cleared first so the same sentence twice is still heard. @param {string} text */
    say(text: string): void;
}
