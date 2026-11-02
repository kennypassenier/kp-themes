import { Controller } from '../controller.js';
/** What a row is called in words. @param {HTMLElement} row */
export declare const nameOf: (row: HTMLElement) => string;
/**
 * Settle one row: it keeps the height it has now, turns inert, and shows its word. Again with another word changes the word.
 * @param {HTMLElement} row @param {string} word
 */
export declare function dress(row: HTMLElement, word: string): void;
/** Take a row out of its settled state (the item came back, Undo). @param {HTMLElement} row */
export declare function undress(row: HTMLElement): void;
export declare class SettledList extends Controller {
    connect(): void;
    /** @param {MutationRecord[]} records */
    onChange(records: MutationRecord[]): void;
    /** Rows put into the list already carrying the attribute (the page drew the list again): dressed, not announced. @param {NodeList} added */
    dressAdded(added: NodeList): void;
    /** Say the row settled, and tell the page. @param {HTMLElement} row @param {string} word */
    said(row: HTMLElement, word: string): void;
    /** The polite line, made once beside the list. */
    live(): HTMLElement;
}
