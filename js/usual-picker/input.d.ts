import { Controller } from '../controller.js';
export type UsualItem = import('./types.js').UsualItem;
export type UsualModel = import('./types.js').UsualModel;
/** @typedef {import('./types.js').UsualItem} UsualItem */
/** @typedef {import('./types.js').UsualModel} UsualModel */
/** The base of a usual picker's controller: its model and the input on it. */
export declare class UsualPickerInput extends Controller {
    /** The picker's model, the `models` registry entry the functions a page calls read; set by adopt(). */
    m: import("./types.js").UsualModel;
    /** The text in the field when Enter went down, to tell an add that named an item already listed. */
    typedAtEnter: string;
    /** @param {HTMLElement} host @param {Record<string, unknown>} [options] */
    constructor(host: HTMLElement, options?: Record<string, unknown>);
    /** Take the model connect() built. @param {UsualModel} m */
    adopt(m: UsualModel): void;
    /** The picks changed: say what a typed name selected, end the Undo, end "not today" for what is picked, tell the page. @param {Event} event */
    onChange(event: Event): void;
    /** A name typed that is already picked: its tag lights up and the status line says so; the text stays. @param {UsualItem} item */
    already(item: UsualItem): void;
    /** Alt U jumps to the first usual choice; Enter on a typed name selects, asks, refuses or adds. @param {KeyboardEvent} event */
    onKey(event: KeyboardEvent): void;
    /**
     * Identical after case, accents and spaces: never a second one, whatever the guard is set to.
     * @param {KeyboardEvent} event @param {string} typed
     * @returns {boolean} whether Enter was spent on an item already listed
     */
    enterExact(event: KeyboardEvent, typed: string): boolean;
    /**
     * A name close to one listed: take the closest, ask first, or point at the one already picked.
     * @param {KeyboardEvent} event @param {string} typed
     * @returns {boolean} whether Enter was spent on the guard
     */
    enterNear(event: KeyboardEvent, typed: string): boolean;
    /** Retry, the add button, or a row of the check pressed. @param {MouseEvent} event */
    onClick(event: MouseEvent): void;
    /** Typing re-orders for `while-typing="hide"` and shows or hides the rows of the guard. */
    onInput(): void;
}
