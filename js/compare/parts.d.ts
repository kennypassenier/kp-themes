/**
 * @param {Document} doc @param {string} wordBefore @param {string} wordAfter @param {string} name the handle's accessible name
 */
export declare function buildCompareParts(doc: Document, wordBefore: string, wordAfter: string, name: string): {
    divider: HTMLDivElement;
    handle: HTMLSpanElement;
    labelBefore: HTMLSpanElement;
    labelAfter: HTMLSpanElement;
    wait: HTMLSpanElement;
};
