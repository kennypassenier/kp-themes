export type SparkWrite = import('../update.js').SparkWrite;
/** @typedef {import('../update.js').SparkWrite} SparkWrite */
/**
 * Write a spark's numbers. A spark that `attachSparklines()` watches is
 * redrawn from its `data-kp-spark`, so the attribute takes the numbers and
 * its own redraw runs first; one nobody watches is drawn here. Returns the
 * two paths before and after, for glideSpark().
 * @param {SVGSVGElement} svg
 * @param {readonly number[]} values
 * @returns {Promise<SparkWrite>}
 */
export declare function writeSpark(svg: SVGSVGElement, values: readonly number[]): Promise<SparkWrite>;
/**
 * The last point glides to its new place on the theme's curve: the two paths
 * morph (the same commands, so they interpolate).
 * @param {SparkWrite} spark
 * @param {{ duration: number, ease: string }} timing
 * @returns {Animation[]}
 */
export declare function glideSpark({ svg, parts, from, to }: SparkWrite, timing: {
    duration: number;
    ease: string;
}): Animation[];
