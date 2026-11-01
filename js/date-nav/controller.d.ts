import { Controller } from '../controller.js';
export type DateNavRange = import('./constants.js').DateNavRange;
export declare class DateNavControl extends Controller {
    label: HTMLElement;
    steps: HTMLElement;
    prev: HTMLButtonElement;
    today: HTMLButtonElement;
    next: HTMLButtonElement;
    status: HTMLElement;
    /** The day the shown range holds. */
    at: string;
    /** @param {HTMLElement} host @param {Record<string, unknown>} [options] */
    constructor(host: HTMLElement, options?: Record<string, unknown>);
    connect(): void;
    /** Today, as the page's clock (or `data-kp-date-nav-today`) says. */
    todayDay(): string;
    /** The day the markup asks for, else today. */
    dayFromMarkup(): string;
    /** The range shown now. @returns {DateNavRange} */
    range(): DateNavRange;
    /** An attribute changed: the day the markup names (when it names one), the mode and the target are taken as they are now. */
    reread(): void;
    /** The label, the buttons' words and names for the mode, and the current mark. */
    paint(): string;
    /** @param {KeyboardEvent} event */
    onKey(event: KeyboardEvent): void;
    /** A person moved the range: paint, drive the target, say it and fire the event. @param {'prev' | 'next' | 'today'} by */
    move(by: 'prev' | 'next' | 'today'): void;
    /** Write a sentence to the status region, cleared first so the same sentence twice is still heard. @param {string} text */
    say(text: string): void;
    /** Show a day without an event (the page asked). @param {string} day */
    show(day: string): void;
}
