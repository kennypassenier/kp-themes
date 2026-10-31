/** @typedef {import('../strings.js').Strings} Strings */
export type Strings = import('../strings.js').Strings;
/** @param {Document} doc @param {string} tag @param {string} className */
export declare const make: (doc: Document, tag: string, className: string) => HTMLElement;
/**
 * The line under the buttons (the countdown, the reason a field is off, or why it could not be read) with its words and drain,
 * and the polite region a screen reader hears. The line always has its height, so nothing moves when it fills.
 * @param {HTMLElement} field
 * @param {Element[]} built collects the parts made here, for detach
 */
export declare function buildLine(field: HTMLElement, built: Element[]): {
    line: HTMLElement;
    words: HTMLElement;
    drain: HTMLElement;
    spoken: HTMLElement;
};
/**
 * A display field's parts: the value box with the mask, Reveal, Copy (unless `data-kp-secret-copy="false"`) and the line.
 * @param {HTMLElement} field @param {Strings} s @param {Element[]} built
 */
export declare function buildDisplay(field: HTMLElement, s: Strings, built: Element[]): {
    line: HTMLElement;
    words: HTMLElement;
    drain: HTMLElement;
    spoken: HTMLElement;
    value: HTMLElement;
    reveal: HTMLButtonElement;
    copy: HTMLButtonElement | null;
};
/**
 * An input field's parts: the entry and its input, Reveal, Paste and Copy (each off with `="false"`), and the line the input is
 * described by.
 * @param {HTMLElement} field @param {string} name @param {Element[]} built
 */
export declare function buildInput(field: HTMLElement, name: string, built: Element[]): {
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
