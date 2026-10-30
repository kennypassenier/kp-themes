export type RangeBound = import('./build.js').RangeBound;
export type RangeCore = import('./core.js').RangeCore;
export declare class RangePanel {
    range: import("./core.js").RangeCore;
    button: HTMLButtonElement;
    panel: HTMLDivElement;
    from: import("./build.js").RangeBound;
    to: import("./build.js").RangeBound;
    error: HTMLParagraphElement;
    cancel: HTMLButtonElement;
    apply: HTMLButtonElement;
    /** Lowers the overlay while the panel is open. @type {(() => void) | null} */
    lower: (() => void) | null;
    /** @param {RangeCore} range the picker this panel belongs to */
    constructor(range: RangeCore);
    /** Add the button and the panel to the picker and wire them. */
    connect(): void;
    /** @param {RangeBound} b @param {number} ms */
    fill(b: RangeBound, ms: number): void;
    /** A bound as a moment, or the word of what is not whole. @param {RangeBound} b @returns {number | null | 'date' | 'time'} */
    read(b: RangeBound): number | null | 'date' | 'time';
    /** Mark the given inputs wrong and the others right. @param {HTMLInputElement[]} bad */
    mark(bad: HTMLInputElement[]): void;
    /** Put the panel under the control, kept inside the page. @param {HTMLElement} p */
    place(p: HTMLElement): void;
    open(): void;
    /** @param {boolean} [refocus] */
    close(refocus?: boolean): Promise<void>;
    /** Every fault of the two bounds as the words to show and the inputs to mark, in the order they are found. @param {number | null | 'date' | 'time'} a @param {number | null | 'date' | 'time'} b */
    faults(a: number | null | 'date' | 'time', b: number | null | 'date' | 'time'): {
        bad: HTMLInputElement[];
        words: string[];
    };
    onApply(): void;
    /** @param {KeyboardEvent} event */
    onKey(event: KeyboardEvent): void;
    /** @param {PointerEvent} event */
    onOutside(event: PointerEvent): void;
}
