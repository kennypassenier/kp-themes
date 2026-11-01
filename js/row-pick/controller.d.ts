import { RowPickCore } from './core.js';
export type RowPickHandle = import('../row-pick.js').RowPickHandle;
/** @typedef {import('../row-pick.js').RowPickHandle} RowPickHandle */
export declare class RowPicker extends RowPickCore {
    /** The long press that starts selection mode on a phone. @type {ReturnType<typeof setTimeout> | null} */
    hold: ReturnType<typeof setTimeout> | null;
    pressAt: {
        x: number;
        y: number;
    };
    /** Whether the last press became a pick, so its own click does not toggle the row again. */
    heldRow: boolean;
    /** What a page gets back from rowPick(el). @type {RowPickHandle} */
    handle: RowPickHandle;
    /** @param {HTMLElement} el @param {Record<string, unknown>} [options] */
    constructor(el: HTMLElement, options?: Record<string, unknown>);
    connect(): void;
    /** Move the cursor one row down (1) or up (-1) over the rows shown. @param {number} by */
    step(by: number): void;
    /** Pick or unpick the cursor row. */
    toggleCursor(): void;
    /** Move the cursor and pick everything from the anchor to it (the anchor is the cursor row when nothing starts a range). @param {number} direction 1 or -1 */
    extend(direction: number): void;
    /** The row a pointer event is about: the innermost keyed row, none when it landed on one of the row's own controls. @param {Event} event */
    rowAt(event: Event): HTMLElement | null;
    /** Whether a plain tap picks: after a long press on touch, or always with `data-kp-pick-mode="any"` once anything is picked. */
    tapPicks(): boolean;
    /** @param {Event} event */
    swallow(event: Event): void;
    /** @param {MouseEvent} event */
    onClick(event: MouseEvent): void;
    /** A double click while picking is two picks, never a rename or an open. @param {MouseEvent} event */
    onDouble(event: MouseEvent): void;
    /** Shift + press would select the text between two rows. @param {MouseEvent} event */
    onDown(event: MouseEvent): void;
    /** A long press on touch picks the row and starts selection mode. @param {PointerEvent} event */
    onPressStart(event: PointerEvent): void;
    /** @param {PointerEvent} event */
    onPressMove(event: PointerEvent): void;
    onPressEnd(): void;
    /** Android opens a context menu on the same long press; the press already picked. @param {Event} event */
    onContext(event: Event): void;
}
