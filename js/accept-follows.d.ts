import { Controller } from './controller.js';
/** The attribute that names the quantity a button follows. */
export declare const FOLLOWS = "data-kp-accept-follows";
/** The verb of the button's words, else the dictionary's. */
export declare const VERB = "data-kp-accept-verb";
/** The least amount that makes sense, else anything above zero. */
export declare const MINIMUM = "data-kp-accept-min";
/** One button and the quantity it follows. */
export declare class AcceptFollows extends Controller {
    /** @type {HTMLElement | null} */
    quantity: HTMLElement | null;
    /** @type {HTMLElement | null} */
    reason: HTMLElement | null;
    /**
     * @param {HTMLElement} host the button
     * @param {Record<string, unknown>} [options]
     */
    constructor(host: HTMLElement, options?: Record<string, unknown>);
    connect(): void;
    /** Remember the button as the page wrote it, and put it back on detach. */
    keepHost(): void;
    /**
     * The line that says why the button is off: under the quantity, in its field when it has one, always one line high so showing it moves nothing.
     * @param {HTMLElement} quantity
     */
    makeReason(quantity: HTMLElement): HTMLParagraphElement;
    /** The amount the quantity shows right now: the text while it is typed in, else the value it stands at. @returns {number} */
    amount(): number;
    /** Write the words and the state for the amount. */
    draw(): void;
}
export { acceptState, amountMakesSense } from './accept-follows-words.js';
/**
 * Wire every button under `scope` that follows a quantity.
 * @param {ParentNode} [scope]
 * @returns {() => void} detach
 */
export declare function attachAcceptFollows(scope?: ParentNode): () => void;
