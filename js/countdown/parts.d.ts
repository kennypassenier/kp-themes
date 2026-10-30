/**
 * Build one control of a timer: a package button whose words keep their width.
 * @param {Document} doc @param {string} className @param {string[]} words @param {string} [title]
 */
export declare function timerButton(doc: Document, className: string, words: string[], title?: string): {
    button: HTMLButtonElement;
    label: HTMLSpanElement;
};
/**
 * The parts of a countdown that stay for its whole life.
 * @param {Document} doc
 */
export declare function buildParts(doc: Document): {
    title: HTMLElement;
    time: HTMLElement;
    digits: HTMLElement;
    spoken: HTMLElement;
    line: HTMLElement;
    said: HTMLElement;
};
