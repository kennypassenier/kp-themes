import { StackbarCore } from './core.js';
export type StackbarDraw = import('./core.js').StackbarDraw;
/** @typedef {import('./core.js').StackbarDraw} StackbarDraw */
export declare class StackbarParts extends StackbarCore {
    /** The part's colour: the status colour of a part that needs attention, else the palette, round and round. @param {StackbarDraw['calc']['parts'][number]} part @param {number} i */
    colourOf(part: StackbarDraw['calc']['parts'][number], i: number): string;
    /** One segment of the bar. @param {StackbarDraw} c @param {StackbarDraw['calc']['parts'][number]} part @param {number} i @param {string} words */
    segment(c: StackbarDraw, part: StackbarDraw['calc']['parts'][number], i: number, words: string): HTMLElement;
    /** One legend row of a part. @param {StackbarDraw} c @param {StackbarDraw['calc']['parts'][number]} part @param {number} i */
    legendRow(c: StackbarDraw, part: StackbarDraw['calc']['parts'][number], i: number): HTMLElement;
    /** The legend row of the free rest, or of what the parts run over by. @param {StackbarDraw} c @param {string} restWords */
    restRow(c: StackbarDraw, restWords: string): HTMLElement;
    /** The ticks across the bar at a share of the whole. @param {StackbarDraw} c */
    marks(c: StackbarDraw): void;
    /** The parts are one tab stop: the part that had the focus, else the first. @param {StackbarDraw} c */
    tabStop(c: StackbarDraw): void;
    /** The segments, the legend, the rest, the ticks and the bar's name. @param {StackbarDraw} c */
    drawParts(c: StackbarDraw): void;
}
