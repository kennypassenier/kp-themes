import { Controller } from '../controller.js';
export type Memory = import('./model.js').Memory;
export type SelectionOptions = import('../selection-bar.js').SelectionOptions;
export declare class SelectionBar extends Controller {
    doc: Document;
    queued: boolean;
    /** @type {Memory} */
    memory: Memory;
    /** @param {HTMLElement} bar @param {SelectionOptions} [options] */
    constructor(bar: HTMLElement, options?: SelectionOptions);
    connect(): void;
    onOptions(): void;
    /** Read the sources again at the end of this task, once for a burst. */
    refresh(): void;
    /** @param {Event} event */
    onSourceEvent(event: Event): void;
    /** @param {MouseEvent} event */
    onClick(event: MouseEvent): void;
    /** Untick all, or empty a bar fed by hand, and say which keys were selected. */
    clear(): void;
    toggleNames(): void;
    /** Take, or give back, the offer for every matching row. @param {boolean} on */
    take(on: boolean): void;
    /** An action button: refused while it is off, else told to the page with what is selected. @param {MouseEvent} event @param {HTMLElement} button */
    act(event: MouseEvent, button: HTMLElement): void;
    /** Esc unticks all while the focus is in the bar or its list. @param {KeyboardEvent} event */
    onKey(event: KeyboardEvent): void;
}
