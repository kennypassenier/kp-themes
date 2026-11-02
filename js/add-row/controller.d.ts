import { Controller } from '../controller.js';
export declare class AddRow extends Controller {
    row: HTMLFormElement;
    /** The frame a new layout waits for. */
    frame: number;
    /** @param {HTMLElement} host the add row, a form */
    constructor(host: HTMLElement);
    connect(): void;
    /** The table this row adds to, or null for a line in a form grid. @returns {HTMLElement | null} */
    wrap(): HTMLElement | null;
    /** Lay out on the next frame. */
    soon(): void;
    lay(): void;
    /** Hold the cells on the table's columns as the table scrolls sideways (and on its first column's edge). */
    shift(): void;
}
