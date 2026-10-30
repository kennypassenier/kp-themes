import { Controller } from '../controller.js';
/** One timer list: draws it, takes the presses of its cards and counts again when the page comes back. */
export declare class TimerList extends Controller {
    connect(): void;
    /** The clock stops and every ring on the list falls silent. */
    release(): void;
    /** Back on screen: show the time that really is left. */
    onVisible(): void;
    /** A press on a card's button: pause or resume, stop, add a minute, or remove. @param {MouseEvent} event */
    onClick(event: MouseEvent): void;
}
/** The starters anywhere under one root: one listener for all, and the mark that says which starter's timer runs. */
export declare class TimerStarters extends Controller {
    connect(): void;
    /** A press on a starter: start its timer, or point at the one already running. @param {MouseEvent} event */
    onStart(event: MouseEvent): void;
    /** A timer ended: its starter is free again. @param {Event} event */
    onDone(event: Event): void;
}
