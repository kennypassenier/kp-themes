import { Controller } from '../controller.js';
/** The controller of one `.kp-passkeys` root: the rows, the flows and the painting. */
export declare class PasskeysController extends Controller {
    /** The spec of the last setPasskeys() call. @type {import('./constants.js').PasskeysSpec} */
    spec: import('./constants.js').PasskeysSpec;
    /** The rows as the page gave them (and as removals and renames changed them). @type {import('./constants.js').PasskeyRow[]} */
    rows: import('./constants.js').PasskeyRow[];
    /** How many rows were shown last: the waiting rows of a loading list copy it. */
    rowCount: number;
    /** The tallest height the list had, kept by the empty and failed notes. */
    height: number;
    /** The busy card of a loading list. @type {import('../busy-card.js').BusyCard | null} */
    card: import('../busy-card.js').BusyCard | null;
    /** Whether the list has been drawn once (the busy card then arrives softly). */
    drawn: boolean;
    /** The spec waiting for the busy card to leave. @type {import('./constants.js').PasskeysSpec | null} */
    pending: import('./constants.js').PasskeysSpec | null;
    /** The key of the row being renamed. @type {string | null} */
    renaming: string | null;
    /** A row's server refusal, by key. @type {Map<string, string>} */
    refused: Map<string, string>;
    /** Keys being removed or renamed. @type {Set<string>} */
    busy: Set<string>;
    /** What the live line says on the next draw. */
    announce: string;
    /**
     * @param {HTMLElement} host the root
     * @param {{ spec?: import('./constants.js').PasskeysSpec }} [options] the first spec
     */
    constructor(host: HTMLElement, options?: {
        spec?: import('./constants.js').PasskeysSpec;
    });
    connect(): void;
    /** Whether removing a row would leave no way in. */
    isLast(): boolean;
    /**
     * Show a new spec: the waiting rows, or the list once the busy card has left.
     * @param {import('./constants.js').PasskeysSpec} spec
     */
    update(spec: import('./constants.js').PasskeysSpec): void;
    /** The row a control sits in. @param {Element} inside */
    rowAround(inside: Element): import("./constants.js").PasskeyRow | undefined;
    /** @param {Event} event */
    onClick(event: Event): void;
    /** Enter saves a rename, Escape drops it. @param {KeyboardEvent} event */
    onKeydown(event: KeyboardEvent): void;
    /** Ask before removing: a dialog, or the exact name typed for the one in use and the last way in. @param {import('./constants.js').PasskeyRow} row @param {HTMLElement} button */
    askRemove(row: import('./constants.js').PasskeyRow, button: HTMLElement): void;
    /** Remove a way: the page's `remove`, or the cancelable event; a rejection is shown on the row. @param {import('./constants.js').PasskeyRow} row */
    removeWay(row: import('./constants.js').PasskeyRow): Promise<void>;
    /** @param {import('./constants.js').PasskeyRow} row */
    startRename(row: import('./constants.js').PasskeyRow): void;
    /** @param {string} key @param {boolean} focus whether the Rename button takes the focus back */
    stopRename(key: string, focus: boolean): void;
    /** The rename field, when one is drawn. */
    renameInput(): HTMLInputElement | null;
    /** Save the new name: the page's `rename`, or the cancelable event; an empty name is refused, an unchanged one just closes. @param {import('./constants.js').PasskeyRow} row */
    saveRename(row: import('./constants.js').PasskeyRow): Promise<void>;
}
