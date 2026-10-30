/**
 * @param {Document} doc
 * @param {string} id
 * @param {import('../viewer.js').ViewerOptions} options
 * @param {import('../strings.js').Strings} strings
 */
export declare function buildViewerParts(doc: Document, id: string, options: import('../viewer.js').ViewerOptions, strings: import('../strings.js').Strings): {
    dialog: HTMLDialogElement;
    title: HTMLElement;
    desc: HTMLElement;
    facts: HTMLElement;
    position: HTMLElement;
    close: HTMLButtonElement;
    stage: HTMLElement;
    content: HTMLElement;
    plate: HTMLElement;
    foot: HTMLElement;
};
