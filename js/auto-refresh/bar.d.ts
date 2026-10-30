/** An element with a class. @param {Document} doc @param {string} tag @param {string} className */
export declare function make(doc: Document, tag: string, className: string): HTMLElement;
/**
 * Every fixed part of a control, built and not yet placed.
 * @param {Document} doc
 */
export declare function buildBar(doc: Document): {
    chooser: HTMLElement;
    custom: HTMLFormElement;
    input: HTMLInputElement;
    problem: HTMLElement;
    line: HTMLElement;
    ago: HTMLElement;
    busyWords: HTMLElement;
    now: HTMLButtonElement;
    count: HTMLElement;
    note: HTMLElement;
    retry: HTMLButtonElement;
    failure: HTMLElement;
    bar: HTMLElement;
};
