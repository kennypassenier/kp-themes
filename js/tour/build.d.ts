export type Strings = import('../strings.js').Strings;
/**
 * @template {keyof HTMLElementTagNameMap} K
 * @param {Document} doc
 * @param {K} tag
 * @param {string} className
 * @param {string} [text]
 * @returns {HTMLElementTagNameMap[K]}
 */
export declare const make: <K extends keyof HTMLElementTagNameMap>(doc: Document, tag: K, className: string, text?: string) => HTMLElementTagNameMap[K];
/**
 * The card and its parts, not yet on the page.
 * @param {Document} doc @param {Strings} strings
 */
export declare function buildCard(doc: Document, strings: Strings): {
    card: HTMLDialogElement;
    title: HTMLHeadingElement;
    text: HTMLParagraphElement;
    count: HTMLSpanElement;
    back: HTMLButtonElement;
    skip: HTMLButtonElement;
    next: HTMLButtonElement;
};
/**
 * The card keeps one shape for the whole tour: its height is the tallest step's, measured once
 * as the tour opens, so going to the next step moves the card and swaps its words without the
 * box changing size (Kenny, 2026-10-12, round 5: "de box moet gewoon zijn vorm behouden").
 * @param {HTMLDialogElement} card
 * @param {{ title: string, text: string }[]} steps
 * @param {HTMLElement} title
 * @param {HTMLElement} text
 */
export declare function fixShape(card: HTMLDialogElement, steps: {
    title: string;
    text: string;
}[], title: HTMLElement, text: HTMLElement): void;
