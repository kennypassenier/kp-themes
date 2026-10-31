import { Controller } from '../controller.js';
export type GridPosition = {
    row: number;
    rows: number;
    column: number;
    cell: HTMLTableCellElement;
};
export type GridSettings = {
    pageRows: number;
    onMove?: (position: GridPosition) => void;
};
/** A roving focus grid over one table [Kenny, 2026-09-13, #keyboard; APG grid]: see attachGrid() in grid.js. */
export declare class GridControl extends Controller {
    table: HTMLTableElement;
    pageRows: number;
    onMove: ((position: GridPosition) => void) | undefined;
    /** The table's own role, given back on detach. */
    roleWas: string | null;
    /** The cell that holds the tab stop. */
    at: {
        row: number;
        column: number;
    };
    /** Elements given a tabindex here, with the value they had. @type {Map<HTMLElement, string | null>} */
    touched: Map<HTMLElement, string | null>;
    /** @param {HTMLElement} host the table @param {Record<string, unknown>} [options] */
    constructor(host: HTMLElement, options?: Record<string, unknown>);
    connect(): void;
    /** The rows a reader can move through. */
    rows(): HTMLTableRowElement[];
    /** @param {HTMLTableRowElement} row */
    cellsOf(row: HTMLTableRowElement): HTMLTableCellElement[];
    /** The one control a cell hands its focus to, or the cell. @param {HTMLTableCellElement} cell */
    targetOf(cell: HTMLTableCellElement): HTMLElement;
    /** @param {HTMLElement} element @param {number} value */
    setTab(element: HTMLElement, value: number): void;
    /** The rows, and the row and column of the tab stop kept inside them. @returns {[HTMLTableRowElement[], number, number]} */
    clamp(): [HTMLTableRowElement[], number, number];
    /** Re-read the rows and cells after they changed; keeps one cell in the tab order. */
    sync(): void;
    /** Move the tab stop to a cell, and the focus with it unless `take` is false. @param {number} row @param {number} column @param {boolean} [take] */
    move(row: number, column: number, take?: boolean): void;
    /**
     * Where row `r` stands among the body's rows of data: a detail row and a group's heading row are not rows of data.
     * @param {HTMLTableRowElement[]} list @param {number} r
     */
    bodyPosition(list: HTMLTableRowElement[], r: number): {
        row: number;
        rows: number;
    };
    /** @param {KeyboardEvent} event */
    onKey(event: KeyboardEvent): void;
    /** @param {FocusEvent} event */
    onFocusIn(event: FocusEvent): void;
}
/** `data-kp-scrolled` on a data table while its scroll box is scrolled away from the top [scope-90]: see watchScrolled() in grid.js. */
export declare class ScrollMark extends Controller {
    /** The box that scrolls. */
    box: HTMLElement;
    view: (Window & typeof globalThis) | null;
    /** The frame a scroll queued the decision for. */
    frame: number;
    /** @param {HTMLElement} host the `.kp-datatable` @param {Record<string, unknown>} [options] */
    constructor(host: HTMLElement, options?: Record<string, unknown>);
    connect(): void;
    decide(): void;
    /** One decision per frame. */
    onScroll(): void;
}
