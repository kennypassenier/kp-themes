import { Controller } from '../controller.js';
/** The controller of one `[data-kp-quote-list]`. */
export declare class QuoteListController extends Controller {
    more: HTMLButtonElement;
    /** Whether the whole list is open. */
    open: boolean;
    /**
     * @param {HTMLElement} host the list
     * @param {Record<string, unknown>} [options]
     */
    constructor(host: HTMLElement, options?: Record<string, unknown>);
    connect(): void;
    /** The cards that count: those not marked gone. */
    items(): Element[];
    /** Hide the cards beyond the maximum (unless open), show the rest, and write the button. */
    sync(): void;
}
