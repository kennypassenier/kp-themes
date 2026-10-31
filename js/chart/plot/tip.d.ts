import { PlotLegend } from './legend.js';
export type PlotGeometry = import('./base.js').PlotGeometry;
export type TipRow = {
    si: number;
    label: string;
    v: number;
    d: number;
};
export declare class PlotTip extends PlotLegend {
    paintLegend(): void;
    /**
     * What is under the crosshair at `t`, for the tooltip and the readout; for a pin outside the window only the sources whose
     * readings still reach it (within an hour), not a reading from another time.
     * @param {number} t @param {boolean} [strict]
     * @returns {TipRow[]}
     */
    rowsAt(t: number, strict?: boolean): TipRow[];
    /** The events within reach of `t`: a thirtieth of the window. @param {number} t */
    eventsNear(t: number): import("../words.js").ChartEvent[];
    /** @param {number} d */
    change(d: number): string;
    paintTip(): void;
    /** The tooltip's words: the time, the pin, a row per source, the events near and the median. @param {number} t @param {boolean} outside */
    fillTip(t: number, outside: boolean): void;
    /** One source's row in the tooltip. @param {TipRow} r */
    tipRow(r: TipRow): HTMLElement;
    /** One event near the crosshair, with its link while pinned. @param {import('../words.js').ChartEvent} ev */
    tipEvent(ev: import('../words.js').ChartEvent): HTMLElement;
    /**
     * Beside the crosshair, on whichever side has room, never past the chart's edge; docked, in the corner away from it; a pin
     * outside the window at the edge it left by.
     * @param {number} t @param {boolean} outside @param {PlotGeometry} geo
     */
    placeTip(t: number, outside: boolean, geo: PlotGeometry): void;
    /** Say what is under the crosshair (keys and pins only: a pointer would talk too much). */
    announce(): void;
}
