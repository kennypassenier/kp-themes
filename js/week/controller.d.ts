import { Controller } from '../controller.js';
export type WeekOptions = import('./types.js').WeekOptions;
/** One week agenda: its model is the `weeks` registry entry the setters read; the last measured size sits on the instance. */
export declare class WeekControl extends Controller {
    /** The agenda's model, the registry entry every part reads. */
    c: import("./types.js").WeekModel;
    /** The grid width and day height last laid out, so a resize that keeps them does nothing. */
    lastSize: string;
    /** @param {HTMLElement} host @param {WeekOptions} [options] */
    constructor(host: HTMLElement, options?: WeekOptions);
    connect(): void;
    /** The pill's height is the CSS's; a change of width can flip grid and list, a font arriving changes the pill. */
    watchSize(): void;
    /** The agenda changed size: lay it out again, or paint it when it crossed between grid and list. */
    onResize(): void;
    /** A press on a pill opens its item. @param {MouseEvent} event */
    onClick(event: MouseEvent): void;
    /** Arrows, Home and End move between the pills of a day, the days, or the upcoming list. @param {KeyboardEvent} event */
    onKey(event: KeyboardEvent): void;
    /** @param {HTMLElement} pill @param {string} key @returns {HTMLElement | undefined} */
    listedFrom(pill: HTMLElement, key: string): HTMLElement | undefined;
    /** @param {HTMLElement} pill @param {string} key @returns {HTMLElement | undefined} */
    dayFrom(pill: HTMLElement, key: string): HTMLElement | undefined;
    /**
     * The pill nearest in time of day in the next day that has any, in the direction of `step`.
     * @param {HTMLElement} pill @param {number} colIndex @param {number} step
     * @returns {HTMLElement | undefined}
     */
    sideways(pill: HTMLElement, colIndex: number, step: number): HTMLElement | undefined;
    /** Previous, Next and Today move the window and tell the page. @param {Event} event */
    onNav(event: Event): void;
}
