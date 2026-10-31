import { Controller } from '../controller.js';
/** One matrix; its tab stop and lit headers stay in the STOPS and LIT registries the setters share. */
export declare class MatrixGrid extends Controller {
    connect(): void;
    /** Pin a cell: it is the pick and the tab stop, and the page hears of it. @param {HTMLElement} cell @param {string} source */
    pin(cell: HTMLElement, source: string): void;
    /** A header lights its row or column; a cell is pinned. @param {Event} event */
    onClick(event: Event): void;
    /** Escape puts every light out; arrows, Home and End move the stop, and pin it when the matrix follows. @param {KeyboardEvent} event */
    onKey(event: KeyboardEvent): void;
    /**
     * Where a key moves the stop from `cell`: arrows wrap round and skip the cells that cannot be pressed; Home and End go to
     * the first or last cell of the row (of the matrix with Ctrl). Null for another key.
     * @param {HTMLElement[][]} grid @param {HTMLElement} cell @param {KeyboardEvent} event
     * @returns {{ r: number, c: number } | null}
     */
    moveFrom(grid: HTMLElement[][], cell: HTMLElement, event: KeyboardEvent): {
        r: number;
        c: number;
    } | null;
}
/**
 * Wire every matrix under `root`: pin, light the headers, keys.
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export declare function attachMatrices(root?: ParentNode): () => void;
