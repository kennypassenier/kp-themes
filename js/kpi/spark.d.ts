import { ScopeWatch } from './scope.js';
/**
 * A sparkline's two paths in a `width` × `height` box: the line, and the
 * area under it. Fewer than two finite numbers draw nothing; a flat series
 * is drawn through the middle.
 * @param {readonly number[]} values oldest first
 * @param {{ width?: number, height?: number }} [box]
 * @returns {{ line: string, area: string }}
 */
export declare function sparkPaths(values: readonly number[], { width, height }?: {
    width?: number;
    height?: number;
}): {
    line: string;
    area: string;
};
/**
 * Draw one sparkline into `svg` from `values`. `parts` names its two paths'
 * classes (`<parts>-area`, `<parts>-line`): a KPI tile's by default, the
 * time chart's spark variant passes its own (js/chart.js).
 * @param {SVGSVGElement} svg
 * @param {readonly number[]} values
 * @param {{ parts?: string }} [options]
 */
export declare function drawSparkline(svg: SVGSVGElement, values: readonly number[], { parts }?: {
    parts?: string;
}): void;
/** @param {string | null} text @returns {number[]} */
export declare const numbersIn: (text: string | null) => number[];
/** One attach call of attachSparklines(): draws every sparkline under the scope and redraws one whenever its numbers change. */
export declare class SparklineWatch extends ScopeWatch {
    connect(): void;
}
