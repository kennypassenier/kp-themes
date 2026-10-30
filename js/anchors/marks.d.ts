import { Controller } from '../controller.js';
export type AnchorOptions = import('../anchors.js').AnchorOptions;
export declare class AnchorMarks extends Controller {
    /** @type {AnchorOptions} */
    opts: AnchorOptions;
    doc: Document;
    view: Window;
    strings: import("../strings/types.js").Strings;
    /** The mark of every anchored heading and row. @type {Map<HTMLElement, HTMLButtonElement>} */
    marks: Map<HTMLElement, HTMLButtonElement>;
    /** The live region the copy is said in, politely. */
    live: HTMLSpanElement;
    /** @param {HTMLElement} box @param {AnchorOptions} [options] overrides the markup */
    constructor(box: HTMLElement, options?: AnchorOptions);
    levels(): number[];
    showMode(): string;
    copyMode(): string;
    highlights(): boolean;
    opensFirst(): boolean;
    copiedMs(): number;
    waitMs(): number;
    /** Whether something is still being drawn in any container of the page: the hash may be a row of another one. */
    drawing(): boolean;
    /** One status region for the whole container: the copy is said politely. */
    mountVoice(): void;
    /** @param {string} text */
    say(text: string): void;
    /** The id of a heading or a row: its own word, else its id, else a slug of its text. @param {HTMLElement} el */
    idFor(el: HTMLElement): string;
    /** Give a heading or a row its mark, once. @param {HTMLElement} el @param {'heading' | 'row'} kind */
    mark(el: HTMLElement, kind: 'heading' | 'row'): void;
    /**
     * The mark: a button whose faces carry their words as an attribute the stylesheet prints. The mark has no text of its own, so
     * a table's sort, a search and a copy of the cell never pick up "#Copied". A row's mark stands in a narrow first column: it
     * shows a tick, and the words are said politely.
     * @param {HTMLElement} el @param {'heading' | 'row'} kind
     */
    makeMark(el: HTMLElement, kind: 'heading' | 'row'): HTMLButtonElement;
    /** Mark what the mode asks for, and take the marks of rows that left. */
    scan(): void;
    /** Take every mark off. */
    unmark(): void;
    /** Draw the marks again, after an option changed (the position of the mark, the levels). */
    rebuild(): void;
}
