import { Controller } from '../controller.js';
export type ContentsItem = import('../page-contents.js').ContentsItem;
export type ContentsEntry = {
    item: ContentsItem;
    target: HTMLElement;
    link: HTMLAnchorElement;
    li: HTMLLIElement;
};
export declare class ContentsCore extends Controller {
    doc: Document;
    view: Window & typeof globalThis;
    title: HTMLParagraphElement;
    list: HTMLOListElement;
    wait: HTMLDivElement;
    /** The entries the page gave, or null to read the headings. @type {ContentsItem[] | null} */
    given: ContentsItem[] | null;
    /** @type {ContentsEntry[]} */
    entries: ContentsEntry[];
    /** @type {string | null} */
    current: string | null;
    /** The animation frame a spy is waiting for, 0 for none. */
    raf: number;
    /** The pane with its own scroll that is listened to. @type {HTMLElement | null} */
    pane: HTMLElement | null;
    /** The scroll handler, one function so it can be removed. */
    onScroll: () => void;
    /**
     * @param {HTMLElement} host the nav
     * @param {Record<string, unknown>} [options]
     */
    constructor(host: HTMLElement, options?: Record<string, unknown>);
    /** The nav's id, made when it has none. */
    ensureId(): string;
    /** @param {ContentsEntry[]} entries @param {string | null} current */
    setEntries(entries: ContentsEntry[], current: string | null): void;
    /** @param {ContentsItem[] | null} items */
    setGiven(items: ContentsItem[] | null): void;
    /** @param {string | null} id */
    setCurrent(id: string | null): void;
    /** @param {number} frame */
    setFrame(frame: number): void;
    /** @param {HTMLElement | null} pane */
    setPane(pane: HTMLElement | null): void;
    /** Ask for a spy on the next frame. The spy overrides it. */
    queueSpy(): void;
    /**
     * The element a selector names, looked for from the list outwards: the nearest ancestor that holds a match wins, so a page that shows
     * the same markup twice (a copy in a dialog, a preview beside the page) is read from its own copy, not from the first one in the document.
     * @param {string | null} selector
     * @returns {Element | null}
     */
    lookup(selector: string | null): Element | null;
    /** Where the headings are. */
    scope(): Element;
    /** Px from the top of the window where a section counts as reached. */
    offset(): number;
    /** The fewest entries that earn a list. */
    least(): number;
    /** The nearest ancestor of `el` that scrolls vertically (below the page itself), or null. @param {Element} el @returns {HTMLElement | null} */
    scrollParent(el: Element): HTMLElement | null;
    /** The box that scrolls the sections when they live in a pane of their own: the one the page names, else the one the first section sits in. @returns {HTMLElement | null} */
    scroller(): HTMLElement | null;
    /** How a press scrolls: smoothly, unless the reader asked for less motion. */
    motion(): "auto" | "smooth";
}
