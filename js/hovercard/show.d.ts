import { HoverCardCore } from './core.js';
export declare class HoverCardShow extends HoverCardCore {
    /** Opens for `anchor`, or moves to it when already open. @param {HTMLElement} anchor */
    open(anchor: HTMLElement): void;
    /** The card is now for this anchor: described, shown or moved, and watched for the anchor's removal. @param {HTMLElement} anchor */
    arrive(anchor: HTMLElement): void;
    /** The card goes the way it came, then is hidden. */
    hide(): void;
    /** The going-out is over: the card is hidden, lowered and emptied. */
    finish(): void;
    /** @param {number} delay */
    close(delay: number): void;
    /** @param {HTMLElement} anchor @param {number} delay */
    schedule(anchor: HTMLElement, delay: number): void;
    /** Fill the card again for the open anchor (data that changed under the pointer). */
    refresh(): void;
}
