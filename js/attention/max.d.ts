import { Controller } from '../controller.js';
/** A band's cap: the worst problems are shown, the others folded, and a button unfolds them (worst first, as the band keeps them). */
export declare class AttentionMax extends Controller {
    /** The unfold button, made the first time a cap is needed. @type {HTMLButtonElement | null} */
    toggle: HTMLButtonElement | null;
    /** Whether the folded problems are shown. */
    expanded: boolean;
    /** @param {HTMLElement} host the band */
    constructor(host: HTMLElement);
    connect(): void;
    /** The cap, or 0 when there is none. */
    get max(): number;
    /** The problems on the band, in the order it keeps them, those on their way out left aside. @returns {HTMLElement[]} */
    problems(): HTMLElement[];
    /** Fold what is over the cap (unless unfolded), keep the toggle last and say how many are folded. */
    apply(): void;
    /** The unfold button, made once and given what it needs to be named and found. @returns {HTMLButtonElement} */
    ensureToggle(): HTMLButtonElement;
    /** One press: unfold or fold, and tell the page how many problems are shown now. */
    flip(): void;
    /** @param {boolean} on */
    setExpanded(on: boolean): void;
    /** Unfold everything and take the toggle away. */
    release(): void;
}
