import { SliderCore } from './core.js';
export declare class SliderControl extends SliderCore {
    connect(): void;
    /** The host's role, name and kind, and where the number shows (switchable at runtime). */
    stamp(): void;
    build(): void;
    unbuild(): void;
    /** A slider the page switched off says why on its line. */
    showReason(): void;
    /** @param {Event} event */
    onInput(event: Event): void;
    /** @param {Event} event */
    onChange(event: Event): void;
    /** Shift+arrow moves ten steps, Page Up and Down a tenth of the range. @param {KeyboardEvent} event */
    onKey(event: KeyboardEvent): void;
    /** A double click puts a thumb back on its default (`data-kp-default`). @param {Event} event */
    onReset(event: Event): void;
    /** The thumb last touched stays on top, so two thumbs at the ends can both be taken. @param {Event} event */
    onDown(event: Event): void;
    onUp(): void;
    /** @param {HTMLInputElement} box @param {string} words */
    invalid(box: HTMLInputElement, words: string): boolean;
    /** A typed value, read on Enter or blur: out of range, or too close to the other thumb, says why. @param {HTMLInputElement} box */
    readBox(box: HTMLInputElement): boolean;
    /** @param {KeyboardEvent} event */
    onBoxKey(event: KeyboardEvent): void;
    /** @param {Event} event */
    onBoxBlur(event: Event): void;
}
