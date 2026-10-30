import { Controller } from '../controller.js';
export type HoverCardOptions = import('../hovercard.js').HoverCardOptions;
export type HoverCardContent = import('../hovercard.js').HoverCardContent;
export declare class HoverCardCore extends Controller {
    root: Document | Element;
    /** @type {HoverCardOptions & { selector: string }} */
    cfg: HoverCardOptions & {
        selector: string;
    };
    doc: Document;
    card: HTMLDivElement;
    /** The anchor the card is open for. @type {HTMLElement | null} */
    current: HTMLElement | null;
    /** The anchor a pending open is for. @type {HTMLElement | null} */
    wanted: HTMLElement | null;
    /** The anchor's own aria-describedby, put back on close. @type {string | null} */
    described: string | null;
    timer: number;
    /** When the card last opened, so the tap that focus already answered is not taken twice. */
    openedAt: number;
    going: boolean;
    overCard: boolean;
    /** @type {(() => void) | null} */
    lower: (() => void) | null;
    /** @type {MutationObserver | null} */
    watch: MutationObserver | null;
    /**
     * @param {Document | Element} root the root the listeners sit on, which is this controller's host
     * @param {HoverCardOptions} [options]
     */
    constructor(root: Document | Element, options?: HoverCardOptions);
    /** The one card node, made but not yet on the page. */
    makeCard(): HTMLDivElement;
    /** A second attach on the same root hands its options to this card. @param {HoverCardOptions} options */
    merge(options: HoverCardOptions): void;
    /** @param {Event | null} event @returns {HTMLElement | null} */
    anchorOf(event: Event | null): HTMLElement | null;
    /** @param {HTMLElement} anchor @param {string} name @param {number} fallback */
    number(anchor: HTMLElement, name: string, fallback: number): number;
    /** @param {HTMLElement} anchor @returns {boolean} whether there is anything to say */
    fillFor(anchor: HTMLElement): boolean;
    /** Under the anchor, start edges aligned, kept in the window; above when there is no room below. @param {HTMLElement} el */
    place(el: HTMLElement): void;
    /** @param {HTMLElement} anchor */
    describe(anchor: HTMLElement): void;
    /** @param {HTMLElement} anchor */
    undescribe(anchor: HTMLElement): void;
    /** @param {boolean} open @param {HTMLElement} anchor */
    announce(open: boolean, anchor: HTMLElement): void;
    /** @param {HTMLElement | null} anchor */
    setCurrent(anchor: HTMLElement | null): void;
    /** @param {HTMLElement | null} anchor */
    setWanted(anchor: HTMLElement | null): void;
    /** @param {boolean} going */
    setGoing(going: boolean): void;
    /** @param {boolean} over */
    setOverCard(over: boolean): void;
    /** Forget the pending ask. */
    unwant(): void;
    /** Stop the pending timer. */
    stopTimer(): void;
    /** Put a timer on a step. @param {() => void} step @param {number} delay */
    startTimer(step: () => void, delay: number): void;
    /** Put the card away without the going-out: the anchor is released, the card leaves the page. */
    release(): void;
}
