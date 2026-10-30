import { Controller } from '../controller.js';
export type RowSelectOptions = import('../row-select.js').RowSelectOptions;
/** @typedef {import('../row-select.js').RowSelectOptions} RowSelectOptions */
export declare class RowSelectCore extends Controller {
    /** @type {RowSelectOptions} */
    opts: RowSelectOptions;
    doc: Document;
    /** The voice: a polite live region in the element. */
    live: HTMLDivElement;
    /** The key of the cursor row. @type {string | null} */
    cursorKey: string | null;
    /** The key of the row last ticked by a click or a key, the start of the next range. @type {string | null} */
    anchorKey: string | null;
    /** @param {HTMLElement} el @param {RowSelectOptions} [options] */
    constructor(el: HTMLElement, options?: RowSelectOptions);
    isRange(): boolean;
    /** A `data-kp-grid` owns the arrow keys. */
    owned(): boolean;
    useArrows(): boolean;
    useAllKey(): boolean;
    scrollTo(): "center" | "nearest";
    /** Put the voice in the element. */
    mountVoice(): void;
    /** @param {string} text */
    say(text: string): void;
    /** Every row with a box, shown or not, in the order they are drawn. @returns {HTMLElement[]} */
    allRows(): HTMLElement[];
    /** The rows the walk may land on, in the order they are drawn. */
    rows(): HTMLElement[];
    /** @param {string | null} key */
    rowByKey(key: string | null): HTMLElement | null;
    keys(): string[];
    count(): number;
    /**
     * Rows are focusable, one of them in the tab order. Every row, hidden or not: the walk skips a hidden row, the
     * roving tabindex does not. Only shown rows were made roving until 11.0.0, and nothing settles again when a row
     * or a section around the element is shown later (a `hidden` flip is not a child added), so a row a data table's
     * page or a hidden section kept out at attach stayed out of the walk once shown, and the markup depended on which
     * of the two modules attached first (tests/auto-lazy.spec.mjs: the catalogue's tables, the fixture's paged row).
     * The tab stop is the cursor row, else the first shown row, else the first row.
     */
    settle(): void;
    /** Move the cursor to a row, or take it away. @param {HTMLElement | null} row @param {{ focus?: boolean }} [how] */
    place(row: HTMLElement | null, { focus }?: {
        focus?: boolean;
    }): void;
    /** Set one box and let the table hear it as a click. @param {HTMLInputElement} box @param {boolean} checked */
    setBox(box: HTMLInputElement, checked: boolean): boolean;
    /** @param {string} source @param {number} [skipped] */
    fire(source: string, skipped?: number): void;
    /** Untick every box. */
    clearAll(): void;
    /** Set the boxes from the anchor to a row. @param {HTMLElement} to @param {boolean} checked */
    tickRange(to: HTMLElement, checked: boolean): {
        changed: number;
        skipped: number;
    };
    /** Say how many are ticked (and how many could not be), then fire. @param {string} source @param {number} skipped */
    said(source: string, skipped: number): void;
    /** Make a row the start of the next range. @param {HTMLElement} row */
    anchorAt(row: HTMLElement): void;
    /** Whether a box is one of ours. @param {EventTarget | null} target @returns {target is HTMLInputElement} */
    static isBox(target: EventTarget | null): target is HTMLInputElement;
}
