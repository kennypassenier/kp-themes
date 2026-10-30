/** @param {Document} doc @param {string} className @param {string} [tag] */
export declare function make(doc: Document, className: string, tag?: string): HTMLElement;
/**
 * @param {Document} doc @param {string} id
 * @param {import('../strings.js').Strings} s
 */
export declare function buildQuiet(doc: Document, id: string, s: import('../strings.js').Strings): {
    onLabel: HTMLLabelElement;
    onInput: HTMLInputElement;
    onWords: HTMLElement;
    body: HTMLElement;
    fromBox: HTMLElement;
    toBox: HTMLElement;
    dayBox: HTMLElement;
    through: HTMLElement;
    problem: HTMLElement;
    summary: HTMLElement;
    reason: HTMLElement;
    wait: HTMLElement;
};
