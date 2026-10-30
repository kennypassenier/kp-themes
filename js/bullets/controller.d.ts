import { Controller } from '../controller.js';
export type BulletsSpec = import('../bullets.js').BulletsSpec;
/** @typedef {import('../bullets.js').BulletsSpec} BulletsSpec */
export declare class BulletList extends Controller {
    doc: Document;
    /** What the list remembers between draws: the rows shown last, whether they had leads, the busy card and the height. */
    rows: number;
    leads: boolean;
    /** @type {import('../busy-card.js').BusyCard | null} */
    card: import('../busy-card.js').BusyCard | null;
    drawn: boolean;
    /** The spec waiting for the busy card to go. @type {BulletsSpec | null} */
    pending: BulletsSpec | null;
    height: number;
    /**
     * @param {HTMLElement} host
     * @param {Record<string, unknown>} [options]
     */
    constructor(host: HTMLElement, options?: Record<string, unknown>);
    connect(): void;
    /** @param {Event} event */
    onClick(event: Event): void;
    /**
     * Draw (or redraw) the list.
     * @param {BulletsSpec} spec
     */
    set(spec: BulletsSpec): void;
    /** @param {BulletsSpec} spec */
    drawLoading(spec: BulletsSpec): void;
    /** @param {BulletsSpec} spec */
    draw(spec: BulletsSpec): void;
    /** @param {BulletsSpec} spec @param {boolean} failed */
    drawNote(spec: BulletsSpec, failed: boolean): void;
    /** @param {BulletsSpec} spec @param {import('./row.js').BulletRow[]} rows @param {string | undefined} focusedKey */
    drawRows(spec: BulletsSpec, rows: import('./row.js').BulletRow[], focusedKey: string | undefined): void;
}
