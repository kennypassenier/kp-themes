import { Controller } from '../controller.js';
/** The panel, its anchor cell and the open state of one strip; the methods open, move and shut it. */
export declare class UptimeInfo extends Controller {
    /** The plate, made on the first opening. @type {HTMLElement | null} */
    panel: HTMLElement | null;
    /** The cell the plate hangs under. @type {HTMLElement | null} */
    anchor: HTMLElement | null;
    /** Lowers the plate from the top layer. @type {(() => void) | null} */
    lower: (() => void) | null;
    /** Whether the plate is open. */
    shown: boolean;
    /** @param {HTMLElement} host @param {Record<string, unknown>} [options] */
    constructor(host: HTMLElement, options?: Record<string, unknown>);
    /** The hover cards of this strip rest while its quick info is open, and come back after. @param {boolean} on */
    tips(on: boolean): void;
    /** Under its cell, its start edge on the cell's, kept inside the strip and the window. @param {HTMLElement} p */
    place(p: HTMLElement): void;
    /** The plate, made and inserted on first use. @returns {HTMLElement} */
    ensurePanel(): HTMLElement;
    /** Open the quick info of the period a cell stands for, or move it there. @param {HTMLElement} cell */
    openInfo(cell: HTMLElement): void;
    /** First opening: the hover cards rest, the plate leaves hidden and goes up into the top layer. @param {HTMLElement} panel */
    show(panel: HTMLElement): void;
    /** @param {boolean} refocus @param {boolean} [now] shut at once, without the close (a redraw) */
    closeInfo(refocus: boolean, now?: boolean): Promise<void>;
    /** Shut the quick info at once and drop the plate: a redraw of the strip starts over. */
    reset(): void;
}
