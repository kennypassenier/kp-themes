import { Controller } from '../controller.js';
import { HeatDays } from './days.js';
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
    /** The row's list of days [heatstates-1102]. */
    days: HeatDays;
    /** The pointer of the press in progress: `touch`, `mouse`, `pen`, or '' (the keys). */
    pointer: string;
    /** @param {HTMLElement} host @param {Record<string, unknown>} [options] */
    constructor(host: HTMLElement, options?: Record<string, unknown>);
    connect(): void;
    /**
     * A row label lights its row; a cell picks its column; a tap on a row whose cells are too small for a finger opens that row's
     * days instead (js/heat/days.js) [heatstates-1102].
     * @param {Event} event
     */
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
/**
 * Open the list of one row's days from the page (an app's own "Days" button, a review page's opened state) [heatstates-1102]: the
 * day of `colKey` takes the focus, else the picked one, else the newest. A grid that is not wired, or has no such row, opens nothing.
 * @param {HTMLElement} el the grid @param {string} rowKey @param {string} [colKey]
 * @returns {boolean} whether it opened
 */
export declare function openHeatDays(el: HTMLElement, rowKey: string, colKey?: string): boolean;
/** Close a grid's list of days, the focus left where it is. @param {HTMLElement} el */
export declare function closeHeatDays(el: HTMLElement): void;
