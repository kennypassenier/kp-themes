import { PIECE_CARRIERS } from './values.js';
export type PieceDraw = {
    html: string;
    q: number;
};
export type PieceBox = {
    W: number;
    H: number;
    foot: number;
    rtl: boolean;
    at: (x: number, w?: number) => number;
};
/** @typedef {{ html: string, q: number }} PieceDraw */
/** @typedef {{ W: number, H: number, foot: number, rtl: boolean, at: (x: number, w?: number) => number }} PieceBox */
/** @param {number} v */
export declare const px: (v: number) => string;
/**
 * The kind of a waiting part, or '' when it waits for nothing now.
 * @param {Element} el
 * @returns {'' | keyof typeof PIECE_CARRIERS}
 */
export declare function kindOf(el: Element): '' | keyof typeof PIECE_CARRIERS;
/** The pieces a theme may name, by name. */
export declare const DRAW: Record<string, (el: HTMLElement, kind: string) => PieceDraw>;
