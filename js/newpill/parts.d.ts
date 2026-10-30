/**
 * @param {Document} doc
 * @param {string} placement `top` or `bottom`
 */
export declare function buildPill(doc: Document, placement: string): {
    pill: HTMLButtonElement;
    number: HTMLSpanElement;
    back: HTMLSpanElement;
    live: HTMLDivElement;
};
