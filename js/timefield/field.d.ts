import { TimeList } from './list.js';
/** One time field, built into its root. */
export declare class TimeField {
    root: HTMLElement;
    /** The text box. @type {HTMLInputElement} */
    input: HTMLInputElement;
    /** The hidden input that posts `HH:MM`. @type {HTMLInputElement} */
    hidden: HTMLInputElement;
    /** The value as `HH:MM`, or '' while empty or invalid. */
    value: string;
    /** The presets above the list. @type {import('./constants.js').TimePresets} */
    presets: import('./constants.js').TimePresets;
    /** The invalid message now shown, or ''. */
    invalid: string;
    /** The list of times. */
    list: TimeList;
    /** @param {HTMLElement} root */
    constructor(root: HTMLElement);
    /** Build the parts into the root. Idempotent through `fieldFor`. */
    build(): void;
    /** Say something through the polite status region, unless the root turns announcing off. @param {string} message */
    say(message: string): void;
    /** The why line. */
    get why(): HTMLElement;
    /** Show or clear the why line and the invalid mark. @param {string} message */
    setInvalid(message: string): void;
    /** A quiet note in the why line (a 12-hour paste that was converted). @param {string} message */
    note(message: string): void;
    /**
     * Set the value, the text and the hidden input; fire the event when it changed.
     * @param {string} value @param {{ text?: string, silent?: boolean, converted?: boolean }} [options]
     */
    write(value: string, { text, silent, converted }?: {
        text?: string;
        silent?: boolean;
        converted?: boolean;
    }): void;
    /** Refuse the typed text: no value, and the message. @param {string} message */
    refuse(message: string): boolean;
    /**
     * Take a typed text as the value, or say why not.
     * @param {string} text @param {{ silent?: boolean }} [options]
     * @returns {boolean} whether the field now holds a valid value (or is validly empty)
     */
    commitText(text: string, { silent }?: {
        silent?: boolean;
    }): boolean;
    /** Choose a value from the list or a chip. @param {string} value */
    pick(value: string): void;
    /** Show or hide the zone line and the look, and follow disabled and loading. */
    sync(): void;
}
/** The field of a root, built on first need. @param {HTMLElement} root @returns {TimeField} */
export declare function fieldFor(root: HTMLElement): TimeField;
