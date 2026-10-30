import { RowSelectCore } from './core.js';
export declare class RowSelector extends RowSelectCore {
    /** The long press that starts selection mode on a phone. @type {ReturnType<typeof setTimeout> | null} */
    hold: ReturnType<typeof setTimeout> | null;
    /** Whether the last press became selection mode, so its own click does not untick the row again. */
    heldRow: boolean;
    /** What a page gets back from rowSelect(el). @type {import('../row-select.js').RowSelectHandle} */
    handle: import('../row-select.js').RowSelectHandle;
    /** @param {HTMLElement} el @param {import('../row-select.js').RowSelectOptions} [options] */
    constructor(el: HTMLElement, options?: import('../row-select.js').RowSelectOptions);
    connect(): void;
    /** Take away the voice, the roving tab stops, the cursor and the mode marks. */
    unmark(): void;
    /** The keys, written as a `.kp-keys` line into the element's `data-kp-select-hint`. */
    writeHint(): void;
    /** @param {KeyboardEvent} event */
    onKey(event: KeyboardEvent): void;
    /** @param {KeyboardEvent} event */
    escape(event: KeyboardEvent): void;
    /** Ctrl+A ticks every row shown, Ctrl+Shift+A unticks them. @param {KeyboardEvent} event @param {HTMLElement[]} list */
    tickShown(event: KeyboardEvent, list: HTMLElement[]): void;
    /**
     * j / k (and the arrows) walk one row, Home and End on a row go to the ends. Returns whether the key was one of these.
     * @param {KeyboardEvent} event @param {HTMLElement[]} list @param {HTMLElement} inRow
     */
    walk(event: KeyboardEvent, list: HTMLElement[], inRow: HTMLElement): boolean;
    /** x ticks or unticks the cursor row. @param {KeyboardEvent} event @param {HTMLElement[]} list @param {HTMLElement} inRow */
    tickKey(event: KeyboardEvent, list: HTMLElement[], inRow: HTMLElement): void;
    /** Shift+x ticks everything from the last tick to the cursor. @param {KeyboardEvent} event @param {HTMLElement[]} list @param {HTMLElement} inRow */
    rangeKey(event: KeyboardEvent, list: HTMLElement[], inRow: HTMLElement): void;
    /** Follows the box the reader ticks with the mouse: the next range starts here. @param {Event} event */
    onChange(event: Event): void;
    /** Shift-click on a box ticks the range from the last tick [data-kp-select-range]. @param {MouseEvent} event */
    onClick(event: MouseEvent): void;
    /** A shift-press on a box would select the text between rows. @param {MouseEvent} event */
    onDown(event: MouseEvent): void;
    /** Selection mode on a phone: a long press on a row ticks it and starts the mode. @param {PointerEvent} event */
    onPressStart(event: PointerEvent): void;
    onPressEnd(): void;
    /** In selection mode every tap on a row ticks it, until the last tick goes. @param {MouseEvent} event */
    onTap(event: MouseEvent): void;
    /** @param {Event} event */
    onFocusIn(event: Event): void;
}
