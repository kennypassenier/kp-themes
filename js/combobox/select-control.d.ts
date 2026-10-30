import { Controller } from '../controller.js';
import { createListbox } from '../listbox.js';
export type SelectHandle = import('./types.js').SelectHandle;
export type Listbox = ReturnType<typeof createListbox>;
export declare class SelectControl extends Controller {
    /** The native select, which stays the control. */
    select: HTMLSelectElement;
    /** The drawn list, a sibling directly after the select. */
    list: HTMLUListElement;
    /** The label that names the list; its id is ours only if we gave it. @type {HTMLLabelElement | undefined} */
    labelled: HTMLLabelElement | undefined;
    /** What the select's attributes were before. */
    before: {
        expanded: string | null;
        controls: string | null;
    };
    /** Takes the open list out of the top layer again (js/top-layer.js). */
    lower: () => void;
    /** The virtual focus between the select and the list; set in `connect()` before first use. @type {Listbox} */
    listbox: Listbox;
    /** What a page gets back. @type {SelectHandle} */
    handle: SelectHandle;
    /** @param {HTMLElement} host @param {Record<string, unknown>} [options] */
    constructor(host: HTMLElement, options?: Record<string, unknown>);
    connect(): void;
    /** Make the list, name it after the select's label, and put it right after the select. */
    drawList(): void;
    /** Take the list away and give the select back its attributes. */
    restore(): void;
    /** Rebuild the options from the select's own, and mark the chosen one. */
    build(): void;
    /**
     * Put the open list under the select and as wide as it. A first guess from the offsets both siblings share, then one
     * correction measured against the paint, because a register may give the list a margin or the page a containing block the
     * offsets do not see. The gap under the select is the list's own top margin, held to at most 0.5rem.
     */
    place(): void;
    isOpen(): boolean;
    open(): void;
    close(): void;
    /** @param {HTMLElement} option */
    take(option: HTMLElement): void;
    /**
     * What the listbox does not do: open from a closed box, and keep the browser's own select behaviour — its popup, its arrow
     * keys and letters changing the value directly — out of the way.
     * @param {KeyboardEvent} event
     */
    onKeyDownCapture(event: KeyboardEvent): void;
    /** A press on the box opens the drawn list instead of the browser's. @param {MouseEvent} event */
    onMouseDown(event: MouseEvent): void;
    onFocusOut(): void;
    /** The page changed the value: the mark follows at once if the list is open. */
    onChange(): void;
}
