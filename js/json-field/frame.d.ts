/**
 * The frame of a field: the gutter, the textarea's place, and under them the status and the help.
 * @param {Document} doc
 * @param {string} id the field's id, the stem of its status and help ids
 * @param {import('../strings.js').Strings} strings
 * @param {{ wrap: boolean, gutter: boolean }} look
 */
export declare function buildFrame(doc: Document, id: string, strings: import('../strings.js').Strings, { wrap, gutter: gutterOn }: {
    wrap: boolean;
    gutter: boolean;
}): {
    tools: HTMLElement;
    toolFormat: HTMLButtonElement;
    toolMinify: HTMLButtonElement;
    toolWrap: HTMLButtonElement;
    word: HTMLElement;
    root: HTMLElement;
    frame: HTMLElement;
    gutter: HTMLElement;
    numbers: HTMLElement;
    status: HTMLElement;
    help: HTMLElement;
    mirror: HTMLElement;
};
