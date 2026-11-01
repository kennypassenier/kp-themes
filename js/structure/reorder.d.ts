import { Controller } from '../controller.js';
export type ReorderHandle = import('../structure.js').ReorderHandle;
export declare class ReorderControl extends Controller {
    pointer: boolean;
    /** The children as attach found them; detach puts them back in this order. */
    original: Element[];
    /** The live region the moves are said in, and whether this module made it. @type {HTMLElement | null} */
    live: HTMLElement | null;
    madeLive: boolean;
    /** Ends a drag in progress. @type {(() => void) | null} */
    endDrag: (() => void) | null;
    /** @type {ReorderHandle} */
    handle: ReorderHandle;
    /** Whether the element is already wired: it carries the mark connect() stamps. @param {HTMLElement} element */
    static isAttached(element: HTMLElement): boolean;
    /** @param {HTMLElement} list @param {import('./shared.js').StructureOptions} [options] */
    constructor(list: HTMLElement, options?: import('./shared.js').StructureOptions);
    connect(): void;
    /** A handle in a list that shares its items says its keys, ← → included, when it gets the focus. @param {EventTarget | null} target */
    describeHandle(target: EventTarget | null): void;
    mountLive(): void;
    order(): string[];
    /** @param {readonly string[]} ids */
    setOrder(ids: readonly string[]): void;
    /** @param {HTMLElement} item */
    static nameOf(item: HTMLElement): string;
    /**
     * Say the move and report it. A list in a group adds `fromList` and `toList` (the lists' keys) to the detail; `source` is the list
     * the item came from when it crossed over.
     * @param {HTMLElement} item @param {number} from @param {number} to @param {HTMLElement} [source]
     */
    announce(item: HTMLElement, from: number, to: number, source?: HTMLElement): void;
    /** @param {string} words */
    say(words: string): void;
    /**
     * Take an item from another list of the group and put it at `index` here.
     * @param {HTMLElement} item @param {number} index
     */
    receive(item: HTMLElement, index: number): void;
    /** @param {HTMLElement} item @param {number} to */
    moveTo(item: HTMLElement, to: number): void;
    /** @param {KeyboardEvent} event */
    onKey(event: KeyboardEvent): void;
    /**
     * ← or →: the item goes to the list before or after in the group (mirrored right to left), at the same place or the last one.
     * @param {HTMLElement} item @param {number} side 1 for →, -1 for ←
     */
    keyAcross(item: HTMLElement, side: number): void;
    /**
     * The pointer route: drag by the handle, drop between siblings. The move and release are heard on the window, not on the
     * handle: moving the row in the DOM detaches the handle for a moment, which releases its pointer capture, and the first
     * version then stopped hearing the pointer after one row [held-60].
     * @param {PointerEvent} event
     */
    onPointerDown(event: PointerEvent): void;
    /**
     * The dragged item goes over to another list of the group under the pointer, or takes the place of the sibling under it in the
     * list it stands in now (which may no longer be this one).
     * @param {HTMLElement} item @param {number} x @param {number} y
     */
    dragOver(item: HTMLElement, x: number, y: number): void;
}
