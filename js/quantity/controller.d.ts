import { Controller } from '../controller.js';
export declare class QuantityControl extends Controller {
    /** @type {ReturnType<typeof setTimeout> | null} */
    timer: ReturnType<typeof setTimeout> | null;
    /** The button a pointer pressed (it stepped on the way down), until its click. @type {HTMLElement | null} */
    pressed: HTMLElement | null;
    /**
     * @param {HTMLElement} host
     * @param {Record<string, unknown>} [options]
     */
    constructor(host: HTMLElement, options?: Record<string, unknown>);
    connect(): void;
    /** Stop the repeat of a held button. */
    stop(): void;
    /** Remember the button a pointer pressed, or forget it. @param {HTMLElement | null} button */
    press(button: HTMLElement | null): void;
    /** The step button an event happened on, if it is one of this quantity's. @param {Event} event @returns {HTMLElement | null} */
    stepButton(event: Event): HTMLElement | null;
    /** One step of a button. @param {HTMLElement} b @returns {boolean} whether the value moved */
    stepOnce(b: HTMLElement): boolean;
    /** A pointer went down on a button: step now, and again while it is held, slowly first and then faster. @param {PointerEvent} event */
    down(event: PointerEvent): void;
    /** @param {MouseEvent} event */
    click(event: MouseEvent): void;
    /**
     * Where a key moves the value to, or null when the key means nothing here.
     * @param {string} key
     * @param {number} now
     * @returns {number | null}
     */
    target(key: string, now: number): number | null;
    /** @param {KeyboardEvent} event */
    key(event: KeyboardEvent): void;
    /** Mark a text that is not a number while it stands. */
    typing(): void;
    /** Take what is typed: change to it, or put the last value back. */
    commit(): void;
}
