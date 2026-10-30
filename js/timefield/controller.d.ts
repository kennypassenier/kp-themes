import { Controller } from '../controller.js';
/** A time field on a page. */
export declare class TimeController extends Controller {
    field: import("./field.js").TimeField;
    /** @param {HTMLElement} host */
    constructor(host: HTMLElement);
    connect(): void;
    /** Every option is live: presets and the list's entries follow their attributes. */
    watchAttributes(): void;
    /** Digits typed fast: 0230 becomes 02:30 as the fourth digit arrives; an open list follows the typed time. */
    onInput(): void;
    /** The index of the option closest to a time; the active one when none has a time. @param {number} t */
    nearestOption(t: number): number;
    onBlur(): void;
    /** @param {MouseEvent} event */
    onClick(event: MouseEvent): void;
    /** @param {FocusEvent} event */
    onFocusOut(event: FocusEvent): void;
    onFocusIn(): void;
    /** A paste is read as a time, whole: `2:30 PM` is converted. @param {ClipboardEvent} event */
    onPaste(event: ClipboardEvent): void;
    /** A press on the list keeps the focus where it was, so the field does not commit half-way. @param {PointerEvent} event */
    onPopupDown(event: PointerEvent): void;
    /** @param {PointerEvent} event */
    onOutside(event: PointerEvent): void;
}
