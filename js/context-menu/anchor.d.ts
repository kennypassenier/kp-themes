import { Controller } from '../controller.js';
export type MenuGroup = import('../menu-button.js').MenuGroup;
export type OpenRequest = {
    el: HTMLElement;
    groups: MenuGroup[];
    source: HTMLElement | null;
    x: number;
    y: number;
    how: 'pointer' | 'touch' | 'keyboard';
    label: string;
};
export declare class ContextAnchor extends Controller {
    /** The element whose menu is open. @type {HTMLElement | null} */
    target: HTMLElement | null;
    /** A menu button whose entries are shown, to which a pick is reported. @type {HTMLElement | null} */
    source: HTMLElement | null;
    /** Where the focus goes back to when the menu closes. @type {HTMLElement | null} */
    returnTo: HTMLElement | null;
    /** What stops listening for a scroll while the menu is open. @type {(() => void) | null} */
    unscroll: (() => void) | null;
    /** @param {HTMLElement} wrapper @param {Record<string, unknown>} [options] */
    constructor(wrapper: HTMLElement, options?: Record<string, unknown>);
    /** The menu of the anchor of a document, made the first time. @param {Document} doc @returns {ContextAnchor} */
    static of(doc: Document): ContextAnchor;
    connect(): void;
    /** Whether the menu is open now. */
    isOpen(): boolean;
    /** Open the menu for an element at a point in window coordinates. @param {OpenRequest} request */
    open({ el, groups, source, x, y, how, label }: OpenRequest): void;
    /**
     * Stand the invisible button at the point. Fixed, then corrected by what was measured: an ancestor with a transform makes
     * `fixed` count from its own box instead of the window's.
     * @param {number} x @param {number} y
     */
    place(x: number, y: number): void;
    /** A scroll of the page moves the element away from the menu: the menu closes, as a system menu does. */
    watchScroll(): void;
    /**
     * A pick: the detail names the element (`context`). A menu that shows a menu button's entries reports the pick on that
     * button's wrapper, where the page already listens; cancelling it there keeps the menu open, as on the button.
     * @param {CustomEvent} event
     */
    onSelect(event: CustomEvent): void;
    /** The focus goes back where it was (the menu button's own close put it on the invisible button). */
    onClose(): void;
    /** Once closed and hidden, the menu leaves the element it served. */
    park(): void;
}
