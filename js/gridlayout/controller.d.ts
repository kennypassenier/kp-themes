import { Controller } from '../controller.js';
export type GridOptions = {
    step?: number;
    rows?: number;
    commitMs?: number;
    pointer?: boolean;
};
/**
 * @typedef {object} GridOptions
 * @property {number} [step]
 * @property {number} [rows]
 * @property {number} [commitMs]
 * @property {boolean} [pointer]
 */
export declare class MovableGrid extends Controller {
    columns: number;
    stride: number;
    maxRows: number;
    settle: number;
    drag: boolean;
    /** The commit timer, and the pointer drag under way, if any. */
    timer: number;
    /** @type {(() => void) | null} */
    endDrag: (() => void) | null;
    /** What the page gets back, the same object every time. @type {import('../gridlayout.js').GridHandle} */
    handle: import('../gridlayout.js').GridHandle;
    /**
     * @param {HTMLElement} host the grid
     * @param {GridOptions} [options] page defaults; each also per grid as `data-kp-step`, `data-kp-rows`, `data-kp-commit-ms`, `data-kp-pointer="false"`
     */
    constructor(host: HTMLElement, options?: GridOptions);
    connect(): void;
    placeAll(): void;
    /** Every move or resize is told at once, and once more when the burst settles. */
    announce(): void;
    /** @param {HTMLElement} tile @param {number} nx @param {number} ny @param {number} nw @param {number} nh */
    set(tile: HTMLElement, nx: number, ny: number, nw: number, nh: number): void;
    /** @param {KeyboardEvent} event */
    onKey(event: KeyboardEvent): void;
    /**
     * The pointer route, beside the keyboard [KT6]. A drag moves the tile by whole cells, measured from the grid's own column width,
     * so a drop lands where the tile will actually be.
     * @param {PointerEvent} event
     */
    onPointerDown(event: PointerEvent): void;
}
