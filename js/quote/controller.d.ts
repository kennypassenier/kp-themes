import { Controller } from '../controller.js';
/** The controller of one `[data-kp-quote]` card. */
export declare class QuoteController extends Controller {
    el: HTMLElement;
    options: import("./constants.js").QuoteOptions;
    /** What the card held before it was drawn, put back on detach. */
    before: ChildNode[];
    /** The words, verbatim. */
    text: string;
    expanded: boolean;
    hiding: boolean;
    /** @type {HTMLElement | null} */
    textEl: HTMLElement | null;
    /** @type {HTMLButtonElement | null} */
    more: HTMLButtonElement | null;
    /** The live line the card says things on. */
    live: HTMLSpanElement;
    copyTimer: number;
    /**
     * @param {HTMLElement} host the card
     * @param {import('./constants.js').QuoteOptions} [options] defaults; each card's own `data-kp-quote-*` wins
     */
    constructor(host: HTMLElement, options?: import('./constants.js').QuoteOptions);
    connect(): void;
    /** The keys of a card: `h` hides, Mod C copies when copy is on and nothing is selected; both are on the `?` sheet. */
    shortcuts(): {
        keys: string;
        what: string;
        group: string;
        when: () => boolean;
        run: () => void;
    }[];
    /** Put back what the card held, and take the line count away. */
    undoDom(): void;
    /** Fold or unfold, hide or copy. @param {MouseEvent} event */
    onClick(event: MouseEvent): void;
}
