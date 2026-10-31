import { TrendView } from './trend-view.js';
export type ChartState = import('./api.js').ChartState;
export declare class TrendChart extends TrendView {
    /** The press under way, and whether it moved or is a finger's. @type {{ x: number, moved: boolean, touch: boolean } | null} */
    press: {
        x: number;
        moved: boolean;
        touch: boolean;
    } | null;
    /** What attachCharts() keeps for this chart and its group holds. @type {ChartState} */
    state: ChartState;
    /** @param {HTMLElement} host @param {Record<string, unknown>} [options] */
    constructor(host: HTMLElement, options?: Record<string, unknown>);
    connect(): void;
    /** @param {number} clientX */
    indexAtX(clientX: number): number;
    /** @param {PointerEvent} event */
    onDown(event: PointerEvent): void;
    /** @param {PointerEvent} event */
    onMove(event: PointerEvent): void;
    /** A click without a drag follows the tile's link, as a click anywhere else on the tile does; a drag only read the trend. @param {MouseEvent} event */
    onClick(event: MouseEvent): void;
    /** @param {KeyboardEvent} event */
    onKey(event: KeyboardEvent): void;
    /** @returns {ChartState} */
    makeState(): ChartState;
}
