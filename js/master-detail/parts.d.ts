/** One pane of a layout. @param {HTMLElement} root @param {string} pane */
export declare const paneOf: (root: HTMLElement, pane: string) => HTMLElement | null;
/** `1fr` is `minmax(0, 1fr)` in a grid, so a long word never widens a column. @param {string} widths */
export declare const columns: (widths: string) => string;
/** The detail's head (with its heading and Back), body and state box: found in the markup, or made and put in by `mount()`. */
export declare class DetailParts {
    detail: HTMLElement;
    /** Whether the head was made here and still has to be put in. */
    madeHead: boolean;
    head: HTMLElement;
    madeBack: boolean;
    back: HTMLButtonElement;
    madeBody: boolean;
    body: HTMLElement;
    madeState: boolean;
    stateBox: HTMLElement;
    /** @param {HTMLElement} detail */
    constructor(detail: HTMLElement);
    /** @param {Document} doc @param {string} tag @param {string} className */
    make(doc: Document, tag: string, className: string): HTMLElement;
    /** Put the made parts in, in the order the markup would have them. */
    mount(): void;
}
