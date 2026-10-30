export type Strings = import('../strings.js').Strings;
/** @typedef {import('../strings.js').Strings} Strings */
/**
 * @param {Document} doc @param {string} className @param {string} [tag]
 * @returns {HTMLElement}
 */
export declare function make(doc: Document, className: string, tag?: string): HTMLElement;
/**
 * The parts of one gate, not yet in it.
 * @param {Document} doc @param {HTMLElement} gate @param {Strings} s @param {string} id
 */
export declare function buildParts(doc: Document, gate: HTMLElement, s: Strings, id: string): {
    side: HTMLElement;
    anchor: HTMLAnchorElement | null;
    tick: HTMLLabelElement;
    box: HTMLInputElement;
    words: HTMLElement;
    live: HTMLElement;
    problem: HTMLElement;
    problemText: HTMLElement;
    retry: HTMLButtonElement;
    frame: HTMLElement;
};
/**
 * Put the parts into the gate: the words and the side stand in one frame, so a container query can lay the frame out (it cannot lay out its own container).
 * @param {HTMLElement} gate @param {ReturnType<typeof buildParts>} ui
 * @returns {() => void} undo: gives the authored nodes back
 */
export declare function mountParts(gate: HTMLElement, ui: ReturnType<typeof buildParts>): () => void;
