import { PickerPreview } from './preview.js';
export declare class ThemePicker extends PickerPreview {
    connect(): void;
    /** A press on an option: end the look, apply the theme, store it, say so, and close an enclosing menu. @param {Event} event */
    onClick(event: Event): void;
    /** @param {PointerEvent} event */
    onEnter(event: PointerEvent): void;
    /** @param {FocusEvent} event */
    onFocusIn(event: FocusEvent): void;
    /** @param {Event} event */
    onToggle(event: Event): void;
}
