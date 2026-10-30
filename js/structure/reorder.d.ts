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
    mountLive(): void;
    order(): string[];
    /** @param {readonly string[]} ids */
    setOrder(ids: readonly string[]): void;
    /** @param {HTMLElement} item @param {number} from @param {number} to */
    announce(item: HTMLElement, from: number, to: number): void;
    /** @param {HTMLElement} item @param {number} to */
    moveTo(item: HTMLElement, to: number): void;
    /** @param {KeyboardEvent} event */
    onKey(event: KeyboardEvent): void;
    /**
     * The pointer route: drag by the handle, drop between siblings. The move and release are heard on the window, not on the
     * handle: moving the row in the DOM detaches the handle for a moment, which releases its pointer capture, and the first
     * version then stopped hearing the pointer after one row [held-60].
     * @param {PointerEvent} event
     */
    onPointerDown(event: PointerEvent): void;
    /** The dragged item takes the place of the sibling under the pointer. @param {HTMLElement} item @param {number} y */
    dragOver(item: HTMLElement, y: number): void;
}
