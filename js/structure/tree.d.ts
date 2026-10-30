import { Controller } from '../controller.js';
import { paintRemembered } from '../remember.js';
export type TreeHandle = import('../structure.js').TreeHandle;
export declare class TreeControl extends Controller {
    o: import("./shared.js").StructureOptions;
    /** What attach found on each item, so detach can put it back. @type {{ item: HTMLElement, tabindex: string | null, selected: string | null }[]} */
    before: {
        item: HTMLElement;
        tabindex: string | null;
        selected: string | null;
    }[];
    /** @type {ReturnType<typeof paintRemembered>} */
    memory: ReturnType<typeof paintRemembered>;
    /** A bulk change (expand all) is applied at once: its groups would measure each other half-grown. */
    quiet: boolean;
    /** The letters typed so far, and the timer that clears them. */
    buffer: string;
    bufferTimer: number;
    /** Whether typeahead is on, what a click does, and whether items are selected; set at attach. */
    finds: boolean;
    clickMode: string;
    selects: boolean;
    /** @type {TreeHandle} */
    handle: TreeHandle;
    /** Whether the element is already wired: it carries the mark connect() stamps. @param {HTMLElement} element */
    static isAttached(element: HTMLElement): boolean;
    /** @param {HTMLElement} tree @param {import('./shared.js').StructureOptions} [options] */
    constructor(tree: HTMLElement, options?: import('./shared.js').StructureOptions);
    connect(): void;
    /** Put back what attach stamped on every item. */
    restore(): void;
    all(): HTMLElement[];
    /** @param {string} id */
    byId(id: string): HTMLElement | null;
    /** One tab stop for the whole tree, arrows inside it — the ARIA practice. @param {HTMLElement} item */
    setStop(item: HTMLElement): void;
    /** @param {HTMLElement} item @param {boolean} expanded */
    setExpanded(item: HTMLElement, expanded: boolean): void;
    /** Write which branches are open, when the tree asked to be remembered. */
    remember(): void;
    /** @param {HTMLElement | null} item */
    setSelected(item: HTMLElement | null): void;
    /** @param {KeyboardEvent} event */
    onKey(event: KeyboardEvent): void;
    /** @param {HTMLElement} item */
    toParent(item: HTMLElement): void;
    /**
     * Typeahead: letters jump to the next item that starts with them, and keep accumulating for half a second so "do" finds
     * Documents rather than Downloads. In a tree of forty folders this is the difference between usable and theoretical.
     * @param {KeyboardEvent} event @param {HTMLElement[]} list @param {number} at
     */
    typeahead(event: KeyboardEvent, list: HTMLElement[], at: number): void;
    /** @param {MouseEvent} event */
    onClick(event: MouseEvent): void;
    /** @param {boolean} expanded */
    setAll(expanded: boolean): void;
    /** @returns {TreeHandle} */
    makeHandle(): TreeHandle;
}
