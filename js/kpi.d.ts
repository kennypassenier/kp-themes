/** An inline SVG drawn from the numbers in its attribute. */
export declare const SPARK = "svg[data-kp-spark]";
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
/**
 * Draw every `svg[data-kp-spark="12 14 13 …"]` under `root`, and redraw one
 * whenever its numbers change.
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export declare function attachSparklines(root?: ParentNode): () => void;
/** A KPI tile that turns a filter on this page on or off. */
export declare const KPI_TOGGLE = "button.kp-kpi--toggle";
/** Fired on the tile, bubbling, after it was pressed: `detail.pressed`. */
export declare const KPI_TOGGLE_EVENT = "kp-kpi-toggle";
/**
 * Wire every KPI toggle under `root`: a click flips `aria-pressed` and fires
 * `kp-kpi-toggle`; the page does the filtering. A tile marked
 * `data-kp-kpi-owned` is left to the page (a framework that keeps the
 * pressed state itself).
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export declare function attachKpiToggles(root?: ParentNode): () => void;
