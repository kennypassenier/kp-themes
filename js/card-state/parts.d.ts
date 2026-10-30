/** @param {Document} doc @param {string} className @param {string} [tag] */
export declare const el: (doc: Document, className: string, tag?: string) => HTMLElement;
/**
 * The card's stage, its data area and its note, made where they are missing.
 * @param {HTMLElement} card
 * @returns {{ stage: HTMLElement, data: HTMLElement, note: HTMLElement }}
 */
export declare function partsOf(card: HTMLElement): {
    stage: HTMLElement;
    data: HTMLElement;
    note: HTMLElement;
};
