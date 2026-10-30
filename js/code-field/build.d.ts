export type Strings = import('../strings.js').Strings;
/** @typedef {import('../strings.js').Strings} Strings */
/**
 * @param {Document} doc @param {Strings} strings @param {string} id @param {boolean} wrap @param {boolean} gutterOn
 */
export declare function buildChrome(doc: Document, strings: Strings, id: string, wrap: boolean, gutterOn: boolean): {
    root: HTMLDivElement;
    tools: HTMLDivElement;
    frame: HTMLDivElement;
    gutter: HTMLDivElement;
    numbers: HTMLDivElement;
    status: HTMLParagraphElement;
    readout: HTMLParagraphElement;
    help: HTMLParagraphElement;
    mirror: HTMLDivElement;
    word: HTMLSpanElement;
};
/**
 * Put the chrome around the textarea and describe the textarea by its readout, status and help.
 * @param {HTMLTextAreaElement} area @param {ReturnType<typeof buildChrome>} ui
 * @returns {string | null} what `aria-describedby` was before, for the undo
 */
export declare function mountChrome(area: HTMLTextAreaElement, ui: ReturnType<typeof buildChrome>): string | null;
