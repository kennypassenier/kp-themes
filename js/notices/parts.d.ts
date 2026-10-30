/**
 * An element with a class and, optionally, its text.
 * @param {Document} doc @param {string} tag @param {string} className @param {string} [text]
 * @returns {HTMLElement}
 */
export declare function make(doc: Document, tag: string, className: string, text?: string): HTMLElement;
/**
 * Build the parts of one centre. The counter, its panel and the voice exist in every look; the page look leaves the counter
 * and the panel out of the document.
 * @param {Document} doc
 * @param {string} id the panel's id, also the anchor name
 * @param {string} listLabel the list's accessible name
 */
export declare function buildParts(doc: Document, id: string, listLabel: string): {
    trigger: HTMLButtonElement;
    triggerLabel: HTMLElement;
    badge: HTMLElement;
    moon: HTMLElement;
    quietLine: HTMLElement;
    panel: HTMLElement;
    head: HTMLElement;
    heading: HTMLElement;
    readAll: HTMLButtonElement;
    endQuiet: HTMLButtonElement;
    body: HTMLElement;
    list: HTMLElement;
    state: HTMLElement;
    sourcesBox: HTMLElement;
    foot: HTMLElement;
    inbox: HTMLAnchorElement;
    voice: HTMLElement;
};
export type NoticeParts = ReturnType<typeof buildParts>;
/** @typedef {ReturnType<typeof buildParts>} NoticeParts */
/**
 * Put the parts in the host: the page look as a section, the other looks as a counter that opens an anchored panel.
 * @param {HTMLElement} el @param {NoticeParts} p @param {boolean} isPage
 */
export declare function mountParts(el: HTMLElement, p: NoticeParts, isPage: boolean): void;
