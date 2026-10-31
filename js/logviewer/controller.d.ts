import { Controller } from '../controller.js';
/** One viewer: its state is the registry entry every part reads; its parts are found once ensureParts() built them. */
export declare class LogViewerControl extends Controller {
    connect(): void;
    /** The key that jumps to the search field from anywhere, through the engine; none when `data-kp-log-focus-key` is off. @param {HTMLInputElement} find @param {HTMLElement} bar */
    searchKey(find: HTMLInputElement, bar: HTMLElement): () => void;
    /**
     * The follow state on the root, for the page and for the stylesheet. Rows change height after they are drawn (a font that
     * arrives late, the width of the window): a reader at the newest line stays at it.
     * @param {HTMLElement} log
     */
    follow(log: HTMLElement): void;
    /** @param {HTMLInputElement} find */
    onInput(find: HTMLInputElement): void;
    /** Enter steps to the next match (Shift: the one before); Esc empties the field. @param {KeyboardEvent} event @param {HTMLInputElement} find */
    onFindKey(event: KeyboardEvent, find: HTMLInputElement): void;
    /** @param {Event} event */
    onChange(event: Event): void;
    /** @param {Event} event */
    onSegment(event: Event): void;
    /** The bar's tools: step, only matches, wrap, clear, retry, copy and download. @param {Event} event @param {HTMLInputElement} find */
    onClick(event: Event, find: HTMLInputElement): void;
    /** Copy the shown lines; the button flashes what happened. @param {HTMLButtonElement} copy */
    copy(copy: HTMLButtonElement): void;
    /** Save the shown lines as `<data-kp-log-filename>.txt`. */
    download(): void;
}
