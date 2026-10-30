import { TourCore } from './core.js';
export declare class TourRun extends TourCore {
    /** Whether the tour has ended; a handle's end() after that does nothing. */
    ended: boolean;
    /** The animation frame a move is waiting for, 0 for none. */
    frame: number;
    /**
     * @param {HTMLElement} host the tour's card
     * @param {import('./core.js').TourRunOptions} options
     */
    constructor(host: HTMLElement, options: import('./core.js').TourRunOptions);
    connect(): void;
    /** What startTour hands back: end it, or go to a step. @returns {import('../tour.js').TourHandle} */
    handle(): import('../tour.js').TourHandle;
    /** End the running tour, if there is one. */
    static endRunning(): void;
    /** @param {boolean} finished */
    finish(finished: boolean): void;
    /** The card has played out: the mark goes, the card is closed and taken off, and the focus returns. @param {HTMLDialogElement} card */
    leave(card: HTMLDialogElement): void;
    /** Place the card on the next frame, once however many moves come. */
    onMove(): void;
    /** @param {KeyboardEvent} event */
    onKey(event: KeyboardEvent): void;
}
