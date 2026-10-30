import { Controller } from '../controller.js';
export declare class ClaimList extends Controller {
    /** The gap sort the rows were last drawn with. */
    lastSort: string;
    /** @param {HTMLElement} host @param {Record<string, unknown>} [options] */
    constructor(host: HTMLElement, options?: Record<string, unknown>);
    connect(): void;
    /** The viewer the markup names and the filter: the remembered one, else the asked one, else all. */
    readStart(): void;
    /** The keys of the list in the shortcut sheet: take or let go of the focused row, and the gaps filter. */
    registerKeys(): void;
    /** Every option is live: change the attribute and the rows are drawn again (a page that switches a look at run time). */
    onAttributes(): void;
    /** @param {MouseEvent} event */
    onClick(event: MouseEvent): void;
    /** A person picked in a row's assign menu: assign them, or take them off. @param {Event} event */
    onMenu(event: Event): void;
    /**
     * The shortcut engine never fires a letter while an input has the focus, and a row's tick box is one: c works there too.
     * @param {KeyboardEvent} event
     */
    onKey(event: KeyboardEvent): void;
}
