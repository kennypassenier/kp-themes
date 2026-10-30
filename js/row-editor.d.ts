import { Controller } from './controller.js';
export declare const ROWS = "[data-kp-rows]";
/** One editor: its rows, its template and its head, add button and status line. */
export declare class RowEditor extends Controller {
    /** The number the next row's `{n}` takes. */
    serial: number;
    /** The detach of the controls inside each row. @type {Map<Element, () => void>} */
    inside: Map<Element, () => void>;
    /** The plate shown while no row is held. @type {HTMLElement | null} */
    plate: HTMLElement | null;
    /** @param {HTMLElement} host */
    constructor(host: HTMLElement);
    get list(): HTMLElement;
    get min(): number;
    /** The most rows, or Infinity. */
    get max(): number;
    /** The unit's two words, from the markup or the dictionary. @returns {[string, string]} */
    get units(): [string, string];
    connect(): void;
    /** The rows, in order. @returns {HTMLElement[]} */
    rows(): HTMLElement[];
    /** @returns {HTMLElement} */
    makeList(): HTMLElement;
    /** The parts the markup left out: the head row, the add button and the status line. */
    ensureParts(): void;
    /** The labels once, over the columns, from the labels of the first row (or of the template). @param {Document} doc */
    makeHead(doc: Document): void;
    /** @returns {HTMLTemplateElement | null} */
    template(): HTMLTemplateElement | null;
    /** @param {Event} event */
    onClick(event: Event): void;
    /** Add a row from the template. @returns {HTMLElement | null} */
    add(): HTMLElement | null;
    /** Take a row away; the focus goes to the row now in its place, else to the add button. @param {HTMLElement} row */
    remove(row: HTMLElement): void;
    /** Give `{n}` in a new row's attributes and text its number. @param {Element} row @param {number} n */
    number(row: Element, n: number): void;
    /** Attach the package's controls inside a new row, as the boot attached the first rows'. @param {HTMLElement} row */
    wire(row: HTMLElement): void;
    /** Write what depends on the count: the remove buttons, the add button, the plate and the line under the rows. */
    sync(): void;
    /** The package's empty plate while no row is held, in the room the rows had. @param {boolean} empty */
    paintPlate(empty: boolean): void;
    /** Say something to a screen reader, in the status line. @param {string} words */
    say(words: string): void;
    /** @returns {HTMLElement} */
    makeLive(): HTMLElement;
    /** @param {string} type @param {HTMLElement} row @param {number} index */
    emit(type: string, row: HTMLElement, index: number): void;
    /** Let go of the controls inside the rows and of what this wrote. */
    release(): void;
}
/**
 * Wire every row editor under `root`.
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export declare function attachRowEditors(root?: ParentNode): () => void;
/**
 * The rows an editor holds, in order.
 * @param {Element} host
 * @returns {HTMLElement[]}
 */
export declare function editorRowsOf(host: Element): HTMLElement[];
/**
 * Add a row from the template, as the add button does.
 * @param {Element} host
 * @returns {HTMLElement | null} the new row, or null when the editor is at its most
 */
export declare function addEditorRow(host: Element): HTMLElement | null;
/**
 * Remove a row, as its remove button does (nothing happens at the fewest rows).
 * @param {Element} host
 * @param {HTMLElement} row
 */
export declare function removeEditorRow(host: Element, row: HTMLElement): void;
