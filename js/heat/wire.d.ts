import { Controller } from '../controller.js';
/**
 * The cell of the grid an event happened in, if any.
 * @param {Element} grid @param {Event} event @param {string} selector
 * @returns {HTMLElement | null}
 */
export declare function cellOf(grid: Element, event: Event, selector: string): HTMLElement | null;
/**
 * A cell that takes the focus holds the tab stop.
 * @param {Element} grid @param {FocusEvent} event @param {string} selector
 */
export declare function followFocus(grid: Element, event: FocusEvent, selector: string): void;
/** One heat grid; its tab stop and lit rows stay in the STOPS and LIT registries the setters share. */
export declare class HeatGrid extends Controller {
    connect(): void;
    /** A row label lights its row; a cell picks its column. @param {Event} event */
    onClick(event: Event): void;
    /** @param {HTMLElement} label */
    pressLabel(label: HTMLElement): void;
    /** Arrows, Home and End move the stop; PageUp and PageDown page; Escape lets go of the pick. @param {KeyboardEvent} event */
    onKey(event: KeyboardEvent): void;
    /**
     * Where an arrow, Home or End moves the stop from `cell`, or null for another key.
     * @param {HTMLElement[][]} grid @param {HTMLElement} cell @param {KeyboardEvent} event
     * @returns {{ r: number, c: number, askLatest: boolean } | null}
     */
    moveFrom(grid: HTMLElement[][], cell: HTMLElement, event: KeyboardEvent): {
        r: number;
        c: number;
        askLatest: boolean;
    } | null;
    /** PageUp asks for earlier columns, PageDown for later ones; a grid with a paging bar pages by it [wish-1120]. @param {KeyboardEvent} event */
    page(event: KeyboardEvent): void;
    /** @param {KeyboardEvent} event @param {HTMLElement} cell */
    unpick(event: KeyboardEvent, cell: HTMLElement): void;
}
/**
 * Wire every heat grid under `root`: pick, row labels, keys.
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export declare function attachHeats(root?: ParentNode): () => void;
