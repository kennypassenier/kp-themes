import { NewPillDraw } from './draw.js';
export declare class NewPillAway extends NewPillDraw {
    /** When the tab was hidden, and the first row that came after. @type {number} */
    hiddenAt: number;
    /** @type {Element | null} */
    firstAway: Element | null;
    /**
     * @param {HTMLElement} host the scroller
     * @param {import('../newpill.js').NewPillOptions} [options]
     */
    constructor(host: HTMLElement, options?: import('../newpill.js').NewPillOptions);
    /** A row came in: the first one that came while the tab was away is where the divider goes. @param {Element} node */
    noteRow(node: Element): void;
    onVisibility(): void;
    /** The tab went away: remember when, and wait for the first row that comes. */
    noteAway(): void;
    /** @param {Element} row @param {Date} left */
    divider(row: Element, left: Date): HTMLDivElement | HTMLLIElement | HTMLTableRowElement;
}
