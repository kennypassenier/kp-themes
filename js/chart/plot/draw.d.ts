import { PlotDrawing } from './drawing.js';
import { PlotTip } from './tip.js';
export type ChartWindow = import('../words.js').ChartWindow;
/** @typedef {import('../words.js').ChartWindow} ChartWindow */
export declare class PlotDraw extends PlotTip {
    draw(): void;
    /**
     * The plot at its height with no lines: loading (a pulse), empty or an error (a sentence), so the card keeps its place in every
     * state.
     * @param {'loading' | 'empty' | 'error'} kind
     * @param {number} H
     */
    drawState(kind: 'loading' | 'empty' | 'error', H: number): void;
    /**
     * The failed plate is the package's own (`statePlate`: the destructive alert every other failed area uses, so each register
     * dresses it): what failed, and a normal Retry under it (`kp-chart-retry`). The button goes with the state, so the focus moves to
     * the plot first, as a card's Try again hands it to its stage.
     * @param {string} words
     */
    failedPlate(words: string): HTMLElement;
    /** Draw the window with its readings, then the key, the plot's name, and the legend and tooltip (or the too-few plate). @param {ChartWindow} win @param {number} H */
    drawWindow(win: ChartWindow, H: number): void;
    /**
     * Too early for a trend: the empty plot, faint, and the sentence on an opaque plate in the middle of its whole height. The plate
     * stands on an opaque ground of the card's colour, so a theme that draws its empty plate as a see-through texture keeps that
     * texture and still lets nothing of the plot show through (Kenny, 2026-10-18 17:45).
     * @param {PlotDrawing} drawing
     */
    drawFew(drawing: PlotDrawing): void;
}
