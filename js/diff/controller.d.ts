import { Controller } from '../controller.js';
/** One diff: its state is the registry entry every part reads; the frame a redraw is queued for sits on the instance. */
export declare class DiffControl extends Controller {
    st: import("./types.js").DiffState;
    /** The animation frame a redraw waits for, 0 when none. */
    queued: number;
    /** @param {HTMLElement} host */
    constructor(host: HTMLElement);
    connect(): void;
    /** @param {Event} event */
    onClick(event: Event): void;
    /** Expand or collapse every file that is not that way yet. @param {HTMLButtonElement} button */
    toggleAll(button: HTMLButtonElement): void;
    /** Show or hide one run of unchanged lines, keep the focus on its fold, and say how many lines moved. @param {HTMLElement} fold */
    toggleFold(fold: HTMLElement): void;
    /** Draw the rest of a long file, past its line cap. @param {Element} more */
    showRest(more: Element): void;
}
