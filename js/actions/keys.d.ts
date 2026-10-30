import { Controller } from '../controller.js';
export declare class RowKeys extends Controller {
    connect(): void;
    /** @returns {HTMLElement[]} */
    rowsOf(): HTMLElement[];
    /** Only this row is in the tab order. @param {HTMLElement} row */
    current(row: HTMLElement): void;
    /** Every row focusable, one of them in the tab order; rows added later too. */
    settle(): void;
    /**
     * The row a key moves to, or null when it is not a moving key.
     * @param {KeyboardEvent} event @param {number} count @param {number} at @param {boolean} onRow
     */
    target(event: KeyboardEvent, count: number, at: number, onRow: boolean): number | null;
    /** @param {KeyboardEvent} event */
    onKey(event: KeyboardEvent): void;
    /** @param {FocusEvent} event */
    onFocus(event: FocusEvent): void;
}
