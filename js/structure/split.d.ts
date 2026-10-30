import { Controller } from '../controller.js';
import { paintRemembered } from '../remember.js';
export type SplitHandle = import('../structure.js').SplitHandle;
export declare class SplitControl extends Controller {
    o: import("./shared.js").StructureOptions;
    /** @type {HTMLElement | null} */
    separator: HTMLElement | null;
    value: number;
    initial: number;
    /** The value before a double click folded the first pane away. */
    lastOpen: number;
    /** @type {ReturnType<typeof paintRemembered>} */
    memory: ReturnType<typeof paintRemembered>;
    /** Read from the pane and its separator at attach. */
    horizontal: boolean;
    step: number;
    largeStep: number;
    collapses: boolean;
    min: number;
    max: number;
    /** @type {SplitHandle | null} null when the pane has no separator */
    handle: SplitHandle | null;
    /** Whether the element is already wired: it carries the mark connect() stamps. @param {HTMLElement} element */
    static isAttached(element: HTMLElement): boolean;
    /** @param {HTMLElement} split @param {import('./shared.js').StructureOptions} [options] */
    constructor(split: HTMLElement, options?: import('./shared.js').StructureOptions);
    connect(): void;
    /** @param {number} next */
    setValue(next: number): void;
    /** @param {KeyboardEvent} event */
    onKey(event: KeyboardEvent): void;
    /** @param {PointerEvent} event */
    onPointerDown(event: PointerEvent): void;
    /** Double-click folds the first pane away and back again, when the pane says it collapses. */
    onDoubleClick(): void;
}
