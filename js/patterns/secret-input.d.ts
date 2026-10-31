import { SecretBase } from './secret-base.js';
export type SecretOptions = import('./secret-base.js').SecretOptions;
/** @typedef {import('./secret-base.js').SecretOptions} SecretOptions */
/** An input field: whether its typing shows, and the words of the last failed paste. */
export declare class SecretInputControl extends SecretBase {
    /** What the field is called, for the input's label and the copy announcement. */
    name: string;
    /** Whether the typing is shown. */
    shown: boolean;
    /** The words of the last failed paste, until the next key. */
    pasteProblem: string;
    /** The field's parts, built in connect(). */
    parts: {
        line: HTMLElement;
        words: HTMLElement;
        drain: HTMLElement;
        spoken: HTMLElement;
        input: HTMLInputElement;
        authored: boolean;
        reveal: HTMLButtonElement;
        paste: HTMLButtonElement | null;
        copy: HTMLButtonElement | null;
    };
    /** @param {HTMLElement} host @param {SecretOptions} [options] */
    constructor(host: HTMLElement, options?: SecretOptions);
    connect(): void;
    /** Follow the reasons the page sets (off, invalid) and the live ttl. */
    watch(): void;
    /** The ttl takes any duration (`45`, `90s`, `5min`); shown typing stays this many whole seconds. */
    readOptions(): void;
    hidesOnBlur(): boolean;
    /** Draw the field: its state, the input's type and marks, the buttons and the line. */
    paint(): void;
    /** The line while nothing is wrong: the countdown, or the hint, or how many characters were typed. @param {boolean} empty */
    lineWords(empty: boolean): string;
    /** @param {string} [reason] */
    hide(reason?: string): void;
    tick(): void;
    /** @param {string} [reason] */
    show(reason?: string): void;
    onReveal(): void;
    onInput(): void;
    /** Paste the clipboard over the selection; a refused read says so on the line until the next key. */
    onPaste(): Promise<void>;
    /** @param {HTMLButtonElement} copy */
    onCopy(copy: HTMLButtonElement): void;
    /** Leaving the field hides the typing (unless `data-kp-secret-hide-on-blur="false"`). @param {FocusEvent} event */
    onFocusOut(event: FocusEvent): void;
}
