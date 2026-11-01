import { Controller } from '../controller.js';
export declare class RowPickCore extends Controller {
    doc: Document;
    /** The picked keys, in the order they were picked. @type {Set<string>} */
    picked: Set<string>;
    /** The key a range starts from: the last row picked or unpicked on its own. @type {string | null} */
    anchorKey: string | null;
    /** The key of the keyboard cursor row. @type {string | null} */
    cursorKey: string | null;
    /** The voice: a polite live region in the element. */
    live: HTMLDivElement;
    /** @param {HTMLElement} el @param {Record<string, unknown>} [options] */
    constructor(el: HTMLElement, options?: Record<string, unknown>);
    /** Put the voice in the element. */
    mountVoice(): void;
    /** @param {string} text */
    say(text: string): void;
    /** Every keyed row, shown or not, in the order they are drawn. @returns {HTMLElement[]} */
    allRows(): HTMLElement[];
    /** The rows a person can see now, in screen order: a range runs over these only. */
    rows(): HTMLElement[];
    /** @param {string | null} key */
    rowByKey(key: string | null): HTMLElement | null;
    /** The picked keys, in the order they were picked. */
    keys(): string[];
    /** Put the picked look on picked rows and the cursor on its row; `aria-selected` on rows that have a selectable role. */
    mark(): void;
    /** Take the marks off, as detach leaves the rows. */
    unmark(): void;
    /** Mark, say how many are picked and tell the page and the selection bar. @param {string} source @param {boolean} [quiet] */
    commit(source: string, quiet?: boolean): void;
    /** Pick a row or take it out; it becomes the start of the next range. @param {string} key @param {string} source */
    toggle(key: string, source: string): void;
    /** A range with no start yet starts at the cursor row. */
    startRange(): void;
    /** Pick every visible row from the anchor to `key`, both included; without an anchor, `key` alone. @param {string} key @param {string} source */
    extendTo(key: string, source: string): void;
    /** Pick exactly these keys, in this order (a page restoring a selection). @param {readonly string[]} keys */
    replacePicks(keys: readonly string[]): void;
    /** Take every pick away. @param {string} source */
    clearAll(source: string): void;
    /** Drop the picks whose row went away (a redraw, a filter that removed it), and mark the rows again. */
    settle(): void;
    /** Move the cursor to a row, or take it away. @param {HTMLElement | null} row */
    place(row: HTMLElement | null): void;
}
