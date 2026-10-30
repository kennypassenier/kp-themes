import { DeplistRows } from './rows.js';
export type DeplistSettings = import('./core.js').DeplistSettings;
/** @typedef {import('./core.js').DeplistSettings} DeplistSettings */
export declare class DependencyList extends DeplistRows {
    connect(): void;
    /** The heading is the exact count, whatever is folded. @param {number} total */
    writeHeading(total: number): void;
    /** Clear what the last draw left and set what every state shares. @param {DeplistSettings} o */
    resetList(o: DeplistSettings): void;
    /** Redraw the list from its rows, its state and its attributes. */
    draw(): void;
    /**
     * Loading, failed and empty stand in for the rows.
     * @param {number} total
     * @returns {boolean} whether a state was drawn, so there are no rows to draw
     */
    drawState(total: number): boolean;
    /**
     * The rows, grouped when asked, folded past the limit with an exact "Show all 23".
     * @param {import('../deplist.js').DepRow[]} rows
     * @param {DeplistSettings} o
     * @returns {HTMLElement[]} the row elements, hidden ones included
     */
    drawRows(rows: import('../deplist.js').DepRow[], o: DeplistSettings): HTMLElement[];
    /** The "Show all 23" / "Show fewer" button. @param {number} count the rows there are */
    moreButton(count: number): HTMLButtonElement;
    /** The button that copies the rows as text. @param {import('../deplist.js').DepRow[]} rows */
    copyButton(rows: import('../deplist.js').DepRow[]): HTMLButtonElement;
}
